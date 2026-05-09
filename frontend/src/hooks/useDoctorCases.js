import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import { showCustomToast } from "../utils/toastUtils";
import { Bell, Trash2 } from "lucide-react";
import React from "react";

export const useDoctorCases = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const prevPendingCountRef = useRef(null);

  const fetchAllScans = async (isBackgroundPoll = false) => {
    try {
      const res = await API.get("/images/all");
      const fetchedScans = res.data;
      const currentPending = fetchedScans.filter(s => s.status !== "Reviewed").length;

      if (isBackgroundPoll) {
        if (prevPendingCountRef.current !== null && currentPending > prevPendingCountRef.current) {
          showCustomToast(
            "New Scan Arrived!",
            "A patient has just uploaded a new scan requiring your immediate review.",
            true,
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-sm"><Bell size={20} className="animate-pulse" /></div>
          );
        }
      }
      
      prevPendingCountRef.current = currentPending;
      setScans(fetchedScans);
    } catch (err) {
      if (!isBackgroundPoll) console.error("Error fetching scans", err);
    } finally {
      if (!isBackgroundPoll) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllScans();
    const intervalId = setInterval(() => fetchAllScans(true), 10000);
    return () => clearInterval(intervalId);
  }, []);

  const deleteCase = async (scanId) => {
    setIsDeleting(true);
    try {
      await API.delete(`/images/${scanId}`);
      showCustomToast("Case Deleted", "The patient record has been permanently purged from the system.", true, <Trash2 size={24} className="text-red-500" />);
      setScans(prev => prev.filter(s => s._id !== scanId));
    } catch (err) {
      showCustomToast("Delete Failed", err.response?.data?.message || err.message, false);
    } finally {
      setIsDeleting(false);
    }
  };

  const updateReport = async (reportId, payload, onSuccess) => {
    if (!reportId || !payload.diagnosis) {
      return showCustomToast("Validation Error", "Diagnosis cannot be empty.", false);
    }
    
    setIsSaving(true);
    try {
      await API.put(`/final-reports/edit/${reportId}`, payload);
      showCustomToast("Updates Saved", "The final medical report has been officially updated.");
      if (onSuccess) onSuccess();
      fetchAllScans(); // Sync
    } catch (err) {
      showCustomToast("Update Failed", err.response?.data?.message || err.message, false);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    scans,
    loading,
    isDeleting,
    isSaving,
    deleteCase,
    updateReport
  };
};
