import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.svg";

const F = "'Signika Negative', sans-serif";
type FormErrors = { identifier?: string; password?: string };

const Login = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password,   setPassword]   = useState("");
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
    try {
      await login(identifier, password);
      toast.success("Welcome back!");
      navigate("/alltasks");
    } catch (err: unknown) {
      const axiosMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(axiosMsg || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f0f5", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <img src={logo} alt="TaskDuty" style={{ width: 32, height: 32 }} />
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 26, color: "#2D0050" }}>TaskDuty</span>
          </Link>
          <p style={{ fontFamily: F, fontSize: 15, color: "#6b7280", marginTop: 8 }}>
            Log in to your account
          </p>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: "white", borderRadius: 16, padding: "36px 32px", boxShadow: "0 4px 24px rgba(124,58,237,0.10)", border: "1px solid #ede9fe" }}>
          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Identifier */}
            <div className="fl-wrap">
              <label>Username or Email</label>
              <input type="text" placeholder="Enter username or email"
                value={identifier} onChange={e => setIdentifier(e.target.value)}
                className={errors.identifier ? "error" : ""} />
              {errors.identifier && <p style={errStyle}>{errors.identifier}</p>}
            </div>

            {/* Password */}
            <div className="fl-wrap">
              <label>Password</label>
              <input type="password" placeholder="Your password"
                value={password} onChange={e => setPassword(e.target.value)}
                className={errors.password ? "error" : ""} />
              {errors.password && <p style={errStyle}>{errors.password}</p>}
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: "right", marginTop: -12 }}>
              <Link to="/forgot-password" style={{ fontFamily: F, fontSize: 13, color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button type="submit" disabled={submitting} style={btnStyle(submitting)}>
              {submitting ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p style={{ fontFamily: F, fontSize: 14, color: "#6b7280", textAlign: "center", marginTop: 20 }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#7c3aed", fontWeight: 700, textDecoration: "none" }}>
              Sign up
            </Link>
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
