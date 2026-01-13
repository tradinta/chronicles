
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, CheckCircle2, Layout, AlignLeft, ChevronRight, Sparkles, ImageIcon,
  Send, Type, Quote, Heading2, AlertCircle, Zap, Minimize2, History
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { createArticle } from '@/firebase/firestore/articles';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const EditorBlock = ({ type, content, isDark, placeholder, onDelete }) => {
  return (
    <div className="relative group mb-6">
      {type === 'h2' && (
        <div 
          contentEditable suppressContentEditableWarning
          className={`editor-placeholder text-3xl font-serif font-bold mb-4 outline-none ${isDark ? 'text-stone-200' : 'text-stone-900'}`}
          placeholder={placeholder || "Heading"}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      )}
      {type === 'paragraph' && (
        <div 
          contentEditable suppressContentEditableWarning
          className={`editor-placeholder text-xl font-serif leading-[1.8] outline-none ${isDark ? 'text-stone-300' : 'text-stone-800'}`}
          placeholder={placeholder || "Start typing..."}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      )}
      {type === 'quote' && (
         <div className={`my-8 pl-8 border-l-4 ${isDark ? 'border-orange-500' : 'border-orange-600'}`}>
             <div contentEditable suppressContentEditableWarning className={`text-2xl font-serif italic outline-none mb-3 ${isDark ? 'text-stone-200' : 'text-stone-900'}`} placeholder="Quote text...">{content}</div>
             <div className="flex items-center space-x-2">
                <div className="h-px w-8 bg-stone-400"></div>
                <div contentEditable suppressContentEditableWarning className="text-xs font-bold uppercase tracking-widest opacity-70 outline-none" placeholder="Source Name"></div>
             </div>
          </div>
      )}
    </div>
  );
};


export default function NewsEditorPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();

  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState('tasks');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);


  // Article State
  const [headline, setHeadline] = useState('');
  const [subheading, setSubheading] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [blocks, setBlocks] = useState([
    { id: 1, type: 'paragraph', content: "The global summit concluded today with a historic agreement..." },
    { id: 2, type: 'quote', content: "This is a turning point for international diplomacy." },
    { id: 3, type: 'paragraph', content: "Delegates from over 40 nations were present to witness the signing, marking the end of months of tense negotiations." },
  ]);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);
  
  const handleBlockContentChange = (blockId, newContent) => {
    setBlocks(blocks.map(block => block.id === blockId ? { ...block, content: newContent } : block));
  };

  const addBlock = (type) => {
    setBlocks([...blocks, { id: Date.now(), type, content: '' }]);
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
        const signResponse = await fetch('/api/sign-image', { method: 'POST' });
        const signData = await signResponse.json();

        formData.append('api_key', '631177719182385');
        formData.append('signature', signData.signature);
        formData.append('timestamp', signData.timestamp);
        formData.append('public_id', signData.public_id);

        const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/doyg2puov/image/upload`, {
            method: 'POST',
            body: formData,
        });

        if (uploadResponse.ok) {
            const imageData = await uploadResponse.json();
            setCoverImageUrl(imageData.secure_url);
            toast({ title: "Image uploaded successfully!" });
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        console.error('Image upload error:', error);
        toast({ variant: 'destructive', title: "Upload Failed", description: "Could not upload image." });
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
    
    // Convert blocks to a single HTML string for content
    const content = blocks.map(block => {
      switch(block.type) {
        case 'h2': return `<h2>${block.content}</h2>`;
        case 'quote': return `<blockquote><p>${block.content}</p></blockquote>`;
        case 'paragraph': return `<p>${block.content}</p>`;
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


  // Checklist logic
  const isHeadlineOptimized = headline.length > 20 && headline.length < 90;
  const isLeadImageAdded = !!coverImageUrl;

  return (
    <div className={`min-h-screen pt-20 relative flex transition-colors duration-500 ${isDark ? 'bg-[#121212]' : 'bg-[#FDFBF7]'}`}>
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-500 ease-in-out ${isSidebarOpen && !isFocusMode ? 'lg:pr-[360px]' : 'pr-0'}`}>
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
          
          {/* Header Metadata */}
          <motion.div 
            animate={{ opacity: isFocusMode ? 0.3 : 1, y: isFocusMode ? -20 : 0 }}
            className={`mb-12 border-b pb-8 transition-colors ${isDark ? 'border-stone-800' : 'border-stone-200'}`}
          >
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                   <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>Politics / Election 2024</span>
                </div>
                <div className="flex items-center space-x-4">
                   <button 
                      onClick={() => setIsFocusMode(!isFocusMode)}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border ${isFocusMode ? 'bg-orange-500 text-white border-orange-500' : (isDark ? 'border-stone-700 text-stone-400' : 'border-stone-300 text-stone-500')}`}
                   >
                      <Minimize2 size={12} />
                      <span>{isFocusMode ? 'Exit Zen' : 'Zen Mode'}</span>
                   </button>
                   <div 
                      onClick={() => setIsBreaking(!isBreaking)}
                      className={`cursor-pointer transition-colors ${isBreaking ? 'text-red-500 animate-pulse' : 'text-stone-300'}`}
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
               className={`w-full bg-transparent outline-none font-serif text-5xl md:text-6xl font-bold leading-[1.1] mb-6 placeholder-opacity-30 ${isDark ? 'text-stone-100 placeholder-stone-700' : 'text-stone-900 placeholder-stone-300'}`}
             />
             <input 
               type="text" 
               placeholder="Subheading or summary (optional)"
               value={subheading}
               onChange={(e) => setSubheading(e.target.value)}
               className={`w-full bg-transparent outline-none text-xl font-light mb-8 placeholder-opacity-50 ${isDark ? 'text-stone-400 placeholder-stone-700' : 'text-stone-600 placeholder-stone-300'}`}
             />

             <div className={`flex items-center space-x-6 text-xs font-mono uppercase tracking-wide opacity-60 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                <span>Sarah Jenkins</span>
                <span>•</span>
                <span>Oct 14, 2024</span>
                <span>•</span>
                <span>Drafting</span>
             </div>
          </motion.div>

          {/* Modular Editor Area */}
          <div className="min-h-[500px] pb-32 relative">
             {blocks.map((block) => (
                <EditorBlock 
                  key={block.id} 
                  type={block.type} 
                  content={block.content} 
                  isDark={isDark}
                />
             ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Contextual Tools */}
      <div 
        className={`fixed right-0 top-16 bottom-16 w-[360px] border-l transform transition-all duration-500 z-20 
        ${isSidebarOpen && !isFocusMode ? 'translate-x-0' : 'translate-x-full'} 
        ${isDark ? 'bg-[#181818] border-stone-800' : 'bg-white border-stone-200'}`}
      >
        <div className={`h-14 border-b flex items-center px-2 ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
           {[{ id: 'tasks', icon: CheckCircle2, label: 'Tasks' }, { id: 'co-pilot', icon: Bot, label: 'Co-Pilot' }, { id: 'assets', icon: Layout, label: 'Assets' }].map(tab => (
              <button key={tab.id} onClick={() => setActiveSidebarTab(tab.id)} className={`flex-1 h-full flex items-center justify-center text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeSidebarTab === tab.id ? (isDark ? 'border-orange-500 text-orange-500' : 'border-orange-600 text-orange-600') : 'border-transparent text-stone-500 hover:text-stone-400'}`}>
                 <tab.icon size={14} className="mr-2" /> {tab.label}
              </button>
           ))}
           <button onClick={() => setIsSidebarOpen(false)} className={`ml-2 p-2 rounded hover:bg-stone-100 dark:hover:bg-stone-800 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
              <ChevronRight size={14} />
           </button>
        </div>
        
        <div className="p-6 overflow-y-auto h-[calc(100%-7rem)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSidebarTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeSidebarTab === 'tasks' && (
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-end mb-4">
                        <h4 className={`text-xs font-bold tracking-widest uppercase ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Readability</h4>
                        <span className="text-xs font-mono text-green-500">Grade 8</span>
                    </div>
                    <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                        <div className="w-[70%] h-full bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Pre-Flight</h4>
                    <div className="space-y-3">
                      {[
                        { label: "Headline optimized", done: isHeadlineOptimized }, 
                        { label: "Lead image added", done: isLeadImageAdded }, 
                        { label: "Tags selected", done: true }, // Placeholder
                        { label: "Facts Checked", done: false } // Placeholder
                      ].map((item, i) => (
                        <div key={i} className="flex items-center space-x-3 text-sm group cursor-pointer">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${item.done ? (isDark ? 'bg-green-900/20 border-green-800 text-green-600' : 'bg-green-100 border-green-300 text-green-600') : (isDark ? 'border-stone-700' : 'border-stone-300')}`}>{item.done && <CheckCircle2 size={10} />}</div>
                          <span className={`${item.done ? 'opacity-50 line-through' : ''} ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>SEO Preview</h4>
                    <div className={`p-4 rounded text-sm border ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
                      <div className="text-blue-500 text-base font-medium truncate mb-1">Headline Preview | The Chronicle</div>
                      <div className="text-green-600 text-xs mb-2">www.chronicle.com/news/story-slug</div>
                      <div className={`text-xs leading-snug opacity-80 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>This is how your story will appear in search results. Make sure to include relevant keywords.</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
       {/* Footer Actions */}
       <motion.div 
        animate={{ y: isFocusMode ? 100 : 0 }}
        className={`fixed bottom-0 left-0 right-0 h-16 border-t px-6 md:px-12 flex items-center justify-between z-30 transition-transform duration-500 ${isDark ? 'bg-[#121212] border-stone-800' : 'bg-white border-stone-200'}`}
      >
         <div className="flex items-center space-x-6">
            <div className={`flex items-center space-x-2 text-xs font-medium cursor-pointer hover:underline ${isDark ? 'text-stone-500' : 'text-stone-400'}`}><Layout size={14} /><span>Preview</span></div>
            <div className={`flex items-center space-x-2 text-xs font-medium cursor-pointer hover:underline ${isDark ? 'text-stone-500' : 'text-stone-400'}`}><History size={14} /><span>History</span></div>
         </div>
         <div className="flex items-center space-x-4">
            <button className={`px-4 py-2 rounded text-sm font-medium transition-colors ${isDark ? 'text-stone-400 hover:bg-stone-800' : 'text-stone-600 hover:bg-stone-100'}`}>Save</button>
            <button 
                onClick={handlePublish}
                disabled={isPublishing}
                className={`px-6 py-2 rounded text-sm font-bold tracking-wide uppercase text-white shadow-lg bg-orange-600 hover:bg-orange-700 transition-colors flex items-center space-x-2 disabled:bg-orange-800 disabled:cursor-not-allowed`}
              >
                 {isPublishing ? 'Publishing...' : 'Publish'}
                 {!isPublishing && <Send size={14} />}
              </button>
         </div>
      </motion.div>
    </div>
  );
}

    