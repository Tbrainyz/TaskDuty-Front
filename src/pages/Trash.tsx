import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";
import SkeletonCard from "../components/SkeletonCard";
import { useTasks } from "../context/TasksContext";
import type { Category } from "../types/task";

const F = "'Signika Negative', sans-serif";

const categoryStyle: Record<Category, React.CSSProperties> = {
  Urgent:   { color: "#e11d48" },
  Personal: { color: "#0d9488" },
  Work:     { color: "#7c3aed" },
};

const Trash = () => {
  const { trashedTasks, trashLoading, getTrashedTasks, restoreTask, permanentDeleteTask } = useTasks();
  const [restoringId,  setRestoringId]  = useState<string | null>(null);
  const [deletingId,   setDeletingId]   = useState<string | null>(null);

  useEffect(() => {
    getTrashedTasks();
  }, [getTrashedTasks]);

  const handleRestore = async (id: string) => {
    setRestoringId(id);
    try {
      await restoreTask(id);
      toast.success("Task restored to My Tasks ✓");
    } catch {
      toast.error("Failed to restore task");
    } finally {
      setRestoringId(null);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!window.confirm("This will permanently delete the task. This cannot be undone. Continue?")) return;
    setDeletingId(id);
    try {
      await permanentDeleteTask(id);
      toast.success("Task permanently deleted");
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDeletedDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const shell = (children: React.ReactNode) => (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f0f5" }}>
      <NavBar variant="tasks" />
      <div style={{ paddingTop: 64 }}>
        <div className="page-pad" style={{ padding: "40px 80px" }}>{children}</div>
      </div>
    </div>
  );

  if (trashLoading) return shell(
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SkeletonCard /><SkeletonCard />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f0f5" }}>
      <NavBar variant="tasks" />
      <div style={{ paddingTop: 64 }}>
        <div className="page-pad" style={{ padding: "40px 80px" }}>

          {/* ── Header ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Bin icon */}
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                backgroundColor: "#fff5f5", border: "1.5px solid #fca5a5",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </div>
              <div>
                <h2 style={{ fontFamily: F, fontWeight: 700, fontSize: 28, color: "#0f0f0f", margin: 0 }}>
                  Trash
                </h2>
                <p style={{ fontFamily: F, fontSize: 13, color: "#9ca3af", margin: 0 }}>
                  {trashedTasks.length} deleted task{trashedTasks.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <Link to="/alltasks" style={{
              textDecoration: "none", fontFamily: F, fontWeight: 600,
              fontSize: 14, color: "#7c3aed",
            }}>
              ← Back to My Tasks
            </Link>
          </div>

          {/* ── Info banner ── */}
          <div style={{
            backgroundColor: "#fffbeb", border: "1px solid #fde68a",
            borderRadius: 10, padding: "12px 16px", marginBottom: 28,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 18 }}>💡</span>
            <p style={{ fontFamily: F, fontSize: 13, color: "#92400e", margin: 0 }}>
              Deleted tasks are stored here. You can restore them to your task list or permanently delete them.
            </p>
          </div>

          {/* ── Empty trash state ── */}
          {trashedTasks.length === 0 ? (
            <div className="task-card" style={{ padding: "64px 32px", textAlign: "center" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🗑️</div>
              <p style={{ fontFamily: F, fontWeight: 700, fontSize: 18, color: "#9ca3af", marginBottom: 8 }}>
                Trash is empty
              </p>
              <p style={{ fontFamily: F, fontSize: 14, color: "#d1d5db", marginBottom: 24 }}>
                Deleted tasks will appear here
              </p>
              <Link to="/alltasks" style={{
                textDecoration: "none", display: "inline-block",
                backgroundColor: "#7c3aed", color: "white",
                fontFamily: F, fontWeight: 700, fontSize: 14,
                padding: "10px 24px", borderRadius: 8,
              }}>
                Go to My Tasks
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {trashedTasks.map((task) => (
                <div
                  key={task._id}
                  className="task-card"
                  style={{
                    opacity: (restoringId === task._id || deletingId === task._id) ? 0.4 : 1,
                    pointerEvents: (restoringId === task._id || deletingId === task._id) ? "none" : "auto",
                    borderLeft: "4px solid #fca5a5",
                  }}
                >
                  {/* Top row */}
                  <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", padding: "14px 24px",
                    flexWrap: "wrap", gap: 10,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{
                        fontFamily: F, fontWeight: 700, fontSize: 13,
                        ...(categoryStyle[task.category] ?? { color: "#7c3aed" }),
                      }}>
                        {task.category}
                      </span>
                      {/* Deleted at timestamp */}
                      {task.deletedAt && (
                        <span style={{
                          fontFamily: F, fontSize: 11, color: "#9ca3af",
                          backgroundColor: "#f9fafb", border: "1px solid #e5e7eb",
                          borderRadius: 6, padding: "2px 8px",
                        }}>
                          🗑 {formatDeletedDate(task.deletedAt)}
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="btn-group" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {/* Restore */}
                      <button
                        onClick={() => handleRestore(task._id)}
                        style={{
                          display: "flex", alignItems: "center", gap: 7,
                          backgroundColor: "#7c3aed", color: "white",
                          fontFamily: F, fontWeight: 600, fontSize: 13,
                          padding: "7px 18px", borderRadius: 8,
                          border: "none", cursor: "pointer",
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                          <path d="M3 3v5h5"/>
                        </svg>
                        Restore
                      </button>

                      {/* Delete Forever */}
                      <button
                        onClick={() => handlePermanentDelete(task._id)}
                        style={{
                          display: "flex", alignItems: "center", gap: 7,
                          border: "1.5px solid #fca5a5", color: "#ef4444",
                          fontFamily: F, fontWeight: 600, fontSize: 13,
                          padding: "7px 18px", borderRadius: 8,
                          backgroundColor: "#fff5f5", cursor: "pointer",
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                        Delete Forever
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, backgroundColor: "#ede9fe", margin: "0 24px" }} />

                  {/* Body */}
                  <div className="task-card-body" style={{ padding: "16px 24px 24px" }}>
                    <h3 style={{
                      fontFamily: F, fontWeight: 700, fontSize: 18,
                      color: "#9ca3af", margin: "0 0 8px 0",
                      textDecoration: "line-through",
                    }}>
                      {task.title}
                    </h3>
                    <p style={{ fontFamily: F, fontSize: 14, lineHeight: 1.7, color: "rgba(0,0,0,0.45)", margin: 0 }}>
                      {task.description}
                    </p>
                    <p style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: "#d1d5db", margin: "10px 0 0 0" }}>
                      Due: {new Date(task.dueDate).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trash;
