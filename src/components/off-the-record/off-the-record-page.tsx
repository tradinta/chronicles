
"use client";

import { motion } from 'framer-motion';
import type { View } from '@/app/page';
import OffTheRecordHeader from './off-the-record-header';
import SubmitTipForm from './submit-tip-form';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';


type OffTheRecordPageProps = {
  onViewChange: (view: View) => void;
};

export default function OffTheRecordPage({ onViewChange }: OffTheRecordPageProps) {
  return (
    <Dialog>
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

        <DialogTrigger asChild>
          <Button
            variant="default"
            className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center group"
          >
            <Mail size={24} className="group-hover:scale-110 transition-transform" />
            <span className="sr-only">Submit a Tip</span>
          </Button>
        </DialogTrigger>
        
        <SubmitTipForm />

      </motion.div>
    </Dialog>
  );
}
