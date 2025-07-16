import type { Task } from '@/lib/types';

const API_BASE = 'http://localhost:8080/api/tasks';

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return await res.json();
}

export async function getTopTasks(n: number): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/top?n=${n}`);
  if (!res.ok) throw new Error('Failed to fetch top tasks');
  return await res.json();
}

export async function getTaskById(id: string | number): Promise<Task | undefined> {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) return undefined;
  return await res.json();
}

export async function createTask(data: Omit<Task, 'id' | 'createdAt' | 'deletedAt'>): Promise<Task> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: data.description }),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return await res.json();
}

export async function updateTask(id: string | number, data: Partial<Omit<Task, 'id' | 'createdAt' | 'deletedAt'>>): Promise<Task | null> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: data.description }),
  });
  if (!res.ok) return null;
  return await res.json();
}

export async function deleteTask(id: string | number): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  return { success: res.status === 204 };
}

export async function markTaskAsDone(id: string | number): Promise<boolean> {
  const res = await fetch(`${API_BASE}/${id}/done`, { method: 'PATCH' });
  return res.status === 204;
}

// The following are not supported by the backend, so return empty/null.
export async function getDeletedTasks(): Promise<Task[]> {
  return [];
}

export async function softDeleteTask(id: string | number): Promise<Task | null> {
  // No soft delete endpoint, so use hard delete
  const result = await deleteTask(id);
  return result.success ? { id } as Task : null;
}

export async function restoreTask(id: string | number): Promise<Task | null> {
  // No restore endpoint, so return null
  return null;
}
