
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
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
  const [isHidden, setIsHidden] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
    setIsScrolled(latest > 20);
  });

  const isAuth = pathname.startsWith('/auth');

  const navClasses = cn(
    "fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out px-6 md:px-12 h-20 flex items-center justify-between",
    isFocusMode ? 'opacity-0 hover:opacity-100' : 'opacity-100',
    (isScrolled || pathname !== '/' || isFocusMode)
      ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm'
      : 'bg-transparent',
    isAuth ? 'bg-transparent' : ''
  );

  // Auth Page Navbar (Minimal)
  if (isAuth) {
    return (
      <nav className={navClasses}>
        <div className="flex-shrink-0 cursor-pointer" onClick={() => router.push('/')}>
          <h1 className="font-serif text-2xl tracking-tighter font-bold text-foreground">
            The Chronicle<span className="text-primary">.</span>
          </h1>
        </div>
        <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
          {isDark ? <Sun strokeWidth={1.5} size={20} /> : <Moon strokeWidth={1.5} size={20} />}
        </button>
      </nav>
    );
  }

  return (
    <>
      <motion.nav
        className={navClasses}
        variants={{
          visible: { y: 0 },
          hidden: { y: -100 },
        }}
        animate={isHidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Left: Brand */}
        <div className="flex items-center">
          <div className="flex-shrink-0 cursor-pointer group" onClick={() => router.push('/')}>
            <h1 className="font-serif text-2xl tracking-tighter font-bold text-foreground">
              The Chronicle<span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">.</span>
            </h1>
          </div>
        </div>

        {/* Center: Navigation Pill */}
        <div className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center",
          "bg-secondary/50 backdrop-blur-md border border-border rounded-full p-1 px-1.5 shadow-sm transition-all duration-300",
          (pathname.startsWith('/article') || pathname.startsWith('/dashboard') || pathname.startsWith('/profile')) ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}>
          <div className="flex items-center gap-1">
            <Link href="/live" className="relative group px-4 py-1.5 rounded-full hover:bg-background transition-all duration-300">
              <span className="flex items-center text-sm font-medium tracking-wide text-foreground/80 group-hover:text-primary transition-colors">
                <Radio size={14} className="mr-2 animate-pulse text-red-500" />
                Live
              </span>
            </Link>
            <Link href="/off-the-record" className="relative group px-4 py-1.5 rounded-full hover:bg-background transition-all duration-300">
              <span className="flex items-center text-sm font-medium tracking-wide text-foreground/80 group-hover:text-purple-500 transition-colors">
                <EyeOff size={14} className="mr-2" />
                Off Record
              </span>
            </Link>
            <Link href="/subscribe" className="relative group px-4 py-1.5 rounded-full hover:bg-background transition-all duration-300">
              <span className="flex items-center text-sm font-medium tracking-wide text-foreground/80 group-hover:text-foreground transition-colors">
                Subscribe
              </span>
            </Link>
          </div>
        </div>

        {/* Right: Actions Pill */}
        <div className="flex items-center gap-4">
          {!user && !isUserLoading && (
            <Link href="/auth" className="hidden md:block text-sm font-bold tracking-wide text-muted-foreground hover:text-foreground transition-colors mr-2">
              Sign In
            </Link>
          )}

          <div className="flex items-center bg-secondary/50 backdrop-blur-md border border-border rounded-full p-1 gap-1 shadow-sm">
            {/* Write Button - Protected */}
            {user && (
              <Link
                href="/dashboard/new"
                className="p-2 rounded-full hover:bg-background text-muted-foreground hover:text-foreground transition-all duration-300 group"
                title="Write a story"
              >
                <PenTool size={18} className="group-hover:text-primary transition-colors" />
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-background text-muted-foreground hover:text-foreground transition-all duration-300"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-full hover:bg-background text-muted-foreground hover:text-foreground transition-all duration-300"
            >
              <Search size={18} />
            </button>

            {/* Avatar */}
            {user && (
              <div className="pl-1 pr-1">
                <Link href="/profile" className="block w-7 h-7 rounded-full overflow-hidden border border-border hover:border-primary transition-colors">
                  <Image
                    src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                    alt="Profile"
                    width={28}
                    height={28}
                    className="w-full h-full object-cover"
                  />
                </Link>
              </div>
            )}
          </div>
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
