'use server';

import { z } from 'zod';
import {
  createTask as apiCreateTask,
  deleteTask as apiDeleteTask,
  softDeleteTask as apiSoftDeleteTask,
  restoreTask as apiRestoreTask,
  updateTask as apiUpdateTask,
} from '@/lib/tasks';
import { revalidatePath } from 'next/cache';
import { TASK_STATUSES, type TaskStatus } from './types';

const taskSchema = z.object({
  description: z.string().min(1, 'Description is required.'),
  dueDate: z.date().nullable(),
  status: z.enum(TASK_STATUSES),
});

export async function createTask(formData: FormData) {
  const values = {
    description: formData.get('description'),
    dueDate: formData.get('dueDate') ? new Date(formData.get('dueDate') as string) : null,
    status: formData.get('status') ?? 'open',
  };

  const validatedFields = taskSchema.safeParse(values);

  if (!validatedFields.success) {
    // In a real app, you'd want to return this error state to the form
    console.error(validatedFields.error.flatten().fieldErrors);
    return {
      error: 'Invalid data provided.'
    };
  }

  await apiCreateTask(validatedFields.data);
  revalidatePath('/');
}

export async function updateTask(id: string, formData: FormData) {
  const values = {
    description: formData.get('description'),
    dueDate: formData.get('dueDate') ? new Date(formData.get('dueDate') as string) : null,
    status: formData.get('status'),
  };

  const validatedFields = taskSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    return {
      error: 'Invalid data provided.'
    };
  }

  await apiUpdateTask(id, validatedFields.data);
  revalidatePath('/');
  revalidatePath('/bin');
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  await apiUpdateTask(id, { status });
  revalidatePath('/');
}

export async function softDeleteTaskAction(id: string) {
  await apiSoftDeleteTask(id);
  revalidatePath('/');
  revalidatePath('/bin');
}

export async function restoreTaskAction(id: string) {
  await apiRestoreTask(id);
  revalidatePath('/');
  revalidatePath('/bin');
}

export async function deleteTask(id: string) {
  await apiDeleteTask(id);
  revalidatePath('/bin');
}
