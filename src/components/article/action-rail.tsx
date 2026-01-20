
"use client";

import { useState, Dispatch, SetStateAction } from 'react';
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
  articleId: string;
};

export default function ActionRail({ isFocusMode, setFocusMode, articleId }: ActionRailProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  // articleId is now passed via props


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
    // We kept this mock for now as per previous logic, can be improved later
    const articleData = {
      title: 'The Chronicle Article',
      publishDate: new Date().toISOString(),
      imageUrl: ''
    };

    if (isBookmarked) {
      removeBookmark(firestore, user.uid, articleId);
      toast({ title: 'Bookmark removed' });
    } else {
      addBookmark(firestore, user.uid, articleId, articleData);
      toast({ title: 'Article bookmarked!' });
    }
  };

  // Dynamic data handling: In a real app, pass article data as props.
  // For now, we will use a safe fallback or assume the parent component can eventually pass it.
  // This version handles the actions generically.

  const handleShare = async () => {
    const shareData = {
      title: 'The Chronicle',
      text: 'Read this story on The Chronicle',
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({ title: 'Shared successfully' });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link copied to clipboard' });
    }
  };

  const handleAudio = () => {
    // Simple Text-to-Speech toggle stub
    const isSpeaking = window.speechSynthesis.speaking;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      toast({ title: 'Audio stopped' });
    } else {
      const textToRead = document.querySelector('article')?.textContent || "No content found to read.";
      const utterance = new SpeechSynthesisUtterance(textToRead.substring(0, 500) + "..."); // Limit for demo
      window.speechSynthesis.speak(utterance);
      toast({ title: 'Reading article...' });
    }
  };

  const [textSizeIndex, setTextSizeIndex] = useState(0);
  const textSizes = ['text-base', 'text-lg', 'text-xl'];

  const handleTextSize = () => {
    const nextIndex = (textSizeIndex + 1) % textSizes.length;
    setTextSizeIndex(nextIndex);
    // In a real app, you'd lift this state up or use a context to affect the article body text size.
    // For now, we mimic the action.
    document.documentElement.style.setProperty('--article-font-size', nextIndex === 0 ? '1rem' : nextIndex === 1 ? '1.125rem' : '1.25rem');
    toast({ title: `Text size: ${nextIndex === 0 ? 'Normal' : nextIndex === 1 ? 'Large' : 'Extra Large'}` });
  };

  const actions = [
    { icon: Bookmark, label: "Save", action: handleBookmarkToggle, active: isBookmarked, fillClass: isBookmarked ? 'fill-current' : 'fill-none' },
    { icon: Share2, label: "Share", action: handleShare },
    { icon: Type, label: "Text Size", action: handleTextSize },
    { icon: Volume2, label: "Listen", action: handleAudio },
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
