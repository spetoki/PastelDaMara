import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';
import { Toaster } from '@/components/ui/toaster';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'PastelPro',
  description: 'Gerencie sua pastelaria com facilidade.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLoggedIn = cookies().has('auth-token');

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        {isLoggedIn ? <AppShell>{children}</AppShell> : children}
        <Toaster />
      </body>
    </html>
  );
}
