'use server';

import { z } from 'zod';
import {
  createTask as apiCreateTask,
  deleteTask as apiDeleteTask,
  softDeleteTask as apiSoftDeleteTask,
  restoreTask as apiRestoreTask,
  updateTask as apiUpdateTask,
  updateTaskStatus as apiUpdateTaskStatus,
} from '@/lib/tasks-fs';
import { revalidatePath } from 'next/cache';
import { TASK_STATUSES, type TaskStatus } from './types';


const taskSchema = z.object({
  description: z.string().min(1, 'Description is required.'),
  dueDate: z.date().nullable(),
  status: z.enum(TASK_STATUSES),
  deletedAt: z.date().nullable().optional(), // Allow deletedAt
});

export async function createTask(userId: string, formData: FormData) {
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

  await apiCreateTask(userId, validatedFields.data);
  revalidatePath('/');
}

export async function updateTask(userId: string, id: string, formData: FormData) {
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

  await apiUpdateTask(userId, id, validatedFields.data);
  revalidatePath('/');
  revalidatePath('/bin');
}

export async function updateTaskStatus(userId: string, id: string, status: TaskStatus) {
  await apiUpdateTaskStatus(userId, id, status);
  revalidatePath('/');
}

export async function softDeleteTaskAction(userId: string, id: string) {
  await apiSoftDeleteTask(userId, id);
  revalidatePath('/');
  revalidatePath('/bin');
}

export async function restoreTaskAction(userId: string, id: string) {
  await apiRestoreTask(userId, id);
  revalidatePath('/');
  revalidatePath('/bin');
}

export async function deleteTask(userId: string, id: string) {
  await apiDeleteTask(userId, id);
  revalidatePath('/bin');
}
