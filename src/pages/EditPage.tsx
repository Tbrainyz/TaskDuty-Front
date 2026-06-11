import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";
import SkeletonCard from "../components/SkeletonCard";
import { useTasks } from "../context/TasksContext";
import type { Category } from "../types/task";

const CATEGORIES: Category[] = ["Work", "Personal", "Urgent"];

type FormErrors = { title?: string; description?: string; dueDate?: string };

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg
    width="20" height="20" viewBox="0 0 20 20" fill="none"
    style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}
  >
    <path d="M5 7.5L10 12.5L15 7.5" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { tasks, loading, updateTask } = useTasks();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState<Category>("Urgent");
  const [completed, setCompleted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (loading) return;
    const task = tasks.find((t) => t._id === id);
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate.split("T")[0]);
      setCategory(task.category);
      setCompleted(task.completed);
      setReady(true);
    }
  }, [tasks, id, loading]);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!title.trim()) e.title = "Title is required";
    if (!description.trim()) e.description = "Description is required";
    if (!dueDate) e.dueDate = "Due date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !id) return;
    setSubmitting(true);
    try {
      await updateTask(id, { title, description, dueDate: new Date(dueDate).toISOString(), category, completed });
      toast.success("Task updated successfully");
      navigate("/alltasks");
    } catch {
      toast.error("Failed to update task");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !ready) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <NavBar variant="form" />
        <div style={{ paddingTop: 64 }}>
          <div style={{ margin: "0 auto", padding: "40px 15%" }}>
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  const task = tasks.find((t) => t._id === id);
  if (!task) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <NavBar variant="form" />
        <div style={{ paddingTop: 64 }}>
          <div style={{ padding: "40px 15%" }}>
            <p style={{ color: "#ef4444", fontFamily: "Montserrat, sans-serif" }}>Task not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <NavBar variant="form" />

      <div style={{ paddingTop: 64 }}>
        <div style={{ margin: "0 auto", padding: "40px 15%" }}>

          {/* ← Back + heading */}
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "none", border: "none",
              fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 22,
              color: "#1f2937", cursor: "pointer", marginBottom: 32, padding: 0,
            }}
          >
            <span style={{ fontSize: 24, lineHeight: 1, marginTop: -2 }}>←</span>
            Edit Task
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

            {/* Task Title */}
            <div className="fl-wrap">
              <label>Task Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={errors.title ? "error" : ""}
              />
              {errors.title && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="fl-wrap">
              <label>Description</label>
              <textarea
                rows={7}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={errors.description ? "error" : ""}
              />
              {errors.description && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.description}</p>}
            </div>

            {/* Due Date */}
            <div className="fl-wrap">
              <label>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={errors.dueDate ? "error" : ""}
                style={{ colorScheme: "light" }}
              />
              {errors.dueDate && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.dueDate}</p>}
            </div>

            {/* Tags — working dropdown */}
            <div className="fl-tags-wrap" ref={dropdownRef}>
              <label>Tags</label>
              <div className="tags-box" onClick={() => setDropdownOpen((o) => !o)}>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{
                    backgroundColor: "#e9e4f8",
                    color: "#7c3aed",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    fontSize: 12,
                    padding: "3px 12px",
                    borderRadius: 4,
                  }}>
                    {category}
                  </span>
                </div>
                <ChevronDown open={dropdownOpen} />
              </div>

              {dropdownOpen && (
                <div className="dropdown">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={category === c ? "active" : ""}
                      onClick={() => { setCategory(c); setDropdownOpen(false); }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Completed toggle */}
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "#7c3aed", cursor: "pointer" }}
              />
              <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 14, color: "#374151" }}>
                Mark as completed
              </span>
            </label>

            {/* Done button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                width: "100%",
                backgroundColor: submitting ? "#a78bfa" : "#7c3aed",
                color: "white",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 16,
                padding: "16px",
                borderRadius: 8,
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
                marginTop: 4,
              }}
            >
              {submitting ? "Saving..." : "Done"}
            </button>
          </div>

          {/* Back to Top */}
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              style={{ background: "none", border: "none", color: "#7c3aed", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
            >
              Back To Top
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
