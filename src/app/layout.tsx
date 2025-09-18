import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AppProvider } from '@/context/app-context';

export const metadata: Metadata = {
  title: 'DayZen',
  description: 'A daily planner and task management app designed to organize your schedule and boost productivity.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased h-full">
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
