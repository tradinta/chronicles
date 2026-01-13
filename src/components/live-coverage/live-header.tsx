"use client";

import { motion } from 'framer-motion';

export default function LiveHeader() {
  return (
    <header className="pt-16 pb-12 px-6 md:px-12 border-b border-border">
      <div className="container mx-auto max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-4 text-foreground">
            Major Tsunami Warning Issued for Pacific Coast After 8.2 Magnitude Quake
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Authorities are urging immediate evacuation of coastal areas following a powerful undersea earthquake.
          </p>
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[1px] bg-border"
          />
          <div className="flex items-center space-x-4 mt-6 text-xs font-medium tracking-wider uppercase text-muted-foreground">
            <span>Location: Pacific Rim</span>
            <span>Topic: Natural Disaster</span>
            <span>Ongoing Since: 10:47 AM</span>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
