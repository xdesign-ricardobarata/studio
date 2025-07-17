import { db } from '@/lib/firebase';
import type { Task, TaskStatus } from '@/lib/types';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  getDoc,
  writeBatch,
} from 'firebase/firestore';

// Helper to get collection references
const tasksCollection = (userId: string) =>
  collection(db, 'users', userId, 'tasks');

// Helper to convert Firestore doc to Task
const fromFirestore = (doc: any): Task => {
  const data = doc.data();
  return {
    id: doc.id,
    description: data.description,
    status: data.status,
    dueDate: data.dueDate ? (data.dueDate as Timestamp).toDate() : null,
    createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
    deletedAt: data.deletedAt ? (data.deletedAt as Timestamp).toDate() : null,
  };
};

export async function getTasks(userId: string): Promise<Task[]> {
  const q = query(
    tasksCollection(userId),
    where('deletedAt', '==', null)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(fromFirestore);
}

export async function getTopTasks(userId: string, n: number): Promise<Task[]> {
  const q = query(
    tasksCollection(userId),
    where('deletedAt', '==', null)
  );
  const snapshot = await getDocs(q);
  // This is not efficient for large datasets, but works for this example.
  // For production, consider a more sophisticated querying or data modeling approach.
  return snapshot.docs.map(fromFirestore).slice(0, n);
}

export async function getTaskById(
  userId: string,
  id: string
): Promise<Task | undefined> {
  const taskDocRef = doc(db, 'users', userId, 'tasks', id);
  const taskDoc = await getDoc(taskDocRef);
  if (taskDoc.exists()) {
    return fromFirestore(taskDoc);
  }
  return undefined;
}

export async function createTask(
  userId: string,
  data: Omit<Task, 'id' | 'createdAt' | 'deletedAt'>
): Promise<Task> {
  const docRef = await addDoc(tasksCollection(userId), {
    ...data,
    createdAt: serverTimestamp(),
    deletedAt: null,
  });
  return {
    id: docRef.id,
    ...data,
    createdAt: new Date(),
    deletedAt: null,
  };
}

export async function updateTask(
  userId: string,
  id: string,
  data: Partial<Omit<Task, 'id' | 'createdAt' | 'deletedAt'>>
): Promise<Task | null> {
  const taskRef = doc(db, 'users', userId, 'tasks', id);
  await updateDoc(taskRef, data);
  const updatedDoc = await getDoc(taskRef);
  if (updatedDoc.exists()) {
    return fromFirestore(updatedDoc);
  }
  return null;
}

export async function updateTaskStatus(
  userId: string,
  id: string,
  status: TaskStatus
): Promise<void> {
  const taskRef = doc(db, 'users', userId, 'tasks', id);
  await updateDoc(taskRef, { status });
}

export async function deleteTask(
  userId: string,
  id: string
): Promise<{ success: boolean }> {
  const taskRef = doc(db, 'users',userId, 'tasks', id);
  await deleteDoc(taskRef);
  return { success: true };
}

export async function getDeletedTasks(userId: string): Promise<Task[]> {
  const q = query(
    tasksCollection(userId),
    where('deletedAt', '!=', null)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(fromFirestore);
}

export async function softDeleteTask(
  userId: string,
  id: string
): Promise<Task | null> {
  const taskRef = doc(db, 'users', userId, 'tasks', id);
  await updateDoc(taskRef, { deletedAt: serverTimestamp() });
  const updatedDoc = await getDoc(taskRef);
  if (updatedDoc.exists()) {
    return fromFirestore(updatedDoc);
  }
  return null;
}

export async function restoreTask(
  userId: string,
  id: string
): Promise<Task | null> {
  const taskRef = doc(db, 'users', userId, 'tasks', id);
  await updateDoc(taskRef, { deletedAt: null });
  const updatedDoc = await getDoc(taskRef);
  if (updatedDoc.exists()) {
    return fromFirestore(updatedDoc);
  }
  return null;
}
