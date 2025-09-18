'use client';

import type { Task } from '@/lib/types';
import { Archive, PlusCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Card, CardContent } from '../ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Trash2, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import AddTaskSheet from './add-task-sheet';
import { useState } from 'react';

type BacklogProps = {
  tasks: Task[];
  deleteTask: (taskId: string, isBacklog: boolean) => void;
  scheduleTask: (task: Omit<Task, 'id' | 'isCompleted'>, backlogTaskId: string) => void;
};

export default function Backlog({ tasks, deleteTask, scheduleTask }: BacklogProps) {
  const { t } = useTranslation();
  const [openSheet, setOpenSheet] = useState(false);
  const [taskToSchedule, setTaskToSchedule] = useState<Task | null>(null);

  const handleScheduleClick = (task: Task) => {
    setTaskToSchedule(task);
    setOpenSheet(true);
  };
  
  const handleAddTask = (newTask: Omit<Task, 'id' | 'isCompleted'>) => {
    if (taskToSchedule) {
      scheduleTask(newTask, taskToSchedule.id);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-card rounded-lg border border-dashed">
        <Archive className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium text-foreground">{t('noTasksInBacklog')}</h3>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3 min-h-[100px]">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-muted/50 p-3 rounded-lg flex items-center justify-between gap-2"
            >
              <span className="font-medium text-foreground flex-grow">{task.name}</span>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{task.estimatedEffort}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('estimatedEffort')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleScheduleClick(task)} aria-label={t('scheduleTask')}>
                        <PlusCircle className="h-4 w-4 text-primary/70" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('scheduleTask')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteTask(task.id, true)} aria-label={t('deleteTask')}>
                        <Trash2 className="h-4 w-4 text-destructive/70" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('deleteTask')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      {taskToSchedule && (
        <AddTaskSheet 
          addTask={handleAddTask}
          taskToSchedule={taskToSchedule}
          open={openSheet}
          onOpenChange={setOpenSheet}
        />
      )}
    </Card>
  );
}
