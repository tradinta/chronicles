
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Type, Quote, Heading2, Zap,
  ImagePlus,
  Layout,
  AlignLeft,
  Minimize2,
  Sparkles,
  History,
  Save,
  Laptop,
  ChevronDown,
  Loader2,
  Link as LinkIcon,
  AtSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { createArticle, getArticleById, updateArticle } from '@/firebase/firestore/articles';
import { useRouter, useSearchParams } from 'next/navigation';
import { PhotoUploader } from '@/components/shared/photo-uploader';

import EditorSidebar from '@/components/editor/EditorSidebar';
import EditorBlock from '@/components/editor/EditorBlock';
import { EntryModal } from '@/components/editor/EntryModal';
import { EditorialStandardsModal } from '@/components/editor/EditorialStandardsModal';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { createSlug } from '@/lib/utils';

const AUTOSAVE_INTERVAL = 3000;
const LOCAL_STORAGE_KEY = 'kihumba_editorial_autosave'; // Distinct key for Editorial
const STANDARDS_ACCEPTED_KEY = 'kihumba_editorial_standards_accepted';

const EditorialEditorPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/dashboard/editorial/new');
    }
  }, [user, isLoading, router]);


  const articleId = searchParams.get('edit');
  const [isEditMode, setIsEditMode] = useState(!!articleId);
  const [isLoadingArticle, setIsLoadingArticle] = useState(isEditMode);

  // Default to Editorial category
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showEditorialModal, setShowEditorialModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);

  // Autosave Status
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  const [headline, setHeadline] = useState('');
  const [subheading, setSubheading] = useState('');
  const [slug, setSlug] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState('Editorial'); // Fixed Category
  const [articleFormat, setArticleFormat] = useState('Opinion'); // Default format
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

      const hasAccepted = localStorage.getItem(STANDARDS_ACCEPTED_KEY);
      if (!hasAccepted) {
        setShowEditorialModal(true);
      }
    }
  }, [user]);

  const handleAcceptStandards = () => {
    localStorage.setItem(STANDARDS_ACCEPTED_KEY, 'true');
    setShowEditorialModal(false);
    toast({ title: "Welcome to the Editorial Board", description: "Make your voice heard." });
  };

  useEffect(() => {
    setSlug(createSlug(headline));
  }, [headline]);

  const [blocks, setBlocks] = useState([
    { id: Date.now(), type: 'paragraph', content: "" },
  ]);

  // Content Parsing (Shared Logic)
  const parseContentToBlocks = (htmlContent: string) => {
    if (!htmlContent) return [{ id: Date.now(), type: 'paragraph', content: "" }];
    const el = document.createElement('div');
    el.innerHTML = htmlContent;
    const parsedBlocks = Array.from(el.children).map((node, index) => {
      const id = Date.now() + index;
      if (node.tagName === 'H2') return { id, type: 'h2', content: node.textContent || "" };
      if (node.tagName === 'BLOCKQUOTE') return { id, type: 'quote', content: node.querySelector('p')?.textContent || "", source: node.querySelector('footer')?.textContent || "" };
      if (node.tagName === 'FIGURE') return { id, type: 'image', imageUrl: node.querySelector('img')?.src || '', caption: node.querySelector('figcaption')?.textContent || '', content: '' };
      if (node.classList.contains('embed-block')) return { id, type: 'embed', url: node.getAttribute('data-url') || '', content: '' };
      if (node.classList.contains('mention')) return { id, type: 'reference', email: node.getAttribute('data-email') || '', content: node.textContent?.replace('@', '') || '' };
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
    const timer = setTimeout(() => {
      if (headline || blocks.some(b => b.content) || blocks.some(b => b.imageUrl)) {
        setSaveStatus('saving');
        const currentState = getArticleState();
        setLocalDrafts(prev => {
          const lastDraft = prev[0];
          if (lastDraft && lastDraft.headline === currentState.headline && JSON.stringify(lastDraft.blocks) === JSON.stringify(currentState.blocks)) {
            return prev;
          }
          const newDrafts = [currentState, ...prev].slice(0, 10);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newDrafts));
          return newDrafts;
        });
        setTimeout(() => setSaveStatus('saved'), 500);
      }
    }, AUTOSAVE_INTERVAL);
    return () => clearTimeout(timer);
  }, [getArticleState, headline, blocks]);

  const addBlock = (type: string) => {
    const newBlock = { id: Date.now(), type, content: '' };
    setBlocks(prev => [...prev, newBlock]);
  };

  const updateBlock = (id: number, updatedValues: object) => {
    setBlocks(blocks.map(block =>
      block.id === id ? { ...block, ...updatedValues } : block
    ));
    setSaveStatus('unsaved');
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
    setCategory(draft.category || 'Editorial');
    setArticleFormat(draft.articleFormat || 'Opinion');
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
      if (!user.displayName) setShowProfileUpdateModal(true);
      return;
    }

    setIsPublishing(true);

    const content = blocks.map(block => {
      switch (block.type) {
        case 'h2': return `<h2>${block.content}</h2>`;
        case 'quote': return `<blockquote><p>${block.content}</p><footer>${(block as any).source || ''}</footer></blockquote>`;
        case 'paragraph': return `<p>${block.content}</p>`;
        case 'image': return `<figure><img src="${(block as any).imageUrl || ''}" alt="${(block as any).caption || ''}" /><figcaption>${(block as any).caption || ''}</figcaption></figure>`;
        case 'embed': return `<div class="embed-block" data-url="${(block as any).url}"></div>`;
        case 'reference': return `<span class="mention" data-email="${(block as any).email}">@${block.content}</span>`;
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
      tags: tags,
      isEditorial: true, // Special flag for editorials
      format: articleFormat
    };

    try {
      if (isEditMode && articleId) {
        await updateArticle(firestore, articleId, articleData);
        toast({ title: "Editorial Updated!", description: `${headline} has been successfully updated.` });
      } else {
        await createArticle(firestore, articleData);
        toast({ title: "Editorial Published!", description: `${headline} is now live.` });
      }
      router.push('/dashboard/stories');
    } catch (error) {
      console.error("Publishing error:", error);
      toast({ variant: 'destructive', title: 'Publishing Failed', description: 'Could not save the article to the database.' });
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
        <p className="ml-4 text-muted-foreground">Loading editorial...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-stone-50 dark:bg-stone-900">
      {/* Optional: We could show EntryModal if we wanted to change "Opinion" to "Analysis", 
          but for now we default to Editorial/Opinion to streamline. */}

      <EditorialStandardsModal
        isOpen={showEditorialModal}
        onAccept={handleAcceptStandards}
        isDark={isDark}
      />

      <Dialog open={showProfileUpdateModal} onOpenChange={setShowProfileUpdateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Your Profile</DialogTitle>
            <DialogDescription>{authorError} To publish, you must set a display name.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button variant="secondary">Close</Button></DialogClose>
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
            {/* Editorial Badge */}
            <div className="flex justify-center mb-6">
              <span className="bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                Editorial Board
              </span>
            </div>

            <PhotoUploader
              initialImage={coverImageUrl}
              onUploadComplete={setCoverImageUrl}
              className="w-full aspect-video rounded-xl mb-8 flex items-center justify-center border-2 border-dashed transition-colors relative overflow-hidden cursor-pointer border-stone-300 bg-stone-100 hover:border-stone-400 dark:border-stone-800 dark:bg-stone-900/50 dark:hover:border-stone-700"
              imageClassName="w-full h-full object-cover"
            >
              {!coverImageUrl && (
                <div className="text-center p-4">
                  <ImagePlus size={32} className="mx-auto mb-2 text-stone-400 dark:text-stone-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-500">Editorial Cover Image</span>
                </div>
              )}
            </PhotoUploader>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  {['Opinion', 'Analysis', 'Perspective'].map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setArticleFormat(fmt)}
                      className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded transition-colors ${articleFormat === fmt ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-stone-200 dark:hover:bg-stone-800'}`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsFocusMode(!isFocusMode)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border ${isFocusMode ? 'bg-primary text-primary-foreground border-primary' : 'border-stone-300 text-stone-500 dark:border-stone-700 dark:text-stone-400'}`}
                >
                  <Minimize2 size={12} />
                  <span>{isFocusMode ? 'Exit Zen' : 'Zen Mode'}</span>
                </button>
              </div>
            </div>

            {/* Save Status Indicator */}
            <div className="absolute top-0 right-0 -mt-8 text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-2">
              {saveStatus === 'saving' && <Loader2 size={10} className="animate-spin" />}
              <span>{saveStatus === 'saved' ? 'Saved locally' : (saveStatus === 'saving' ? 'Saving...' : 'Unsaved changes')}</span>
            </div>

            <input
              type="text"
              placeholder="Editorial Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              autoFocus
              className="w-full bg-transparent outline-none font-serif text-4xl md:text-5xl font-bold leading-tight mb-6 placeholder-opacity-30 text-stone-900 placeholder-stone-400 dark:text-stone-100 dark:placeholder-stone-700 text-center"
            />
            <input
              type="text"
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              placeholder="A strong, argumentative subheading..."
              className="w-full bg-transparent outline-none text-lg font-light mb-8 placeholder-opacity-50 text-stone-600 placeholder-stone-400 dark:text-stone-400 dark:placeholder-stone-600 text-center italic"
            />

            <div className="flex items-center justify-center space-x-6 text-xs font-mono uppercase tracking-wide opacity-60 text-stone-500 dark:text-stone-500">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 hover:opacity-100 opacity-60 disabled:opacity-40" disabled={!!authorError}>
                    <span>By: {author || <span className="text-red-500 font-bold">Unknown</span>}</span>
                    <ChevronDown size={14} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {user?.displayName && <DropdownMenuItem onClick={() => setAuthor(user.displayName)}>{user.displayName}</DropdownMenuItem>}
                  <DropdownMenuItem onClick={() => setAuthor('The Editorial Board')}>The Editorial Board</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <span>•</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </motion.div>

          <div className="min-h-[500px] pb-32 relative">
            {blocks.map((block) => (
              <EditorBlock key={block.id} block={block} updateBlock={updateBlock} isDark={isDark} />
            ))}
            <div className="my-12 flex justify-center group relative">
              <div className="absolute top-1/2 left-0 right-0 h-px transition-colors bg-stone-200 group-hover:bg-stone-300 dark:bg-stone-800 dark:group-hover:bg-stone-700"></div>
              <div className="relative z-10 p-1.5 rounded-full border flex space-x-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 bg-white border-stone-200 shadow-lg dark:bg-stone-900 dark:border-stone-700 dark:shadow-2xl dark:shadow-black">
                {[
                  { icon: Type, type: 'paragraph', tooltip: 'Text' },
                  { icon: Quote, type: 'quote', tooltip: 'Quote' },
                  { icon: Heading2, type: 'h2', tooltip: 'Heading' },
                  { icon: ImagePlus, type: 'image', tooltip: 'Image' },
                  { icon: AtSign, type: 'reference', tooltip: 'Mention Author' },
                  { icon: LinkIcon, type: 'embed', tooltip: 'Embed URL' },
                  { icon: Sparkles, type: 'infobox', tooltip: 'AI Box' }
                ].map((tool) => (
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
                <DialogTitle>Editorial Preview</DialogTitle>
              </DialogHeader>
              <div className="prose prose-sm dark:prose-invert overflow-y-auto h-full p-4">
                <h1>{headline}</h1>
                <p className="lead italic border-l-4 pl-4 border-primary">{subheading}</p>
                {coverImageUrl && <img src={coverImageUrl} alt="Cover" />}
                <div dangerouslySetInnerHTML={{ __html: blocks.map(b => b.content).join('') }} />
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border border-stone-300 text-stone-500 dark:border-stone-700 dark:text-stone-400">
                <History size={12} />
                <span>Drafts</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white dark:bg-stone-900 dark:border-stone-700">
              <DialogHeader>
                <DialogTitle>Editorial History</DialogTitle>
                <DialogDescription>Restore a previous version.</DialogDescription>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto space-y-2">
                {localDrafts.map((draft, i) => (
                  <div key={i} onClick={() => restoreDraft(draft)} className="p-3 rounded-md border cursor-pointer border-stone-200 hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800">
                    <p className="font-semibold text-sm">{draft.headline || 'Untitled'}</p>
                    <span className="text-xs text-muted-foreground">{new Date(draft.timestamp).toLocaleTimeString()}</span>
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
          <button onClick={handlePublish} disabled={isPublishing || !!authorError} className="px-6 py-2 rounded-full text-sm font-bold tracking-wide text-white shadow-lg bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center space-x-2 disabled:bg-opacity-50 disabled:cursor-not-allowed">
            {isPublishing ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update' : 'Publish')}
            {!isPublishing && <Send size={14} />}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditorialEditorPage;
