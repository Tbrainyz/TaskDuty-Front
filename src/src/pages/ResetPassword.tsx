import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.svg";
import broIllustration from "../assets/bro.svg";

const F = "'Signika Negative', sans-serif";
type FormErrors = { password?: string; confirmPassword?: string; api?: string };

const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeClosed = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const ResetPassword = () => {
  const { resetPassword }  = useAuth();
  const navigate           = useNavigate();
  const location           = useLocation();
  const resetToken         = (location.state as { resetToken?: string })?.resetToken || "";

  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass,        setShowPass]        = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [errors,          setErrors]          = useState<FormErrors>({});
  const [submitting,      setSubmitting]      = useState(false);

  // Redirect if no reset token
  if (!resetToken) {
    navigate("/forgot-password");
    return null;
  }

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!password)                e.password        = "Password is required";
    else if (password.length < 6) e.password        = "Must be at least 6 characters";
    if (!confirmPassword)         e.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrors({});
    try {
      const msg = await resetPassword(resetToken, password, confirmPassword);
      toast.success(msg);
      navigate("/login");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Reset failed. Please try again.";
      setErrors({ api: msg });
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: "#f0f0f5" }}>

      {/* Left — illustration */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        backgroundColor: "#f5f3ff", padding: "40px",
        borderRight: "1px solid #ede9fe",
      }} className="auth-left">
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 32 }}>
          <img src={logo} alt="TaskDuty" style={{ width: 32, height: 32 }} />
          <span style={{ fontFamily: F, fontWeight: 700, fontSize: 26, color: "#2D0050" }}>TaskDuty</span>
        </Link>
        <div style={{ border: "2px solid #7c3aed", borderRadius: 14, overflow: "hidden", backgroundColor: "white", width: "100%", maxWidth: 420 }}>
          <img src={broIllustration} alt="illustration" style={{ width: "100%", height: "auto", display: "block" }} />
        </div>
        <p style={{ fontFamily: F, fontSize: 14, color: "#7c3aed", marginTop: 24, fontWeight: 600, textAlign: "center" }}>
          Manage all your tasks in one place
        </p>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>

          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>

          <h2 style={{ fontFamily: F, fontWeight: 700, fontSize: 28, color: "#0f0f0f", marginBottom: 6 }}>
            Set new password
          </h2>
          <p style={{ fontFamily: F, fontSize: 14, color: "#6b7280", marginBottom: 32 }}>
            OTP verified ✓ — Choose a strong new password.
          </p>

          {errors.api && (
            <div style={{
              backgroundColor: "#fff5f5", border: "1.5px solid #fca5a5",
              borderRadius: 8, padding: "12px 16px", marginBottom: 20,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <p style={{ fontFamily: F, fontSize: 13, color: "#ef4444", margin: 0 }}>{errors.api}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div className="fl-wrap">
              <label>New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                  className={errors.password ? "error" : ""}
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPass(o => !o)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  {showPass ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>
              {errors.password && <p style={errStyle}>{errors.password}</p>}
            </div>

            <div className="fl-wrap">
              <label>Confirm New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: undefined })); }}
                  className={errors.confirmPassword ? "error" : ""}
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowConfirm(o => !o)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  {showConfirm ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>
              {errors.confirmPassword && <p style={errStyle}>{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={submitting} style={{
              width: "100%", backgroundColor: submitting ? "#a78bfa" : "#7c3aed",
              color: "white", fontFamily: F, fontWeight: 700, fontSize: 16,
              padding: "14px", borderRadius: 10, border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
              boxShadow: "0 4px 16px rgba(124,58,237,0.25)",
            }}>
              {submitting ? "Resetting..." : "Reset Password"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

const errStyle: React.CSSProperties = {
  color: "#ef4444", fontSize: 12, marginTop: 4,
  fontFamily: "'Signika Negative', sans-serif",
};

export default ResetPassword;
