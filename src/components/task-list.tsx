'use client';

import { useState } from 'react';
import type { Task, TaskStatus } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskItem } from '@/components/task-item';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

const TABS: { label: string; value: 'all' | TaskStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
];

export function TaskList({ tasks }: { tasks: Task[] }) {
  const [activeTab, setActiveTab] = useState<'all' | TaskStatus>('all');

  const filteredTasks = tasks.filter(task =>
    activeTab === 'all' ? true : task.status === activeTab
  );

  return (
    <Tabs
      value={activeTab}
      onValueChange={value => setActiveTab(value as 'all' | TaskStatus)}
      className="w-full"
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-headline font-semibold">Your Tasks</h2>
        <TabsList className="w-full sm:w-auto">
          {TABS.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex-1 sm:flex-none">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value={activeTab} className="mt-4">
        <Card>
          <CardContent className="p-0">
            {filteredTasks.length > 0 ? (
              <div className="divide-y divide-border">
                {filteredTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 p-8 text-center text-muted-foreground sm:p-16">
                <ClipboardList className="h-16 w-16" />
                <h3 className="text-xl font-semibold">No Tasks Found</h3>
                <p>There are no tasks with this status. Try creating one!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
