
"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';
import ScrollProgress from '@/components/shared/scroll-progress';
import LandingPage from '@/components/landing/landing-page';
import MainNewsPage from '@/components/main-news/main-news-page';
import ArticlePage from '@/components/article/article-page';
import LiveCoveragePage from '@/components/live-coverage/live-coverage-page';
import OffTheRecordPage from '@/components/off-the-record/off-the-record-page';
import PostSelectionPage from '@/app/dashboard/page';
import NewsEditorPage from '@/app/dashboard/new-story/page';
import EditorialDashboard from '@/app/dashboard/editorial/page';
import EditorialEditor from '@/app/dashboard/editorial/new/page';
import SubscribePage from '@/app/subscribe/page';
import CheckoutPage from '@/app/checkout/page';
import AuthPage from '@/app/auth/page';


export type View = 'landing' | 'main' | 'article' | 'live' | 'off-the-record' | 'post-selection' | 'editor-news' | 'editorial-dashboard' | 'editor-editorial' | 'subscribe' | 'checkout' | 'auth';

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

  const renderContent = () => {
    switch(currentView) {
      case 'landing':
        return <LandingPage key="landing" onViewChange={handleViewChange} />;
      case 'main':
        return <MainNewsPage key="main" onViewChange={handleViewChange} />;
      case 'article':
        return <ArticlePage 
            key="article" 
            onViewChange={handleViewChange} 
            isFocusMode={isFocusMode}
            setFocusMode={setFocusMode}
          />;
      case 'live':
        return <LiveCoveragePage key="live" onViewChange={handleViewChange} />;
      case 'off-the-record':
        return <OffTheRecordPage key="off-the-record" onViewChange={handleViewChange} />;
      case 'post-selection':
        return <PostSelectionPage />;
      case 'editor-news':
        return <NewsEditorPage />;
      case 'editorial-dashboard':
        return <EditorialDashboard />;
      case 'editor-editorial':
        return <EditorialEditor />;
      case 'subscribe':
        return <SubscribePage onViewChange={handleViewChange} />;
      case 'checkout':
        return <CheckoutPage onViewChange={handleViewChange} />;
      case 'auth':
        return <AuthPage onViewChange={handleViewChange} />;
      default:
        return <LandingPage key="landing" onViewChange={handleViewChange} />;
    }
  }

  const showFooter = !['article', 'live', 'off-the-record', 'post-selection', 'editor-news', 'editorial-dashboard', 'editor-editorial', 'subscribe', 'checkout', 'auth'].includes(currentView);

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
        {renderContent()}
      </AnimatePresence>
      
      {showFooter && <Footer />}
    </main>
  );
}
