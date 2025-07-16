import { getTasks } from '@/lib/tasks';
import { TaskList } from '@/components/task-list';
import { TaskFormDialog } from '@/components/task-form-dialog';
import { TaskSuggestion } from '@/components/task-suggestion';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { DummyLoginButton } from '@/components/dummy-login-button';

export default async function Home() {
  const tasks = await getTasks();

  return (
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
            <ThemeToggle />
            <DummyLoginButton />
          </div>
        </div>
      </header>
      <main className="container mx-auto flex-1 p-4 md:p-6">
        <TaskList tasks={tasks} />
      </main>
      <footer className="container mx-auto p-4 text-center text-sm text-muted-foreground md:p-6">
        <p>Stay organized, one task at a time.</p>
      </footer>
    </div>
  );
}
