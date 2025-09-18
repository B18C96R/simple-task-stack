'use client';

import { format } from 'date-fns';
import { Bell, Clock, Trash2, Archive } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '../ui/button';
import { getEndTime } from '@/lib/time-utils';

type TaskItemProps = {
  task: Task;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string, isBacklog: boolean) => void;
  moveTaskToBacklog: (taskId: string) => void;
};

export default function TaskItem({ task, toggleTask, deleteTask, moveTaskToBacklog }: TaskItemProps) {
  const { t } = useTranslation();
  const formattedTime = format(task.dateTime!, 'p');
  const endTime = getEndTime(task.dateTime!, task.estimatedEffort);
  const formattedEndTime = format(endTime, 'p');

  const completeAriaLabel = t('markTaskAs', {
    taskName: task.name,
    status: task.isCompleted ? t('incomplete') : t('complete'),
  });

  return (
    <Card
      className={cn(
        'p-4 flex items-center gap-4 transition-all duration-300 border-l-4',
        task.isCompleted
          ? 'bg-card/50 border-transparent'
          : task.hasOverlap ? 'bg-destructive/20 border-destructive' : 'bg-card hover:shadow-lg border-primary'
      )}
    >
      <div className="flex flex-col items-center justify-center w-28 text-center">
        <div className="font-bold text-lg text-foreground">{formattedTime.split(' ')[0]}</div>
        <div className="text-sm text-muted-foreground">{formattedTime.split(' ')[1]}</div>
        <div className="text-xs text-muted-foreground">to {formattedEndTime}</div>
      </div>
      
      <div className="flex-grow flex items-center gap-4">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.isCompleted}
          onCheckedChange={() => toggleTask(task.id)}
          className="h-6 w-6 rounded-full"
          aria-label={completeAriaLabel}
        />
        <label
          htmlFor={`task-${task.id}`}
          className={cn(
            'flex-grow font-medium text-lg transition-colors cursor-pointer',
            task.isCompleted && 'line-through text-muted-foreground'
          )}
        >
          {task.name}
        </label>
      </div>
      
      <div className="flex items-center gap-2 text-muted-foreground">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-1 text-sm p-1">
                <Clock className="h-4 w-4" />
                <span>{task.estimatedEffort}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('estimatedEffort')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {task.reminderMinutes && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-1 text-sm text-primary p-1">
                  <Bell className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('reminderSet', { minutes: task.reminderMinutes })}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => moveTaskToBacklog(task.id)} aria-label={t('moveToBacklog')}>
                  <Archive className="h-4 w-4 text-muted-foreground/70" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('moveToBacklog')}</p>
              </TooltipContent>
            </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id, false)} aria-label={t('deleteTask')}>
                  <Trash2 className="h-4 w-4 text-destructive/70" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('deleteTask')}</p>
              </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
}
