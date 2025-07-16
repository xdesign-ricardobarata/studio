import { getDeletedTasks } from '@/lib/tasks';
import { DeletedTaskList } from '@/components/deleted-task-list';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { DummyLoginButton } from '@/components/dummy-login-button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function BinPage() {
  const deletedTasks = await getDeletedTasks();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Logo />
            <h1 className="font-headline text-2xl font-bold text-foreground">
              Deleted Tasks
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tasks
              </Link>
            </Button>
            <ThemeToggle />
            <DummyLoginButton />
          </div>
        </div>
      </header>
      <main className="container mx-auto flex-1 p-4 md:p-6">
        <DeletedTaskList tasks={deletedTasks} />
      </main>
      <footer className="container mx-auto p-4 text-center text-sm text-muted-foreground md:p-6">
        <p>Tasks in the bin will be permanently deleted after 30 days.</p>
      </footer>
    </div>
  );
}
