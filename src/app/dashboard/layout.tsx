'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Layout,
  PenTool,
  BarChart2,
  Bell,
  Search,
  TrendingUp,
  Users,
  Clock,
  FileText,
  MessageSquare,
  MoreHorizontal,
  ChevronRight,
  Wifi,
  Coffee,
  Sun,
  Moon,
  Plus,
  User as UserIcon,
  LogOut,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import Image from 'next/image';
import Link from 'next/link';

const GrainOverlay = () => (
  <div className="grain-overlay pointer-events-none fixed inset-0 z-50 opacity-30 mix-blend-overlay"></div>
);

function Sidebar({ activeTab, isDarkMode, toggleTheme, onLogout }: any) {
  const router = useRouter();
  const navItems = [
    { id: 'overview', icon: Layout, label: 'Overview', href: '/dashboard' },
    { id: 'stories', icon: FileText, label: 'My Stories', href: '/dashboard/stories' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics', href: '/dashboard/analytics' },
    { id: 'messages', icon: MessageSquare, label: 'Comms', href: '/dashboard/messages' },
    { id: 'research', icon: Search, label: 'Research', href: '/dashboard/research' },
  ];

  return (
    <aside className="w-[80px] md:w-64 bg-background/95 dark:bg-background/80 backdrop-blur-md border-r border-border flex flex-col sticky top-0 h-screen z-30 transition-all duration-300">
      <div className="p-6 flex items-center justify-center md:justify-start gap-3 border-b border-border h-[80px]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-serif font-black text-xl rounded shadow-sm shrink-0">
            K
          </div>
          <span className="font-serif font-bold text-xl tracking-tight hidden md:block">Kihumba.</span>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href || '#'}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200 group relative overflow-hidden ${
              activeTab === item.id
                ? 'bg-foreground text-background shadow-md'
                : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
            }`}
          >
            <item.icon className={`w-5 h-5 relative z-10 ${activeTab === item.id ? 'text-primary' : ''}`} />
            <span className={`font-medium text-sm hidden md:block relative z-10 ${activeTab === item.id ? 'font-bold' : ''}`}>
              {item.label}
            </span>
            {activeTab === item.id && (
              <motion.div
                layoutId="active-bg"
                className="absolute inset-0 bg-foreground"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-md transition-colors"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="font-medium text-sm hidden md:block">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <Link
          href="/dashboard?tab=profile"
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
            activeTab === 'profile'
              ? 'bg-foreground/5 text-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="font-medium text-sm hidden md:block">Profile</span>
        </Link>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm hidden md:block">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dateStr, setDateStr] = useState('');

  const activeTab = pathname.split('/')[2] || 'overview';
  
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    const d = new Date();
    setDateStr(d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase());
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDarkMode;
    setIsDarkMode(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    await auth.signOut();
    router.push('/auth');
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'dark bg-neutral-950' : 'bg-[#f4f1ea]'}`}>
      <div className="bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground relative overflow-hidden flex h-screen w-full">
        <GrainOverlay />
        <Sidebar activeTab={activeTab} isDarkMode={isDarkMode} toggleTheme={toggleTheme} onLogout={handleLogout} />

        <main className="flex-1 h-screen overflow-y-auto relative z-10 flex flex-col bg-background/50 dark:bg-background/80 backdrop-blur-[2px]">
          <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between transition-colors duration-500">
            <div className="flex flex-col">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">Newsroom Connected</span>
              </motion.div>
              <h1 className="font-serif text-2xl font-bold text-foreground">Good Morning, {user?.displayName?.split(' ')[0] || 'Editor'}.</h1>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col items-end border-r border-border pr-6">
                <span className="font-serif italic text-lg leading-none">{dateStr}</span>
                <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Vol. CDXX</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-foreground/5 rounded-full transition-colors relative group">
                  <Bell className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
                </button>
                <div className="h-10 w-10 rounded-full bg-foreground text-background flex items-center justify-center font-serif font-bold text-lg border-2 border-transparent hover:border-primary hover:scale-105 cursor-pointer transition-all shadow-lg overflow-hidden">
                  {user?.photoURL ? (
                    <Image src={user.photoURL} alt={user.displayName || 'User'} width={40} height={40} />
                  ) : (
                    user?.displayName?.charAt(0) || 'E'
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="p-6 md:p-8 max-w-[1800px] w-full mx-auto space-y-6 pb-20">{children}</div>
        </main>
      </div>
    </div>
  );
}
