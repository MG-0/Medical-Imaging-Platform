import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { CheckCircle, X } from "lucide-react";
import React from "react";

export const showCustomToast = (title, message, isSuccess = true, icon = null) => {
  toast.custom((t) => (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 overflow-hidden ${t.visible ? 'animate-enter' : 'animate-leave'}`}
    >
      <div className="flex-1 p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            {icon || (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {isSuccess ? <CheckCircle size={24} /> : <X size={24} />}
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-extrabold text-slate-900">{title}</p>
            <p className="mt-1 text-sm text-slate-500 font-medium leading-relaxed">{message}</p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-slate-100">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </motion.div>
  ), { duration: 6000 });
};
