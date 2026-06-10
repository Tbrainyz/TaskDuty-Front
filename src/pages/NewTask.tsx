import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";
import { useTasks } from "../context/TasksContext";
import type { Category } from "../types/task";

const CATEGORIES: Category[] = ["Work", "Personal", "Urgent"];
const todayISO = () => new Date().toISOString().split("T")[0];

type FormErrors = { title?: string; description?: string; dueDate?: string };

const NewTask = () => {
  const { createTask } = useTasks();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState<Category>("Urgent");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!title.trim()) e.title = "Title is required";
    if (!description.trim()) e.description = "Description is required";
    if (!dueDate) e.dueDate = "Due date is required";
    else if (dueDate < todayISO()) e.dueDate = "Due date cannot be in the past";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await createTask({
        title, description,
        dueDate: new Date(dueDate).toISOString(),
        category,
        completed: false,
      });
      toast.success("Task created successfully");
      navigate("/alltasks");
    } catch {
      toast.error("Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#2d2d2d" }}>
      {/* Dark title bar */}
      <div style={{ backgroundColor: "#2d2d2d", padding: "12px 80px 10px" }}>
        <p style={{ color: "white", fontSize: 13, fontWeight: 600, margin: 0, fontFamily: "Montserrat, sans-serif" }}>
          New Task
        </p>
      </div>

      {/* Light content area */}
      <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        <NavBar variant="form" />

        <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 24px" }}>
          {/* Back + heading */}
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: "none",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: 22,
              color: "#1f2937",
              cursor: "pointer",
              marginBottom: 28,
              padding: 0,
            }}
          >
            ‹ New Task
          </button>

          {/* White card */}
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: "28px 28px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Task Title */}
            <div className="fl-wrap">
              <label>Task Title</label>
              <input
                type="text"
                placeholder="E.g Project Defense, Assignment ..."
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
                rows={6}
                placeholder="Briefly describe your task..."
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
                min={todayISO()}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={errors.dueDate ? "error" : ""}
                style={{ colorScheme: "light" }}
              />
              {errors.dueDate && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.dueDate}</p>}
            </div>

            {/* Tags */}
            <div>
              <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8, fontFamily: "Montserrat, sans-serif" }}>
                Tags
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  padding: "10px 14px",
                  backgroundColor: "white",
                }}
              >
                <div style={{ display: "flex", gap: 8 }}>
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 700,
                        fontSize: 12,
                        padding: "5px 14px",
                        borderRadius: 6,
                        cursor: "pointer",
                        border: "none",
                        backgroundColor: category === c ? "#7c3aed" : "#f3f4f6",
                        color: category === c ? "white" : "#6b7280",
                        transition: "all 0.15s",
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <span style={{ color: "#9ca3af", fontSize: 16 }}>⌄</span>
              </div>
            </div>

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
              }}
            >
              {submitting ? "Creating..." : "Done"}
            </button>
          </div>

          {/* Back to Top */}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              style={{
                background: "none",
                border: "none",
                color: "#7c3aed",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Back To Top
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTask;
