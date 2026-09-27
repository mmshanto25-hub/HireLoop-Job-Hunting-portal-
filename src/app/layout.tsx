import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/navbar/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HireLoop — Modern High-Velocity Job Hunting & Recruitment Platform',
  description:
    'HireLoop connects high-caliber job seekers with category-defining startups and enterprise employers. Explore verified tech, design, AI, and executive roles.',
  keywords: [
    'Job Board',
    'Tech Careers',
    'Software Engineer Jobs',
    'AI Jobs',
    'Recruiting SaaS',
    'Hiring Platform',
    'HireLoop',
  ],
  openGraph: {
    title: 'HireLoop — Next-Gen Job Hunting & Recruitment',
    description: 'Find the work that moves you forward. Connect with top tier engineering & product teams.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950`}
      >
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
