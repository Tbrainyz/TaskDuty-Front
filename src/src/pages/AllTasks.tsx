import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";
import SkeletonCard from "../components/SkeletonCard";
import { useTasks } from "../context/TasksContext";
import penIcon from "../assets/pen.png";
import canIcon from "../assets/can.png";
import type { Category, Task } from "../types/task";

const F = "'Signika Negative', sans-serif";

const categoryStyle: Record<Category, React.CSSProperties> = {
  Urgent:   { color: "#e11d48" },
  Personal: { color: "#0d9488" },
  Work:     { color: "#7c3aed" },
};

type StatusFilter   = "All" | "Active" | "Completed";
type CategoryFilter = "All" | Category;

// ── Reusable filter dropdown ─────────────────────────────────
interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

const FilterDropdown = ({ label, value, options, onChange }: FilterDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const isActive = value !== "All";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 16px", borderRadius: 8, cursor: "pointer",
          fontFamily: F, fontWeight: 600, fontSize: 13,
          border: isActive ? "1.5px solid #7c3aed" : "1.5px solid #d1d5db",
          backgroundColor: isActive ? "#f5f3ff" : "white",
          color: isActive ? "#7c3aed" : "#374151",
          transition: "all 0.15s", whiteSpace: "nowrap",
        }}
      >
        <span>{label}: <strong>{value}</strong></span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
          <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0,
          minWidth: 150, backgroundColor: "white",
          border: "1.5px solid #e5e7eb", borderRadius: 10,
          boxShadow: "0 8px 24px rgba(0,0,0,0.10)", zIndex: 50, overflow: "hidden",
        }}>
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "10px 16px", fontFamily: F, fontSize: 13,
                fontWeight: opt === value ? 700 : 500,
                backgroundColor: opt === value ? "#f5f3ff" : "white",
                color: opt === value ? "#7c3aed" : "#374151",
                border: "none", cursor: "pointer",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main component ───────────────────────────────────────────
const AllTasks = () => {
  const { tasks, loading, error, getAllTasks, deleteTask } = useTasks();

  const [deletingId,     setDeletingId]     = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [statusFilter,   setStatusFilter]   = useState<StatusFilter>("All");
  const [filteredTasks,  setFilteredTasks]  = useState<Task[]>([]);

  // ── useEffect 1: fetch all tasks from backend on page load ──
  useEffect(() => {
    getAllTasks();
  }, [getAllTasks]);

  // ── useEffect 2: re-filter whenever tasks or filters change ─
  useEffect(() => {
    let result = [...tasks];

    // Filter by category
    if (categoryFilter !== "All") {
      result = result.filter(task => task.category === categoryFilter);
    }

    // Filter by completion status
    if (statusFilter === "Active") {
      result = result.filter(task => !task.completed);
    } else if (statusFilter === "Completed") {
      result = result.filter(task => task.completed);
    }

    setFilteredTasks(result);

  }, [tasks, categoryFilter, statusFilter]);

  const hasActiveFilters = categoryFilter !== "All" || statusFilter !== "All";

  const clearFilters = () => {
    setCategoryFilter("All");
    setStatusFilter("All");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setDeletingId(id);
    try {
      await deleteTask(id);
      toast.success("Task deleted successfully");
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setDeletingId(null);
    }
  };

  const shell = (children: React.ReactNode) => (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f0f5" }}>
      <NavBar variant="tasks" />
      <div style={{ paddingTop: 64 }}>
        <div className="page-pad" style={{ padding: "40px 80px" }}>{children}</div>
      </div>
    </div>
  );

  if (loading) return shell(
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SkeletonCard /><SkeletonCard /><SkeletonCard />
    </div>
  );

  if (error) return shell(
    <p style={{ color: "#ef4444", fontFamily: F }}>{error}</p>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f0f5" }}>
      <NavBar variant="tasks" />
      <div style={{ paddingTop: 64 }}>
        <div className="page-pad" style={{ padding: "40px 80px" }}>

          {/* ── Page header ── */}
          <div className="tasks-header" style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: 20,
          }}>
            <h2 style={{ fontFamily: F, fontWeight: 700, fontSize: 30, color: "#0f0f0f", margin: 0 }}>
              My Tasks
            </h2>
            <Link to="/newtask" style={{
              textDecoration: "none", fontFamily: F,
              fontWeight: 600, fontSize: 15, color: "#7c3aed",
            }}>
              + Add New Task
            </Link>
          </div>

          {/* ── Filter bar ── */}
          <div style={{
            display: "flex", alignItems: "center",
            gap: 12, marginBottom: 28, flexWrap: "wrap",
          }}>
            <FilterDropdown
              label="Category"
              value={categoryFilter}
              options={["All", "Work", "Personal", "Urgent"]}
              onChange={v => setCategoryFilter(v as CategoryFilter)}
            />
            <FilterDropdown
              label="Status"
              value={statusFilter}
              options={["All", "Active", "Completed"]}
              onChange={v => setStatusFilter(v as StatusFilter)}
            />

            {/* Clear filters — only shows when a filter is active */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                style={{
                  padding: "8px 14px", borderRadius: 8, cursor: "pointer",
                  fontFamily: F, fontWeight: 600, fontSize: 13,
                  border: "1.5px solid #fca5a5", backgroundColor: "#fff5f5",
                  color: "#ef4444",
                }}
              >
                ✕ Clear filters
              </button>
            )}

            {/* Result count */}
            <span style={{
              marginLeft: "auto", fontFamily: F,
              fontSize: 13, color: "#9ca3af", fontWeight: 500,
            }}>
              {filteredTasks.length} of {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* ── Empty state — no tasks at all ── */}
          {tasks.length === 0 ? (
            <div className="task-card" style={{ padding: "64px 32px", textAlign: "center" }}>
              <p style={{ color: "#9ca3af", fontWeight: 600, fontSize: 18, marginBottom: 20, fontFamily: F }}>
                No tasks yet.
              </p>
              <Link to="/newtask" style={{
                textDecoration: "none", display: "inline-block",
                backgroundColor: "#7c3aed", color: "white",
                fontFamily: F, fontWeight: 700, fontSize: 15,
                padding: "12px 28px", borderRadius: 10,
              }}>
                + Add New Task
              </Link>
            </div>

          ) : filteredTasks.length === 0 ? (
            /* No results after filtering */
            <div className="task-card" style={{ padding: "48px 32px", textAlign: "center" }}>
              <p style={{ color: "#9ca3af", fontWeight: 600, fontSize: 16, marginBottom: 12, fontFamily: F }}>
                No tasks match your filters.
              </p>
              <button onClick={clearFilters} style={{
                background: "none", border: "none", color: "#7c3aed",
                fontFamily: F, fontWeight: 600, fontSize: 14, cursor: "pointer",
              }}>
                Clear filters
              </button>
            </div>

          ) : (
            /* Task cards */
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {filteredTasks.map((task) => {
                const isOverdue = !task.completed && new Date(task.dueDate) < new Date();
                return (
                  <div
                    key={task._id}
                    className="task-card"
                    style={{
                      opacity: deletingId === task._id ? 0.4 : 1,
                      pointerEvents: deletingId === task._id ? "none" : "auto",
                    }}
                  >
                    {/* Top row */}
                    <div style={{
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between", padding: "14px 24px",
                    }}>
                      <span style={{
                        fontFamily: F, fontWeight: 700, fontSize: 13,
                        ...(categoryStyle[task.category] ?? { color: "#7c3aed" }),
                      }}>
                        {task.category}
                      </span>
                      <div className="btn-group" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Link to={`/edit/${task._id}`} style={{
                          textDecoration: "none", display: "flex", alignItems: "center", gap: 7,
                          backgroundColor: "#7c3aed", color: "white",
                          fontFamily: F, fontWeight: 600, fontSize: 13,
                          padding: "7px 18px", borderRadius: 8,
                        }}>
                          <img src={penIcon} alt="" style={{ width: 13, height: 13, filter: "brightness(0) invert(1)" }} />
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(task._id)} style={{
                          display: "flex", alignItems: "center", gap: 7,
                          border: "1.5px solid #d1d5db", color: "#374151",
                          fontFamily: F, fontWeight: 600, fontSize: 13,
                          padding: "7px 18px", borderRadius: 8,
                          backgroundColor: "white", cursor: "pointer",
                        }}>
                          <img src={canIcon} alt="" style={{ width: 13, height: 13 }} />
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, backgroundColor: "#ede9fe", margin: "0 24px" }} />

                    {/* Body */}
                    <div className="task-card-body" style={{ padding: "16px 24px 24px" }}>
                      <h3 style={{
                        fontFamily: F, fontWeight: 700, fontSize: 19,
                        color: task.completed ? "#9ca3af" : "#0f0f0f",
                        margin: "0 0 8px 0",
                        textDecoration: task.completed ? "line-through" : "none",
                      }}>
                        {task.title}
                      </h3>
                      <p style={{ fontFamily: F, fontSize: 14, lineHeight: 1.7, color: "rgba(0,0,0,0.6)", margin: 0 }}>
                        {task.description}
                      </p>
                      <p style={{
                        fontFamily: F, fontSize: 12, fontWeight: 500,
                        color: isOverdue ? "#ef4444" : "#9ca3af",
                        margin: "10px 0 0 0",
                      }}>
                        Due: {new Date(task.dueDate).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                        {isOverdue && " · Overdue"}
                        {task.completed && (
                          <span style={{ marginLeft: 8, color: "#22c55e" }}>· Completed ✓</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Back to Top */}
          {filteredTasks.length > 2 && (
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                style={{
                  background: "none", border: "none", color: "#7c3aed",
                  fontFamily: F, fontWeight: 600, fontSize: 15, cursor: "pointer",
                }}
              >
                Back To Top
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AllTasks;
