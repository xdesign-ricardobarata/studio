'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Sparkles, PlusCircle } from 'lucide-react';
import { suggestTasks } from '@/ai/flows/suggest-tasks';
import { createTask } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

function getTimeOfDay(hours: number): 'morning' | 'afternoon' | 'evening' {
  if (hours < 12) return 'morning';
  if (hours < 18) return 'afternoon';
  return 'evening';
}

export function TaskSuggestion() {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSuggesting, startSuggestionTransition] = useTransition();
  const [isAdding, startAddingTransition] = useTransition();
  const { toast } = useToast();

  const handleGetSuggestions = () => {
    setError(null);
    setSuggestions([]);
    startSuggestionTransition(() => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser.');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          const timeOfDay = getTimeOfDay(new Date().getHours());

          try {
            const result = await suggestTasks({
              timeOfDay,
              location: `${latitude}, ${longitude}`,
            });

            if (result.suggestedTasks && result.suggestedTasks.length > 0) {
              setSuggestions(result.suggestedTasks);
            } else {
              setError('Could not get suggestions. Please try again.');
            }
          } catch (err) {
            console.error(err);
            setError('An unexpected error occurred while fetching suggestions.');
          }
        },
        error => {
          console.error('Geolocation error:', error);
          setError(
            'Could not access your location. Please enable location services in your browser settings.'
          );
        }
      );
    });
  };

  const handleAddTask = (description: string) => {
    startAddingTransition(async () => {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('status', 'open');
      await createTask(formData);
      setSuggestions(prev => prev.filter(s => s !== description));
      toast({
        title: 'Task Added!',
        description: `"${description}" has been added to your list.`,
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Sparkles className="mr-2 h-4 w-4 text-accent" />
          Suggest Tasks
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Task Suggestions</DialogTitle>
          <DialogDescription>
            Let AI suggest tasks based on your location and the time of day.
            Your location is private and never stored.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-4 min-h-[12rem] space-y-4">
          {isSuggesting ? (
            <div className="space-y-2 pt-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between rounded-md border bg-card p-3"
                >
                  <span className="flex-grow pr-2">{suggestion}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddTask(suggestion)}
                    disabled={isAdding}
                    className="shrink-0"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
             <div className="flex flex-col items-center justify-center gap-2 text-center text-muted-foreground pt-8">
                <Sparkles className="h-12 w-12"/>
                <p>Click below to get some ideas!</p>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Button
            onClick={handleGetSuggestions}
            disabled={isSuggesting}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isSuggesting
              ? 'Getting suggestions...'
              : 'Get New Suggestions'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
