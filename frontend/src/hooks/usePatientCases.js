import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import { showCustomToast } from "../utils/toastUtils";
import { Bell } from "lucide-react";
import React from "react";

export const usePatientCases = () => {
  const [images, setImages] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [uploading, setUploading] = useState(false);

  const prevStatusesRef = useRef({}); 

  const fetchMyImages = async (isBackgroundPoll = false) => {
    try {
      const res = await API.get("/images/my-images");
      const fetchedImages = res.data;
      
      if (isBackgroundPoll) {
        fetchedImages.forEach((img) => {
          const oldStatus = prevStatusesRef.current[img._id];
          if (oldStatus && oldStatus !== "Reviewed" && img.status === "Reviewed") {
            const doctorName = img.finalReport?.doctor?.name || 'your doctor';
            showCustomToast(
              "Report Finalized!",
              `Dr. ${doctorName} has just completed reviewing your scan and attached the final report.`,
              true,
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-sm"><Bell size={20} className="animate-bounce" /></div>
            );
          }
          prevStatusesRef.current[img._id] = img.status;
        });
      } else {
        const statusMap = {};
        fetchedImages.forEach((img) => { statusMap[img._id] = img.status; });
        prevStatusesRef.current = statusMap;
      }
      setImages(fetchedImages);
    } catch (err) {
      if (!isBackgroundPoll) console.error("Failed to fetch images", err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/users/doctors/list");
      setDoctors(res.data);
    } catch (err) {
      console.error("Failed to fetch doctors", err);
    }
  };

  useEffect(() => {
    fetchMyImages();
    fetchDoctors();
    const intervalId = setInterval(() => fetchMyImages(true), 10000);
    return () => clearInterval(intervalId);
  }, []);

  const uploadImage = async (file, doctorId, onSuccess) => {
    if (!file) return showCustomToast("Validation Error", "Please select an MRI image file.", false);
    if (!doctorId) return showCustomToast("Validation Error", "Please select a doctor.", false);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("doctorId", doctorId);
    formData.append("imageType", "MRI");

    try {
      setUploading(true);
      await API.post("/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showCustomToast("Upload Successful", "Your scan has been safely transmitted to the selected doctor for review.");
      fetchMyImages(); // refresh
      if (onSuccess) onSuccess();
    } catch (err) {
      showCustomToast("Upload Failed", err.response?.data?.message || err.message, false);
    } finally {
      setUploading(false);
    }
  };

  return {
    images,
    doctors,
    uploading,
    uploadImage
  };
};
