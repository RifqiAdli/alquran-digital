import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Al-Quran Digital - Baca, Dengar, dan Pelajari Al-Quran',
  description: 'Website Al-Quran modern dengan fitur audio dari 5 qari terbaik, bookmark, pencarian, dan pengalaman membaca yang nyaman.',
  keywords: 'Al-Quran, Quran, Islam, Arabic, Indonesian, Audio, Qari, Digital Quran',
  authors: [{ name: 'Al-Quran Digital Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#10b981',
  openGraph: {
    title: 'Al-Quran Digital',
    description: 'Baca, dengar, dan pelajari Al-Quran dengan pengalaman modern',
    type: 'website',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}