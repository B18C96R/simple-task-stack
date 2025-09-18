'use client';

import { useTheme } from '@/context/app-context';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages, Palette, Settings, Wrench } from 'lucide-react';
import Link from 'next/link';

export default function SettingsDropdown() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings />
          <span className="sr-only">{t('settings')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <Languages /> {t('language')}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(value as 'en' | 'ja')}>
          <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ja">日本語</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <Palette /> {t('theme')}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as 'zenith' | 'dusk' | 'sunrise')}>
          <DropdownMenuRadioItem value="zenith">{t('themeZenith')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dusk">{t('themeDusk')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="sunrise">{t('themeSunrise')}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <Link href="/settings">
          <DropdownMenuItem>
              <Wrench />
              <span>{t('apiSettings')}</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
