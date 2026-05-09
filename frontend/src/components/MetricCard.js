import React from "react";
import { motion } from "framer-motion";

const MetricCard = ({ title, value, icon: Icon, delay = 0, bgClass = "bg-blue-50", textClass = "text-blue-600" }) => {
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ delay }} 
      className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-slate-100 flex items-center gap-5 transition-shadow"
    >
      <div className={`w-16 h-16 ${bgClass} ${textClass} rounded-2xl flex items-center justify-center`}>
         <Icon size={32} />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-extrabold text-slate-800">{value}</p>
      </div>
    </motion.div>
  );
}

export default MetricCard;
