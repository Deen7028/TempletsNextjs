import React from 'react';
import { MainAppShell, ThemeRegistry } from '@/layout';
import './globals.css';

import { BlockUIOverlay } from '@/shared/components/BlockUI';
import { PopupContainer } from '@/shared/components/Popup/pate';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <title>Starter Template | Clean Architecture</title>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <ThemeRegistry>
          <MainAppShell>
            {children}
          </MainAppShell>
          <BlockUIOverlay />
          <PopupContainer />
        </ThemeRegistry>
      </body>
    </html>
  );
}
