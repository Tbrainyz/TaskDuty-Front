import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.svg";

const F = "'Signika Negative', sans-serif";
type FormErrors = { password?: string; confirmPassword?: string };

const ResetPassword = () => {
  const { token }          = useParams<{ token: string }>();
  const { resetPassword }  = useAuth();
  const navigate           = useNavigate();

  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors,          setErrors]          = useState<FormErrors>({});
  const [submitting,      setSubmitting]      = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!password)               e.password        = "Password is required";
    else if (password.length < 6) e.password       = "Password must be at least 6 characters";
    if (!confirmPassword)        e.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !token) return;
    setSubmitting(true);
    try {
      const msg = await resetPassword(token, password, confirmPassword);
      toast.success(msg);
      navigate("/login");
    } catch (err: unknown) {
      const axiosMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(axiosMsg || "Reset failed. Link may have expired.");
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
            Set a new password
          </p>
        </div>

        <div style={{ backgroundColor: "white", borderRadius: 16, padding: "36px 32px", boxShadow: "0 4px 24px rgba(124,58,237,0.10)", border: "1px solid #ede9fe" }}>
          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div className="fl-wrap">
              <label>New Password</label>
              <input type="password" placeholder="Min. 6 characters"
                value={password} onChange={e => setPassword(e.target.value)}
                className={errors.password ? "error" : ""} />
              {errors.password && <p style={errStyle}>{errors.password}</p>}
            </div>

            <div className="fl-wrap">
              <label>Confirm New Password</label>
              <input type="password" placeholder="Repeat new password"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? "error" : ""} />
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
