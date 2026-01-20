
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Type, Quote, Heading2, AlertCircle, Zap,
  ImagePlus,
  Layout, Book, Check, BrainCircuit, AlignLeft,
  Minimize2,
  Sparkles,
  History,
  Save,
  Clock,
  Server,
  Laptop,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { createArticle, getArticleById, updateArticle } from '@/firebase/firestore/articles';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

import EditorSidebar from '@/components/editor/EditorSidebar';
import EditorBlock from '@/components/editor/EditorBlock';
import { EntryModal } from '@/components/editor/EntryModal';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { createSlug } from '@/lib/utils';
import { PhotoUploader } from '@/components/shared/photo-uploader';

const AUTOSAVE_INTERVAL = 10000; // 10 seconds
const LOCAL_STORAGE_KEY = 'kihumba_editor_autosave';

const NewsEditorPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/dashboard/new-story');
    }
  }, [user, isLoading, router]);


  const articleId = searchParams.get('edit');
  const [isEditMode, setIsEditMode] = useState(!!articleId);
  const [isLoadingArticle, setIsLoadingArticle] = useState(isEditMode);

  const [showEntryModal, setShowEntryModal] = useState(!isEditMode);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);

  const [headline, setHeadline] = useState('');
  const [subheading, setSubheading] = useState('');
  const [slug, setSlug] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [articleFormat, setArticleFormat] = useState('');
  const [author, setAuthor] = useState<string | null>(null);
  const [authorError, setAuthorError] = useState<string | null>(null);
  const [showProfileUpdateModal, setShowProfileUpdateModal] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.displayName) {
        setAuthor(user.displayName);
        setAuthorError(null);
      } else {
        setAuthor(null);
        setAuthorError("Your user profile is missing a display name.");
        setShowProfileUpdateModal(true);
      }
    }
  }, [user]);

  useEffect(() => {
    setSlug(createSlug(headline));
  }, [headline]);

  const [blocks, setBlocks] = useState([
    { id: Date.now(), type: 'paragraph', content: "" },
  ]);

  const parseContentToBlocks = (htmlContent: string) => {
    if (!htmlContent) return [{ id: Date.now(), type: 'paragraph', content: "" }];

    const el = document.createElement('div');
    el.innerHTML = htmlContent;

    const parsedBlocks = Array.from(el.children).map((node, index) => {
      const id = Date.now() + index;
      if (node.tagName === 'H2') {
        return { id, type: 'h2', content: node.textContent || "" };
      }
      if (node.tagName === 'BLOCKQUOTE') {
        return {
          id,
          type: 'quote',
          content: node.querySelector('p')?.textContent || "",
          source: node.querySelector('footer')?.textContent || ""
        };
      }
      if (node.tagName === 'FIGURE') {
        return {
          id,
          type: 'image',
          imageUrl: node.querySelector('img')?.src || '',
          caption: node.querySelector('figcaption')?.textContent || '',
          content: ''
        };
      }
      return { id, type: 'paragraph', content: node.textContent || "" };
    });
    return parsedBlocks.length > 0 ? parsedBlocks : [{ id: Date.now(), type: 'paragraph', content: "" }];
  }

  useEffect(() => {
    if (isEditMode && articleId && firestore) {
      const fetchArticle = async () => {
        setIsLoadingArticle(true);
        try {
          const article = await getArticleById(firestore, articleId);
          if (article) {
            setHeadline(article.title);
            setSubheading(article.summary);
            setSlug(article.slug);
            setCoverImageUrl(article.imageUrl || '');
            setCategory(article.category);
            setTags(article.tags || []);
            setBlocks(parseContentToBlocks(article.content));
            // Assuming format and breaking status might be stored in the article doc in a real scenario
            // setArticleFormat(article.format);
            // setIsBreaking(article.isBreaking);
          } else {
            toast({ variant: 'destructive', title: 'Article not found' });
            router.push('/dashboard/stories');
          }
        } catch (error) {
          console.error("Error fetching article:", error);
          toast({ variant: 'destructive', title: 'Failed to load article' });
        } finally {
          setIsLoadingArticle(false);
        }
      };
      fetchArticle();
    }
  }, [isEditMode, articleId, firestore, router, toast]);

  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [localDrafts, setLocalDrafts] = useState<any[]>([]);

  useEffect(() => {
    const savedDrafts = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedDrafts) {
      setLocalDrafts(JSON.parse(savedDrafts));
    }
  }, []);

  const getArticleState = useCallback(() => {
    return {
      headline,
      subheading,
      slug,
      coverImageUrl,
      tags,
      category,
      articleFormat,
      blocks,
      timestamp: new Date().toISOString(),
    };
  }, [headline, subheading, slug, coverImageUrl, tags, category, articleFormat, blocks]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (headline || blocks.some(b => b.content)) {
        const currentState = getArticleState();
        setLocalDrafts(prev => {
          const newDrafts = [currentState, ...prev].slice(0, 10);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newDrafts));
          return newDrafts;
        });
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(timer);
  }, [getArticleState, headline, blocks]);


  const addBlock = (type: string) => {
    setBlocks([...blocks, { id: Date.now(), type, content: '' }]);
  };

  const updateBlock = (id: number, updatedValues: object) => {
    setBlocks(blocks.map(block =>
      block.id === id ? { ...block, ...updatedValues } : block
    ));
  };

  const handleSaveDraft = async () => {
    if (!firestore || !user) {
      toast({ variant: 'destructive', title: 'Cannot Save Draft', description: 'You must be signed in.' });
      return;
    }
    if (!headline) {
      toast({ variant: 'destructive', title: 'Headline Required', description: 'Please add a headline before saving.' });
      return;
    }

    setIsSaving(true);
    try {
      const draftData = getArticleState();
      await addDoc(collection(firestore, `users/${user.uid}/drafts`), {
        ...draftData,
        savedAt: serverTimestamp(),
      });
      toast({ title: 'Draft Saved!', description: 'Your draft has been saved to the cloud.' });
    } catch (error) {
      console.error("Draft saving error:", error);
      toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save draft.' });
    } finally {
      setIsSaving(false);
    }
  };

  const restoreDraft = (draft: any) => {
    setHeadline(draft.headline || '');
    setSubheading(draft.subheading || '');
    setSlug(draft.slug || '');
    setCoverImageUrl(draft.coverImageUrl || '');
    setTags(draft.tags || []);
    setCategory(draft.category || '');
    setArticleFormat(draft.articleFormat || '');
    setBlocks(draft.blocks || [{ id: Date.now(), type: 'paragraph', content: "" }]);
    toast({ title: 'Draft Restored', description: `Loaded version from ${new Date(draft.timestamp).toLocaleTimeString()}` });
  };

  const handlePublish = async () => {
    if (!headline) {
      toast({ variant: 'destructive', title: 'Headline is required' });
      return;
    }
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'Authentication error', description: 'You must be signed in to publish.' });
      return;
    }
    if (!author) {
      setAuthorError("Author name is missing. Please select an author.");
      if (!user.displayName) {
        setShowProfileUpdateModal(true);
      }
      return;
    }

    setIsPublishing(true);

    const content = blocks.map(block => {
      switch (block.type) {
        case 'h2': return `<h2>${block.content}</h2>`;
        case 'quote': return `<blockquote><p>${block.content}</p><footer>${(block as any).source || ''}</footer></blockquote>`;
        case 'paragraph': return `<p>${block.content}</p>`;
        case 'image': return `<figure><img src="${(block as any).imageUrl || ''}" alt="${(block as any).caption || ''}" /><figcaption>${(block as any).caption || ''}</figcaption></figure>`
        default: return '';
      }
    }).join('');

    const articleData = {
      title: headline,
      summary: subheading,
      slug: slug || createSlug(headline),
      content,
      imageUrl: coverImageUrl,
      authorId: user.uid,
      category: category,
      tags: tags
    };

    try {
      if (isEditMode && articleId) {
        await updateArticle(firestore, articleId, articleData);
        toast({
          title: "Article Updated!",
          description: `${headline} has been successfully updated.`
        });
      } else {
        await createArticle(firestore, articleData);
        toast({
          title: "Article Published!",
          description: `${headline} is now live.`
        });
      }
      router.push('/dashboard/stories');
    } catch (error) {
      console.error("Publishing error:", error);
      toast({
        variant: 'destructive',
        title: 'Publishing Failed',
        description: 'Could not save the article to the database.',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  if (isLoadingArticle) {
    return (
      <div className="flex h-screen items-center justify-center bg-stone-50 dark:bg-stone-900">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading article...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-stone-50 dark:bg-stone-900">
      <EntryModal
        show={showEntryModal}
        setShow={setShowEntryModal}
        isDark={isDark}
        setCategory={setCategory}
        setArticleFormat={setArticleFormat}
      />

      <Dialog open={showProfileUpdateModal} onOpenChange={setShowProfileUpdateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Your Profile</DialogTitle>
            <DialogDescription>
              {authorError} To publish articles, you must set a display name for your author profile.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button onClick={() => router.push('/dashboard?tab=profile')}>Go to Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content Area */}
      <main className="flex-1 transition-all duration-300 ease-in-out overflow-y-auto pt-16">
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">

          <motion.div
            animate={{ opacity: isFocusMode ? 0.3 : 1, y: isFocusMode ? -20 : 0 }}
            className="mb-12 border-b pb-8 transition-colors border-stone-200 dark:border-stone-800"
          >
            <PhotoUploader
              initialImage={coverImageUrl}
              onUploadComplete={setCoverImageUrl}
              className="w-full aspect-video rounded-xl mb-8 flex items-center justify-center border-2 border-dashed transition-colors relative overflow-hidden cursor-pointer border-stone-300 bg-stone-100 hover:border-stone-400 dark:border-stone-800 dark:bg-stone-900/50 dark:hover:border-stone-700"
              imageClassName="w-full h-full object-cover"
            >
              {!coverImageUrl && (
                <div className="text-center p-4">
                  <ImagePlus size={32} className="mx-auto mb-2 transition-colors text-stone-400 group-hover:text-stone-500 dark:text-stone-600 dark:group-hover:text-stone-500" />
                  <span className="text-xs font-bold uppercase tracking-wider transition-colors text-stone-500 group-hover:text-stone-600 dark:text-stone-500 dark:group-hover:text-stone-400">Add Cover Image</span>
                </div>
              )}
            </PhotoUploader>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                {category && <span className="text-xs font-bold uppercase tracking-widest text-primary">{category}</span>}
                {articleFormat && <>
                  <span className="text-xs text-muted-foreground">/</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{articleFormat}</span>
                </>}
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsFocusMode(!isFocusMode)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border ${isFocusMode ? 'bg-primary text-primary-foreground border-primary' : 'border-stone-300 text-stone-500 dark:border-stone-700 dark:text-stone-400'}`}
                >
                  <Minimize2 size={12} />
                  <span>{isFocusMode ? 'Exit Zen' : 'Zen Mode'}</span>
                </button>
                <div
                  onClick={() => setIsBreaking(!isBreaking)}
                  className={`cursor-pointer transition-colors ${isBreaking ? 'text-red-500 animate-pulse' : 'text-stone-400 dark:text-stone-600 hover:text-red-500'}`}
                  title="Toggle Breaking Status"
                >
                  <Zap size={18} fill={isBreaking ? "currentColor" : "none"} />
                </div>
              </div>
            </div>

            <input
              type="text"
              placeholder="Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              autoFocus
              className="w-full bg-transparent outline-none font-serif text-4xl md:text-5xl font-bold leading-tight mb-6 placeholder-opacity-30 text-stone-900 placeholder-stone-400 dark:text-stone-100 dark:placeholder-stone-700"
            />
            <input
              type="text"
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              placeholder="Subheading or summary (optional)"
              className="w-full bg-transparent outline-none text-lg font-light mb-8 placeholder-opacity-50 text-stone-600 placeholder-stone-400 dark:text-stone-400 dark:placeholder-stone-600"
            />

            <div className="flex items-center space-x-6 text-xs font-mono uppercase tracking-wide opacity-60 text-stone-500 dark:text-stone-500">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 hover:opacity-100 opacity-60 disabled:opacity-40 disabled:cursor-not-allowed" disabled={!!authorError}>
                    <span>
                      Posting as: {author || <span className="text-red-500 font-bold">{authorError || '...'}</span>}
                    </span>
                    <ChevronDown size={14} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {user?.displayName && <DropdownMenuItem onClick={() => setAuthor(user.displayName)}>{user.displayName}</DropdownMenuItem>}
                  <DropdownMenuItem onClick={() => setAuthor('Anonymous')} disabled={!user?.displayName}>
                    Anonymous
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <span>•</span>
              <span>{new Date().toLocaleDateString()}</span>
              <span>•</span>
              <span>{isEditMode ? 'Editing' : 'Draft'}</span>
            </div>
          </motion.div>

          <div className="min-h-[500px] pb-32 relative">
            {blocks.map((block) => (
              <EditorBlock key={block.id} block={block} updateBlock={updateBlock} isDark={isDark} />
            ))}
            <div className="my-12 flex justify-center group relative">
              <div className="absolute top-1/2 left-0 right-0 h-px transition-colors bg-stone-200 group-hover:bg-stone-300 dark:bg-stone-800 dark:group-hover:bg-stone-700"></div>
              <div className="relative z-10 p-1.5 rounded-full border flex space-x-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 bg-white border-stone-200 shadow-lg dark:bg-stone-900 dark:border-stone-700 dark:shadow-2xl dark:shadow-black">
                {[{ icon: Type, type: 'paragraph', tooltip: 'Text' }, { icon: Quote, type: 'quote', tooltip: 'Quote' }, { icon: Heading2, type: 'h2', tooltip: 'Heading' }, { icon: ImagePlus, type: 'image', tooltip: 'Image' }, { icon: Sparkles, type: 'infobox', tooltip: 'AI Box' },].map((tool) => (
                  <button key={tool.type} onClick={() => addBlock(tool.type)} className="p-2 rounded-full hover:scale-110 transition-transform text-stone-500 hover:text-black dark:text-stone-400 dark:hover:text-white" title={tool.tooltip}>
                    <tool.icon size={16} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sidebar Section */}
      <AnimatePresence>
        {isSidebarOpen && !isFocusMode && (
          <motion.aside
            className="hidden md:block relative border-l z-20 pt-16"
            initial={{ width: 0 }}
            animate={{ width: '360px' }}
            exit={{ width: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <EditorSidebar
              isOpen={isSidebarOpen}
              setIsOpen={setIsSidebarOpen}
              isFocusMode={isFocusMode}
              isDark={isDark}
              headline={headline}
              subheading={subheading}
              slug={slug}
              blocks={blocks}
              tags={tags}
              setTags={setTags}
              coverImageUrl={coverImageUrl}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="md:hidden">
            <motion.div
              className="fixed inset-0 bg-black/50 z-30 pt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm border-l z-40 bg-white dark:bg-stone-900 pt-16"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <EditorSidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                isFocusMode={isFocusMode}
                isDark={isDark}
                headline={headline}
                subheading={subheading}
                slug={slug}
                blocks={blocks}
                tags={tags}
                setTags={setTags}
                coverImageUrl={coverImageUrl}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Actions */}
      <motion.div
        animate={{ y: isFocusMode ? 100 : 0 }}
        className="fixed bottom-0 left-0 right-0 h-16 border-t px-6 flex items-center justify-between z-20 transition-transform duration-500 bg-white/80 backdrop-blur-md border-stone-200 dark:bg-stone-900/80 dark:border-stone-800"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border border-stone-300 text-stone-500 dark:border-stone-700 dark:text-stone-400"
          >
            <AlignLeft size={12} />
            <span>Tools</span>
          </button>
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border border-stone-300 text-stone-500 dark:border-stone-700 dark:text-stone-400">
                <Layout size={12} />
                <span>Preview</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[80vh] bg-white dark:bg-stone-900 dark:border-stone-700">
              <DialogHeader>
                <DialogTitle>Article Preview</DialogTitle>
              </DialogHeader>
              <div className="prose prose-sm dark:prose-invert overflow-y-auto h-full p-4">
                <h1>{headline}</h1>
                <p className="lead">{subheading}</p>
                {coverImageUrl && <img src={coverImageUrl} alt="Cover" />}
                <div dangerouslySetInnerHTML={{ __html: blocks.map(b => b.content).join('') }} />
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border border-stone-300 text-stone-500 dark:border-stone-700 dark:text-stone-400">
                <History size={12} />
                <span>History & Drafts</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white dark:bg-stone-900 dark:border-stone-700">
              <DialogHeader>
                <DialogTitle>History & Drafts</DialogTitle>
                <DialogDescription>Select a version to restore.</DialogDescription>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto space-y-2">
                {localDrafts.map((draft, i) => (
                  <div key={i} onClick={() => restoreDraft(draft)} className="p-3 rounded-md border cursor-pointer border-stone-200 hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <Laptop size={14} className="text-muted-foreground" />
                        <div>
                          <p className="font-semibold text-sm">{draft.headline || 'Untitled Draft'}</p>
                          <p className="text-xs text-muted-foreground">Autosaved to this device</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(draft.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={handleSaveDraft} disabled={isSaving} className="px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center space-x-2 text-stone-600 hover:bg-stone-200 dark:text-stone-400 dark:hover:bg-stone-800">
            <Save size={14} />
            <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
          </button>
          <button onClick={handlePublish} disabled={isPublishing || !!authorError} className="px-6 py-2 rounded-md text-sm font-bold tracking-wide text-white shadow-lg bg-primary hover:bg-primary/90 transition-colors flex items-center space-x-2 disabled:bg-opacity-50 disabled:cursor-not-allowed">
            {isPublishing ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update' : 'Publish')}
            {!isPublishing && <Send size={14} />}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NewsEditorPage;
