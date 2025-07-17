'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { softDeleteTaskAction } from '@/lib/actions';
import { useTransition } from 'react';
import { Button } from './ui/button';


export function DeleteTaskAlert({
  userId,
  taskId,
  children,
}: {
  userId?: string;
  taskId: string;
  children: React.ReactNode;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!userId) return;
    startTransition(() => {
      softDeleteTaskAction(userId, taskId);
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will move the task to the bin. You can restore it later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? 'Moving to bin...' : 'Move to Bin'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
