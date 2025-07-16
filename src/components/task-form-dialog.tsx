'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { createTask, updateTask } from '@/lib/actions';
import type { Task } from '@/lib/types';
import { TASK_STATUSES } from '@/lib/types';
import { useState, useTransition, useEffect } from 'react';
import { Textarea } from './ui/textarea';

const formSchema = z.object({
  description: z.string().min(1, { message: 'Description is required.' }),
  dueDate: z.date().nullable(),
  status: z.enum(TASK_STATUSES),
});

type FormValues = z.infer<typeof formSchema>;

interface TaskFormDialogProps {
  task?: Task;
  trigger: React.ReactNode;
}

export function TaskFormDialog({ task, trigger }: TaskFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isEditMode = !!task;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      dueDate: null,
      status: 'open',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        description: task?.description || '',
        dueDate: task?.dueDate || null,
        status: task?.status || 'open',
      });
    }
  }, [open, task, form]);

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('description', values.description);
      if (values.dueDate) {
        formData.append('dueDate', values.dueDate.toISOString());
      }
      formData.append('status', values.status);

      if (isEditMode) {
        await updateTask(task.id, formData);
      } else {
        await createTask(formData);
      }
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Task' : 'Create Task'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Make changes to your task here.'
              : 'Add a new task to your list.'}{' '}
            Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. Finish project report"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TASK_STATUSES.map(status => (
                          <SelectItem
                            key={status}
                            value={status}
                            className="capitalize"
                          >
                            {status.replace('-', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
