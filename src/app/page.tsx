'use client';

import { useState, useEffect } from 'react';
import type { Task } from '@/lib/types';
import Header from '@/components/layout/header';
import TaskList from '@/components/tasks/task-list';
import Backlog from '@/components/tasks/backlog';
import { useTranslation } from '@/hooks/use-translation';
import { getEndTime } from '@/lib/time-utils';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [backlogTasks, setBacklogTasks] = useState<Task[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setIsClient(true);
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const initialTasks: Task[] = [
      {
        id: '1',
        name: 'Morning coffee & planning',
        dateTime: new Date(todayStart.getTime() + 9 * 60 * 60 * 1000), // 9:00 AM
        estimatedEffort: '15 minutes',
        isCompleted: true,
      },
      {
        id: '2',
        name: 'Team stand-up meeting',
        dateTime: new Date(todayStart.getTime() + 9.5 * 60 * 60 * 1000), // 9:30 AM
        estimatedEffort: '30 minutes',
        isCompleted: false,
      },
      {
        id: '3',
        name: 'Develop new feature for Project X',
        dateTime: new Date(todayStart.getTime() + 10 * 60 * 60 * 1000), // 10:00 AM
        estimatedEffort: '3 hours',
        isCompleted: false,
      },
      {
        id: '4',
        name: 'Lunch break',
        dateTime: new Date(todayStart.getTime() + 13 * 60 * 60 * 1000), // 1:00 PM
        estimatedEffort: '1 hour',
        isCompleted: false,
      },
      {
        id: '5',
        name: 'Code review for team members',
        dateTime: new Date(todayStart.getTime() + 15 * 60 * 60 * 1000), // 3:00 PM
        estimatedEffort: '1.5 hours',
        isCompleted: false,
        reminderMinutes: 15,
      },
    ];
    setTasks(initialTasks.map(addHasOverlap));

    const initialBacklog: Task[] = [
      {
        id: 'backlog-1',
        name: 'Check emails',
        estimatedEffort: '30 minutes',
        isCompleted: false,
      },
      {
        id: 'backlog-2',
        name: 'Plan tomorrow\'s tasks',
        estimatedEffort: '20 minutes',
        isCompleted: false,
      },
    ];
    setBacklogTasks(initialBacklog.map(addHasOverlap));
  }, []);

  useEffect(() => {
    const sortedTasks = [...tasks].sort((a, b) => (a.dateTime?.getTime() ?? 0) - (b.dateTime?.getTime() ?? 0));
    updateTaskOverlaps(sortedTasks, setTasks);
  }, [tasks.length]); 

  const addHasOverlap = (task: Task): Task => ({ ...task, hasOverlap: false });
  
  const updateTaskOverlaps = (currentTasks: Task[], setter: (tasks: Task[]) => void) => {
    const sortedTasks = [...currentTasks].sort((a, b) => (a.dateTime?.getTime() ?? 0) - (b.dateTime?.getTime() ?? 0));
    let hasChanged = false;
    const newTasks = sortedTasks.map((task, index, array) => {
      let newHasOverlap = false;
      if (task.dateTime && index > 0) {
        const prevTask = array[index - 1];
        if (prevTask.dateTime && !prevTask.isCompleted) {
          const prevEndTime = getEndTime(prevTask.dateTime, prevTask.estimatedEffort);
          if (prevEndTime > task.dateTime) {
            newHasOverlap = true;
          }
        }
      }
      if (task.hasOverlap !== newHasOverlap) {
        hasChanged = true;
      }
      return { ...task, hasOverlap: newHasOverlap };
    });
  
    if (hasChanged) {
      setter(newTasks);
    }
  };

  const addTask = (newTask: Omit<Task, 'id' | 'isCompleted'>) => {
    const task: Task = {
      ...newTask,
      id: crypto.randomUUID(),
      isCompleted: false,
      hasOverlap: false
    };
    setTasks(prevTasks => [...prevTasks, task]);
  };

  const addBacklogTask = (newTask: Omit<Task, 'id' | 'isCompleted' | 'dateTime'>) => {
    const task: Task = {
      ...newTask,
      id: crypto.randomUUID(),
      isCompleted: false,
      hasOverlap: false,
    };
    setBacklogTasks((prev) => [...prev, task]);
  };

  const scheduleBacklogTask = (task: Omit<Task, 'id' | 'isCompleted'>, backlogTaskId: string) => {
    addTask(task);
    setBacklogTasks(prev => prev.filter(t => t.id !== backlogTaskId));
  };
  
  const moveTaskToBacklog = (taskId: string) => {
    const taskToMove = tasks.find(t => t.id === taskId);
    if (!taskToMove) return;

    const backlogTask: Task = {
      id: taskToMove.id,
      name: taskToMove.name,
      estimatedEffort: taskToMove.estimatedEffort,
      isCompleted: false, // Always reset completion status
    };
    
    setBacklogTasks(prev => [...prev, backlogTask]);
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }

  const deleteTask = (taskId: string, isBacklog: boolean) => {
    if (isBacklog) {
      setBacklogTasks((prev) => prev.filter((task) => task.id !== taskId));
    } else {
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    }
  };


  const toggleTask = (taskId: string) => {
    const newTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    );
    setTasks(newTasks);
  };
  
  const sortedTasks = [...tasks].sort((a, b) => (a.dateTime?.getTime() ?? 0) - (b.dateTime?.getTime() ?? 0));

  return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header addTask={addTask} addBacklogTask={addBacklogTask} tasks={tasks} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-foreground mb-6">{t('todaysAgenda')}</h2>
              {isClient ? (
                <TaskList tasks={sortedTasks} toggleTask={toggleTask} deleteTask={deleteTask} moveTaskToBacklog={moveTaskToBacklog} />
              ) : (
                <div className="space-y-4">
                  <div className="h-24 bg-muted rounded-lg animate-pulse"></div>
                  <div className="h-24 bg-muted rounded-lg animate-pulse"></div>
                  <div className="h-24 bg-muted rounded-lg animate-pulse"></div>
                </div>
              )}
            </div>
            <div className="md:col-span-1">
              <h2 className="text-2xl font-bold text-foreground mb-6">{t('backlog')}</h2>
              {isClient ? (
                  <Backlog tasks={backlogTasks} deleteTask={deleteTask} scheduleTask={scheduleBacklogTask} />
              ) : (
                <div className="space-y-4">
                  <div className="h-16 bg-muted rounded-lg animate-pulse"></div>
                  <div className="h-16 bg-muted rounded-lg animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
  );
}
