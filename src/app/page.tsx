"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';
import ScrollProgress from '@/components/shared/scroll-progress';
import LandingPage from '@/components/landing/landing-page';
import MainNewsPage from '@/components/main-news/main-news-page';
import ArticlePage from '@/components/article/article-page';

export type View = 'landing' | 'main' | 'article';

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [currentView, setCurrentView] = useState<View>('landing');
  const [isFocusMode, setFocusMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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
  
  const handleViewChange = (view: View) => {
    window.scrollTo(0, 0);
    setCurrentView(view);
    if(view !== 'article') {
      setFocusMode(false);
    }
  };

  if (!isMounted) {
    return null;
  }
  
  const isArticleInFocus = currentView === 'article' && isFocusMode;

  return (
    <main>
      <ScrollProgress isFocusMode={isArticleInFocus} />
      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        onViewChange={handleViewChange}
        currentView={currentView}
        isFocusMode={isArticleInFocus}
      />
      
      <AnimatePresence mode="wait">
        {currentView === 'landing' ? (
          <LandingPage key="landing" onViewChange={handleViewChange} />
        ) : currentView === 'main' ? (
          <MainNewsPage key="main" onViewChange={handleViewChange} />
        ) : (
          <ArticlePage 
            key="article" 
            onViewChange={handleViewChange} 
            isFocusMode={isFocusMode}
            setFocusMode={setFocusMode}
          />
        )}
      </AnimatePresence>
      
      {currentView !== 'article' && <Footer />}
    </main>
  );
}
