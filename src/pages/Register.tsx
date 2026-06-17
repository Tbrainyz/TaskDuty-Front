import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.svg";

const F = "'Signika Negative', sans-serif";

type FormErrors = {
  username?: string; email?: string;
  password?: string; confirmPassword?: string;
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username,        setUsername]        = useState("");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors,          setErrors]          = useState<FormErrors>({});
  const [submitting,      setSubmitting]      = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!username.trim())        e.username        = "Username is required";
    if (!email.trim())           e.email           = "Email is required";
    if (!password)               e.password        = "Password is required";
    else if (password.length < 6) e.password       = "Password must be at least 6 characters";
    if (!confirmPassword)        e.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register(username, email, password, confirmPassword);
      toast.success("Account created! Welcome to TaskDuty");
      navigate("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      // axios wraps the error — get backend message
      const axiosMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(axiosMsg || msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f0f5", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: 460 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <img src={logo} alt="TaskDuty" style={{ width: 32, height: 32 }} />
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 26, color: "#2D0050" }}>TaskDuty</span>
          </Link>
          <p style={{ fontFamily: F, fontSize: 15, color: "#6b7280", marginTop: 8 }}>
            Create your account
          </p>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: "white", borderRadius: 16, padding: "36px 32px", boxShadow: "0 4px 24px rgba(124,58,237,0.10)", border: "1px solid #ede9fe" }}>
          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Username */}
            <div className="fl-wrap">
              <label>Username</label>
              <input type="text" placeholder="e.g. johndoe"
                value={username} onChange={e => setUsername(e.target.value)}
                className={errors.username ? "error" : ""} />
              {errors.username && <p style={errStyle}>{errors.username}</p>}
            </div>

            {/* Email */}
            <div className="fl-wrap">
              <label>Email</label>
              <input type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                className={errors.email ? "error" : ""} />
              {errors.email && <p style={errStyle}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="fl-wrap">
              <label>Password</label>
              <input type="password" placeholder="Min. 6 characters"
                value={password} onChange={e => setPassword(e.target.value)}
                className={errors.password ? "error" : ""} />
              {errors.password && <p style={errStyle}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="fl-wrap">
              <label>Confirm Password</label>
              <input type="password" placeholder="Repeat your password"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? "error" : ""} />
              {errors.confirmPassword && <p style={errStyle}>{errors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            <button type="submit" disabled={submitting} style={btnStyle(submitting)}>
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Login link */}
          <p style={{ fontFamily: F, fontSize: 14, color: "#6b7280", textAlign: "center", marginTop: 20 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#7c3aed", fontWeight: 700, textDecoration: "none" }}>
              Log in
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
  marginTop: 4,
});

export default Register;
