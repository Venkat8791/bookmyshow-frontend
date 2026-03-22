"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// helper to safely read from localStorage
const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("user");
  return saved ? JSON.parse(saved) : null;
};

const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // initialize directly — no useEffect needed
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [token, setToken] = useState<string | null>(getStoredToken);

  const login = (userData: User, jwtToken: string) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
