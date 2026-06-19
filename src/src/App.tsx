import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./layout/ProtectedRoute";

import CoverPage      from "./pages/CoverPage";
import AllTasks       from "./pages/AllTasks";
import NewTask        from "./pages/NewTask";
import EditPage       from "./pages/EditPage";
import Login          from "./pages/Login";
import Register       from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp      from "./pages/VerifyOtp";
import ResetPassword  from "./pages/ResetPassword";
import Profile        from "./pages/Profile";
import ErrorPage      from "./pages/Error";

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/alltasks" replace /> : <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar closeOnClick pauseOnHover theme="light" />
      <Routes>
        {/* Public */}
        <Route path="/" element={<CoverPage />} />

        {/* Guest only */}
        <Route path="/login"            element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register"         element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/forgot-password"  element={<ForgotPassword />} />
        <Route path="/verify-otp"       element={<VerifyOtp />} />
        <Route path="/reset-password"   element={<ResetPassword />} />

        {/* Protected */}
        <Route path="/alltasks" element={<ProtectedRoute><AllTasks /></ProtectedRoute>} />
        <Route path="/newtask"  element={<ProtectedRoute><NewTask /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><EditPage /></ProtectedRoute>} />
        <Route path="/profile"  element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
