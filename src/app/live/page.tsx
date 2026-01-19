'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Calendar, Clock, ChevronRight, Pause } from 'lucide-react';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import { getLiveEvents, LiveEvent } from '@/firebase/firestore/live';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function LiveIndexPage() {
  const firestore = useFirestore();
  const [activeEvents, setActiveEvents] = useState<LiveEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<LiveEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (firestore) {
      const fetchData = async () => {
        setIsLoading(true);
        const allEvents = await getLiveEvents(firestore);
        setActiveEvents(allEvents.filter(e => e.status === 'live'));
        setPastEvents(allEvents.filter(e => e.status !== 'live'));
        setIsLoading(false);
      };
      fetchData();
    }
  }, [firestore]);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-zinc-950 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent"></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-600 text-red-500 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            Live Coverage
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-serif font-black mb-6 tracking-tight">
            Breaking News, <br /> As It Happens.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-zinc-400 max-w-2xl mx-auto font-serif italic">
            Follow our journalists on the ground for real-time updates on the stories that matter.
          </motion.p>
        </div>
      </section>

      {/* Active Events */}
      <section className="container mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 gap-8">
          {isLoading && <div className="text-white text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>}

          {activeEvents.map((event) => (
            <Link href={`/live/${event.slug}`} key={event.id}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border-l-4 border-red-600 shadow-xl rounded-r-xl overflow-hidden hover:shadow-2xl transition-all group">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
                    {event.coverImage && <Image src={event.coverImage} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest rounded shadow-sm animate-pulse">
                      Live Now
                    </div>
                  </div>
                  <div className="p-8 md:w-2/3 flex flex-col justify-center">
                    <h2 className="text-3xl font-serif font-bold mb-3 highlight-red">{event.title}</h2>
                    <p className="text-muted-foreground text-lg mb-6 line-clamp-2">{event.summary}</p>
                    <div className="flex items-center gap-2 text-red-600 font-bold uppercase tracking-widest text-sm group-hover:gap-4 transition-all">
                      Join Broadcast <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}

          {!isLoading && activeEvents.length === 0 && (
            <div className="bg-card border border-border p-8 rounded-xl text-center shadow-lg">
              <Radio className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No Active Broadcasts</h3>
              <p className="text-muted-foreground">Check back later for breaking news coverage.</p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className="container mx-auto px-6 mt-24">
        <h3 className="font-serif text-2xl font-bold mb-8 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" /> Past Coverage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pastEvents.map((event) => (
            <Link href={`/live/${event.slug}`} key={event.id} className="group">
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
                {event.coverImage && <Image src={event.coverImage} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur text-white px-4 py-2 rounded-full border border-white/20 text-sm font-bold">View Archive</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">Ended</span>
                <span className="text-[10px] text-muted-foreground">{event.startTime?.toDate?.().toLocaleDateString()}</span>
              </div>
              <h4 className="font-serif text-lg font-bold group-hover:text-primary transition-colors leading-tight mb-2">{event.title}</h4>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

