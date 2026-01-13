
"use client";

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { breakingNews } from '@/lib/data';

export default function BreakingNews() {
  const router = useRouter();

  return (
    <section className="py-12 bg-primary/5 dark:bg-primary/10 border-y border-primary/10 dark:border-primary/20">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-center md:space-x-8"
        >
          <div className="flex-shrink-0 mb-6 md:mb-0 text-center md:text-left">
            <div className="inline-flex items-center space-x-3 text-primary">
              <Zap className="animate-pulse" />
              <h2 className="text-sm font-bold tracking-[0.2em] uppercase">
                Breaking News
              </h2>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {breakingNews.map((story) => (
              <div
                key={story.id}
                onClick={() => router.push('/live')}
                className="group cursor-pointer flex items-baseline"
              >
                <span className="text-xs font-mono mr-4 opacity-50 text-muted-foreground">{story.time}</span>
                <p className="font-serif text-lg leading-tight text-foreground group-hover:underline">
                  {story.title}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
