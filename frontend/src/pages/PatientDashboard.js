import React, { useState } from "react";
import { Activity, UploadCloud, FileText } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

import DashboardHeader from "../components/DashboardHeader";
import MetricCard from "../components/MetricCard";
import PatientCasesGrid from "../components/PatientCasesTable";
import UploadScanModal from "../components/UploadScanModal";
import { usePatientCases } from "../hooks/usePatientCases";
import { pageTransitions } from "../utils/animations";

const PatientDashboard = () => {
  const { images, doctors, uploading, uploadImage } = usePatientCases();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <motion.div {...pageTransitions} className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <Toaster position="top-right" reverseOrder={true} />
      
      <div className="max-w-7xl mx-auto">
        <DashboardHeader 
          title="Patient Portal" 
          subtitle="Upload scans and track your medical analysis securely" 
          icon={Activity} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MetricCard 
            title="Total Uploads" 
            value={images.length} 
            icon={Activity} 
            delay={0.2} 
          />
          <MetricCard 
            title="Finalized Reports" 
            value={images.filter(img => img.status === "Reviewed").length} 
            icon={FileText} 
            delay={0.3} 
            bgClass="bg-emerald-50" 
            textClass="text-emerald-600" 
          />
        </div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex justify-end mb-6">
          <button
            onClick={() => setDialogOpen(true)}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 group"
          >
            <UploadCloud size={20} className="group-hover:scale-110 transition-transform" />
            Upload New Scan
          </button>
        </motion.div>

        <PatientCasesGrid 
          images={images} 
          loading={images.length === 0} 
        />
      </div>

      <UploadScanModal 
        open={dialogOpen} 
        setOpen={setDialogOpen}
        doctors={doctors}
        uploading={uploading}
        onUpload={uploadImage}
      />
    </motion.div>
  );
};

export default PatientDashboard;
