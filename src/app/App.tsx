
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FirebaseClientProvider } from '@/firebase';
import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';
import ScrollProgress from '@/components/shared/scroll-progress';

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
  const showFooter = !pathname.startsWith('/dashboard') && !pathname.startsWith('/auth') && !pathname.startsWith('/checkout') && !pathname.startsWith('/subscribe');

  return (
    <FirebaseClientProvider>
      <div className="grain-overlay" />
      <ScrollProgress isFocusMode={isFocusMode} />
      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        isFocusMode={isFocusMode}
      />
      <main>
        {children}
      </main>
      {showFooter && <Footer />}
    </FirebaseClientProvider>
  );
}
