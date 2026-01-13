"use client";

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

type InfiniteLoaderProps = {
  loadMore: () => void;
};

export default function InfiniteLoader({ loadMore }: InfiniteLoaderProps) {
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && !loading) {
      setLoading(true);
      setTimeout(() => {
        loadMore();
        setLoading(false);
      }, 1500);
    }
  }, [isInView, loading, loadMore]);

  return (
    <div ref={ref} className="py-24 text-center">
      <p className="font-serif italic text-lg animate-pulse text-muted-foreground">
        Unfolding more stories...
      </p>
    </div>
  );
}
