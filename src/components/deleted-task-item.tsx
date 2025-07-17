'use client';
import type { Task } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Undo2, Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import { restoreTaskAction, deleteTask } from '@/lib/actions';
import { useAuth } from '@/hooks/use-auth';
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

export function DeletedTaskItem({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition();
  const { user } = useAuth();

  const handleRestore = () => {
    if (!user) return;
    startTransition(() => {
      restoreTaskAction(user.uid, task.id);
    });
  };

  const handleDeletePermanent = () => {
    if (!user) return;
    startTransition(() => {
      deleteTask(user.uid, task.id);
    });
  };

  return (
    <div className="flex items-center p-4">
      <div className="flex-grow">
        <p className="font-medium text-muted-foreground line-through">
          {task.description}
        </p>
        <div className="mt-1 text-sm text-muted-foreground">
          {task.deletedAt && (
            <span>
              Deleted {formatDistanceToNow(task.deletedAt, { addSuffix: true })}
            </span>
          )}
        </div>
      </div>
      <div className="ml-4 flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleRestore}
          disabled={isPending}
        >
          <Undo2 className="h-4 w-4" />
          <span className="sr-only">Restore</span>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete permanently</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                task from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeletePermanent}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
