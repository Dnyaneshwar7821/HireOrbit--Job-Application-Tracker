import { useState, useMemo } from "react";
import { AuthContext } from "./authContextValue";

const parseJwt = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const userRole = useMemo(() => {
    const claims = parseJwt(token);
    return claims?.role || "USER";
  }, [token]);

  const isAdmin = useMemo(() => {
    return String(userRole).toUpperCase() === "ADMIN";
  }, [userRole]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, userRole, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
