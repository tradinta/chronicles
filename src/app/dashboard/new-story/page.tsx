
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Type, Quote, Heading2, AlertCircle, Zap, Minimize2, History, Plus,
  Layout, Globe, CheckCircle2, ChevronRight, AlignLeft,
  Bot, Sparkles, Wand2,
  Image as ImageIcon,
  ImagePlus
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { createArticle } from '@/firebase/firestore/articles';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const NewsEditorPage = () => {
  const [showEntryModal, setShowEntryModal] = useState(false); // Default to false after first load
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState('checklist'); // checklist, ai, assets
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();

  const [headline, setHeadline] = useState('');
  const [subheading, setSubheading] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const [blocks, setBlocks] = useState([
    { id: 1, type: 'paragraph', content: "The global summit concluded today with a historic agreement..." },
  ]);
  
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const addBlock = (type) => {
    setBlocks([...blocks, { id: Date.now(), type, content: '' }]);
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
    
    // This is a simplified conversion. A real implementation would use a library like TipTap/ProseMirror state.
    const content = blocks.map(block => {
      // In a real app, you'd get the content from the contentEditable divs' state
      const blockElement = document.querySelector(`[data-block-id="${block.id}"]`);
      const blockContent = blockElement ? blockElement.innerHTML : block.content;

      switch(block.type) {
        case 'h2': return `<h2>${blockContent}</h2>`;
        case 'quote': return `<blockquote><p>${blockContent}</p></blockquote>`;
        case 'paragraph': return `<p>${blockContent}</p>`;
        case 'image': return `<figure><img src="${block.imageUrl || ''}" alt="${block.caption || ''}" /><figcaption>${block.caption || ''}</figcaption></figure>`
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
  
  const handleImageUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    
    // In a real app, you'd show a loading indicator here
    
    try {
      const signResponse = await fetch('/api/sign-image', { method: 'POST' });
      const signData = await signResponse.json();

      formData.append('api_key', '631177719182385'); // Replace with your actual API key from env
      formData.append('signature', signData.signature);
      formData.append('timestamp', signData.timestamp);
      formData.append('public_id', signData.public_id);

      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/doyg2puov/image/upload`, { // Replace with your cloud name
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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const isHeadlineOptimized = headline.length > 20 && headline.length < 90;
  const isLeadImageAdded = !!coverImageUrl;

  // Entry Modal
  const EntryModal = () => (
    <AnimatePresence>
      {showEntryModal && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
            className={`w-full max-w-lg p-8 rounded-xl shadow-2xl relative border overflow-hidden ${isDark ? 'bg-[#181818] border-stone-800' : 'bg-white border-stone-200'}`}
          >
             {/* Decorative top bar */}
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500"></div>

             <div className="mb-8">
               <h2 className={`text-3xl font-serif mb-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>New Assignment</h2>
               <p className={`text-sm ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Configure the parameters for your new piece.</p>
             </div>
             
             <div className="space-y-6">
                <div>
                   <label className={`block text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>Format</label>
                   <div className="grid grid-cols-2 gap-3">
                      {['Standard Report', 'Breaking Wire', 'Longform', 'Investigation'].map((type, i) => (
                        <button key={i} className={`text-left p-3 rounded border text-sm transition-all hover:border-orange-500 group ${isDark ? 'border-stone-700 bg-stone-800/50 text-stone-300' : 'border-stone-200 bg-stone-50 text-stone-700'}`}>
                           <span className="block font-medium group-hover:text-orange-500 transition-colors">{type}</span>
                        </button>
                      ))}
                   </div>
                </div>
                <div>
                   <label className={`block text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>Primary Section</label>
                   <div className="flex flex-wrap gap-2">
                      {['Politics', 'Business', 'Technology', 'Science', 'Culture'].map((cat, i) => (
                        <button key={i} className={`px-4 py-2 rounded-full border text-xs font-medium transition-colors ${isDark ? 'border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-200' : 'border-stone-300 text-stone-600 hover:border-stone-400 hover:text-stone-900'}`}>
                           {cat}
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             <div className="mt-10 flex justify-end">
                <button 
                  onClick={() => setShowEntryModal(false)}
                  className={`px-8 py-3 rounded-full bg-stone-900 text-white dark:bg-white dark:text-stone-900 text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-lg`}
                >
                  Create Draft
                </button>
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  
  const EditorBlock = ({ id, type, content }) => {
    return (
      <div className="relative group mb-6" data-block-id={id}>
        {/* Placeholder for contentEditable div */}
        {type === 'paragraph' && <div contentEditable suppressContentEditableWarning className="editor-placeholder text-xl font-serif leading-[1.8] outline-none" placeholder="Start typing...">{content}</div>}
        {type === 'quote' && <blockquote contentEditable suppressContentEditableWarning className="editor-placeholder border-l-4 border-orange-500 pl-8 italic text-2xl font-serif my-8 py-4" placeholder="Quote...">{content}</blockquote>}
        {type === 'h2' && <h2 contentEditable suppressContentEditableWarning className="editor-placeholder text-3xl font-serif font-bold tracking-tight mb-4 mt-8 outline-none" placeholder="Heading...">{content}</h2>}
        {type === 'image' && (
           <div className={`my-8 relative group rounded-lg overflow-hidden border transition-all ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
             {/* Image upload logic would go here */}
           </div>
        )}
      </div>
    )
  };

  return (
    <div className={`min-h-screen pt-20 relative flex transition-colors duration-500 ${isDark ? 'bg-[#121212]' : 'bg-[#FDFBF7]'}`}>
      <EntryModal />
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-500 ease-in-out ${isSidebarOpen && !isFocusMode ? 'pr-0 md:pr-[360px]' : 'pr-0'}`}>
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
          
          {/* Header Metadata */}
          <motion.div 
            animate={{ opacity: isFocusMode ? 0.3 : 1, y: isFocusMode ? -20 : 0 }}
            className={`mb-12 border-b pb-8 transition-colors ${isDark ? 'border-stone-800' : 'border-stone-200'}`}
          >
             <div 
               onDrop={handleDrop}
               onDragOver={handleDragOver}
               className={`group w-full h-48 md:h-64 rounded-xl mb-8 flex items-center justify-center border-2 border-dashed transition-colors relative overflow-hidden ${isDark ? 'border-stone-800 bg-stone-900/50 hover:border-stone-700' : 'border-stone-200 bg-stone-100 hover:border-stone-300'}`}>
                {coverImageUrl ? (
                   <Image src={coverImageUrl} alt="Cover image" layout="fill" objectFit="cover" />
                ) : (
                   <div className="text-center">
                      <ImagePlus size={32} className={`mx-auto mb-2 ${isDark ? 'text-stone-600' : 'text-stone-400'}`} />
                      <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>Add Cover Image</span>
                   </div>
                )}
             </div>
             
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
               value={subheading}
               onChange={(e) => setSubheading(e.target.value)}
               placeholder="Subheading or summary (optional)" 
               className={`w-full bg-transparent outline-none text-xl font-light mb-8 placeholder-opacity-50 ${isDark ? 'text-stone-400 placeholder-stone-700' : 'text-stone-600 placeholder-stone-300'}`}
             />

             <div className={`flex items-center space-x-6 text-xs font-mono uppercase tracking-wide opacity-60 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                <span>{user?.displayName || 'Loading...'}</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString()}</span>
                <span>•</span>
                <span>Drafting</span>
             </div>
          </motion.div>

          {/* Modular Editor Area */}
          <div className="min-h-[500px] pb-32 relative">
             {blocks.map((block) => (
                <EditorBlock key={block.id} type={block.type} content={block.content} isDark={isDark} id={block.id} />
             ))}

             <div className="my-12 flex justify-center group relative">
                <div className={`absolute top-1/2 left-0 right-0 h-px transition-colors ${isDark ? 'bg-stone-800 group-hover:bg-stone-700' : 'bg-stone-200 group-hover:bg-stone-300'}`}></div>
                <div className={`relative z-10 px-4 py-2 rounded-full border flex space-x-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 ${isDark ? 'bg-stone-900 border-stone-700 shadow-xl' : 'bg-white border-stone-200 shadow-lg'}`}>
                   {[
                      { icon: Type, type: 'paragraph', tooltip: 'Text' },
                      { icon: Quote, type: 'quote', tooltip: 'Quote' },
                      { icon: Heading2, type: 'h2', tooltip: 'Heading' },
                      { icon: ImageIcon, type: 'image', tooltip: 'Image' },
                      { icon: Sparkles, type: 'infobox', tooltip: 'AI Box' },
                   ].map((tool) => (
                      <button 
                        key={tool.type} 
                        onClick={() => addBlock(tool.type)}
                        className={`p-1.5 rounded hover:scale-110 transition-transform ${isDark ? 'text-stone-400 hover:text-white' : 'text-stone-500 hover:text-black'}`}
                        title={tool.tooltip}
                      >
                         <tool.icon size={18} />
                      </button>
                   ))}
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* Right Sidebar - Contextual Tools */}
      <div 
        className={`fixed right-0 top-16 bottom-16 w-full md:w-[360px] border-l transform transition-all duration-500 z-20 
        ${isSidebarOpen && !isFocusMode ? 'translate-x-0' : 'translate-x-full'} 
        ${isDark ? 'bg-[#181818] border-stone-800' : 'bg-white border-stone-200'}`}
      >
        {!isSidebarOpen && !isFocusMode && (
           <button onClick={() => setIsSidebarOpen(true)} className={`absolute -left-10 top-6 p-2 rounded-l border-y border-l shadow-sm ${isDark ? 'bg-[#181818] border-stone-800 text-stone-400' : 'bg-white border-stone-200 text-stone-500'}`}>
              <AlignLeft size={16} />
           </button>
        )}

        <div className={`h-14 border-b flex items-center px-2 ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
           {[
              { id: 'checklist', icon: CheckCircle2, label: 'Tasks' },
              { id: 'ai', icon: Bot, label: 'Co-Pilot' },
              { id: 'assets', icon: Layout, label: 'Assets' }
           ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveSidebarTab(tab.id)}
                className={`flex-1 h-full flex items-center justify-center text-xs font-bold uppercase tracking-wider border-b-2 transition-colors
                  ${activeSidebarTab === tab.id 
                     ? (isDark ? 'border-orange-500 text-orange-500' : 'border-orange-600 text-orange-600') 
                     : 'border-transparent text-stone-500 hover:text-stone-400'}`}
              >
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
             {activeSidebarTab === 'checklist' && (
               <div className="space-y-8">
                 <div>
                    <div className="flex justify-between items-end mb-4">
                       <h4 className={`text-xs font-bold tracking-widest uppercase ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Content Score</h4>
                       <span className="text-xs font-mono text-green-500">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                 </div>
                 <div>
                  <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Pre-Flight</h4>
                  <div className="space-y-3">
                    {[{ label: "Headline optimized", done: isHeadlineOptimized }, { label: "Lead image added", done: isLeadImageAdded }, { label: "Tags selected", done: true }, { label: "Facts Checked", done: false }].map((item, i) => (
                      <div key={i} className="flex items-center space-x-3 text-sm group cursor-pointer">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${item.done ? (isDark ? 'bg-green-900/20 border-green-800 text-green-600' : 'bg-green-100 border-green-300 text-green-600') : (isDark ? 'border-stone-700 group-hover:border-stone-500' : 'border-stone-300 group-hover:border-stone-400')}`}>{item.done && <CheckCircle2 size={10} />}</div>
                        <span className={`${item.done ? 'opacity-50 line-through' : ''} ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                 </div>
               </div>
             )}
            </motion.div>
           </AnimatePresence>
        </div>
      </div>

      <motion.div 
        animate={{ y: isFocusMode ? 100 : 0 }}
        className={`fixed bottom-0 left-0 right-0 h-16 border-t px-6 md:px-12 flex items-center justify-between z-30 transition-transform duration-500 ${isDark ? 'bg-[#121212] border-stone-800' : 'bg-white border-stone-200'}`}
      >
         <div className="flex items-center space-x-6">
            <button className={`flex items-center space-x-2 text-xs font-medium cursor-pointer hover:underline ${isDark ? 'text-stone-500' : 'text-stone-400'}`}><Layout size={14} /><span>Preview</span></button>
            <button className={`flex items-center space-x-2 text-xs font-medium cursor-pointer hover:underline ${isDark ? 'text-stone-500' : 'text-stone-400'}`}><History size={14} /><span>History</span></button>
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
};

export default NewsEditorPage;
