import type { Task, TaskStatus } from '@/lib/types';

// In-memory store for tasks
let tasks: Task[] = [
    {
        id: '1',
        description: 'Set up the project structure for TaskJuggler',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        status: 'completed',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    },
    {
        id: '2',
        description: 'Design the main UI components using shadcn/ui',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
        status: 'in-progress',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    },
    {
        id: '3',
        description: 'Implement server actions for CRUD operations',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
        status: 'open',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    },
    {
        id: '4',
        description: 'Integrate the GenAI task suggestion feature',
        dueDate: null,
        status: 'open',
        createdAt: new Date(),
    },
    {
        id: '5',
        description: 'Deploy the app to production',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        status: 'open',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    },
    {
        id: '6',
        description: 'Write end-to-end tests',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
        status: 'open',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 4)),
    },
    {
        id: '7',
        description: 'Review PR from a colleague',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        status: 'in-progress',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    },
];

const getSortedTasks = () => tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

export async function getTasks(): Promise<Task[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return getSortedTasks();
}

export async function getTopTasks(n: number): Promise<Task[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getSortedTasks().slice(0, n);
}

export async function getTaskById(id: string): Promise<Task | undefined> {
    return tasks.find(task => task.id === id);
}

export async function createTask(data: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
  const newTask: Task = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: new Date(),
  };
  tasks.push(newTask);
  return newTask;
}

export async function updateTask(id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task | null> {
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    return null;
  }
  tasks[taskIndex] = { ...tasks[taskIndex], ...data };
  return tasks[taskIndex];
}

export async function deleteTask(id: string): Promise<{ success: boolean }> {
  const initialLength = tasks.length;
  tasks = tasks.filter(task => task.id !== id);
  return { success: tasks.length < initialLength };
}
