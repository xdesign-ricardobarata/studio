'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from './ui/skeleton';

const TaskList = dynamic(
  () => import('@/components/task-list').then(mod => mod.TaskList),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    ),
  }
);

export function ClientTaskList() {
  return <TaskList />;
}
