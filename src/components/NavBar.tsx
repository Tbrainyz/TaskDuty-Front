import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import logo from "../assets/logo.svg";

type NavVariant = "cover" | "tasks" | "form";
interface NavBarProps { variant?: NavVariant; }

const F = "'Signika Negative', sans-serif";

const NavBar = ({ variant = "cover" }: NavBarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 80px",
      backgroundColor: "white",
      borderBottom: "1px solid rgba(124,58,237,0.12)",
      boxShadow: "0 2px 12px rgba(124,58,237,0.07)",
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
        <img src={logo} alt="TaskDuty" style={{ width: 28, height: 28 }} />
        <span style={{ fontFamily: F, fontWeight: 700, fontSize: 24, color: "#2D0050" }}>
          TaskDuty
        </span>
      </Link>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {variant === "cover" && (
          <>
            <Link to="/newtask"  style={linkStyle}>New Task</Link>
            <Link to="/alltasks" style={linkStyle}>All Tasks</Link>
          </>
        )}
        {variant === "tasks" && <Link to="/newtask"  style={linkStyle}>New Task</Link>}
        {variant === "form"  && <Link to="/alltasks" style={linkStyle}>All Tasks</Link>}

        {/* Logged-in user display */}
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{
              fontFamily: F, fontWeight: 600, fontSize: 15, color: "#7c3aed",
              backgroundColor: "#f5f3ff", padding: "5px 14px", borderRadius: 20,
            }}>
              👋 {user.username}
            </span>
            <button
              onClick={handleLogout}
              style={{
                fontFamily: F, fontWeight: 600, fontSize: 14,
                color: "#ef4444", backgroundColor: "#fff5f5",
                border: "1.5px solid #fca5a5", borderRadius: 8,
                padding: "6px 16px", cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const linkStyle: React.CSSProperties = {
  textDecoration: "none",
  fontFamily: F,
  fontWeight: 600,
  fontSize: 17,
  color: "#1f2937",
};

export default NavBar;
