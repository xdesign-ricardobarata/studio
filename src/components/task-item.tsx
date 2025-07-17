'use client';
import type { Task, TaskStatus } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Edit, Trash2 } from 'lucide-react';
import { updateTaskStatus } from '@/lib/actions';
import { useAuth } from '@/hooks/use-auth';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { TaskFormDialog } from './task-form-dialog';
import { DeleteTaskAlert } from './delete-task-alert';
import { Badge } from '@/components/ui/badge';

const statusConfig: Record<
  TaskStatus,
  { label: string; className: string }
> = {
  open: { label: 'Open', className: 'bg-muted text-muted-foreground' },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-blue-200 text-blue-800',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-200 text-green-800',
  },
};

export function TaskItem({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition();
  const { user } = useAuth();

  const handleStatusChange = (checked: boolean) => {
    if (!user) return;
    const newStatus = checked ? 'completed' : 'open';
    startTransition(() => {
      updateTaskStatus(user.uid, task.id, newStatus);
    });
  };

  const currentStatus = statusConfig[task.status];

  return (
    <div
      className={cn(
        'flex items-center p-4 transition-colors hover:bg-card-foreground/5',
        isPending && 'opacity-60'
      )}
    >
      <Checkbox
        id={`task-${task.id}`}
        checked={task.status === 'completed'}
        onCheckedChange={handleStatusChange}
        aria-label={`Mark task "${task.description}" as ${
          task.status === 'completed' ? 'not completed' : 'completed'
        }`}
        className="mr-4 h-5 w-5"
      />
      <div className="flex-grow">
        <p
          className={cn(
            'font-medium',
            task.status === 'completed' &&
              'text-muted-foreground line-through'
          )}
        >
          {task.description}
        </p>
        <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
          {task.dueDate && (
            <div className="flex items-center">
              <CalendarIcon className="mr-1.5 h-4 w-4" />
              {format(task.dueDate, 'PPP')}
            </div>
          )}
          {task.dueDate && <span className="text-border">|</span>}
           <Badge variant="outline" className={cn(
            task.status === 'in-progress' && 'border-primary/50 bg-primary/10 text-primary',
            task.status === 'completed' && 'border-green-500/50 bg-green-500/10 text-green-700',
           )}>
            {/* {task.status.replace('-', ' ')} */}
          </Badge>
        </div>
      </div>
      <div className="ml-4 flex items-center gap-1">
        <TaskFormDialog
          task={task}
          trigger={
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          }
        />
        <DeleteTaskAlert userId={user?.uid} taskId={task.id}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </DeleteTaskAlert>
      </div>
    </div>
  );
}
