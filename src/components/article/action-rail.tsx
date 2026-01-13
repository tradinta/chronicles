
"use client";

import type { Dispatch, SetStateAction } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Share2, Type, Volume2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useFirestore } from '@/firebase';
import { addBookmark, removeBookmark } from '@/firebase/firestore/bookmarks';
import { useToast } from '@/hooks/use-toast';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';

type ActionRailProps = {
  isFocusMode: boolean;
  setFocusMode: Dispatch<SetStateAction<boolean>>;
};

export default function ActionRail({ isFocusMode, setFocusMode }: ActionRailProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const articleId = '1'; // This should be dynamic based on the article

  const bookmarkRef = useMemo(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid, 'bookmarks', articleId);
  }, [firestore, user]);

  const { data: bookmark, isLoading: isLoadingBookmark } = useDoc(bookmarkRef);
  const isBookmarked = !!bookmark;

  const handleBookmarkToggle = () => {
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'You must be signed in to bookmark articles.' });
      return;
    }

    // A mock article object - in a real app this would come from the page props
    const articleData = { 
      title: 'The Ethics of Synthetic Memory', 
      publishDate: new Date().toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop'
    };

    if (isBookmarked) {
      removeBookmark(firestore, user.uid, articleId);
      toast({ title: 'Bookmark removed' });
    } else {
      addBookmark(firestore, user.uid, articleId, articleData);
      toast({ title: 'Article bookmarked!' });
    }
  };

  const actions = [
    { icon: Bookmark, label: "Save", action: handleBookmarkToggle, active: isBookmarked, fillClass: isBookmarked ? 'fill-current' : 'fill-none' },
    { icon: Share2, label: "Share" },
    { icon: Type, label: "Text Size" },
    { icon: Volume2, label: "Listen" },
    { icon: Minimize2, label: "Focus", action: () => setFocusMode(!isFocusMode), active: isFocusMode }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
      className={cn(
        "hidden lg:flex fixed right-12 bottom-12 flex-col space-y-4 z-40 transition-opacity duration-500",
        isFocusMode ? 'opacity-20 hover:opacity-100' : 'opacity-100'
      )}
    >
      {actions.map((Item, idx) => (
        <button
          key={idx}
          onClick={Item.action}
          disabled={Item.label === 'Save' && isLoadingBookmark}
          className={cn(`p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 relative group`,
            Item.active
              ? 'bg-orange-900/50 text-orange-200 dark:bg-accent dark:text-accent-foreground'
              : 'bg-white text-muted-foreground hover:text-foreground dark:bg-secondary dark:text-muted-foreground dark:hover:text-foreground'
            )}
        >
          <Item.icon size={20} strokeWidth={1.5} className={Item.fillClass} />
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-secondary text-secondary-foreground shadow-sm">
            {Item.label}
          </span>
        </button>
      ))}
    </motion.div>
  );
}
