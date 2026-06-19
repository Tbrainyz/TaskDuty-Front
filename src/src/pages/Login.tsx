import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.svg";
import broIllustration from "../assets/bro.svg";

const F = "'Signika Negative', sans-serif";
type FormErrors = { identifier?: string; password?: string; api?: string };

const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosed = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const Login = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password,   setPassword]   = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [errors,     setErrors]     = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!identifier.trim()) e.identifier = "Username or email is required";
    if (!password)          e.password   = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrors({});
    try {
      await login(identifier, password);
      toast.success("Welcome back!");
      navigate("/alltasks");
    } catch (err: unknown) {
      const axiosMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      const msg = axiosMsg || "Login failed. Please check your credentials.";
      setErrors({ api: msg });
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: "#f0f0f5" }}>

      {/* ── Left — illustration ── */}
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
          <img src={broIllustration} alt="TaskDuty illustration" style={{ width: "100%", height: "auto", display: "block" }} />
        </div>
        <p style={{ fontFamily: F, fontSize: 14, color: "#7c3aed", marginTop: 24, fontWeight: 600, textAlign: "center" }}>
          Manage all your tasks in one place
        </p>
      </div>

      {/* ── Right — form ── */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center",
        justifyContent: "center", padding: "40px 32px",
      }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <h2 style={{ fontFamily: F, fontWeight: 700, fontSize: 28, color: "#0f0f0f", marginBottom: 6 }}>
            Welcome back
          </h2>
          <p style={{ fontFamily: F, fontSize: 14, color: "#6b7280", marginBottom: 32 }}>
            Log in to continue to TaskDuty
          </p>

          {/* API error banner */}
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

            {/* Identifier */}
            <div className="fl-wrap">
              <label>Username or Email</label>
              <input type="text" placeholder="Enter username or email" autoComplete="username"
                value={identifier}
                onChange={e => { setIdentifier(e.target.value); setErrors(p => ({ ...p, identifier: undefined })); }}
                className={errors.identifier ? "error" : ""} />
              {errors.identifier && <p style={errStyle}>{errors.identifier}</p>}
            </div>

            {/* Password */}
            <div className="fl-wrap">
              <label>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Your password"
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

            {/* Forgot password */}
            <div style={{ textAlign: "right", marginTop: -12 }}>
              <Link to="/forgot-password" style={{ fontFamily: F, fontSize: 13, color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={submitting} style={btnStyle(submitting)}>
              {submitting ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p style={{ fontFamily: F, fontSize: 14, color: "#6b7280", textAlign: "center", marginTop: 24 }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#7c3aed", fontWeight: 700, textDecoration: "none" }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const errStyle: React.CSSProperties = { color: "#ef4444", fontSize: 12, marginTop: 4, fontFamily: "'Signika Negative', sans-serif" };
const btnStyle = (disabled: boolean): React.CSSProperties => ({
  width: "100%", backgroundColor: disabled ? "#a78bfa" : "#7c3aed",
  color: "white", fontFamily: "'Signika Negative', sans-serif",
  fontWeight: 700, fontSize: 16, padding: "14px",
  borderRadius: 10, border: "none",
  cursor: disabled ? "not-allowed" : "pointer",
  boxShadow: "0 4px 16px rgba(124,58,237,0.25)",
});

export default Login;
