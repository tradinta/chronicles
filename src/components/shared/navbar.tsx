
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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* --- LEFT PILL: BRAND --- */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-6 left-6 z-50 flex items-center px-6 py-3 rounded-full border shadow-sm transition-all duration-300",
          isDark ? "bg-stone-900/80 border-stone-800 text-stone-100 placeholder-stone-500" : "bg-[#FDFBF7]/80 border-stone-200 text-stone-900",
          "backdrop-blur-md"
        )}
      >
        <div className="cursor-pointer group" onClick={() => router.push('/')}>
          <h1 className={cn("font-serif text-xl tracking-tighter font-bold", isDark ? 'text-stone-100' : 'text-stone-900')}>
            The Chronicle<span className={cn("opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-orange-600")}>.</span>
          </h1>
        </div>
      </motion.div>

      {/* --- RIGHT PILL: ACTIONS --- */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className={cn(
          "fixed top-6 right-6 z-50 flex items-center px-5 py-2.5 rounded-full border shadow-sm transition-all duration-300",
          isDark ? "bg-stone-900/80 border-stone-800 text-stone-400" : "bg-[#FDFBF7]/80 border-stone-200 text-stone-600",
          "backdrop-blur-md"
        )}
      >
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Desktop Only Links */}
          <div className="hidden md:flex items-center space-x-6">
            {!user && !isUserLoading && (
              <Link href="/auth" className="text-xs font-bold tracking-wider uppercase hover:text-orange-600 transition-colors">Sign In</Link>
            )}
            {user && (
              <Link href="/dashboard/new" className="flex items-center space-x-2 transition-colors hover:text-orange-600">
                <PenTool size={16} />
                <span className="text-xs font-bold tracking-wider uppercase">Write</span>
              </Link>
            )}
            <button onClick={() => setIsSearchOpen(true)} className="hover:text-orange-600 transition-colors"><Search strokeWidth={1.5} size={20} /></button>
            <button onClick={toggleTheme} className="hover:text-orange-600 transition-colors">
              {isDark ? <Sun strokeWidth={1.5} size={20} /> : <Moon strokeWidth={1.5} size={18} />}
            </button>
            {user && (
              <div onClick={() => router.push('/profile')} className={cn("w-8 h-8 rounded-full overflow-hidden border cursor-pointer", isDark ? 'border-stone-700' : 'border-stone-300')}>
                <Image src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="Profile" width={32} height={32} className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Mobile / Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden items-center group space-x-2 focus:outline-none"
          >
            <span className="text-xs font-bold uppercase tracking-widest group-hover:text-orange-600 transition-colors">Menu</span>
            <div className="space-y-1">
              <span className={cn("block w-6 h-[2px] transition-all", isDark ? "bg-white" : "bg-black", isMobileMenuOpen ? "rotate-45 translate-y-1.5" : "")}></span>
              <span className={cn("block w-4 h-[2px] ml-auto transition-all", isDark ? "bg-white" : "bg-black", isMobileMenuOpen ? "opacity-0" : "")}></span>
              <span className={cn("block w-6 h-[2px] transition-all", isDark ? "bg-white" : "bg-black", isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : "")}></span>
            </div>
          </button>

          {/* Desktop Menu Trigger (Optional, acts as extra categories) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="hidden md:flex items-center space-x-2 pl-4 border-l border-stone-200 dark:border-stone-700 hover:text-orange-600 transition-colors"
          >
            <Radio size={18} className={isMobileMenuOpen ? "animate-pulse text-orange-600" : ""} />
          </button>
        </div>
      </motion.div>

      {/* --- JUMBOTRON MENU (Mobile & Desktop Overlay) --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "fixed inset-0 z-40 flex flex-col pt-32 px-6 md:px-12 pb-12 overflow-y-auto",
              isDark ? "bg-[#121212]" : "bg-[#FDFBF7]"
            )}
          >
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 h-full">

              {/* Left Column: Big Navigation */}
              <div className="flex flex-col justify-center space-y-6">
                {['World', 'Technology', 'Business', 'Culture', 'Science'].map((link, i) => (
                  <motion.div
                    key={link}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="group cursor-pointer"
                  // onClick={() => router.push(`/category/${link.toLowerCase()}`)} 
                  >
                    <span className={cn("text-xs font-bold uppercase tracking-widest mb-1 block transition-colors", isDark ? "text-stone-500 group-hover:text-orange-500" : "text-stone-400 group-hover:text-orange-600")}>0{i + 1}</span>
                    <h2 className={cn("font-serif text-5xl md:text-7xl font-bold transition-colors", isDark ? "text-stone-100 group-hover:text-white" : "text-stone-900 group-hover:text-black")}>
                      {link}
                    </h2>
                  </motion.div>
                ))}
              </div>

              {/* Right Column: Featured / Account (Mobile) */}
              <div className="flex flex-col justify-center md:border-l md:border-stone-200 md:dark:border-stone-800 md:pl-12 space-y-12">

                {/* Mobile Only Account Actions */}
                <div className="md:hidden space-y-6 pb-6 border-b border-stone-200 dark:border-stone-800">
                  {!user ? (
                    <Link href="/auth" className="block text-2xl font-serif font-bold">Sign In</Link>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-200"><Image src={user.photoURL || "/default-avatar.png"} width={48} height={48} alt="User" /></div>
                      <div>
                        <p className="font-bold">My Account</p>
                        <Link href="/dashboard" className="text-sm text-orange-600">Go to Dashboard</Link>
                      </div>
                    </div>
                  )}
                  <div className="flex space-x-6">
                    <button onClick={toggleTheme}>{isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}</button>
                    <button onClick={() => setIsSearchOpen(true)}>Search</button>
                  </div>
                </div>

                {/* Featured Snippet */}
                <div className="hidden md:block">
                  <span className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-4 block">Today's Essential</span>
                  <h3 className={cn("font-serif text-3xl font-bold mb-4", isDark ? "text-stone-100" : "text-stone-900")}>The Quiet Revolution of Analogue.</h3>
                  <p className={cn("text-lg leading-relaxed", isDark ? "text-stone-400" : "text-stone-600")}>Why creators are ditching digital for tangible mediums in 2024.</p>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SEARCH OVERLAY --- */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl relative">
              <Input autoFocus type="text" placeholder="Type to search..." className="w-full bg-transparent border-b-2 border-white/20 text-4xl font-serif text-white h-auto pb-4 focus:outline-none focus:border-orange-500 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-white/20" />
              <button onClick={() => setIsSearchOpen(false)} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"><X size={32} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
