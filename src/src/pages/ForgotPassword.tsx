import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.svg";
import broIllustration from "../assets/bro.svg";

const F = "'Signika Negative', sans-serif";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const navigate            = useNavigate();
  const [email,      setEmail]      = useState("");
  const [error,      setError]      = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Email is required"); return; }
    setError("");
    setSubmitting(true);
    try {
      await forgotPassword(email);
      toast.success("OTP sent! Check your email.");
      // Pass email to verify-otp page via state
      navigate("/verify-otp", { state: { email } });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Something went wrong";
      setError(msg);
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

          {/* Icon */}
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>

          <h2 style={{ fontFamily: F, fontWeight: 700, fontSize: 28, color: "#0f0f0f", marginBottom: 6 }}>
            Forgot password?
          </h2>
          <p style={{ fontFamily: F, fontSize: 14, color: "#6b7280", marginBottom: 32, lineHeight: 1.7 }}>
            Enter your email and we'll send a <strong>6-digit OTP</strong> to verify it's you.
          </p>

          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="fl-wrap">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                className={error ? "error" : ""}
              />
              {error && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4, fontFamily: F }}>{error}</p>}
            </div>

            <button type="submit" disabled={submitting} style={{
              width: "100%", backgroundColor: submitting ? "#a78bfa" : "#7c3aed",
              color: "white", fontFamily: F, fontWeight: 700, fontSize: 16,
              padding: "14px", borderRadius: 10, border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
              boxShadow: "0 4px 16px rgba(124,58,237,0.25)",
            }}>
              {submitting ? "Sending OTP..." : "Send OTP"}
            </button>

            <p style={{ fontFamily: F, fontSize: 14, color: "#6b7280", textAlign: "center" }}>
              <Link to="/login" style={{ color: "#7c3aed", fontWeight: 700, textDecoration: "none" }}>
                ← Back to login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
