import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { Activity, ArrowRight, ShieldCheck, User, Brain, Bell, CheckCircle, X, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { AlertDialog, Flex } from "@radix-ui/themes";

const showCustomToast = (title, message, isSuccess = true, icon = null) => {
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
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
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

const Home = () => {
  const { user, signout } = useContext(AuthContext);
  const checkedRef = useRef(false);

  useEffect(() => {
    // Only check once per mount if user is logged in
    if (user && !checkedRef.current) {
      checkedRef.current = true;
      checkNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const checkNotifications = async () => {
    if (sessionStorage.getItem("hasSeenHomeNotifications") === "true") return;

    try {
      if (user.role === "doctor" || user.role === "admin") {
        const res = await API.get("/images/all");
        const pendingCount = res.data.filter(s => s.status !== "Reviewed").length;
        if (pendingCount > 0 && !sessionStorage.getItem("hasSeenDoctorWelcome")) {
          showCustomToast(
            "Action Required",
            `You have ${pendingCount} pending patient scan(s) awaiting your medical review in the dashboard.`,
            true,
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shadow-sm"><Bell size={20} className="animate-bounce" /></div>
          );
          sessionStorage.setItem("hasSeenDoctorWelcome", "true");
        }
      } else {
        const res = await API.get("/images/my-images");
        const reviewedCases = res.data.filter(img => img.status === "Reviewed" && img.finalReport);
        if (reviewedCases.length > 0) {
          const latestDocId = reviewedCases[0].finalReport._id;
          const lastSeen = localStorage.getItem("lastSeenReviewDoc");
          
          if (lastSeen !== latestDocId) {
            const docName = reviewedCases[0].finalReport?.doctor?.name || "your specialist";
            showCustomToast(
              "Diagnosis Ready!",
              `Dr. ${docName} has reviewed your case and attached the final medical report. Go to your dashboard to review it.`,
              true,
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-sm"><Bell size={20} className="animate-bounce" /></div>
            );
            localStorage.setItem("lastSeenReviewDoc", latestDocId);
          }
        }
      }
      sessionStorage.setItem("hasSeenHomeNotifications", "true");
    } catch (err) {
      console.error("Failed to fetch notification data: ", err);
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/users/logout");
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      signout();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-6">
      <Toaster position="top-right" reverseOrder={true} />
      
      {/* Top Navigation / Welcome Bar */}
      {user && (
        <div className="w-full max-w-5xl mx-auto flex justify-end items-center mb-8 gap-3">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white px-6 py-3 rounded-full shadow-sm border border-slate-200 flex items-center gap-3">
            <span className="font-bold text-slate-700">
              Welcome, {user.role === "admin" || user.role === "doctor" ? "Dr. " : "Mr./Ms. "}{user.name || "User"}!
            </span>
          </motion.div>
          
          {/* Logout Radix Alert Dialog */}
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <motion.button 
                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                className="bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 px-5 py-3 rounded-full shadow-sm border border-slate-200 flex items-center gap-2 transition-colors font-bold group"
              >
                <LogOut size={18} className="group-hover:scale-110 transition-transform" /> Logout
              </motion.button>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px" className="rounded-3xl p-8 shadow-2xl">
              <AlertDialog.Title className="text-2xl font-extrabold text-slate-800">Secure Logout</AlertDialog.Title>
              <AlertDialog.Description size="2" className="text-slate-500 mb-8 mt-3 font-medium leading-relaxed">
                Are you sure you want to securely log out of the medical portal? You will need to sign in again to access any data.
              </AlertDialog.Description>
              <Flex gap="4" justify="end">
                <AlertDialog.Cancel>
                  <button className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <button onClick={handleLogout} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95">
                    Yes, Logout
                  </button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, type: "spring" }} className="text-center max-w-2xl">
          <div className="bg-blue-600 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12 shadow-2xl shadow-blue-200">
            <Brain className="text-white -rotate-12" size={48} />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Brain Tumor <span className="text-blue-600">Detection</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 leading-relaxed font-medium">
            Advanced AI-powered medical imaging analysis to assist healthcare professionals 
            and patients in early detection and meticulous diagnosis.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!user ? (
              <>
                <Link
                  to="/signin"
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Sign In
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 rounded-2xl font-bold text-lg shadow-sm transition-all active:scale-95"
                >
                  Create Account
                </Link>
              </>
            ) : (
              <>
                {(user.role === "admin" || user.role === "doctor") ? (
                  <Link
                    to="/doctor-dashboard"
                    className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                  >
                    <ShieldCheck size={24} className="group-hover:scale-110 transition-transform" />
                    Enter Doctor Dashboard
                    <ArrowRight size={20} />
                  </Link>
                ) : (
                  <Link
                    to="/patient-dashboard"
                    className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-teal-200 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                  >
                    <User size={24} className="group-hover:scale-110 transition-transform" />
                    Enter Patient Dashboard
                    <ArrowRight size={20} />
                  </Link>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
