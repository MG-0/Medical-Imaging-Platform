import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const FilterBar = ({ filter, setFilter, searchTerm, setSearchTerm, filterOptions }) => {
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div className="flex gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap shadow-sm ${
              filter === option.value
                ? "bg-slate-800 text-white shadow-md scale-105"
                : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="relative w-full md:w-1/3 group">
        <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Search by patient name..." 
          className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3.5 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all font-semibold text-slate-700 shadow-sm" 
        />
      </div>
    </motion.div>
  );
};

export default FilterBar;
