
'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FileText, Radio, EyeOff, Feather, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const assignmentTypes = [
  {
    icon: FileText,
    title: 'Standard Report',
    description: 'Create a factual, balanced news article with sources, images, and structured content. Ideal for daily news.',
    href: '/dashboard/new-story',
    color: 'text-blue-500',
    bgColor: 'hover:bg-blue-500/5',
    borderColor: 'hover:border-blue-500/30'
  },
  {
    icon: Radio,
    title: 'Live Coverage',
    description: 'Run a real-time feed for breaking news, events, or ongoing situations with timestamped updates.',
    href: '/live',
    color: 'text-red-500',
    bgColor: 'hover:bg-red-500/5',
    borderColor: 'hover:border-red-500/30'
  },
  {
    icon: EyeOff,
    title: 'Off the Record',
    description: 'Publish unverified tips, rumors, and insider gossip. Anonymity and speculation are key features.',
    href: '/off-the-record',
    color: 'text-purple-500',
    bgColor: 'hover:bg-purple-500/5',
    borderColor: 'hover:border-purple-500/30'
  },
  {
    icon: Feather,
    title: 'Editorial / Opinion',
    description: 'Write a perspective piece, analysis, or guest column. Focus on voice, tone, and argumentation.',
    href: '/dashboard/editorial/new',
    color: 'text-indigo-500',
    bgColor: 'hover:bg-indigo-500/5',
    borderColor: 'hover:border-indigo-500/30'
  },
];

export default function NewAssignmentPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background dark:bg-black pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-5xl md:text-6xl mb-4 text-foreground">Start a New Assignment</h1>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
            Choose the type of content you want to create. Each format is tailored with the specific tools you'll need.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignmentTypes.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
            >
              <Link href={item.href}>
                <div className={`group h-full p-8 rounded-2xl border cursor-pointer flex flex-col transition-all bg-secondary/20 dark:bg-stone-900/50 border-border dark:border-stone-800 ${item.bgColor} ${item.borderColor}`}>
                  <div className="flex items-center justify-between mb-4">
                    <item.icon size={24} className={item.color} />
                    <ArrowRight size={20} className="text-muted-foreground transform -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                  <h3 className="font-serif text-2xl mb-2 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground flex-grow">{item.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-20">
            <Link href="/dashboard">
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Back to Dashboard
                </span>
            </Link>
        </div>
      </div>
    </div>
  );
}
