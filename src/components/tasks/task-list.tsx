'use client';

import TaskItem from './task-item';
import type { Task } from '@/lib/types';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

type TaskListProps = {
  tasks: Task[];
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string, isBacklog: boolean) => void;
  moveTaskToBacklog: (taskId: string) => void;
};

export default function TaskList({ tasks, toggleTask, deleteTask, moveTaskToBacklog }: TaskListProps) {
  const { t } = useTranslation();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-card rounded-lg border border-dashed min-h-[200px] flex flex-col justify-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h3 className="mt-4 text-lg font-medium text-foreground">{t('allClear')}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('noTasksToday')}
        </p>
      </div>
    );
  }

  return (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id}>
              <TaskItem task={task} toggleTask={toggleTask} deleteTask={deleteTask} moveTaskToBacklog={moveTaskToBacklog} />
            </div>
          ))}
        </div>
  );
}
