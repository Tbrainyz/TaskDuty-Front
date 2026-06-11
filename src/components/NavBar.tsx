import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import avatar from "../assets/avatar.svg";

type NavVariant = "cover" | "tasks" | "form";

interface NavBarProps {
  variant?: NavVariant;
}

const navLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 600,
  fontSize: 18,
  color: "#000",
};

const NavBar = ({ variant = "cover" }: NavBarProps) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 80px",
        backgroundColor: "white",
        borderBottom: "1px solid rgba(0,0,0,0.12)",
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
        <img src={logo} alt="TaskDuty logo" style={{ width: 28, height: 28 }} />
        <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 24, color: "#2D0050" }}>
          TaskDuty
        </span>
      </Link>

      {/* Right nav */}
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {variant === "cover" && (
          <>
            <Link to="/newtask" style={navLinkStyle}>New Task</Link>
            <Link to="/alltasks" style={navLinkStyle}>All Tasks</Link>
          </>
        )}
        {variant === "tasks" && (
          <Link to="/newtask" style={navLinkStyle}>New Task</Link>
        )}
        {variant === "form" && (
          <Link to="/alltasks" style={navLinkStyle}>All Task</Link>
        )}
        <img src={avatar} alt="Profile" style={{ width: 42, height: 42, borderRadius: "50%", cursor: "pointer" }} />
      </div>
    </div>
  );
};

export default NavBar;
