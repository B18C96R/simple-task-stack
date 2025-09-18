'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Sparkles, Loader2, Info } from 'lucide-react';
import {
  suggestTaskPriorities,
  type TaskPrioritizationOutput,
} from '@/ai/flows/intelligent-task-prioritization';
import type { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { Badge } from '../ui/badge';
import { useAppContext } from '@/context/app-context';
import Link from 'next/link';

type PrioritySuggesterProps = {
  tasks: Task[];
};

export default function PrioritySuggester({ tasks }: PrioritySuggesterProps) {
  const [suggestions, setSuggestions] =
    useState<TaskPrioritizationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { apiKeys, aiProvider } = useAppContext();

  const isApiKeySet = !!apiKeys[aiProvider];

  const handleOpenDialog = () => {
    if (isApiKeySet) {
      setIsOpen(true);
    } else {
      setShowApiKeyPrompt(true);
    }
  };

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setSuggestions(null);

    const uncompletedTasks = tasks.filter(task => !task.isCompleted);

    if (uncompletedTasks.length === 0) {
      toast({
        title: t('noTasksToPrioritize'),
        description: t('noTasksToPrioritizeDescription'),
      });
      setIsLoading(false);
      setIsOpen(false);
      return;
    }


    try {
      const result = await suggestTaskPriorities({
        agenda: uncompletedTasks.map((task) => ({
          taskName: task.name,
          deadline: format(task.dateTime, 'yyyy-MM-dd HH:mm'),
          estimatedEffort: task.estimatedEffort,
          isCompleted: task.isCompleted,
        })),
        provider: aiProvider,
        apiKey: apiKeys[aiProvider],
      });
      setSuggestions(result);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      toast({
        variant: 'destructive',
        title: t('aiErrorTitle'),
        description: t('aiErrorDescription'),
      });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    const lowerPriority = priority.toLowerCase();
    if (lowerPriority.includes('high')) return 'destructive';
    if (lowerPriority.includes('medium')) return 'secondary';
    return 'outline';
  };

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" onClick={handleOpenDialog} disabled={!isApiKeySet}>
            <Sparkles className="mr-2" /> {t('aiPriority')}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('aiPriorityTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('aiPriorityDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : suggestions ? (
            <div className="max-h-[50vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('task')}</TableHead>
                    <TableHead>{t('priority')}</TableHead>
                    <TableHead className="w-[50%]">{t('reasoning')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suggestions.recommendations.map((rec, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{rec.taskName}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadgeVariant(rec.priority.split(' ')[0])}>
                          {t(rec.priority.split(' ')[0].toLowerCase() as any)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{rec.priority.substring(rec.priority.indexOf(' ') + 1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t('getStarted')}</p>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>{t('close')}</AlertDialogCancel>
            <Button onClick={handleGetSuggestions} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('analyzing')}...
                </>
              ) : (
                t('getSuggestions')
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showApiKeyPrompt} onOpenChange={setShowApiKeyPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('apiKeyRequiredTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
            {t('apiKeyRequiredDescription', { provider: aiProvider })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowApiKeyPrompt(false)}>{t('close')}</AlertDialogCancel>
            <Link href="/settings">
              <AlertDialogAction>{t('goToSettings')}</AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
