import dynamic from 'next/dynamic';
import { TaskFormDialog } from '@/components/task-form-dialog';
import { TaskSuggestion } from '@/components/task-suggestion';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { AuthButton } from '@/components/dummy-login-button';
import { Suspense } from 'react';
import { TopTasksFilter } from '@/components/top-tasks-filter';
import Link from 'next/link';
import { ClientTaskList } from '@/components/client-task-list';
import { AuthProvider } from '@/hooks/use-auth';


export default function Home() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
        <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Logo />
              <h1 className="font-headline text-2xl font-bold text-foreground">
                TaskJuggler
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <TaskSuggestion />
              <TaskFormDialog
                trigger={
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Task
                  </Button>
                }
              />
              <Button variant="outline" size="icon" asChild>
                <Link href="/bin">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Deleted Tasks</span>
                </Link>
              </Button>
              <ThemeToggle />
              <AuthButton />
            </div>
          </div>
        </header>
        <main className="container mx-auto flex-1 p-4 md:p-6">
          <div className="mb-4 flex justify-end">
            <Suspense fallback={<div>Loading...</div>}>
              <TopTasksFilter />
            </Suspense>
          </div>
          <ClientTaskList />
        </main>
      </div>
    </AuthProvider>
  );
}
