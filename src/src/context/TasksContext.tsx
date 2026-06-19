import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import api from "../api/axios";
import type { Task, CreateTaskPayload, UpdateTaskPayload } from "../types/task";

type GetTasksResponse = { success: boolean; count: number; data: Task[] };

interface TasksContextValue {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  getAllTasks: () => Promise<void>;
  createTask: (payload: CreateTaskPayload) => Promise<void>;
  updateTask: (id: string, payload: UpdateTaskPayload) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const TasksContext = createContext<TasksContextValue | null>(null);

export const useTasks = (): TasksContextValue => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used inside TasksProvider");
  return ctx;
};

const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks,   setTasks]   = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const getAllTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<GetTasksResponse>("/tasks");
      setTasks(Array.isArray(data.data) ? data.data : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (payload: CreateTaskPayload) => {
    const { data } = await api.post<Task>("/tasks", payload);
    setTasks(prev => [data, ...prev]);
  };

  const updateTask = async (id: string, payload: UpdateTaskPayload) => {
    const { data } = await api.put<Task>(`/tasks/${id}`, payload);
    setTasks(prev => prev.map(t => t._id === id ? data : t));
  };

  const deleteTask = async (id: string) => {
    await api.delete(`/tasks/${id}`);
    setTasks(prev => prev.filter(t => t._id !== id));
  };

  return (
    <TasksContext.Provider value={{ tasks, loading, error, getAllTasks, createTask, updateTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export default TasksProvider;
