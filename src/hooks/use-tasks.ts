export function useDeletedTasks() {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }
    // Add a more specific check for user.uid
    if (!user || !user.uid) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const tasksCollection = collection(db, 'users', user.uid, 'deletedTasks');
    const q = query(
      tasksCollection,
      where('deletedAt', '!=', null)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newTasks = snapshot.docs.map(fromFirestore);
        setTasks(newTasks);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  return { tasks, loading, error };
}
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { db } from '@/lib/firebase';
import type { Task } from '@/lib/types';
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';

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

export function useTasks() {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }
    // Add a more specific check for user.uid
    if (!user || !user.uid) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const tasksCollection = collection(db, 'users', user.uid, 'tasks');
    const q = query(
      tasksCollection,
      where('deletedAt', '==', null)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newTasks = snapshot.docs.map(fromFirestore);
        setTasks(newTasks);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, authLoading]);

  return { tasks, loading, error };
}
