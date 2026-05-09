const FinalReport = require("../models/FinalReport");
const MedicalImage = require("../models/MedicalImage");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");



exports.submitFinalReport = async (req, res) => {
  try {
    const { aiReportId, imageId, diagnosis, recommendations, severity, manualAnnotation, confidenceScore } =
      req.body;

    const finalReport = new FinalReport({
      aiReport: aiReportId,
      doctor: req.user.id,
      diagnosis,
      recommendations,
      severity,
      manualAnnotation,
      confidenceScore,
    });

    await finalReport.save();

    await MedicalImage.findByIdAndUpdate(imageId, { status: "Reviewed" });

    res
      .status(201)
      .json({ message: "Final report submitted successfully", finalReport });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to submit final report", error: error.message });
  }
};

exports.getPatientReports = async (req, res) => {
  try {
    const reports = await FinalReport.find({
      doctor: { $exists: true },
    }).populate({
      path: "aiReport",
      populate: { path: "image" },
    });

    const myReports = reports.filter(
      (report) => report.aiReport.image.patient.toString() === req.user.id,
    );

    res.status(200).json(myReports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your reports" });
  }
};



exports.downloadPDFReport = async (req, res) => {
  try {
    const report = await FinalReport.findById(req.params.reportId)
      .populate({
        path: "aiReport",
        populate: { path: "image", populate: { path: "patient" } },
      })
      .populate("doctor", "name email");

    if (!report) return res.status(404).json({ message: "Report not found" });

    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const fileName = `Medical_Report_${report._id}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    doc.pipe(res);

    // --- SINGLE PAGE LAYOUT (A4) ---
    doc.rect(0, 0, doc.page.width, 90).fill("#0f172a"); 
    doc.fillColor("#ffffff").fontSize(24).font("Helvetica-Bold").text("MEDICAL ANALYSIS REPORT", 50, 35, { align: "center" });
    
    doc.y = 110;
    doc.x = 50;

    // Header Info Box
    doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(10);
    doc.text(`Date: ${new Date().toLocaleString()}`, { align: "right" });
    doc.moveDown(0.5);
    
    const infoY = doc.y;
    doc.rect(50, infoY, doc.page.width - 100, 45).lineWidth(0.5).strokeColor("#cbd5e1").stroke();
    doc.fillColor("#334155").font("Helvetica-Bold").fontSize(11).text(`Patient: `, 65, infoY + 10, { continued: true }).font("Helvetica").text(`${report.aiReport.image.patient.name}`);
    doc.font("Helvetica-Bold").text(`Specialist: `, { continued: true }).font("Helvetica").text(`Dr. ${report.doctor.name}`);
    
    doc.y = infoY + 65;

    // Report Content Grid
    // 1. AI Section
    doc.fillColor("#4338ca").fontSize(13).font("Helvetica-Bold").text("1. PRELIMINARY AI ANALYSIS");
    doc.rect(50, doc.y + 2, doc.page.width - 100, 1).fill("#e2e8f0");
    doc.moveDown(0.5);
    
    doc.fillColor("#334155").fontSize(10).font("Helvetica-Bold").text("Detection: ", { continued: true })
       .fillColor(report.aiReport.tumorDetected ? "#dc2626" : "#059669").text(report.aiReport.tumorDetected ? "POSITIVE" : "NEGATIVE", { continued: true })
       .fillColor("#64748b").font("Helvetica").text(` (Confidence: ${report.confidenceScore || report.aiReport.confidenceScore}%)`);
    
    doc.fillColor("#475569").font("Helvetica-Bold").text("AI Diagnosis: ", { continued: true })
       .font("Helvetica").text(report.aiReport.initialDiagnosis || "Analyzed by Neural Network");
    
    doc.moveDown(1);

    // 2. Physician Section
    doc.fillColor("#059669").fontSize(13).font("Helvetica-Bold").text("2. CLINICAL PHYSICIAN REVIEW");
    doc.rect(50, doc.y + 2, doc.page.width - 100, 1).fill("#e2e8f0");
    doc.moveDown(0.5);

    doc.fillColor("#334155").fontSize(10).font("Helvetica-Bold").text("Assessed Severity: ", { continued: true });
    const sevColor = report.severity === "Critical" ? "#b91c1c" : report.severity === "High" ? "#ea580c" : "#059669";
    doc.fillColor(sevColor).text(report.severity.toUpperCase());

    doc.moveDown(0.5);
    doc.fillColor("#0f172a").font("Helvetica-Bold").text("Doctor's Final Diagnosis:");
    doc.fillColor("#334155").font("Helvetica").fontSize(10).text(report.diagnosis || "No specific diagnosis provided.", { align: "justify" });

    doc.moveDown(0.5);
    doc.fillColor("#0f172a").font("Helvetica-Bold").text("Medical Recommendations:");
    doc.fillColor("#334155").font("Helvetica").fontSize(10).text(report.recommendations || "Routine follow-up advised.", { align: "justify" });

    doc.moveDown(1.5);

    // 3. Visual Analysis (Side by Side)
    doc.fillColor("#0f172a").fontSize(13).font("Helvetica-Bold").text("3. VISUAL DATA COMPARISON");
    doc.rect(50, doc.y + 2, doc.page.width - 100, 1).fill("#e2e8f0");
    doc.moveDown(1);

    const imgWidth = 220;
    const imgPadding = 30;
    const currentY = doc.y;

    // Draw Original
    if (report.aiReport.image.imagePath) {
      const originalPath = path.join(__dirname, "..", report.aiReport.image.imagePath);
      if (fs.existsSync(originalPath)) {
        doc.fontSize(9).fillColor("#64748b").text("ORIGINAL MRI", 50, currentY, { width: imgWidth, align: "center" });
        doc.image(originalPath, 50, currentY + 15, { width: imgWidth });
      }
    }

    // Draw Heatmap (AI or Manual)
    if ((report.manualAnnotation && report.manualAnnotation.width) || report.severity === 'None') {
      // Draw Manual/Healthy Annotation based on Original
      const originalPath = path.join(__dirname, "..", report.aiReport.image.imagePath);
      if (fs.existsSync(originalPath)) {
        doc.fontSize(9).fillColor("#64748b").text(report.severity === 'None' ? "HEALTHY ANALYSIS" : "MANUAL CORRECTION", 50 + imgWidth + imgPadding, currentY, { width: imgWidth, align: "center" });
        
        // Draw the image first
        doc.image(originalPath, 50 + imgWidth + imgPadding, currentY + 15, { width: imgWidth });
        
        // Setup center point with safety fallbacks to avoid NaN crashes
        const ann = report.manualAnnotation || { x: 0.4, y: 0.4, width: 0.2, height: 0.2 };
        const safeX = Number(ann.x) || 0.4;
        const safeY = Number(ann.y) || 0.4;
        const safeW = Number(ann.width) || 0.2;
        const safeH = Number(ann.height) || 0.2;

        const scanX = 50 + imgWidth + imgPadding;
        const scanY = currentY + 15;
        
        const centerX = scanX + (safeX + safeW / 2) * imgWidth;
        const centerY = scanY + (safeY + safeH / 2) * imgWidth; 
        const maxRadius = imgWidth * 0.8;

        if (!isNaN(centerX) && !isNaN(centerY)) {
          doc.save();
          
          // Create radial gradient based on severity
          const grad = doc.radialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
          
          if (report.severity === 'None') {
            grad.stop(0, [0, 255, 100], 0.4)      // Green
                .stop(0.5, [0, 100, 255], 0.2)   // Blue
                .stop(1, [0, 0, 255], 0.05);     // Transparent Blue
          } else {
            grad.stop(0, [255, 0, 0], 0.7)      // Red
                .stop(0.2, [255, 100, 0], 0.5)  // Orange
                .stop(0.4, [255, 255, 0], 0.3)  // Yellow
                .stop(0.6, [0, 255, 0], 0.15)    // Green
                .stop(0.8, [0, 0, 255], 0.1)     // Blue
                .stop(1, [0, 0, 255], 0);       // Transparent Blue
          }

          // Clip to image area and draw gradient
          doc.rect(scanX, scanY, imgWidth, imgWidth).clip();
          doc.circle(centerX, centerY, maxRadius).fill(grad);
          
          doc.restore();
        }
      }
    } else if (report.aiReport.heatmapPath) {
      const heatmapFullPath = path.join(__dirname, "..", report.aiReport.heatmapPath);
      if (fs.existsSync(heatmapFullPath)) {
        doc.fontSize(9).fillColor("#64748b").text("AI HEATMAP", 50 + imgWidth + imgPadding, currentY, { width: imgWidth, align: "center" });
        doc.image(heatmapFullPath, 50 + imgWidth + imgPadding, currentY + 15, { width: imgWidth });
      }
    }

    // Footer
    doc.fontSize(8).fillColor("#94a3b8").text("This clinical document is generated by the AI Diagnostic System and verified by licensed medical professionals.", 50, doc.page.height - 40, { align: "center" });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Error generating PDF", error: error.message });
  }
};

exports.editFinalReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnosis, recommendations, severity, manualAnnotation, confidenceScore } = req.body;

    const report = await FinalReport.findById(id).populate("doctor");

    if (!report) {
      return res.status(404).json({ message: "Final report not found" });
    }

    if (report.doctor._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to edit this report" });
    }

    report.diagnosis = diagnosis || report.diagnosis;
    report.recommendations = recommendations || report.recommendations;
    report.severity = severity || report.severity;
    if (manualAnnotation) report.manualAnnotation = manualAnnotation;
    if (confidenceScore !== undefined) report.confidenceScore = confidenceScore;

    await report.save();

    res.status(200).json({ message: "Report updated successfully", report });
  } catch (error) {
    res.status(500).json({ message: "Failed to update report", error: error.message });
  }
};
