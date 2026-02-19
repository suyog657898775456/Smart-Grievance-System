import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // LOGIN
  const login = async (username, password) => {
    try {
      const res = await API.post("auth/login/", {
        username,
        password,
      });

      // Save tokens
      localStorage.setItem("access", res.data.access_token);
      localStorage.setItem("refresh", res.data.refresh_token);

      // Save user
      setUser(res.data.user);

      // Redirect based on role
      if (res.data.user.role === "CITIZEN") {
        navigate("/user-dashboard");
      } else if (res.data.user.role === "OFFICER") {
        navigate("/municipal-dashboard");
      } else if (res.data.user.role === "ADMIN") {
        navigate("/admin");
      }
    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data);
      throw err;
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  // AUTO LOGIN AFTER REFRESH
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      setUser({ loggedIn: true });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
