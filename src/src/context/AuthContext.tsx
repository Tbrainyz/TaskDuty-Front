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
  verifyOtp: (email: string, otp: string) => Promise<string>;
  resetPassword: (resetToken: string, password: string, confirmPassword: string) => Promise<string>;
  updatePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("taskduty_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (identifier: string, password: string) => {
    const { data } = await api.post<AuthUser>("/auth/login", { identifier, password });
    setUser(data);
    localStorage.setItem("taskduty_user", JSON.stringify(data));
  };

  const register = async (username: string, email: string, password: string, confirmPassword: string) => {
    const { data } = await api.post<AuthUser>("/auth/register", { username, email, password, confirmPassword });
    setUser(data);
    localStorage.setItem("taskduty_user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("taskduty_user");
  };

  const forgotPassword = async (email: string): Promise<string> => {
    const { data } = await api.post<{ message: string }>("/auth/forgot-password", { email });
    return data.message;
  };

  const verifyOtp = async (email: string, otp: string): Promise<string> => {
    const { data } = await api.post<{ message: string; resetToken: string }>("/auth/verify-otp", { email, otp });
    return data.resetToken;
  };

  const resetPassword = async (resetToken: string, password: string, confirmPassword: string): Promise<string> => {
    const { data } = await api.post<{ message: string }>("/auth/reset-password", { resetToken, password, confirmPassword });
    return data.message;
  };

  const updatePassword = async (currentPassword: string, newPassword: string, confirmPassword: string): Promise<string> => {
    const { data } = await api.put<{ message: string }>("/auth/update-password", { currentPassword, newPassword, confirmPassword });
    return data.message;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, forgotPassword, verifyOtp, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
