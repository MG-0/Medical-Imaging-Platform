import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { BASE_URL } from "../services/api";
import { Activity, AlertTriangle, CheckCircle, Save, ArrowLeft, Image as ImageIcon, User, Mail, Edit3, Trash2 } from "lucide-react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import { useRef } from "react";

const CaseDetails = () => {
  const { id } = useParams(); // This is the imageId
  const navigate = useNavigate();

  const [imageData, setImageData] = useState(null);
  const [aiReport, setAiReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [diagnosis, setDiagnosis] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [severity, setSeverity] = useState("Low");
  const [confidenceScore, setConfidenceScore] = useState(0);

  // --- Manual Heatmap States ---
  const [editHeatmap, setEditHeatmap] = useState(false);
  const [manualAnnotation, setManualAnnotation] = useState(null);
  const [tempRect, setTempRect] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const [imgElement, setImgElement] = useState(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    fetchCaseDetails();
  }, [id]);

  const fetchCaseDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/images/details/${id}`);
      setImageData(res.data.image);
      setAiReport(res.data.aiReport);
      if (res.data.aiReport) {
        setDiagnosis(res.data.aiReport.initialDiagnosis || ""); // Pre-fill with AI diagnosis
        setConfidenceScore(res.data.aiReport.confidenceScore || 0); // Pre-fill with AI confidence
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Case details not found.");
        setAiReport(null);
      } else {
        setError("Failed to fetch Case Details.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load Image for Konva
  useEffect(() => {
    if (imageData?.imagePath) {
      const img = new window.Image();
      img.src = `${BASE_URL}/${imageData.imagePath.replace(/\\/g, "/")}`;
      img.crossOrigin = "Anonymous";
      img.onload = () => setImgElement(img);
    }
  }, [imageData]);

  useEffect(() => {
    if (containerRef.current && imgElement) {
      const updateSize = () => {
        if (containerRef.current) {
          const containerWidth = containerRef.current.offsetWidth;
          const containerHeight = containerRef.current.offsetHeight || 400;
          
          const imgRatio = imgElement.width / imgElement.height;
          const containerRatio = containerWidth / containerHeight;
          
          let targetWidth, targetHeight;
          
          if (imgRatio > containerRatio) {
            targetWidth = containerWidth;
            targetHeight = containerWidth / imgRatio;
          } else {
            targetHeight = containerHeight;
            targetWidth = containerHeight * imgRatio;
          }

          setSize({
            width: targetWidth,
            height: targetHeight,
          });
        }
      };
      updateSize();
      // Small timeout to ensure DOM has rendered
      const timeoutId = setTimeout(updateSize, 50);
      window.addEventListener('resize', updateSize);
      return () => {
        window.removeEventListener('resize', updateSize);
        clearTimeout(timeoutId);
      };
    }
  }, [editHeatmap, imgElement]); // Run when toggling edit mode or image loads

  const handleMouseDown = (e) => {
    if (!editHeatmap || isSaved) return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    setIsDrawing(true);
    setTempRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || isSaved) return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    setTempRect((prev) => ({
      ...prev,
      width: pos.x - prev.x,
      height: pos.y - prev.y,
    }));
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const saveManualChanges = () => {
    if (!tempRect || !stageRef.current) return;
    
    // Normalize coordinates (0-1) based on current size
    const normalized = {
      x: tempRect.x / size.width,
      y: tempRect.y / size.height,
      width: tempRect.width / size.width,
      height: tempRect.height / size.height,
    };
    
    setManualAnnotation(normalized);
    setIsSaved(true);
  };

  const resetManualChanges = () => {
    setManualAnnotation(null);
    setTempRect(null);
    setIsSaved(false);
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      setError("");
      const res = await API.post(`/ai-reports/analyze/${id}`);
      setAiReport(res.data.report);
      setDiagnosis(res.data.report.initialDiagnosis || "");
    } catch (err) {
      setError("Failed to run AI analysis.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmitFinalReport = async (e) => {
    e.preventDefault();
    if (!aiReport) return;

    try {
      setSubmitting(true);
      setError("");
      await API.post("/final-reports/submit", {
        aiReportId: aiReport._id,
        imageId: id,
        diagnosis,
        recommendations,
        severity,
        manualAnnotation: isSaved ? manualAnnotation : null,
        confidenceScore,
      });
      setPopupMessage("Final Medical Report submitted successfully! Status updated to 'Reviewed'.");
      setShowPopup(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-xl font-bold text-slate-600 animate-pulse">Loading Case Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 relative">
      {/* Custom Popup Modal instead of alert */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-900/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center">
            <CheckCircle className="mx-auto text-emerald-500 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Success!</h3>
            <p className="text-slate-600 mb-8">{popupMessage}</p>
            <button
              onClick={() => {
                setShowPopup(false);
                navigate(-1); // Returns back securely
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md active:scale-95"
            >
              Close & Return
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-semibold transition"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <Activity className="text-blue-600" size={32} />
            Case Details & Analysis
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Review patient details, AI findings, and provide the final medical diagnosis.
          </p>
        </header>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 mb-6 border border-red-100">
            <AlertTriangle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Patient Info Card */}
        {imageData?.patient && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8 flex flex-wrap gap-8 items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <User size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Patient Name</p>
                <p className="text-lg font-bold text-slate-800">{imageData.patient.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Email Address</p>
                <p className="text-lg font-bold text-slate-800">{imageData.patient.email}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column: Images & AI Report */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Images Side-by-Side */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <ImageIcon className="text-blue-500" size={24} />
                Medical Scans
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original Image */}
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
                  <p className="text-center text-sm font-semibold text-slate-700 mb-3">Original Image</p>
                  {imageData?.imagePath ? (
                    <img
                      src={`${BASE_URL}/${imageData.imagePath.replace(/\\/g, "/")}`}
                      alt="Original Scan"
                      className="w-full h-auto max-h-64 object-contain rounded-xl bg-black"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Not+Found"; }}
                    />
                  ) : (
                    <div className="h-48 flex items-center justify-center text-slate-400">No Image</div>
                  )}
                </div>
                
                {/* AI Heatmap or Manual Drawing Layer */}
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-semibold text-slate-700">
                      {editHeatmap ? "Manual Heatmap Correction" : "AI Heatmap (Grad-CAM)"}
                    </p>
                    {aiReport && (
                      <button
                        onClick={() => setEditHeatmap(!editHeatmap)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg transition ${
                          editHeatmap ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        }`}
                      >
                        {editHeatmap ? "Cancel Edit" : "Edit Heatmap"}
                      </button>
                    )}
                  </div>

                  <div 
                    ref={containerRef}
                    className="relative w-full h-[400px] bg-black rounded-xl overflow-hidden flex items-center justify-center p-2"
                  >
                    {!editHeatmap ? (
                      aiReport?.heatmapPath ? (
                        <img
                          src={`${BASE_URL}/${aiReport.heatmapPath.replace(/\\/g, "/")}`}
                          alt="Heatmap Scan"
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=No+Heatmap"; }}
                        />
                      ) : (
                        <div className="w-full h-full relative">
                          {size.width > 0 && (
                            <Stage width={size.width} height={size.height}>
                              <Layer>
                                {imgElement && (
                                  <KonvaImage
                                    image={imgElement}
                                    width={size.width}
                                    height={size.height}
                                    listening={false}
                                  />
                                )}
                                <Rect
                                  x={0}
                                  y={0}
                                  width={size.width}
                                  height={size.height}
                                  fillRadialGradientStartPoint={{ x: size.width / 2, y: size.height / 2 }}
                                  fillRadialGradientStartRadius={0}
                                  fillRadialGradientEndPoint={{ x: size.width / 2, y: size.height / 2 }}
                                  fillRadialGradientEndRadius={Math.max(size.width, size.height)}
                                  fillRadialGradientColorStops={[
                                    0, "rgba(0, 255, 100, 0.2)", 
                                    0.5, "rgba(0, 100, 255, 0.15)", 
                                    1, "rgba(0, 0, 255, 0.05)"
                                  ]}
                                  shadowColor="blue"
                                  shadowBlur={15}
                                  shadowOpacity={0.4}
                                  listening={false}
                                />
                              </Layer>
                            </Stage>
                          )}
                        </div>
                      )
                    ) : (
                      <div className="w-full h-full relative cursor-crosshair">
                        {size.width > 0 && (
                          <Stage
                            width={size.width}
                            height={size.height}
                            ref={stageRef}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            className="absolute inset-0"
                          >
                            <Layer>
                              {imgElement && (
                                <KonvaImage
                                  image={imgElement}
                                  width={size.width}
                                  height={size.height}
                                  listening={false}
                                />
                              )}
                            {tempRect && (
                              <Rect
                                x={tempRect.x}
                                y={tempRect.y}
                                width={tempRect.width}
                                height={tempRect.height}
                                stroke="red"
                                strokeWidth={1}
                                dash={[5, 5]}
                              />
                            )}

                            {(manualAnnotation || severity === 'None') && (
                              <Rect
                                x={0}
                                y={0}
                                width={size.width}
                                height={size.height}
                                fillRadialGradientStartPoint={{ 
                                  x: severity === 'None' ? size.width / 2 : (manualAnnotation?.x + manualAnnotation?.width / 2) * size.width, 
                                  y: severity === 'None' ? size.height / 2 : (manualAnnotation?.y + manualAnnotation?.height / 2) * size.height 
                                }}
                                fillRadialGradientStartRadius={0}
                                fillRadialGradientEndPoint={{ 
                                  x: severity === 'None' ? size.width / 2 : (manualAnnotation?.x + manualAnnotation?.width / 2) * size.width, 
                                  y: severity === 'None' ? size.height / 2 : (manualAnnotation?.y + manualAnnotation?.height / 2) * size.height 
                                }}
                                fillRadialGradientEndRadius={Math.max(size.width, size.height)}
                                fillRadialGradientColorStops={
                                  severity === 'None' 
                                  ? [0, "rgba(0, 255, 100, 0.2)", 0.5, "rgba(0, 100, 255, 0.15)", 1, "rgba(0, 0, 255, 0.05)"]
                                  : [
                                      0, "rgba(255, 0, 0, 0.7)", 
                                      0.15, "rgba(255, 69, 0, 0.5)", 
                                      0.3, "rgba(255, 255, 0, 0.3)", 
                                      0.5, "rgba(0, 255, 0, 0.15)",
                                      0.8, "rgba(0, 0, 255, 0.1)",
                                      1, "rgba(0, 0, 255, 0.05)"
                                    ]
                                }
                                shadowColor={severity === 'None' ? "blue" : "red"}
                                shadowBlur={15}
                                shadowOpacity={0.4}
                                listening={false}
                              />
                            )}
                          </Layer>
                        </Stage>
                      )}
                        
                        {/* Control Overlays */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                          {!isSaved ? (
                            <button
                              type="button"
                              onClick={saveManualChanges}
                              disabled={!tempRect}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
                            >
                              <CheckCircle size={14} /> Save Changes
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={resetManualChanges}
                              className="bg-slate-700/80 hover:bg-slate-800 text-white text-xs font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-1.5 transition active:scale-95"
                            >
                              <Trash2 size={14} /> Reset Drawing
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {!aiReport ? (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center">
                <Activity className="mx-auto text-slate-300 mb-4" size={48} />
                <h2 className="text-xl font-bold text-slate-700 mb-2">No AI Analysis Yet</h2>
                <p className="text-slate-500 mb-6">Run the analysis to generate preliminary findings.</p>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {analyzing ? "Analyzing Image..." : "Run AI Analysis"}
                </button>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-4">
                  <CheckCircle className="text-emerald-500" size={24} />
                  AI Preliminary Report
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="font-semibold text-slate-600">Tumor Detected:</span>
                    <span className={`font-bold px-4 py-1.5 rounded-full ${aiReport.tumorDetected ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {aiReport.tumorDetected ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <span className="font-semibold text-slate-600">AI Confidence:</span>
                    <span className="font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">
                      {aiReport.confidenceScore}%
                    </span>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="block font-semibold text-blue-800 mb-2">Initial Diagnosis:</span>
                    <p className="text-slate-700 leading-relaxed">
                      {aiReport.initialDiagnosis}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Final Report Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 sticky top-10">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">
                Final Medical Report
              </h2>
              <form onSubmit={handleSubmitFinalReport} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Final Diagnosis
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="Enter the confirmed medical diagnosis..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Recommendations / Treatment Plan
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="Enter recommended actions..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Severity Level
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="None">None (Healthy)</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                {/* Manual Confidence Adjustment */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-bold text-slate-700">
                      Doctor Confidence Level:
                    </label>
                    <span className={`text-lg font-black px-4 py-1 rounded-full ${
                      confidenceScore > 80 ? "bg-emerald-100 text-emerald-700" : 
                      confidenceScore > 50 ? "bg-blue-100 text-blue-700" : 
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {confidenceScore}%
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={confidenceScore} 
                    onChange={(e) => setConfidenceScore(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-wider">
                    <span>Uncertain</span>
                    <span>Highly Confident</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!aiReport || submitting}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-slate-200 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Saving Report..." : (
                    <>
                      <Save size={20} />
                      Submit Final Report
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
