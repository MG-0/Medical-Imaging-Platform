import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Calendar, ExternalLink, Edit, Trash2, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { AlertDialog, Flex } from "@radix-ui/themes";
import { tableVariants, rowVariants } from "../utils/animations";

const DoctorCasesTable = ({ scans, loading, isDeleting, handleOpenEdit, handleDeleteCase }) => {
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-8 py-5 font-bold uppercase tracking-wider text-xs">Patient Name</th>
              <th className="px-8 py-5 font-bold uppercase tracking-wider text-xs">Scan Type</th>
              <th className="px-8 py-5 font-bold uppercase tracking-wider text-xs">Date Uploaded</th>
              <th className="px-8 py-5 font-bold uppercase tracking-wider text-xs">Status</th>
              <th className="px-8 py-5 font-bold uppercase tracking-wider text-xs">Actions</th>
            </tr>
          </thead>
          
          <motion.tbody variants={tableVariants} initial="hidden" animate="visible" className="divide-y divide-slate-100">
            <AnimatePresence>
              {scans.map((scan, index) => (
                <motion.tr custom={index} variants={rowVariants} initial="hidden" animate="visible" exit="exit" layoutId={scan._id} key={scan._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${scan.status === 'Reviewed' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`}>
                      <User size={18} />
                    </div>
                    <span className="font-extrabold text-slate-800">
                      {scan.patient?.name || "Unknown Patient"}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-slate-600 font-medium">{scan.imageType}</td>
                  <td className="px-8 py-6 text-slate-500 font-medium whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-slate-400" />
                      {new Date(scan.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                        scan.status === "Reviewed"
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : "bg-amber-100 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {scan.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2 items-center flex-wrap">
                      <Link
                        to={`/review/${scan._id}`}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all shadow-sm active:scale-95 group-hover:shadow-md ${scan.status === 'Reviewed' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                      >
                        {scan.status === "Reviewed" ? "View" : "Review"} <ExternalLink size={16} />
                      </Link>

                      {scan.status === "Reviewed" && (
                        <button
                          onClick={() => handleOpenEdit(scan)}
                          className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 px-3 py-2 rounded-xl font-bold transition-all shadow-sm active:scale-95 group-hover:shadow-md"
                          title="Edit Final Report"
                        >
                          <Edit size={16} /> Edit
                        </button>
                      )}
                      
                      <AlertDialog.Root>
                        <AlertDialog.Trigger>
                          <button
                            disabled={isDeleting}
                            className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 px-3 py-2 rounded-xl font-bold transition-all shadow-sm active:scale-95 group-hover:shadow-md disabled:opacity-50"
                            title="Delete Case"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </AlertDialog.Trigger>
                        <AlertDialog.Content maxWidth="450px" className="rounded-3xl p-8 shadow-2xl border border-red-100">
                          <AlertDialog.Title className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                            <span className="p-2 bg-red-100 text-red-600 rounded-xl"><Trash2 size={24} /></span> Confirm Deletion
                          </AlertDialog.Title>
                          <AlertDialog.Description size="2" className="text-slate-500 mb-8 mt-5 font-medium leading-relaxed">
                            Are you absolutely sure you want to delete <span className="font-bold text-slate-700">{scan.patient?.name}'s</span> entire case file? This action will permanently drop the physical MRI, the AI analysis parameters, and the Final Report from the system.
                          </AlertDialog.Description>
                          <Flex gap="4" justify="end">
                            <AlertDialog.Cancel>
                              <button className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action>
                              <button onClick={() => handleDeleteCase(scan._id)} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95">
                                Yes, Purge Record
                              </button>
                            </AlertDialog.Action>
                          </Flex>
                        </AlertDialog.Content>
                      </AlertDialog.Root>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </motion.tbody>
        </table>
      </div>

      {scans.length === 0 && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-16 flex flex-col items-center justify-center text-slate-400">
          <ClipboardList size={48} className="text-slate-300 mb-4" />
          <p className="text-lg font-medium text-slate-500">No cases found matching your criteria.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DoctorCasesTable;
