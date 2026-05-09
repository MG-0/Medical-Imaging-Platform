const MedicalImage = require("../models/MedicalImage");
const AIReport = require("../models/AIReport"); // تأكد من استدعاء الموديل فوق
// Upload a medical image for the authenticated patient
const axios = require("axios");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No image uploaded" });

    // 1. حفظ الصورة الأساسية
    const newImage = new MedicalImage({
      patient: req.user.id,
      assignedDoctor: req.body.doctorId, // حفظ الطبيب المختار
      imageType: req.body.imageType,
      imagePath: req.file.path,
      status: "Pending",
    });
    await newImage.save();

    try {
      // 2. طلب التحليل من بايثون
      const aiResponse = await axios.post("http://127.0.0.1:5001/predict", {
        path: req.file.path,
      });

      let diagnosisMsg = aiResponse.data.result;
      if (diagnosisMsg !== "No Tumor") {
        diagnosisMsg = `AI detection indicates potential signs of ${diagnosisMsg}. Please note this is a preliminary analysis and wait for your doctor's final verification.`;
      } else {
        diagnosisMsg = "No tumor detected by the preliminary AI analysis. A review by your assigned doctor is still required to confirm this result.";
      }

      // 3. إنشاء تقرير الـ AI وربطه بالصورة (بناءً على الـ Schema الجديدة)
      const newAIReport = new AIReport({
        image: newImage._id,
        tumorDetected: aiResponse.data.result !== "No Tumor",
        confidenceScore: parseFloat(aiResponse.data.confidence),
        heatmapPath: aiResponse.data.heatmap_url, // المسار اللي راجع من بايثون
        initialDiagnosis: diagnosisMsg,
      });
      await newAIReport.save();

      // 4. تحديث حالة الصورة لـ Analyzed
      newImage.status = "Analyzed";
      await newImage.save();
    } catch (aiErr) {
      console.error("AI Server Error:", aiErr.message);
      // في حالة فشل بايثون، الصورة بتفضل Pending
    }

    res.status(201).json({ message: "Success", data: newImage });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get My images for the authenticated patient
exports.getMyImages = async (req, res) => {
  try {
    const patientId = req.user.id;
    const images = await MedicalImage.find({ patient: patientId })
      .lean()
      .sort({ createdAt: -1 });

    const AIReport = require("../models/AIReport");
    const FinalReport = require("../models/FinalReport");

    for (let i = 0; i < images.length; i++) {
      const ai = await AIReport.findOne({ image: images[i]._id }).lean();
      if (ai) {
        images[i].aiReport = ai;
        const final = await FinalReport.findOne({ aiReport: ai._id })
          .populate("doctor", "name")
          .lean();
        if (final) {
          images[i].finalReport = final;
        }
      }
    }

    res.status(200).json(images);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get images", error: error.message });
  }
};

// Get All images for the authenticated patient
exports.getAllImages = async (req, res) => {
  try {
    let filter = {};
    // فلترة الحالات لتظهر فقط للطبيب المعالج (سواء كان حسابه doctor أو admin)
    if (req.user.role === "doctor" || req.user.role === "admin") {
      filter.assignedDoctor = req.user.id;
    }
    const images = await MedicalImage.find(filter)
      .populate("patient", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const FinalReport = require("../models/FinalReport");
    for (let i = 0; i < images.length; i++) {
      if (images[i].status === "Reviewed") {
        const AS = require("../models/AIReport");
        const ai = await AS.findOne({ image: images[i]._id }).lean();
        if (ai) {
          const final = await FinalReport.findOne({ aiReport: ai._id }).lean();
          if (final) images[i].finalReport = final;
        }
      }
    }

    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all images" });
  }
};

exports.getPendingReviews = async (req, res) => {
  try {
    let filter = { status: "Analyzed" };
    // فلترة الحالات المعلقة لتظهر فقط للطبيب المعالج
    if (req.user.role === "doctor" || req.user.role === "admin") {
      filter.assignedDoctor = req.user.id;
    }
    const pendingImages = await MedicalImage.find(filter).populate(
      "patient",
      "name email",
    );
    res.status(200).json(pendingImages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending reviews" });
  }
};

// ... الأكواد القديمة (uploadImage, getAllImages)

exports.getCaseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await MedicalImage.findById(id).populate(
      "patient",
      "name email",
    );
    if (!image) return res.status(404).json({ message: "Case not found" });

    // استدعاء موديل الـ AIReport
    const AIReport = require("../models/AIReport");
    const aiReport = await AIReport.findOne({ image: id });

    res.status(200).json({
      image,
      aiReport,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching details", error: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await MedicalImage.findById(id);
    if (!image) return res.status(404).json({ message: "Case not found" });

    // Check permission
    if (req.user.role !== "admin" && (req.user.role !== "doctor" || image.assignedDoctor?.toString() !== req.user.id)) {
      return res.status(403).json({ message: "Unauthorized to delete this case" });
    }

    const fs = require("fs");
    const path = require("path");
    
    if (image.imagePath) {
      const fullPath = path.join(__dirname, "..", image.imagePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    const AIReport = require("../models/AIReport");
    const FinalReport = require("../models/FinalReport");
    const aiReport = await AIReport.findOne({ image: id });

    if (aiReport) {
      if (aiReport.heatmapPath) {
        const fullHeatmapPath = path.join(__dirname, "..", aiReport.heatmapPath);
        if (fs.existsSync(fullHeatmapPath)) fs.unlinkSync(fullHeatmapPath);
      }
      await FinalReport.deleteMany({ aiReport: aiReport._id });
      await AIReport.findByIdAndDelete(aiReport._id);
    }

    await MedicalImage.findByIdAndDelete(id);

    res.status(200).json({ message: "Case fully deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete case", error: error.message });
  }
};
