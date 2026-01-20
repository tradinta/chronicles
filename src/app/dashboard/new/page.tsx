
'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Newspaper,
  Radio,
  FileLock,
  Feather,
  ArrowRight,
  CheckCircle2,
  Clock,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore } from '@/firebase';
import { canCreateStandardArticle, canCreateLiveEvent, canCreateOffTheRecord, canCreateEditorial } from '@/firebase/firestore/rbac';

// --- Types ---
type AssignmentType = 'standard' | 'live' | 'secret' | 'editorial';

interface AssignmentOption {
  id: AssignmentType;
  title: string;
  description: string;
  icon: React.ElementType;
  colorVar: string;
  badge: string;
}

// --- Data ---
const options: AssignmentOption[] = [
  {
    id: 'standard',
    title: 'Standard Report',
    description: 'Create a factual, balanced news article with sources, images, and structured content. Ideal for daily news.',
    icon: Newspaper,
    colorVar: 'var(--chart-3)', // Deep Navy/Ink
    badge: 'Factual'
  },
  {
    id: 'live',
    title: 'Live Coverage',
    description: 'Run a real-time feed for breaking news, events, or ongoing situations with timestamped updates.',
    icon: Radio,
    colorVar: 'var(--destructive)', // Red
    badge: 'Breaking'
  },
  {
    id: 'secret',
    title: 'Off the Record',
    description: 'Publish unverified tips, rumors, and insider gossip. Anonymity and speculation are key features.',
    icon: FileLock,
    colorVar: 'var(--chart-4)', // Amber/Yellow
    badge: 'Confidential'
  },
  {
    id: 'editorial',
    title: 'Editorial / Opinion',
    description: 'Write a perspective piece, analysis, or guest column. Focus on voice, tone, and argumentation.',
    icon: Feather,
    colorVar: 'var(--chart-2)', // Teal/Green
    badge: 'Perspective'
  }
];

// --- Components ---

const GrainOverlay = () => (
  <div className="grain-overlay pointer-events-none fixed inset-0 z-50 opacity-40 mix-blend-overlay"></div>
);

const Ticker = () => (
  <div className="fixed bottom-0 left-0 right-0 z-40 h-8 border-t border-border bg-background text-[10px] uppercase tracking-widest text-muted-foreground">
    <div className="ticker-wrap flex h-full items-center">
      <div className="ticker font-sans font-medium">
        <span className="mx-4">System Ready</span>•
        <span className="mx-4">Connection Secure</span>•
        <span className="mx-4">Awaiting Input</span>•
        <span className="mx-4">Deadline Approaching: 23:59 EST</span>•
        <span className="mx-4">New Sources Available</span>•
        <span className="mx-4">Editorial Board Review In Progress</span>•
        <span className="mx-4">System Ready</span>•
        <span className="mx-4">Connection Secure</span>•
        <span className="mx-4">Awaiting Input</span>•
      </div>
    </div>
  </div>
);

export default function NewStoryPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const firestore = useFirestore();
  const [selected, setSelected] = useState<AssignmentType | null>(null);
  const [hovered, setHovered] = useState<AssignmentType | null>(null);
  const [dateStr, setDateStr] = useState('');
  const [userRole, setUserRole] = useState<any>(null);

  useEffect(() => {
    const d = new Date();
    setDateStr(d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase());
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/dashboard/new');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user || !firestore) return;
      try {
        const { getUserRole } = await import('@/firebase/firestore/rbac');
        const role = await getUserRole(firestore, user.uid);
        setUserRole(role || 'subscriber'); // Default to subscriber
      } catch (e) {
        console.error("Error checking role", e);
      }
    };
    fetchRole();
  }, [user, firestore]);


  const handleConfirm = () => {
    if (!selected) return;

    const paths: Record<AssignmentType, string> = {
      standard: '/dashboard/new-story',
      live: '/dashboard/live',
      secret: '/dashboard/off-the-record',
      editorial: '/dashboard/editorial/new',
    };

    const path = paths[selected];
    if (path) {
      router.push(path);
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground relative overflow-hidden flex flex-col">
      {/* Inject Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
        
        :root {
          --font-headline: 'Playfair Display', serif;
          --font-body: 'Inter', sans-serif;
          
          --background: 43 23% 94%;
          --foreground: 0 0% 3.9%;
          --card: 43 23% 94%;
          --card-foreground: 0 0% 3.9%;
          --popover: 43 23% 94%;
          --popover-foreground: 0 0% 3.9%;
          --primary: 25 92% 40%;
          --primary-foreground: 0 0% 98%;
          --secondary: 0 0% 96.1%;
          --secondary-foreground: 0 0% 9%;
          --muted: 0 0% 96.1%;
          --muted-foreground: 0 0% 45.1%;
          --accent: 25 76% 48%;
          --accent-foreground: 0 0% 9%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 0 0% 98%;
          --border: 0 0% 80%; /* Slightly darker for contrast */
          --input: 0 0% 89.8%;
          --ring: 25 92% 40%;
          --chart-1: 12 76% 61%;
          --chart-2: 173 58% 39%;
          --chart-3: 197 37% 24%;
          --chart-4: 43 74% 66%;
          --chart-5: 27 87% 67%;
          --radius: 0.5rem;
        }

        .dark {
          --background: 0 0% 7%;
          --foreground: 0 0% 98%;
          --card: 0 0% 7%;
          --card-foreground: 0 0% 98%;
          --popover: 0 0% 7%;
          --popover-foreground: 0 0% 98%;
          --primary: 25 92% 40%;
          --primary-foreground: 0 0% 98%;
          --secondary: 240 5% 10%;
          --secondary-foreground: 0 0% 98%;
          --muted: 240 5% 10%;
          --muted-foreground: 0 0% 63.9%;
          --accent: 25 76% 48%;
          --accent-foreground: 0 0% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 0 0% 98%;
          --border: 240 5% 15%;
          --input: 240 5% 15%;
          --ring: 25 76% 48%;
        }

        .ticker-wrap {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
        }
        .ticker {
          display: inline-block;
          animation: ticker 30s linear infinite;
        }
        .ticker-wrap:hover .ticker {
          animation-play-state: paused;
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .grain-overlay {
           background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        }
      `}</style>

      <GrainOverlay />
      <Ticker />

      {/* Header Bar */}
      <header className="relative z-10 flex w-full flex-col border-b border-border px-6 py-4 md:px-12">
        <div className="flex w-full items-center justify-between border-b-2 border-foreground pb-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-primary" />
            <span className="font-serif text-sm font-bold tracking-widest uppercase text-primary">The Newsroom</span>
          </div>
          <div className="hidden md:block text-[10px] tracking-[0.2em] font-medium uppercase text-muted-foreground">
            {dateStr} — Vol. CDXX
          </div>
        </div>
        <div className="flex justify-between items-end">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] text-foreground"
          >
            Assignment<br />Protocol
          </motion.h1>
          <div className="hidden lg:block text-right max-w-xs">
            <p className="font-sans text-xs text-muted-foreground leading-relaxed border-l-2 border-primary pl-3">
              Welcome back, <span className="font-bold">{user?.displayName?.split(' ')[0] || 'Editor'}</span>. Select a format to begin.
              <br />
              <Link href="/dashboard" className="text-primary hover:underline">Return to dashboard</Link>.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="relative z-10 flex-1 w-full max-w-[1600px] mx-auto p-6 md:p-12 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 md:mb-12 flex items-center justify-between"
        >
          <h2 className="font-sans text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Select Format Type
          </h2>
          <div className="h-[1px] flex-1 bg-border mx-4"></div>
          <span className="text-xs font-mono text-primary">
            {userRole ? `Role: ${userRole.toUpperCase()}` : 'Verifying Clearance...'}
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
          {options.map((option, index) => {
            // Check permissions
            let isAllowed = false;
            if (option.id === 'standard') isAllowed = canCreateStandardArticle(userRole);
            else if (option.id === 'live') isAllowed = canCreateLiveEvent(userRole);
            else if (option.id === 'secret') isAllowed = canCreateOffTheRecord(userRole);
            else if (option.id === 'editorial') isAllowed = canCreateEditorial(userRole);

            if (!isAllowed) return null; // Or render a locked state

            return (
              <AssignmentCard
                key={option.id}
                option={option}
                index={index}
                isSelected={selected === option.id}
                isHovered={hovered === option.id}
                isDimmed={hovered !== null && hovered !== option.id}
                onClick={() => setSelected(option.id)}
                onHover={(state) => setHovered(state ? option.id : null)}
              />
            );
          })}
        </div>

        {/* Action Bar */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-0 right-0 p-6 md:p-12 z-50 pointer-events-none"
            >
              <div className="pointer-events-auto bg-foreground text-background p-1 pl-6 rounded-full flex items-center shadow-2xl gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Confirm Selection</span>
                  <span className="font-serif font-bold text-lg leading-none pb-1">{options.find(o => o.id === selected)?.title}</span>
                </div>
                <button
                  className="bg-primary hover:bg-accent text-white h-12 w-12 rounded-full flex items-center justify-center transition-colors group"
                  onClick={handleConfirm}
                >
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Sub-Components ---

function AssignmentCard({
  option,
  index,
  isSelected,
  isHovered,
  isDimmed,
  onClick,
  onHover
}: {
  option: AssignmentOption,
  index: number,
  isSelected: boolean,
  isHovered: boolean,
  isDimmed: boolean,
  onClick: () => void,
  onHover: (state: boolean) => void
}) {
  const Icon = option.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isDimmed ? 0.5 : 1,
        y: 0,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: "backOut"
      }}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={`
                group relative cursor-pointer flex flex-col justify-between
                h-full min-h-[340px] p-6 rounded-lg border-2
                transition-all duration-500 ease-out
                ${isSelected
          ? 'bg-foreground text-background border-foreground shadow-2xl ring-2 ring-primary ring-offset-4 ring-offset-background'
          : 'bg-card text-card-foreground border-border hover:border-foreground/50 hover:shadow-xl'
        }
            `}
    >
      {/* Hover Accent Line */}
      <div
        className="absolute top-0 left-0 w-full h-1.5 transition-all duration-300 origin-left transform scale-x-0 group-hover:scale-x-100"
        style={{ backgroundColor: `hsl(${option.colorVar})` }}
      />

      {/* Badge */}
      <div className="flex justify-between items-start mb-8">
        <span
          className={`
                        text-[10px] font-mono uppercase tracking-widest py-1 px-2 rounded-sm border
                        transition-colors duration-300
                        ${isSelected
              ? 'border-background/20 text-background/80'
              : 'border-foreground/10 text-muted-foreground group-hover:border-primary group-hover:text-primary'
            }
                    `}
        >
          {option.id === 'live' && <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />}
          {option.badge}
        </span>

        {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
      </div>

      {/* Icon & Visuals */}
      <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
        <motion.div
          animate={{
            rotate: isHovered ? [0, -5, 5, 0] : 0,
            scale: isHovered ? 1.1 : 1
          }}
          transition={{ duration: 0.5 }}
        >
          <Icon
            strokeWidth={1}
            className={`w-20 h-20 mb-6 transition-colors duration-300 ${isSelected ? 'text-primary' : 'text-foreground/80'}`}
            style={{
              filter: isHovered ? `drop-shadow(0 0 8px hsl(${option.colorVar}))` : 'none'
            }}
          />
        </motion.div>

        {/* Decorative elements based on type */}
        {option.id === 'secret' && (
          <div className={`absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${isSelected ? 'hidden' : ''}`}
            style={{ backgroundImage: 'linear-gradient(45deg, transparent 45%, currentColor 45%, currentColor 55%, transparent 55%)', backgroundSize: '10px 10px' }}
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className={`font-serif text-2xl md:text-3xl font-bold mb-3 leading-tight ${isSelected ? 'text-background' : 'text-foreground'}`}>
          {option.title}
        </h3>
        <p className={`font-sans text-sm leading-relaxed transition-colors duration-300 ${isSelected ? 'text-background/70' : 'text-muted-foreground group-hover:text-foreground'}`}>
          {option.description}
        </p>

        {/* Meta Data on Hover */}
        <div className={`mt-6 pt-4 border-t flex items-center justify-between overflow-hidden transition-all duration-500 ${isHovered || isSelected ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'}`}>
          <div className={`flex items-center gap-2 text-[10px] uppercase tracking-wider ${isSelected ? 'text-background/50 border-background/20' : 'text-muted-foreground border-border'}`}>
            <Clock className="w-3 h-3" />
            <span>Est. 2h</span>
          </div>
          <div className={`flex items-center gap-2 text-[10px] uppercase tracking-wider ${isSelected ? 'text-background/50' : 'text-muted-foreground'}`}>
            <Globe className="w-3 h-3" />
            <span>Global</span>
          </div>
        </div>
      </div>

      {/* Animated Background Gradient on Hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, hsl(${option.colorVar}), transparent)` }}
      />
    </motion.div>
  );
}
