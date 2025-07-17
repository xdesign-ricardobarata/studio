import { db } from '@/lib/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';

/**
 * This migration script iterates through all tasks for a given user
 * and adds `deletedAt: null` to any document that is missing the field.
 * This is necessary to ensure all documents have the fields required by
 * Firestore queries and security rules.
 * @param userId The ID of the user whose tasks need to be migrated.
 * @returns An object containing the number of tasks scanned and migrated.
 */
export async function migrateTasks(userId: string) {
  if (!userId) {
    throw new Error('User ID is required to run the migration.');
  }

  const tasksCollectionRef = collection(db, 'users', userId, 'tasks');
  const snapshot = await getDocs(tasksCollectionRef);

  const batch = writeBatch(db);
  let migratedCount = 0;

  snapshot.docs.forEach((document) => {
    const data = document.data();
    // Check if the deletedAt field is missing (it can be null, but not undefined)
    if (data.deletedAt === undefined) {
      const taskDocRef = doc(db, 'users', userId, 'tasks', document.id);
      batch.update(taskDocRef, { deletedAt: null });
      migratedCount++;
    }
  });

  if (migratedCount > 0) {
    await batch.commit();
  }

  return {
    scanned: snapshot.size,
    migrated: migratedCount,
  };
}
