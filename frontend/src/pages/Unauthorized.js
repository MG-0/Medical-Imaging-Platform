import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

const Unauthorized = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-white p-10 md:p-14 rounded-[2rem] shadow-xl border border-slate-200 max-w-lg w-full text-center"
      >
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-red-50">
          <ShieldAlert className="text-red-500" size={48} />
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-800 mb-4">Access Denied</h1>
        <p className="text-slate-500 font-medium mb-10 leading-relaxed">
          You do not have the required permissions to view this page. This area is strictly restricted to authorized personnel.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            to={(() => {
              if (!user) return "/signin";
              if (user.role === "doctor" || user.role === "admin") return "/doctor-dashboard";
              return "/patient-dashboard";
            })()}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Return to My Dashboard
          </Link>
          <Link
            to="/"
            className="w-full bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-bold py-4 px-6 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Go to Home Page
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
