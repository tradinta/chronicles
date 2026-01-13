
"use client";

import { motion } from 'framer-motion';
import type { View } from '@/app/page';
import OffTheRecordHeader from './off-the-record-header';

type OffTheRecordPageProps = {
  onViewChange: (view: View) => void;
};

export default function OffTheRecordPage({ onViewChange }: OffTheRecordPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-zinc-900 text-stone-300"
    >
      <OffTheRecordHeader />
      <div className="container mx-auto px-6 md:px-12 py-12">
        <p className="text-center font-serif italic">The gossip feed will appear here...</p>
      </div>
    </motion.div>
  );
}
