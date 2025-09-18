'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
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
import type { Task } from '@/lib/types';
import { useTranslation } from '@/hooks/use-translation';

const formSchema = z.object({
  name: z.string().min(1, 'Task name is required.'),
  date: z.date({
    required_error: 'A date is required.',
  }),
  time: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      'Invalid time format. Please use HH:MM.'
    ),
  estimatedEffort: z.string().min(1, 'Effort estimation is required.'),
  reminderMinutes: z.coerce.number().int().positive().optional(),
});

type AddTaskSheetProps = {
  addTask: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
  taskToSchedule?: Omit<Task, 'id' | 'isCompleted'>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
};

export default function AddTaskSheet({
  addTask,
  taskToSchedule,
  open,
  onOpenChange,
  children
}: AddTaskSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: taskToSchedule?.name || '',
      time: format(new Date(), 'HH:mm'),
      date: new Date(),
      estimatedEffort: taskToSchedule?.estimatedEffort || '',
    },
  });

  const sheetOpen = open !== undefined ? open : isOpen;
  const setSheetOpen = onOpenChange !== undefined ? onOpenChange : setIsOpen;

  useEffect(() => {
    if (taskToSchedule) {
      form.reset({
        name: taskToSchedule.name,
        estimatedEffort: taskToSchedule.estimatedEffort,
        date: new Date(),
        time: format(new Date(), 'HH:mm'),
        reminderMinutes: taskToSchedule.reminderMinutes,
      });
    }
  }, [taskToSchedule, form, sheetOpen]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    const [hours, minutes] = values.time.split(':').map(Number);
    const dateTime = new Date(values.date);
    dateTime.setHours(hours, minutes, 0, 0);

    addTask({
      name: values.name,
      dateTime,
      estimatedEffort: values.estimatedEffort,
      reminderMinutes: values.reminderMinutes,
    });
    form.reset();
    setSheetOpen(false);
  }

  const trigger = children || (
    <Button>
      <Plus className="mr-2" />
      {t('addTask')}
    </Button>
  );

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{taskToSchedule ? t('scheduleTask') : t('addTaskTitle')}</SheetTitle>
          <SheetDescription>
            {t('addTaskDescription')}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('taskNameLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('taskNamePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>{t('date')}</FormLabel>
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
                              <span>{t('pickADate')}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
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
                name="time"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-[120px]">
                    <FormLabel>{t('time')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="time" className="pl-9" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="estimatedEffort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('estimatedEffortLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('estimatedEffortPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reminderMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('reminderLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t('reminderPlaceholder')}
                      {...field}
                      onChange={(event) => field.onChange(+event.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type="submit">{t('saveTask')}</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
