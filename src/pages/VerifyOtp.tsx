import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.svg";
import broIllustration from "../assets/bro.svg";

const F = "'Signika Negative', sans-serif";

const VerifyOtp = () => {
  const { forgotPassword, verifyOtp } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const email     = (location.state as { email?: string })?.email || "";

  // 6 individual digit inputs
  const [digits,     setDigits]     = useState<string[]>(["", "", "", "", "", ""]);
  const [error,      setError]      = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending,  setResending]  = useState(false);
  const [countdown,  setCountdown]  = useState(60); // resend cooldown

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Redirect if no email passed
  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, [email, navigate]);

  const handleDigitChange = (index: number, value: string) => {
    // Only allow single digit
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setError("");

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // On backspace with empty field, focus previous
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newDigits = [...digits];
    pasted.split("").forEach((char, i) => { newDigits[i] = char; });
    setDigits(newDigits);
    // Focus last filled input
    const lastIndex = Math.min(pasted.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < 6) { setError("Please enter all 6 digits"); return; }
    setSubmitting(true);
    setError("");
    try {
      const resetToken = await verifyOtp(email, otp);
      toast.success("OTP verified!");
      navigate("/reset-password", { state: { resetToken } });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Invalid or expired OTP";
      setError(msg);
      toast.error(msg);
      // Clear digits on error
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await forgotPassword(email);
      toast.success("New OTP sent!");
      setDigits(["", "", "", "", "", ""]);
      setCountdown(60);
      inputRefs.current[0]?.focus();
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setResending(false);
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

      {/* Right — OTP form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>

          <div style={{ fontSize: 48, marginBottom: 16 }}>📩</div>

          <h2 style={{ fontFamily: F, fontWeight: 700, fontSize: 28, color: "#0f0f0f", marginBottom: 6 }}>
            Enter OTP
          </h2>
          <p style={{ fontFamily: F, fontSize: 14, color: "#6b7280", marginBottom: 8, lineHeight: 1.7 }}>
            We sent a 6-digit code to
          </p>
          <p style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: "#7c3aed", marginBottom: 32 }}>
            {email}
          </p>

          <form onSubmit={handleSubmit} noValidate>

            {/* 6 digit boxes */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24 }} onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleDigitChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  style={{
                    width: 52, height: 60,
                    textAlign: "center",
                    fontSize: 24, fontWeight: 700,
                    fontFamily: F, color: "#2D0050",
                    border: `2px solid ${digit ? "#7c3aed" : error ? "#ef4444" : "#d1d5db"}`,
                    borderRadius: 10,
                    backgroundColor: digit ? "#f5f3ff" : "white",
                    outline: "none",
                    transition: "all 0.15s",
                    caretColor: "#7c3aed",
                  }}
                />
              ))}
            </div>

            {/* Error */}
            {error && (
              <p style={{ color: "#ef4444", fontSize: 13, textAlign: "center", marginBottom: 16, fontFamily: F }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button type="submit" disabled={submitting} style={{
              width: "100%", backgroundColor: submitting ? "#a78bfa" : "#7c3aed",
              color: "white", fontFamily: F, fontWeight: 700, fontSize: 16,
              padding: "14px", borderRadius: 10, border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
              boxShadow: "0 4px 16px rgba(124,58,237,0.25)",
              marginBottom: 20,
            }}>
              {submitting ? "Verifying..." : "Verify OTP"}
            </button>

            {/* Resend */}
            <div style={{ textAlign: "center" }}>
              {countdown > 0 ? (
                <p style={{ fontFamily: F, fontSize: 13, color: "#9ca3af" }}>
                  Resend OTP in <strong style={{ color: "#7c3aed" }}>{countdown}s</strong>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  style={{
                    background: "none", border: "none",
                    fontFamily: F, fontWeight: 700, fontSize: 14,
                    color: "#7c3aed", cursor: "pointer",
                  }}
                >
                  {resending ? "Sending..." : "Resend OTP"}
                </button>
              )}
            </div>

            <p style={{ fontFamily: F, fontSize: 14, color: "#6b7280", textAlign: "center", marginTop: 20 }}>
              <Link to="/forgot-password" style={{ color: "#7c3aed", fontWeight: 700, textDecoration: "none" }}>
                ← Change email
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
