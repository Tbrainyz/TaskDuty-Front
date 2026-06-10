import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import api from "../api/axios";
import type { Task, CreateTaskPayload, UpdateTaskPayload } from "../types/task";

// ── Types ────────────────────────────────────────────────────
interface TasksContextValue {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  getAllTasks: () => Promise<void>;
  createTask: (payload: CreateTaskPayload) => Promise<void>;
  updateTask: (id: string, payload: UpdateTaskPayload) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

// ── Context ──────────────────────────────────────────────────
export const TasksContext = createContext<TasksContextValue | null>(null);

// ── Hook ─────────────────────────────────────────────────────
export const useTasks = (): TasksContextValue => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used inside TasksProvider");
  return ctx;
};

// ── Provider ─────────────────────────────────────────────────
const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GET all tasks
  const getAllTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Task[]>("/tasks");
      setTasks(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to fetch tasks";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // POST create task
  const createTask = async (payload: CreateTaskPayload): Promise<void> => {
    const { data } = await api.post<Task>("/tasks", payload);
    setTasks((prev) => [data, ...prev]);
  };

  // PUT update task
  const updateTask = async (
    id: string,
    payload: UpdateTaskPayload
  ): Promise<void> => {
    const { data } = await api.put<Task>(`/tasks/${id}`, payload);
    setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
  };

  // DELETE task
  const deleteTask = async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        error,
        getAllTasks,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export default TasksProvider;
