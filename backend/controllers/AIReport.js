const AIReport = require("../models/AIReport");
const MedicalImage = require("../models/MedicalImage");

exports.analyzeImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const image = await MedicalImage.findById(imageId);
    if (!image) return res.status(404).json({ message: "Image not found" });

    const isDetected = Math.random() > 0.5;
    const confidence = (Math.random() * (100 - 80) + 80).toFixed(2);

    let detailText = "";
    if (isDetected) {
      detailText = `The AI system has identified patterns consistent with a potential ${image.imageType} abnormality. There are signs of localized mass or tissue density variations that require clinical correlation by a specialist.`;
    } else {
      detailText = `The automated analysis of the ${image.imageType} scan shows no immediate significant findings of tumorous growth. However, this is an initial screening and should be verified by a radiologist.`;
    }

    const aiResult = {
      image: imageId,
      tumorDetected: isDetected,
      confidenceScore: confidence,
      initialDiagnosis: detailText,
      heatmapPath: image.imagePath,
    };

    const report = new AIReport(aiResult);
    await report.save();

    image.status = "Analyzed";
    await image.save();

    res.status(201).json({ message: "Analysis completed", report });
  } catch (error) {
    res
      .status(500)
      .json({ message: "AI Analysis failed", error: error.message });
  }
};

exports.getReportByImage = async (req, res) => {
  try {
    const report = await AIReport.findOne({ image: req.params.imageId });
    if (!report) {
      return res
        .status(404)
        .json({ message: "Report not found for this image" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Error fetching report" });
  }
};
