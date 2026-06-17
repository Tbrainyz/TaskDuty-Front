import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.svg";

const F = "'Signika Negative', sans-serif";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email,      setEmail]      = useState("");
  const [error,      setError]      = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent,       setSent]       = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Email is required"); return; }
    setError("");
    setSubmitting(true);
    try {
      const msg = await forgotPassword(email);
      setSent(true);
      toast.success(msg);
    } catch (err: unknown) {
      const axiosMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(axiosMsg || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f0f5", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <img src={logo} alt="TaskDuty" style={{ width: 32, height: 32 }} />
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 26, color: "#2D0050" }}>TaskDuty</span>
          </Link>
          <p style={{ fontFamily: F, fontSize: 15, color: "#6b7280", marginTop: 8 }}>
            Reset your password
          </p>
        </div>

        <div style={{ backgroundColor: "white", borderRadius: 16, padding: "36px 32px", boxShadow: "0 4px 24px rgba(124,58,237,0.10)", border: "1px solid #ede9fe" }}>

          {sent ? (
            /* Success state */
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
              <h3 style={{ fontFamily: F, fontWeight: 700, fontSize: 20, color: "#0f0f0f", marginBottom: 8 }}>
                Check your email
              </h3>
              <p style={{ fontFamily: F, fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>
                If an account exists for <strong>{email}</strong>, a password reset link has been sent. Check your inbox and spam folder.
              </p>
              <Link to="/login" style={{ display: "inline-block", marginTop: 24, fontFamily: F, fontWeight: 700, fontSize: 14, color: "#7c3aed", textDecoration: "none" }}>
                ← Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <p style={{ fontFamily: F, fontSize: 14, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
                Enter the email address for your account and we'll send you a reset link.
              </p>

              <div className="fl-wrap">
                <label>Email Address</label>
                <input type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className={error ? "error" : ""} />
                {error && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4, fontFamily: F }}>{error}</p>}
              </div>

              <button type="submit" disabled={submitting} style={{
                width: "100%", backgroundColor: submitting ? "#a78bfa" : "#7c3aed",
                color: "white", fontFamily: F, fontWeight: 700, fontSize: 16,
                padding: "14px", borderRadius: 10, border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
                boxShadow: "0 4px 16px rgba(124,58,237,0.25)",
              }}>
                {submitting ? "Sending..." : "Send Reset Link"}
              </button>

              <p style={{ fontFamily: F, fontSize: 14, color: "#6b7280", textAlign: "center" }}>
                <Link to="/login" style={{ color: "#7c3aed", fontWeight: 700, textDecoration: "none" }}>
                  ← Back to login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
