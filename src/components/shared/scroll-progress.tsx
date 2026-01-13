"use client";

import { motion, useScroll, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

type ScrollProgressProps = {
  isFocusMode: boolean;
};

export default function ScrollProgress({ isFocusMode }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div 
      className={cn(
        "fixed top-0 left-0 right-0 h-1 z-50 origin-left transition-opacity duration-300",
        isFocusMode ? 'opacity-20' : 'opacity-100',
        'bg-primary dark:bg-border'
      )}
      style={{ scaleX }} 
    />
  );
}
