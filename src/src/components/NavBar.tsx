import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.svg";

type NavVariant = "cover" | "tasks" | "form" | "guest";
interface NavBarProps { variant?: NavVariant; }

const F = "'Signika Negative', sans-serif";

const NavBar = ({ variant = "cover" }: NavBarProps) => {
  const { user, logout }        = useAuth();
  const navigate                 = useNavigate();
  const [dropOpen, setDropOpen]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropRef                  = useRef<HTMLDivElement>(null);
  const mobileRef                = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Close mobile menu on route change / resize back to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    setDropOpen(false);
    setMobileOpen(false);
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const initials = user?.username?.slice(0, 2).toUpperCase() || "?";

  // ── Reusable nav links based on variant ───────────────────
  const renderLinks = (onClick?: () => void) => (
    <>
      {variant === "cover" && (
        <>
          <Link to="/newtask" style={linkStyle} onClick={onClick}>New Task</Link>
          <Link to="/alltasks" style={linkStyle} onClick={onClick}>All Tasks</Link>
        </>
      )}
      {variant === "tasks" && <Link to="/newtask" style={linkStyle} onClick={onClick}>New Task</Link>}
      {variant === "form"  && <Link to="/alltasks" style={linkStyle} onClick={onClick}>All Tasks</Link>}
      {variant === "guest" && (
        <>
          <Link to="/login" style={linkStyle} onClick={onClick}>Sign In</Link>
          <Link
            to="/register"
            onClick={onClick}
            style={{
              textDecoration: "none", fontFamily: F, fontWeight: 700,
              fontSize: 15, color: "white", backgroundColor: "#7c3aed",
              padding: "8px 22px", borderRadius: 8,
              boxShadow: "0 2px 8px rgba(124,58,237,0.25)",
              display: "inline-block",
            }}
          >
            Sign Up
          </Link>
        </>
      )}
    </>
  );

  return (
    <div className="navbar-root" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 80px",
      backgroundColor: "white",
      borderBottom: "1px solid rgba(124,58,237,0.12)",
      boxShadow: "0 2px 12px rgba(124,58,237,0.07)",
    }}>

      {/* ── Logo ── */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
        <img src={logo} alt="TaskDuty" style={{ width: 28, height: 28 }} />
        <span style={{ fontFamily: F, fontWeight: 700, fontSize: 24, color: "#2D0050" }}>
          TaskDuty
        </span>
      </Link>

      {/* ── Desktop right side ── */}
      <div className="navbar-desktop" style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {renderLinks()}

        {/* Avatar dropdown (logged-in only) */}
        {user && (
          <div ref={dropRef} style={{ position: "relative" }}>
            <button
              onClick={() => setDropOpen(o => !o)}
              style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}
              aria-label="User menu"
            >
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, boxShadow: "0 2px 8px rgba(124,58,237,0.35)",
              }}>
                <span style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: "white" }}>{initials}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <span style={{ fontFamily: F, fontWeight: 700, fontSize: 13, color: "#2D0050", lineHeight: 1.2 }}>{user.username}</span>
                <span style={{ fontFamily: F, fontWeight: 400, fontSize: 11, color: "#9ca3af", lineHeight: 1.2 }}>My account</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                style={{ transform: dropOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", color: "#9ca3af" }}>
                <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {dropOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 10px)", right: 0,
                minWidth: 200, backgroundColor: "white",
                border: "1.5px solid #ede9fe", borderRadius: 12,
                boxShadow: "0 8px 28px rgba(124,58,237,0.14)",
                overflow: "hidden", zIndex: 100,
              }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #f3f0ff", backgroundColor: "#faf8ff" }}>
                  <p style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: "#2D0050", margin: "0 0 2px 0" }}>{user.username}</p>
                  <p style={{ fontFamily: F, fontSize: 12, color: "#9ca3af", margin: 0 }}>{user.email}</p>
                </div>
                <Link to="/profile" onClick={() => setDropOpen(false)} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
                  textDecoration: "none", fontFamily: F, fontWeight: 600, fontSize: 14, color: "#374151",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  View Profile
                </Link>
                <div style={{ height: 1, backgroundColor: "#f3f0ff" }} />
                <button onClick={handleLogout} style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "12px 16px",
                  fontFamily: F, fontWeight: 600, fontSize: 14, color: "#ef4444",
                  background: "none", border: "none", cursor: "pointer", textAlign: "left",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Mobile hamburger ── */}
      <div ref={mobileRef} className="navbar-mobile" style={{ display: "none", alignItems: "center", gap: 12 }}>
        {/* Mini avatar always visible on mobile if logged in */}
        {user && (
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 12, color: "white" }}>{initials}</span>
          </div>
        )}

        {/* Hamburger button */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Menu"
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: 6, display: "flex", flexDirection: "column", gap: 4,
          }}
        >
          <span style={{ width: 22, height: 2, backgroundColor: "#2D0050", borderRadius: 2, transition: "all 0.2s", transform: mobileOpen ? "rotate(45deg) translateY(6px)" : "none" }} />
          <span style={{ width: 22, height: 2, backgroundColor: "#2D0050", borderRadius: 2, opacity: mobileOpen ? 0 : 1, transition: "all 0.2s" }} />
          <span style={{ width: 22, height: 2, backgroundColor: "#2D0050", borderRadius: 2, transition: "all 0.2s", transform: mobileOpen ? "rotate(-45deg) translateY(-6px)" : "none" }} />
        </button>

        {/* Mobile dropdown panel */}
        {mobileOpen && (
          <div style={{
            position: "absolute", top: "100%", left: 0, right: 0,
            backgroundColor: "white", borderBottom: "1px solid #ede9fe",
            boxShadow: "0 8px 20px rgba(124,58,237,0.10)",
            padding: "16px 20px", display: "flex", flexDirection: "column", gap: 4,
          }}>
            {user && (
              <div style={{ padding: "8px 4px 14px 4px", borderBottom: "1px solid #f3f0ff", marginBottom: 6 }}>
                <p style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: "#2D0050", margin: "0 0 2px 0" }}>{user.username}</p>
                <p style={{ fontFamily: F, fontSize: 12, color: "#9ca3af", margin: 0 }}>{user.email}</p>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {renderLinks(() => setMobileOpen(false))}
            </div>

            {user && (
              <>
                <div style={{ height: 1, backgroundColor: "#f3f0ff", margin: "10px 0" }} />
                <Link to="/profile" onClick={() => setMobileOpen(false)} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 4px",
                  textDecoration: "none", fontFamily: F, fontWeight: 600, fontSize: 15, color: "#374151",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  View Profile
                </Link>
                <button onClick={handleLogout} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 4px",
                  fontFamily: F, fontWeight: 600, fontSize: 15, color: "#ef4444",
                  background: "none", border: "none", cursor: "pointer", textAlign: "left",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Log Out
                </button>
              </>
            )}
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
