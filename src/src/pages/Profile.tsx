import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const F = "'Signika Negative', sans-serif";

type Tab = "info" | "password";
type PwErrors = { current?: string; newPass?: string; confirm?: string; api?: string };

const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeClosed = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [tab, setTab]    = useState<Tab>("info");

  // ── Password change state ──────────────────────────────────
  const [current,      setCurrent]      = useState("");
  const [newPass,      setNewPass]      = useState("");
  const [confirm,      setConfirm]      = useState("");
  const [showCurrent,  setShowCurrent]  = useState(false);
  const [showNew,      setShowNew]      = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [pwErrors,     setPwErrors]     = useState<PwErrors>({});
  const [submitting,   setSubmitting]   = useState(false);

  const validatePw = (): boolean => {
    const e: PwErrors = {};
    if (!current)              e.current = "Current password is required";
    if (!newPass)              e.newPass = "New password is required";
    else if (newPass.length < 6) e.newPass = "Must be at least 6 characters";
    if (!confirm)              e.confirm = "Please confirm your new password";
    else if (newPass !== confirm) e.confirm = "Passwords do not match";
    setPwErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePw()) return;
    setSubmitting(true);
    setPwErrors({});
    try {
      await api.put("/auth/update-password", {
        currentPassword: current,
        newPassword: newPass,
        confirmPassword: confirm,
      });
      toast.success("Password updated successfully");
      setCurrent(""); setNewPass(""); setConfirm("");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update password";
      setPwErrors({ api: msg });
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Generate initials avatar
  const initials = user?.username?.slice(0, 2).toUpperCase() || "??";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f0f5" }}>
      <NavBar variant="tasks" />

      <div style={{ paddingTop: 64 }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>

          {/* ── Profile header card ── */}
          <div style={{
            backgroundColor: "white", borderRadius: 16,
            border: "1px solid #ede9fe",
            boxShadow: "0 4px 20px rgba(124,58,237,0.08)",
            padding: "36px 32px", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 24,
          }}>
            {/* Avatar circle with initials */}
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ fontFamily: F, fontWeight: 700, fontSize: 28, color: "white" }}>
                {initials}
              </span>
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: F, fontWeight: 700, fontSize: 24, color: "#0f0f0f", margin: "0 0 4px 0" }}>
                {user?.username}
              </h2>
              <p style={{ fontFamily: F, fontSize: 14, color: "#6b7280", margin: "0 0 16px 0" }}>
                {user?.email}
              </p>
              <button
                onClick={handleLogout}
                style={{
                  fontFamily: F, fontWeight: 600, fontSize: 13,
                  color: "#ef4444", backgroundColor: "#fff5f5",
                  border: "1.5px solid #fca5a5", borderRadius: 8,
                  padding: "7px 18px", cursor: "pointer",
                }}
              >
                Log Out
              </button>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div style={{
            display: "flex", gap: 0, marginBottom: 24,
            backgroundColor: "white", borderRadius: 12,
            border: "1px solid #ede9fe", overflow: "hidden",
            boxShadow: "0 2px 8px rgba(124,58,237,0.06)",
          }}>
            {(["info", "password"] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: "14px",
                  fontFamily: F, fontWeight: 600, fontSize: 14,
                  border: "none", cursor: "pointer",
                  backgroundColor: tab === t ? "#7c3aed" : "white",
                  color: tab === t ? "white" : "#6b7280",
                  transition: "all 0.15s",
                }}
              >
                {t === "info" ? "Account Info" : "Change Password"}
              </button>
            ))}
          </div>

          {/* ── Tab content ── */}
          <div style={{
            backgroundColor: "white", borderRadius: 16,
            border: "1px solid #ede9fe", padding: "32px",
            boxShadow: "0 4px 20px rgba(124,58,237,0.08)",
          }}>

            {/* Account Info tab */}
            {tab === "info" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <h3 style={{ fontFamily: F, fontWeight: 700, fontSize: 18, color: "#0f0f0f", margin: 0 }}>
                  Account Details
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { label: "Username", value: user?.username },
                    { label: "Email",    value: user?.email },
                  ].map(({ label, value }) => (
                    <div key={label} style={{
                      display: "flex", flexDirection: "column", gap: 4,
                      padding: "14px 16px", backgroundColor: "#f9f7ff",
                      borderRadius: 10, border: "1px solid #ede9fe",
                    }}>
                      <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {label}
                      </span>
                      <span style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: "#1f2937" }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <p style={{ fontFamily: F, fontSize: 13, color: "#9ca3af", margin: 0 }}>
                  To update your username or email, please contact support.
                </p>
              </div>
            )}

            {/* Change Password tab */}
            {tab === "password" && (
              <form onSubmit={handlePasswordChange} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <h3 style={{ fontFamily: F, fontWeight: 700, fontSize: 18, color: "#0f0f0f", margin: 0 }}>
                  Change Password
                </h3>

                {/* API error banner */}
                {pwErrors.api && (
                  <div style={{
                    backgroundColor: "#fff5f5", border: "1.5px solid #fca5a5",
                    borderRadius: 8, padding: "12px 16px",
                    display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <span style={{ fontSize: 16 }}>⚠️</span>
                    <p style={{ fontFamily: F, fontSize: 13, color: "#ef4444", margin: 0 }}>{pwErrors.api}</p>
                  </div>
                )}

                {/* Current password */}
                <div className="fl-wrap">
                  <label>Current Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showCurrent ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Your current password"
                      value={current}
                      onChange={e => { setCurrent(e.target.value); setPwErrors(p => ({ ...p, current: undefined })); }}
                      className={pwErrors.current ? "error" : ""}
                      style={{ paddingRight: 44 }}
                    />
                    <button type="button" onClick={() => setShowCurrent(o => !o)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      {showCurrent ? <EyeClosed /> : <EyeOpen />}
                    </button>
                  </div>
                  {pwErrors.current && <p style={errStyle}>{pwErrors.current}</p>}
                </div>

                {/* New password */}
                <div className="fl-wrap">
                  <label>New Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showNew ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Min. 6 characters"
                      value={newPass}
                      onChange={e => { setNewPass(e.target.value); setPwErrors(p => ({ ...p, newPass: undefined })); }}
                      className={pwErrors.newPass ? "error" : ""}
                      style={{ paddingRight: 44 }}
                    />
                    <button type="button" onClick={() => setShowNew(o => !o)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      {showNew ? <EyeClosed /> : <EyeOpen />}
                    </button>
                  </div>
                  {pwErrors.newPass && <p style={errStyle}>{pwErrors.newPass}</p>}
                </div>

                {/* Confirm password */}
                <div className="fl-wrap">
                  <label>Confirm New Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Repeat new password"
                      value={confirm}
                      onChange={e => { setConfirm(e.target.value); setPwErrors(p => ({ ...p, confirm: undefined })); }}
                      className={pwErrors.confirm ? "error" : ""}
                      style={{ paddingRight: 44 }}
                    />
                    <button type="button" onClick={() => setShowConfirm(o => !o)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      {showConfirm ? <EyeClosed /> : <EyeOpen />}
                    </button>
                  </div>
                  {pwErrors.confirm && <p style={errStyle}>{pwErrors.confirm}</p>}
                </div>

                <button type="submit" disabled={submitting} style={{
                  width: "100%", backgroundColor: submitting ? "#a78bfa" : "#7c3aed",
                  color: "white", fontFamily: F, fontWeight: 700, fontSize: 16,
                  padding: "14px", borderRadius: 10, border: "none",
                  cursor: submitting ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 16px rgba(124,58,237,0.25)",
                }}>
                  {submitting ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const errStyle: React.CSSProperties = {
  color: "#ef4444", fontSize: 12, marginTop: 4,
  fontFamily: "'Signika Negative', sans-serif",
};

export default Profile;
