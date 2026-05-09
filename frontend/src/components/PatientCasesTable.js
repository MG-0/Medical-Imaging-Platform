import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Download, Brain, FileText, Calendar, UploadCloud } from "lucide-react";
import API, { BASE_URL } from "../services/api";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";

const ManualHeatmap = ({ imagePath, annotation, severity }) => {
  const [imgElement, setImgElement] = useState(null);
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new window.Image();
    img.src = `${BASE_URL}/${imagePath.replace(/\\/g, "/")}`;
    img.crossOrigin = "Anonymous";
    img.onload = () => setImgElement(img);
  }, [imagePath]);

  useEffect(() => {
    if (containerRef.current && imgElement) {
      const updateSize = () => {
        if (!containerRef.current) return;
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight || 300;
        
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
      };
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, [imgElement]);

  // Show heatmap if there's an annotation OR if it's a "None/Healthy" case
  if (!annotation && severity !== 'None') return null;

  return (
    <div ref={containerRef} className="w-full h-full min-h-[250px] relative flex items-center justify-center overflow-hidden">
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
          {(annotation || severity === 'None') && (
            <Rect
              x={0}
              y={0}
              width={size.width}
              height={size.height}
              fillRadialGradientStartPoint={{ 
                x: severity === 'None' ? size.width / 2 : (annotation.x + annotation.width / 2) * size.width, 
                y: severity === 'None' ? size.height / 2 : (annotation.y + annotation.height / 2) * size.height 
              }}
              fillRadialGradientStartRadius={0}
              fillRadialGradientEndPoint={{ 
                x: severity === 'None' ? size.width / 2 : (annotation.x + annotation.width / 2) * size.width, 
                y: severity === 'None' ? size.height / 2 : (annotation.y + annotation.height / 2) * size.height 
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
    </div>
  );
};

const handleDownload = async (reportId) => {
  try {
    const res = await API.get(`/final-reports/download/${reportId}`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Medical_Report_${reportId}.pdf`);
    document.body.appendChild(link);
    link.click();
  } catch (err) {
    console.error("Failed to download PDF", err);
  }
};

const PatientCasesGrid = ({ images, loading }) => {
  return (
    <div className="w-full space-y-12">
      <AnimatePresence>
        {(images || []).map((img, index) => (
          <motion.div
            key={img._id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
            transition={{ duration: 0.4, ease: "easeOut", type: "spring", stiffness: 100 }}
            className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 flex flex-col relative"
          >
            {/* Card Header */}
            <div className="flex flex-wrap justify-between items-center px-6 md:px-10 py-5 border-b border-slate-100 bg-slate-50/50 gap-4">
                <div className="flex items-center gap-3">
                  <motion.span 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
                    className={`px-5 py-2 rounded-xl text-sm font-extrabold shadow-sm ${
                      img.status === "Reviewed" ? "bg-emerald-500 text-white" :
                      img.status === "Analyzed" ? "bg-indigo-500 text-white" : "bg-blue-500 text-white"
                    }`}
                  >
                    {img.status}
                  </motion.span>
                  <div className="text-slate-500 text-[11px] font-bold flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg shadow-sm border border-slate-100">
                     <Calendar size={12} className="text-slate-400" /> 
                     {new Date(img.createdAt).toLocaleDateString()} | {new Date(img.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row p-6 md:p-10 gap-8 items-stretch">
                
                {/* Left Column: Original Scan */}
                <div className="flex-1 flex flex-col relative group">
                  <h4 className="font-extrabold text-slate-700 mb-4 flex items-center justify-center md:justify-start gap-2 text-lg">
                     <Activity size={20} className="text-blue-500" /> Original {img.imageType} Scan
                  </h4>
                  <div className="bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] p-4 flex-1 flex items-center justify-center relative overflow-hidden transition-all group-hover:border-blue-200 group-hover:bg-blue-50/50">
                     <motion.img 
                       whileHover={{ scale: 1.05 }}
                       transition={{ duration: 0.3 }}
                       src={`${BASE_URL}/${img.imagePath.replace(/\\/g, "/")}`} 
                       alt="MRI Scan" 
                       className="w-full h-56 xl:h-72 object-contain filter drop-shadow-md z-10"
                     />
                  </div>
                </div>

                {/* Center Column: Heatmap */}
                {img.status === "Reviewed" && (img.aiReport?.heatmapPath || img.finalReport?.manualAnnotation || img.finalReport?.severity === 'None') && (
                  <div className="flex-1 flex flex-col relative group border-t xl:border-t-0 xl:border-l xl:border-r border-slate-100 xl:px-6 pt-6 xl:pt-0">
                    <h4 className="font-extrabold text-slate-700 mb-4 flex items-center justify-center md:justify-start gap-2 text-lg">
                       <Brain size={20} className={img.finalReport?.manualAnnotation ? "text-red-500" : "text-purple-500"} /> 
                       {img.finalReport?.manualAnnotation ? "Manual Correction" : "AI Heatmap"}
                    </h4>
                     <div className="bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] p-4 flex-1 flex items-center justify-center relative overflow-hidden transition-all group-hover:border-blue-200 group-hover:bg-blue-50/50">
                        { (img.finalReport?.manualAnnotation || img.finalReport?.severity === 'None') ? (
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full"
                          >
                            <ManualHeatmap 
                              imagePath={img.imagePath} 
                              annotation={img.finalReport?.manualAnnotation || { x: 0.4, y: 0.4, width: 0.2, height: 0.2 }} 
                              severity={img.finalReport?.severity} 
                            />
                          </motion.div>
                        ) : img.aiReport?.heatmapPath ? (
                          <motion.img 
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            src={`${BASE_URL}/${img.aiReport.heatmapPath.replace(/\\/g, "/")}`} 
                            alt="MRI Heatmap" 
                            className="w-full h-56 xl:h-72 object-contain filter drop-shadow-md z-10 mix-blend-multiply opacity-90"
                          />
                        ) : null}
                     </div>
                  </div>
                )}

                {/* Right Column: Reports */}
                <div className={`flex flex-col gap-5 ${img.status === "Reviewed" && img.aiReport?.heatmapPath ? "flex-[1.2]" : "flex-1 xl:ml-8"} pt-6 xl:pt-0 border-t xl:border-t-0 border-slate-100`}>
                  
                  {/* Preliminary Report */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-[1.5rem] border border-indigo-100 shadow-sm"
                  >
                    <h4 className="font-extrabold text-indigo-900 flex items-center gap-2 mb-3">
                      <Brain size={18} className="text-indigo-500" /> Preliminary AI Report
                    </h4>
                    <p className="text-indigo-800/90 font-medium text-sm leading-relaxed p-3 bg-white/60 rounded-xl">
                      {img.aiReport ? img.aiReport.initialDiagnosis : "Processing..."}
                    </p>
                  </motion.div>

                  {/* Final Report */}
                  {img.status === "Reviewed" && img.finalReport ? (
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-[1.5rem] border border-emerald-100 shadow-sm flex flex-col flex-1"
                    >
                      <div className="flex flex-col gap-3 mb-4 border-b border-emerald-200/40 pb-4">
                        <h4 className="font-extrabold text-emerald-900 flex items-center gap-2">
                          <FileText size={18} className="text-emerald-500" /> Final Medical Report 
                        </h4>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/50 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-sm">
                            Attending Physician: Dr. {img.finalReport.doctor?.name || "Specialist"}
                          </span>
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm text-white ${
                            img.finalReport.severity === 'Critical' ? 'bg-red-500' : 
                            img.finalReport.severity === 'High' ? 'bg-orange-500' : 'bg-emerald-500'
                          }`}>
                            Severity: {img.finalReport.severity}
                          </span>
                          <span className="text-xs font-black text-blue-700 bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200">
                            Confidence: {img.finalReport.confidenceScore || img.aiReport.confidenceScore}%
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div>
                          <h5 className="font-bold text-emerald-800/60 uppercase tracking-widest text-[10px] mb-1.5">Diagnosis</h5>
                          <p className="text-slate-700 text-sm font-bold bg-white p-3.5 rounded-xl border border-emerald-50 shadow-sm">
                            {img.finalReport.diagnosis}
                          </p>
                        </div>
                        <div>
                          <h5 className="font-bold text-emerald-800/60 uppercase tracking-widest text-[10px] mb-1.5">Recommendations</h5>
                          <p className="text-slate-700 text-sm font-bold bg-white p-3.5 rounded-xl border border-emerald-50 shadow-sm">
                            {img.finalReport.recommendations}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-slate-50 border-2 border-slate-200 border-dashed rounded-[1.5rem] p-6 flex-1 flex flex-col items-center justify-center text-center">
                      <Activity size={32} className="text-blue-300 animate-pulse mb-3" />
                      <h4 className="font-extrabold text-slate-500">Pending Review</h4>
                      <p className="text-slate-400 text-sm mt-1 max-w-[200px] font-medium leading-relaxed">Waiting for doctor's official confirmation.</p>
                    </div>
                  )}
                </div>
                
            </div>

            {/* Bottom Download Button */}
            {img.status === "Reviewed" && img.finalReport && (
              <motion.button 
                whileHover={{ backgroundColor: "#0f172a", scale: 1.002 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDownload(img.finalReport._id)}
                className="w-full bg-slate-800 text-white pt-5 pb-6 flex items-center justify-center gap-3 font-extrabold text-lg uppercase tracking-wider transition-colors shadow-inner group"
              >
                <Download size={24} className="group-hover:-translate-y-1 transition-transform text-emerald-400" /> 
                Download Complete Medical PDF
              </motion.button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {images.length === 0 && !loading && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-24 px-6 flex flex-col items-center justify-center bg-white rounded-[2.5rem] shadow-sm border border-slate-100">
          <UploadCloud size={80} className="text-blue-100 mb-6 drop-shadow-sm" />
          <p className="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">No Scans Uploaded</p>
          <p className="font-medium text-slate-500 text-lg max-w-md text-center leading-relaxed">Your secure medical portal is empty. Upload your first scan to begin AI analysis.</p>
        </motion.div>
      )}
    </div>
  );
};

export default PatientCasesGrid;
