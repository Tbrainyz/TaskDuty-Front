import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";
import SkeletonCard from "../components/SkeletonCard";
import { useTasks } from "../context/TasksContext";
import penIcon from "../assets/pen.png";
import canIcon from "../assets/can.png";

const AllTasks = () => {
  const { tasks, loading, error, getAllTasks, deleteTask } = useTasks();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    getAllTasks();
  }, [getAllTasks]);

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

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <NavBar variant="tasks" />
        <div style={{ padding: "32px 80px", display: "flex", flexDirection: "column", gap: 24 }}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        <NavBar variant="tasks" />
        <div style={{ padding: "32px 80px" }}>
          <p style={{ color: "#ef4444", fontFamily: "Montserrat, sans-serif" }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <NavBar variant="tasks" />

      <div style={{ paddingTop: 64 }}>
        <div style={{ padding: "40px 80px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: 32,
              color: "#0f0f0f",
              margin: 0,
            }}
          >
            My Tasks
          </h2>
          <Link
            to="/newtask"
            style={{
              textDecoration: "none",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              fontSize: 16,
              color: "#6b7280",
            }}
          >
            + Add New Task
          </Link>
        </div>

        {/* Empty state */}
        {tasks.length === 0 ? (
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: "64px 32px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#9ca3af", fontWeight: 600, fontSize: 18, marginBottom: 16 }}>
              No tasks yet.
            </p>
            <Link
              to="/newtask"
              style={{
                textDecoration: "none",
                display: "inline-block",
                backgroundColor: "#7c3aed",
                color: "white",
                fontWeight: 700,
                fontSize: 15,
                padding: "12px 24px",
                borderRadius: 10,
              }}
            >
              + Add New Task
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {tasks.map((task) => {
              const isOverdue = !task.completed && new Date(task.dueDate) < new Date();
              return (
                <div
                  key={task._id}
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    padding: "20px 32px 32px 32px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    opacity: deletingId === task._id ? 0.4 : 1,
                    pointerEvents: deletingId === task._id ? "none" : "auto",
                  }}
                >
                  {/* Top row: category + action buttons */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 700,
                        fontSize: 13,
                        color: "#7c3aed",
                      }}
                    >
                      {task.category}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Link
                        to={`/edit/${task._id}`}
                        style={{
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          border: "1px solid #7c3aed",
                          color: "#7c3aed",
                          fontWeight: 700,
                          fontSize: 13,
                          padding: "6px 16px",
                          borderRadius: 8,
                          backgroundColor: "white",
                        }}
                      >
                        <img src={penIcon} alt="Edit" style={{ width: 14, height: 14 }} />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(task._id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          border: "1px solid #d1d5db",
                          color: "#6b7280",
                          fontWeight: 700,
                          fontSize: 13,
                          padding: "6px 16px",
                          borderRadius: 8,
                          backgroundColor: "white",
                          cursor: "pointer",
                        }}
                      >
                        <img src={canIcon} alt="Delete" style={{ width: 14, height: 14 }} />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 700,
                      fontSize: 20,
                      color: task.completed ? "#9ca3af" : "#0f0f0f",
                      margin: 0,
                      textDecoration: task.completed ? "line-through" : "none",
                      textAlign: "left",
                    }}
                  >
                    {task.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 400,
                      fontSize: 15,
                      lineHeight: 1.65,
                      color: "rgba(0,0,0,0.65)",
                      margin: 0,
                      textAlign: "left",
                    }}
                  >
                    {task.description}
                  </p>

                  {/* Due date */}
                  <p
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: 12,
                      fontWeight: 500,
                      color: isOverdue ? "#ef4444" : "#9ca3af",
                      margin: 0,
                      textAlign: "left",
                    }}
                  >
                    Due:{" "}
                    {new Date(task.dueDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {isOverdue && " · Overdue"}
                    {task.completed && (
                      <span style={{ marginLeft: 8, color: "#22c55e" }}>· Completed ✓</span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Back to Top */}
        {tasks.length > 2 && (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              style={{
                background: "none",
                border: "none",
                color: "#7c3aed",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
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
