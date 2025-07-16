export const TASK_STATUSES = ['open', 'in-progress', 'completed'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export type Task = {
  id: string;
  description: string;
  dueDate: Date | null;
  status: TaskStatus;
  createdAt: Date;
  deletedAt: Date | null;
};
