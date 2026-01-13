
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FirebaseClientProvider } from '@/firebase';
import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';
import ScrollProgress from '@/components/shared/scroll-progress';
import BreakingNewsStrip from '@/components/shared/breaking-news-strip';
import { cn } from '@/lib/utils';

export default function App({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }, [isDark, isMounted]);

  const toggleTheme = () => setIsDark(prev => !prev);
  
  if (!isMounted) {
    return null;
  }
  
  const isFocusMode = pathname.startsWith('/article');
  const noHeaderFooterRoutes = ['/auth', '/dashboard', '/checkout', '/subscribe'];
  const showHeader = !noHeaderFooterRoutes.some(p => pathname.startsWith(p));
  const showFooter = showHeader && !pathname.startsWith('/article');
  const showBreakingNews = showHeader;

  return (
    <FirebaseClientProvider>
      <div className="grain-overlay" />
      <ScrollProgress isFocusMode={isFocusMode} />
      {showHeader && <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        isFocusMode={isFocusMode}
      />}
      {showBreakingNews && <BreakingNewsStrip />}
      <main className={cn(showBreakingNews && 'pt-[44px]')}>
        {children}
      </main>
      {showFooter && <Footer />}
    </FirebaseClientProvider>
  );
}
