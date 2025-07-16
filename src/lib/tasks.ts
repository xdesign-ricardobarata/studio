import type { Task, TaskStatus } from '@/lib/types';

// In-memory store for tasks
let tasks: Task[] = [
    {
        id: '1',
        description: 'Set up the project structure for TaskJuggler',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        status: 'completed',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
        deletedAt: null,
    },
    {
        id: '2',
        description: 'Design the main UI components using shadcn/ui',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
        status: 'in-progress',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
        deletedAt: null,
    },
    {
        id: '3',
        description: 'Implement server actions for CRUD operations',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
        status: 'open',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
        deletedAt: null,
    },
    {
        id: '4',
        description: 'Integrate the GenAI task suggestion feature',
        dueDate: null,
        status: 'open',
        createdAt: new Date(),
        deletedAt: null,
    },
    {
        id: '5',
        description: 'Deploy the app to production',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        status: 'open',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
        deletedAt: null,
    },
    {
        id: '6',
        description: 'Write end-to-end tests',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
        status: 'open',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 4)),
        deletedAt: null,
    },
    {
        id: '7',
        description: 'Review PR from a colleague',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        status: 'in-progress',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
        deletedAt: null,
    },
    {
        id: '8',
        description: 'This is a deleted task',
        dueDate: new Date(),
        status: 'completed',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
        deletedAt: new Date(),
    },
];

const getSortedTasks = () => tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

export async function getTasks(): Promise<Task[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return getSortedTasks().filter(task => !task.deletedAt);
}

export async function getDeletedTasks(): Promise<Task[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return getSortedTasks().filter(task => !!task.deletedAt);
}

export async function getTopTasks(n: number): Promise<Task[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getSortedTasks().filter(task => !task.deletedAt).slice(0, n);
}

export async function getTaskById(id: string): Promise<Task | undefined> {
    return tasks.find(task => task.id === id);
}

export async function createTask(data: Omit<Task, 'id' | 'createdAt' | 'deletedAt'>): Promise<Task> {
  const newTask: Task = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: new Date(),
    deletedAt: null,
  };
  tasks.push(newTask);
  return newTask;
}

export async function updateTask(id: string, data: Partial<Omit<Task, 'id' | 'createdAt' | 'deletedAt'>>): Promise<Task | null> {
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    return null;
  }
  tasks[taskIndex] = { ...tasks[taskIndex], ...data };
  return tasks[taskIndex];
}

export async function softDeleteTask(id: string): Promise<Task | null> {
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    return null;
  }
  tasks[taskIndex].deletedAt = new Date();
  return tasks[taskIndex];
}

export async function restoreTask(id: string): Promise<Task | null> {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
        return null;
    }
    tasks[taskIndex].deletedAt = null;
    return tasks[taskIndex];
}

export async function deleteTask(id: string): Promise<{ success: boolean }> {
  const initialLength = tasks.length;
  tasks = tasks.filter(task => task.id !== id);
  return { success: tasks.length < initialLength };
}
