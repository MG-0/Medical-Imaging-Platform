import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { Home, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertDialog, Flex } from "@radix-ui/themes";

const DashboardHeader = ({ title, subtitle, icon: Icon, iconColorClass = "text-blue-600", iconBgClass = "bg-blue-100" }) => {
  const { signout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/users/logout");
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      signout();
      navigate("/");
    }
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, type: "spring" }}>
        <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
          <div className={`${iconBgClass} p-3 rounded-2xl`}>
             <Icon className={iconColorClass} size={28} />
          </div>
          {title}
        </h1>
        <p className="text-slate-500 mt-2 ml-14 font-medium">{subtitle}</p>
      </motion.div>
      
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, type: "spring" }} className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
        <button
          onClick={() => navigate("/")}
          className="w-full sm:w-auto bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 px-5 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm font-bold"
        >
          <Home size={18} /> Home
        </button>

        <AlertDialog.Root>
          <AlertDialog.Trigger>
            <button className="w-full sm:w-auto bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 px-5 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md font-bold">
              <LogOut size={18} /> Logout
            </button>
          </AlertDialog.Trigger>
          <AlertDialog.Content maxWidth="450px" className="rounded-3xl p-8 shadow-2xl">
            <AlertDialog.Title className="text-2xl font-extrabold text-slate-800">Secure Logout</AlertDialog.Title>
            <AlertDialog.Description size="2" className="text-slate-500 mb-8 mt-3 font-medium leading-relaxed">
              Are you sure you want to securely log out of your medical portal? You will need your credentials to access your portal again.
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
      </motion.div>
    </header>
  );
};

export default DashboardHeader;
