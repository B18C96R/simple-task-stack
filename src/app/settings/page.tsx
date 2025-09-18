'use client';

import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/app-context';
import { useTranslation } from '@/hooks/use-translation';
import { KeyRound, BrainCircuit, Save } from 'lucide-react';
import Link from 'next/link';

const settingsSchema = z.object({
  google: z.string().optional(),
  openai: z.string().optional(),
  anthropic: z.string().optional(),
  aiProvider: z.enum(['google', 'openai', 'anthropic']),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { apiKeys, setApiKeys, aiProvider, setAiProvider } = useAppContext();
  const { toast } = useToast();
  const { t } = useTranslation();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      ...apiKeys,
      aiProvider,
    },
  });
  
  const watchedProvider = useWatch({
    control,
    name: "aiProvider",
    defaultValue: aiProvider
  });


  const onSubmit = (data: SettingsFormValues) => {
    const { aiProvider: provider, ...keys } = data;
    setApiKeys({
        google: keys.google || '',
        openai: keys.openai || '',
        anthropic: keys.anthropic || ''
    });
    setAiProvider(provider);
    toast({
      title: t('settingsSaved'),
      description: t('settingsSavedDescription'),
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
       <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-foreground">{t('apiSettings')}</h1>
                </div>
                <Link href="/">
                    <Button variant="outline">{t('backToHome')}</Button>
                </Link>
            </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>{t('apiSettingsTitle')}</CardTitle>
                <CardDescription>
                  {t('apiSettingsDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="aiProvider" className="flex items-center gap-2">
                    <BrainCircuit/> {t('aiProviderLabel')}
                  </Label>
                  <Controller
                    name="aiProvider"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('aiProviderPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="google">Gemini (Google)</SelectItem>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {watchedProvider === 'google' && (
                  <div className="space-y-2">
                    <Label htmlFor="google" className="flex items-center gap-2">
                      <KeyRound /> Gemini API Key
                    </Label>
                    <Input
                      id="google"
                      type="password"
                      {...register('google')}
                      placeholder={t('apiKeyPlaceholder')}
                    />
                  </div>
                )}
                {watchedProvider === 'openai' && (
                  <div className="space-y-2">
                    <Label htmlFor="openai" className="flex items-center gap-2">
                       <KeyRound /> OpenAI API Key
                    </Label>
                    <Input
                      id="openai"
                      type="password"
                      {...register('openai')}
                      placeholder={t('apiKeyPlaceholder')}
                    />
                  </div>
                )}
                {watchedProvider === 'anthropic' && (
                  <div className="space-y-2">
                    <Label htmlFor="anthropic" className="flex items-center gap-2">
                      <KeyRound /> Anthropic API Key
                    </Label>
                    <Input
                      id="anthropic"
                      type="password"
                      {...register('anthropic')}
                      placeholder={t('apiKeyPlaceholder')}
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit">
                  <Save /> {t('saveSettings')}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </main>
    </div>
  );
}
