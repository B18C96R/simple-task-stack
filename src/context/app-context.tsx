'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ja';
type Theme = 'zenith' | 'dusk' | 'sunrise';
type AiProvider = 'google' | 'openai' | 'anthropic';

interface ApiKeys {
  google: string;
  openai: string;
  anthropic: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  apiKeys: ApiKeys;
  setApiKeys: (keys: ApiKeys) => void;
  aiProvider: AiProvider;
  setAiProvider: (provider: AiProvider) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setThemeState] = useState<Theme>('zenith');
  const [apiKeys, setApiKeysState] = useState<ApiKeys>({ google: '', openai: '', anthropic: '' });
  const [aiProvider, setAiProviderState] = useState<AiProvider>('google');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem('app-language') as Language;
    const storedTheme = localStorage.getItem('app-theme') as Theme;
    const storedKeys = localStorage.getItem('app-api-keys');
    const storedProvider = localStorage.getItem('app-ai-provider') as AiProvider;
    
    if (storedLang) setLanguageState(storedLang);
    if (storedTheme) setThemeState(storedTheme);
    if (storedKeys) {
      const parsedKeys = JSON.parse(storedKeys);
      setApiKeysState({
        google: parsedKeys.google || '',
        openai: parsedKeys.openai || '',
        anthropic: parsedKeys.anthropic || '',
      });
    }
    if (storedProvider) setAiProviderState(storedProvider);

    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      document.documentElement.lang = language;
      localStorage.setItem('app-language', language);
    }
  }, [language, isMounted]);

  useEffect(() => {
    if (isMounted) {
      document.body.classList.remove('theme-zenith', 'theme-dusk', 'theme-sunrise');
      document.body.classList.add(`theme-${theme}`);
      localStorage.setItem('app-theme', theme);
    }
  }, [theme, isMounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };
  
  const setTheme = (theme: Theme) => {
    setThemeState(theme);
  };

  const setApiKeys = (keys: ApiKeys) => {
    setApiKeysState(keys);
    localStorage.setItem('app-api-keys', JSON.stringify(keys));
  };

  const setAiProvider = (provider: AiProvider) => {
    setAiProviderState(provider);
    localStorage.setItem('app-ai-provider', provider);
  };


  if (!isMounted) {
    // Avoid rendering mismatch by returning null on the server.
    return null; 
  }

  return (
    <AppContext.Provider value={{ language, setLanguage, theme, setTheme, apiKeys, setApiKeys, aiProvider, setAiProvider }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
      throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}

export function useLanguage() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within an AppProvider');
  }
  return { language: context.language, setLanguage: context.setLanguage };
}

export function useTheme() {
    const context = useContext(AppContext);
    if (context === undefined) {
      throw new Error('useTheme must be used within an AppProvider');
    }
    return { theme: context.theme, setTheme: context.setTheme };
}
