'use client';

import type { Task } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { DeletedTaskItem } from './deleted-task-item';

export function DeletedTaskList({ tasks }: { tasks: Task[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        {tasks.length > 0 ? (
          <div className="divide-y divide-border">
            {tasks.map(task => (
              <DeletedTaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 p-8 text-center text-muted-foreground sm:p-16">
            <Trash2 className="h-16 w-16" />
            <h3 className="text-xl font-semibold">The Bin is Empty</h3>
            <p>Deleted tasks will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
