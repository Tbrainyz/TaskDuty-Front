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
  trashedTasks: Task[];
  loading: boolean;
  trashLoading: boolean;
  error: string | null;
  getAllTasks: () => Promise<void>;
  getTrashedTasks: () => Promise<void>;
  createTask: (payload: CreateTaskPayload) => Promise<void>;
  updateTask: (id: string, payload: UpdateTaskPayload) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;           // soft delete
  restoreTask: (id: string) => Promise<void>;          // restore from trash
  permanentDeleteTask: (id: string) => Promise<void>;  // delete forever
}

export const TasksContext = createContext<TasksContextValue | null>(null);

export const useTasks = (): TasksContextValue => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used inside TasksProvider");
  return ctx;
};

const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks,         setTasks]         = useState<Task[]>([]);
  const [trashedTasks,  setTrashedTasks]  = useState<Task[]>([]);
  const [loading,       setLoading]       = useState(false);
  const [trashLoading,  setTrashLoading]  = useState(false);
  const [error,         setError]         = useState<string | null>(null);

  // GET all active tasks (deleted: false)
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

  // GET all trashed tasks (deleted: true)
  const getTrashedTasks = useCallback(async () => {
    setTrashLoading(true);
    try {
      const { data } = await api.get<GetTasksResponse>("/tasks/trash");
      setTrashedTasks(Array.isArray(data.data) ? data.data : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch trash");
    } finally {
      setTrashLoading(false);
    }
  }, []);

  // CREATE task
  const createTask = async (payload: CreateTaskPayload) => {
    const { data } = await api.post<Task>("/tasks", payload);
    setTasks(prev => [data, ...prev]);
  };

  // UPDATE task
  const updateTask = async (id: string, payload: UpdateTaskPayload) => {
    const { data } = await api.put<Task>(`/tasks/${id}`, payload);
    setTasks(prev => prev.map(t => t._id === id ? data : t));
  };

  // SOFT DELETE — moves to trash, removes from active list
  const deleteTask = async (id: string) => {
    await api.delete(`/tasks/${id}`);
    setTasks(prev => prev.filter(t => t._id !== id));
  };

  // RESTORE — removes from trash, adds back to active list
  const restoreTask = async (id: string) => {
    const { data } = await api.put<{ success: boolean; data: Task }>(`/tasks/${id}/restore`);
    setTrashedTasks(prev => prev.filter(t => t._id !== id));
    setTasks(prev => [data.data, ...prev]);
  };

  // PERMANENT DELETE — removes from trash list and DB forever
  const permanentDeleteTask = async (id: string) => {
    await api.delete(`/tasks/${id}/permanent`);
    setTrashedTasks(prev => prev.filter(t => t._id !== id));
  };

  return (
    <TasksContext.Provider value={{
      tasks, trashedTasks, loading, trashLoading, error,
      getAllTasks, getTrashedTasks,
      createTask, updateTask,
      deleteTask, restoreTask, permanentDeleteTask,
    }}>
      {children}
    </TasksContext.Provider>
  );
};

export default TasksProvider;
