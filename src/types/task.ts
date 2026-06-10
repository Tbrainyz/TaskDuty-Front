export type Category = "Work" | "Personal" | "Urgent";

export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  category: Category;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskPayload = {
  title: string;
  description: string;
  dueDate: string;
  category: Category;
  completed: boolean;
};

export type UpdateTaskPayload = Partial<CreateTaskPayload>;
