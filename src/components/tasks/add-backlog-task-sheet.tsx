'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusSquare } from 'lucide-react';
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
import type { Task } from '@/lib/types';
import { useTranslation } from '@/hooks/use-translation';

const formSchema = z.object({
  name: z.string().min(1, 'Task name is required.'),
  estimatedEffort: z.string().min(1, 'Effort estimation is required.'),
});

type AddBacklogTaskSheetProps = {
  addBacklogTask: (task: Omit<Task, 'id' | 'isCompleted' | 'dateTime'>) => void;
};

export default function AddBacklogTaskSheet({ addBacklogTask }: AddBacklogTaskSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      estimatedEffort: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addBacklogTask(values);
    form.reset();
    setIsOpen(false);
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <PlusSquare className="mr-2" />
          {t('addBacklogTask')}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('addBacklogTaskTitle')}</SheetTitle>
          <SheetDescription>
            {t('addBacklogTaskDescription')}
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
            <SheetFooter>
              <Button type="submit">{t('saveTask')}</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
