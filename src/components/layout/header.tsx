'use client';

import React, { Suspense } from 'react';
import AddTaskSheet from '@/components/tasks/add-task-sheet';
import AddBacklogTaskSheet from '@/components/tasks/add-backlog-task-sheet';
import type { Task } from '@/lib/types';
import { Sparkles } from 'lucide-react';
import SettingsDropdown from './settings-dropdown';
import { Button } from '../ui/button';

// Dynamically import the PrioritySuggester
const PrioritySuggester = React.lazy(() => import('@/components/ai/priority-suggester'));

type HeaderProps = {
  addTask: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
  addBacklogTask: (task: Omit<Task, 'id' | 'isCompleted' | 'dateTime'>) => void;
  tasks: Task[];
};

export default function Header({ addTask, addBacklogTask, tasks }: HeaderProps) {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
             <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">DayZen</h1>
          </div>
          <div className="flex items-center gap-2">
            <Suspense fallback={<Button variant="outline" disabled><Sparkles className="mr-2" /> AI Priority</Button>}>
              <PrioritySuggester tasks={tasks} />
            </Suspense>
            <AddBacklogTaskSheet addBacklogTask={addBacklogTask} />
            <AddTaskSheet addTask={addTask} />
            <SettingsDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
