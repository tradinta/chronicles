
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Type, Quote, Heading2, AlertCircle, Zap, Minimize2,
  ImagePlus,
  Bot, Sparkles, Wand2,
  LayoutGrid, Book, Check, BrainCircuit, AlignLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { createArticle } from '@/firebase/firestore/articles';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import EditorSidebar from '@/components/editor/EditorSidebar';
import EditorBlock from '@/components/editor/EditorBlock';
import { EntryModal } from '@/components/editor/EntryModal';

const NewsEditorPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();

  const [showEntryModal, setShowEntryModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  
  const [headline, setHeadline] = useState('');
  const [subheading, setSubheading] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [tags, setTags] = useState<string[]>(['Election 2024']);
  
  const [blocks, setBlocks] = useState([
    { id: 1, type: 'paragraph', content: "The global summit concluded today with a historic agreement..." },
    { id: 2, type: 'quote', content: "This is a turning point for international diplomacy.", source: "Ambassador J. Smith" },
  ]);

  const [isPublishing, setIsPublishing] = useState(false);
  
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const addBlock = (type: string) => {
    setBlocks([...blocks, { id: Date.now(), type, content: '' }]);
  };

  const updateBlockContent = (id: number, newContent: string) => {
    setBlocks(blocks.map(block => block.id === id ? { ...block, content: newContent } : block));
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

    setIsPublishing(true);
    
    const content = blocks.map(block => {
      switch(block.type) {
        case 'h2': return `<h2>${block.content}</h2>`;
        case 'quote': return `<blockquote><p>${block.content}</p><footer>${block.source || ''}</footer></blockquote>`;
        case 'paragraph': return `<p>${block.content}</p>`;
        case 'image': return `<figure><img src="${(block as any).imageUrl || ''}" alt="${(block as any).caption || ''}" /><figcaption>${(block as any).caption || ''}</figcaption></figure>`
        default: return '';
      }
    }).join('');

    const articleData = {
      title: headline,
      summary: subheading,
      content,
      imageUrl: coverImageUrl,
      authorId: user.uid,
      category: 'Politics', // Hardcoded for now
    };

    try {
      await createArticle(firestore, articleData);
      toast({
        title: "Article Published!",
        description: `${headline} is now live.`
      });
      router.push('/news'); // Redirect after successful publish
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

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const signResponse = await fetch('/api/sign-image', { method: 'POST' });
      const signData = await signResponse.json();

      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '631177719182385');
      formData.append('signature', signData.signature);
      formData.append('timestamp', signData.timestamp);
      formData.append('public_id', signData.public_id);

      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'doyg2puov'}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        const imageData = await uploadResponse.json();
        setCoverImageUrl(imageData.secure_url);
        toast({ title: "Cover image uploaded!" });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast({ variant: 'destructive', title: "Upload Failed", description: "Could not upload cover image." });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={`min-h-screen pt-16 relative flex transition-colors duration-500 ${isDark ? 'bg-stone-900' : 'bg-stone-50'}`}>
      <EntryModal show={showEntryModal} setShow={setShowEntryModal} isDark={isDark} />
      
      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen && !isFocusMode ? 'lg:mr-[24rem]' : ''}`}>
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
          
          <motion.div 
            animate={{ opacity: isFocusMode ? 0.3 : 1, y: isFocusMode ? -20 : 0 }}
            className={`mb-12 border-b pb-8 transition-colors ${isDark ? 'border-stone-800' : 'border-stone-700'}`}
          >
             <div 
               onDrop={handleDrop}
               onDragOver={handleDragOver}
               className={`group w-full aspect-video rounded-xl mb-8 flex items-center justify-center border-2 border-dashed transition-colors relative overflow-hidden ${isDark ? 'border-stone-800 bg-stone-900/50 hover:border-stone-700' : 'border-stone-300 bg-stone-100 hover:border-stone-400'}`}>
                {coverImageUrl ? (
                   <Image src={coverImageUrl} alt="Cover image" fill objectFit="cover" />
                ) : (
                   <div className="text-center p-4">
                      <ImagePlus size={32} className={`mx-auto mb-2 transition-colors ${isDark ? 'text-stone-600 group-hover:text-stone-500' : 'text-stone-400 group-hover:text-stone-500'}`} />
                      <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${isDark ? 'text-stone-500 group-hover:text-stone-400' : 'text-stone-500 group-hover:text-stone-600'}`}>Add Cover Image</span>
                   </div>
                )}
             </div>
             
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                   <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-primary' : 'text-primary'}`}>Politics / Election 2024</span>
                </div>
                <div className="flex items-center space-x-4">
                   <button 
                      onClick={() => setIsFocusMode(!isFocusMode)}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border ${isFocusMode ? 'bg-primary text-primary-foreground border-primary' : (isDark ? 'border-stone-700 text-stone-400' : 'border-stone-300 text-stone-500')}`}
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
               className={`w-full bg-transparent outline-none font-serif text-4xl md:text-5xl font-bold leading-tight mb-6 placeholder-opacity-30 ${isDark ? 'text-stone-100 placeholder-stone-700' : 'text-stone-900 placeholder-stone-400'}`}
             />
             <input 
               type="text"
               value={subheading}
               onChange={(e) => setSubheading(e.target.value)}
               placeholder="Subheading or summary (optional)" 
               className={`w-full bg-transparent outline-none text-lg font-light mb-8 placeholder-opacity-50 ${isDark ? 'text-stone-400 placeholder-stone-600' : 'text-stone-600 placeholder-stone-400'}`}
             />

             <div className={`flex items-center space-x-6 text-xs font-mono uppercase tracking-wide opacity-60 ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>
                <span>{user?.displayName || 'Loading...'}</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString()}</span>
                <span>•</span>
                <span>Draft</span>
             </div>
          </motion.div>

          <div className="min-h-[500px] pb-32 relative">
             {blocks.map((block) => (
                <EditorBlock key={block.id} block={block} updateContent={updateBlockContent} isDark={isDark} />
             ))}
             <div className="my-12 flex justify-center group relative">
                <div className={`absolute top-1/2 left-0 right-0 h-px transition-colors ${isDark ? 'bg-stone-800 group-hover:bg-stone-700' : 'bg-stone-200 group-hover:bg-stone-300'}`}></div>
                <div className={`relative z-10 p-1.5 rounded-full border flex space-x-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 ${isDark ? 'bg-stone-900 border-stone-700 shadow-2xl shadow-black' : 'bg-white border-stone-200 shadow-lg'}`}>
                   {[ { icon: Type, type: 'paragraph', tooltip: 'Text' }, { icon: Quote, type: 'quote', tooltip: 'Quote' }, { icon: Heading2, type: 'h2', tooltip: 'Heading' }, { icon: ImagePlus, type: 'image', tooltip: 'Image' }, { icon: Sparkles, type: 'infobox', tooltip: 'AI Box' }, ].map((tool) => (
                      <button key={tool.type} onClick={() => addBlock(tool.type)} className={`p-2 rounded-full hover:scale-110 transition-transform ${isDark ? 'text-stone-400 hover:text-white' : 'text-stone-500 hover:text-black'}`} title={tool.tooltip}>
                         <tool.icon size={16} />
                      </button>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </main>

      <EditorSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isFocusMode={isFocusMode}
        isDark={isDark}
        headline={headline}
        subheading={subheading}
        blocks={blocks}
        tags={tags}
        setTags={setTags}
        coverImageUrl={coverImageUrl}
      />

      <motion.div animate={{ y: isFocusMode ? 100 : 0 }} className={`fixed bottom-0 left-0 right-0 h-16 border-t px-6 flex items-center justify-end z-30 transition-transform duration-500 ${isDark ? 'bg-stone-900/80 backdrop-blur-md border-stone-800' : 'bg-white/80 backdrop-blur-md border-stone-200'}`}>
         <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className={`lg:hidden flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border ${isDark ? 'border-stone-700 text-stone-400' : 'border-stone-300 text-stone-500'}`}
            >
              <AlignLeft size={12} />
              <span>Tools</span>
            </button>
            <button className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${isDark ? 'text-stone-400 hover:bg-stone-800' : 'text-stone-600 hover:bg-stone-200'}`}>Save</button>
            <button onClick={handlePublish} disabled={isPublishing} className="px-6 py-2 rounded-md text-sm font-bold tracking-wide text-white shadow-lg bg-primary hover:bg-primary/90 transition-colors flex items-center space-x-2 disabled:bg-opacity-50 disabled:cursor-not-allowed">
               {isPublishing ? 'Publishing...' : 'Publish'}
               {!isPublishing && <Send size={14} />}
            </button>
         </div>
      </motion.div>
    </div>
  );
};

export default NewsEditorPage;

    