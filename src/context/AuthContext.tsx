import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import api from "../api/axios";
import type { AuthUser } from "../types/task";

interface AuthContextValue {
  user: AuthUser | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Load user from localStorage on app start
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("taskduty_user");
    return stored ? JSON.parse(stored) : null;
  });

  // ── LOGIN ──────────────────────────────────────────────────
  const login = async (identifier: string, password: string) => {
    const { data } = await api.post<AuthUser>("/auth/login", { identifier, password });
    setUser(data);
    localStorage.setItem("taskduty_user", JSON.stringify(data));
  };

  // ── REGISTER ───────────────────────────────────────────────
  const register = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    const { data } = await api.post<AuthUser>("/auth/register", {
      username, email, password, confirmPassword,
    });
    setUser(data);
    localStorage.setItem("taskduty_user", JSON.stringify(data));
  };

  // ── LOGOUT ─────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    localStorage.removeItem("taskduty_user");
  };

  // ── FORGOT PASSWORD ────────────────────────────────────────
  const forgotPassword = async (email: string): Promise<string> => {
    const { data } = await api.post<{ message: string }>("/auth/forgot-password", { email });
    return data.message;
  };

  // ── RESET PASSWORD ─────────────────────────────────────────
  const resetPassword = async (
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<string> => {
    const { data } = await api.put<{ message: string }>(`/auth/reset-password/${token}`, {
      password, confirmPassword,
    });
    return data.message;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
