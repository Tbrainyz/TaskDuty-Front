import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import avatar from "../assets/avatar.svg";

type NavVariant = "cover" | "tasks" | "form";
interface NavBarProps { variant?: NavVariant; }

const NavBar = ({ variant = "cover" }: NavBarProps) => (
  <div
    className="nav-inner"
    style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 80px",
      backgroundColor: "white",
      borderBottom: "1px solid rgba(124,58,237,0.12)",
      boxShadow: "0 2px 12px rgba(124,58,237,0.07)",
    }}
  >
    <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
      <img src={logo} alt="TaskDuty" style={{ width: 28, height: 28 }} />
      <span style={{ fontFamily: "'Signika Negative', sans-serif", fontWeight: 700, fontSize: 24, color: "#2D0050" }}>
        TaskDuty
      </span>
    </Link>

    <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 32 }}>
      {variant === "cover" && (
        <>
          <Link to="/newtask" style={linkStyle}>New Task</Link>
          <Link to="/alltasks" style={linkStyle}>All Tasks</Link>
        </>
      )}
      {variant === "tasks" && <Link to="/newtask" style={linkStyle}>New Task</Link>}
      {variant === "form"  && <Link to="/alltasks" style={linkStyle}>All Tasks</Link>}
      <img src={avatar} alt="Profile" style={{ width: 42, height: 42, borderRadius: "50%", cursor: "pointer" }} />
    </div>
  </div>
);

const linkStyle: React.CSSProperties = {
  textDecoration: "none",
  fontFamily: "'Signika Negative', sans-serif",
  fontWeight: 600,
  fontSize: 17,
  color: "#1f2937",
};

export default NavBar;
