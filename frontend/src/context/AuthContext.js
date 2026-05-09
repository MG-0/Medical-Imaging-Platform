import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const name = Cookies.get("name");
    if (token && role) {
      setUser({ role, name });
    }
    setLoading(false);
  }, []);

  const signin = (token, role, name) => {
    Cookies.set("token", token, { expires: 7 }); 
    Cookies.set("role", role, { expires: 7 });
    if (name) Cookies.set("name", name, { expires: 7 });
    setUser({ role, name });
  };

  const signout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("name");
    sessionStorage.clear(); // Ensure notifications and session tracking reset for next login
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
