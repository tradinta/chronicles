
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sun, Moon, ArrowLeft, X, Radio, EyeOff, PenTool } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useUser } from '@/firebase';

type NavbarProps = {
  isDark: boolean;
  toggleTheme: () => void;
  isFocusMode: boolean;
};

export default function Navbar({ isDark, toggleTheme, isFocusMode }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const isAuth = pathname.startsWith('/auth');

  const navClasses = cn(
    "fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out px-6 md:px-12 h-20 flex items-center justify-between",
    isFocusMode ? 'opacity-0 hover:opacity-100' : 'opacity-100',
    (isScrolled || pathname !== '/' || isFocusMode)
      ? 'bg-background/80 backdrop-blur-md border-b border-border' 
      : 'bg-transparent',
    isAuth ? 'bg-transparent' : ''
  );
  
  // Auth Page Navbar (Minimal)
  if (isAuth) {
    return (
      <nav className={navClasses}>
        <div className="flex-shrink-0 cursor-pointer" onClick={() => router.push('/')}>
          <h1 className={`font-serif text-2xl tracking-tighter font-bold text-foreground`}>
            Kihumba<span className="text-primary">.</span>
          </h1>
        </div>
        <button onClick={toggleTheme} className={`text-muted-foreground hover:text-foreground`}>
            {isDark ? <Sun strokeWidth={1.5} size={20} /> : <Moon strokeWidth={1.5} size={20} />}
        </button>
      </nav>
    );
  }

  return (
    <>
      <motion.nav
        className={navClasses}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-4">
          {(pathname !== '/') && !isFocusMode && (
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-full transition-colors text-muted-foreground hover:bg-secondary"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="flex-shrink-0 cursor-pointer group" onClick={() => router.push('/')}>
            <h1 className="font-serif text-2xl tracking-tighter font-bold text-foreground">
              Kihumba<span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">.</span>
            </h1>
          </div>
        </div>

        <div className={cn(
          "hidden md:flex items-center space-x-8 transition-opacity duration-300",
          (pathname.startsWith('/article') || pathname.startsWith('/subscribe') || pathname.startsWith('/checkout') || pathname.startsWith('/dashboard') || pathname.startsWith('/profile')) ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}>
          <Link href="/live" className="relative group cursor-pointer h-full flex items-center">
            <span className="flex items-center text-sm font-medium tracking-wide text-primary group-hover:text-foreground transition-colors duration-300">
              <Radio size={14} className="mr-2 animate-pulse" />
              Live
            </span>
          </Link>
          <Link href="/off-the-record" className="relative group cursor-pointer h-full flex items-center">
            <span className="flex items-center text-sm font-medium tracking-wide text-purple-500/80 dark:text-purple-400/80 group-hover:text-foreground transition-colors duration-300">
              <EyeOff size={14} className="mr-2" />
              Off the Record
            </span>
          </Link>
           <Link href="/subscribe" className="text-sm font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors">
            Subscribe
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          {!user && !isUserLoading && <Link href="/auth"
             className={`hidden md:block text-xs font-bold tracking-wider uppercase transition-colors text-muted-foreground hover:text-foreground`}
           >
             Sign In
           </Link>}
          <Link href="/dashboard/new"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 bg-secondary text-secondary-foreground hover:bg-secondary/80">
             <PenTool size={16} />
             <span className="text-xs font-bold tracking-wider uppercase hidden sm:block">Write</span>
          </Link>
          <button onClick={() => setIsSearchOpen(true)} className="text-muted-foreground hover:text-foreground">
            <Search strokeWidth={1.5} size={20} />
          </button>
          <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
            {isDark ? <Sun strokeWidth={1.5} size={20} /> : <Moon strokeWidth={1.5} size={20} />}
          </button>
          {user && <div className="hidden md:block w-8 h-8 rounded-full overflow-hidden border border-border cursor-pointer">
             <Link href="/profile">
               <Image src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="Profile" width={32} height={32} className="w-full h-full object-cover" />
             </Link>
          </div>}
        </div>
      </motion.nav>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl relative">
               <Input autoFocus type="text" placeholder="Search..." className="w-full bg-transparent border-b-2 border-white/20 text-4xl font-serif text-white h-auto pb-4 focus:outline-none focus:border-white focus-visible:ring-0 focus-visible:ring-offset-0" />
               <button onClick={() => setIsSearchOpen(false)} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"><X size={32} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
