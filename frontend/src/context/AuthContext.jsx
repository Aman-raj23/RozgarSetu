import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from sessionStorage on mount (fresh start on new tab/window)
  useEffect(() => {
    const savedToken = sessionStorage.getItem("rozgarsetu_token");
    const savedUser = sessionStorage.getItem("rozgarsetu_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    const res = await API.post("/auth/register", userData);
    const { token: newToken, user: newUser } = res.data;
    setToken(newToken);
    setUser(newUser);
    sessionStorage.setItem("rozgarsetu_token", newToken);
    sessionStorage.setItem("rozgarsetu_user", JSON.stringify(newUser));
    return newUser;
  };

  const login = async (credentials) => {
    const res = await API.post("/auth/login", credentials);
    const { token: newToken, user: newUser } = res.data;
    setToken(newToken);
    setUser(newUser);
    sessionStorage.setItem("rozgarsetu_token", newToken);
    sessionStorage.setItem("rozgarsetu_user", JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem("rozgarsetu_token");
    sessionStorage.removeItem("rozgarsetu_user");
  };

  const updateLocation = (lat, lng) => {
    if (user) {
      const updatedUser = { ...user, location: { lat, lng } };
      setUser(updatedUser);
      sessionStorage.setItem("rozgarsetu_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, register, login, logout, updateLocation }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
