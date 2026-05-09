import React, { useState } from "react";
import { ClipboardList, Clock, AlertTriangle } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

import DashboardHeader from "../components/DashboardHeader";
import MetricCard from "../components/MetricCard";
import FilterBar from "../components/FilterBar";
import DoctorCasesTable from "../components/DoctorCasesTable";
import EditReportModal from "../components/EditReportModal";
import { useDoctorCases } from "../hooks/useDoctorCases";
import { pageTransitions } from "../utils/animations";

const filterOptions = [
  { label: "Pending Review", value: "Pending" },
  { label: "Reviewed Cases", value: "Reviewed" },
  { label: "Critical Cases", value: "Critical" },
  { label: "All Cases", value: "All" }
];

const DoctorDashboard = () => {
  const { scans, loading, isDeleting, isSaving, deleteCase, updateReport } = useDoctorCases();
  
  const [filter, setFilter] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingScan, setEditingScan] = useState(null);
  const [editForm, setEditForm] = useState({ diagnosis: "", recommendations: "", severity: "Low", reportId: null });

  const filteredScans = scans.filter((scan) => {
    let matchFilter = true;
    if (filter === "Pending") matchFilter = scan.status !== "Reviewed";
    if (filter === "Reviewed") matchFilter = scan.status === "Reviewed";
    if (filter === "Critical") matchFilter = scan.status === "Reviewed" && scan.finalReport?.severity === "Critical";
    
    const matchSearch = scan.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleOpenEdit = (scan) => {
    setEditForm({
      diagnosis: scan.finalReport?.diagnosis || "",
      recommendations: scan.finalReport?.recommendations || "",
      severity: scan.finalReport?.severity || "Low",
      reportId: scan.finalReport?._id
    });
    setEditingScan(scan);
    setEditModalOpen(true);
  };

  const handleSubmitEdit = () => {
    updateReport(editForm.reportId, editForm, () => setEditModalOpen(false));
  };

  return (
    <motion.div {...pageTransitions} className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <Toaster position="top-right" reverseOrder={true} />
      
      <div className="max-w-7xl mx-auto">
        <DashboardHeader 
          title="Doctor Portal" 
          subtitle="Manage and review pending medical cases" 
          icon={ClipboardList} 
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard title="Total Cases" value={scans.length} icon={ClipboardList} delay={0.2} />
          <MetricCard title="Pending Review" value={scans.filter(s => s.status !== "Reviewed").length} icon={Clock} delay={0.3} bgClass="bg-amber-50" textClass="text-amber-600" />
          <MetricCard title="Critical Cases" value={scans.filter(s => s.status === "Reviewed" && s.finalReport?.severity === "Critical").length} icon={AlertTriangle} delay={0.4} bgClass="bg-red-50" textClass="text-red-600" />
        </div>

        <FilterBar 
          filter={filter} setFilter={setFilter} 
          searchTerm={searchTerm} setSearchTerm={setSearchTerm} 
          filterOptions={filterOptions} 
        />

        <DoctorCasesTable 
          scans={filteredScans} 
          loading={loading} 
          isDeleting={isDeleting} 
          handleOpenEdit={handleOpenEdit} 
          handleDeleteCase={deleteCase} 
        />
      </div>

      <EditReportModal 
        open={editModalOpen} setOpen={setEditModalOpen}
        editingScan={editingScan} editForm={editForm} setEditForm={setEditForm}
        isSaving={isSaving} onSubmit={handleSubmitEdit}
      />
    </motion.div>
  );
};

export default DoctorDashboard;
