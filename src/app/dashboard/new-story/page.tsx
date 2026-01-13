
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Send,
  Layout,
  ChevronRight,
  AlignLeft,
  CheckCircle2,
  Globe,
  User,
  AlertTriangle,
  FileText,
  BarChart,
  LayoutTemplate,
  MessageCircle,
  Image as ImageIcon,
  Quote,
  GripVertical,
  UserPlus,
  MapPin,
  Calendar,
  Loader2,
  UploadCloud
} from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { createArticle } from '@/firebase/firestore/articles';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const EditorBlock = ({ type, content, isDark, placeholder, onContentChange }) => {
  return (
    <div className="relative group mb-4">
      <div className="absolute -left-12 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
        <div className="cursor-grab text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"><GripVertical size={16} /></div>
      </div>

      {type === 'h2' && (
        <div 
          contentEditable suppressContentEditableWarning
          onBlur={e => onContentChange(e.currentTarget.textContent || '')}
          className={`editor-placeholder text-3xl font-serif font-medium mb-4 outline-none ${isDark ? 'text-stone-200' : 'text-stone-800'}`}
          placeholder={placeholder || "Heading"}
        >{content}</div>
      )}
      {type === 'paragraph' && (
        <div 
          contentEditable suppressContentEditableWarning
          onBlur={e => onContentChange(e.currentTarget.textContent || '')}
          className={`editor-placeholder text-lg font-sans leading-relaxed outline-none ${isDark ? 'text-stone-300' : 'text-stone-800'}`}
          placeholder={placeholder || "Start typing..."}
        >{content}</div>
      )}
      {/* Other block types can be expanded similarly */}
    </div>
  );
};


export default function NewsEditorPage() {
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isBreaking, setIsBreaking] = useState(false);

  // Story state
  const [headline, setHeadline] = useState('');
  const [subheading, setSubheading] = useState('');
  const [blocks, setBlocks] = useState([
    { id: 1, type: 'paragraph', content: "" },
  ]);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { user } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleBlockContentChange = (index, newContent) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index].content = newContent;
    setBlocks(updatedBlocks);
  };
  
  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const response = await fetch('/api/sign-image', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      const { signature, timestamp, public_id } = await response.json();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '631177719182385');
      
      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'doyg2puov'}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const uploadedImageData = await uploadResponse.json();
      
      if (uploadedImageData.secure_url) {
        setImageUrl(uploadedImageData.secure_url);
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Upload Failed', description: 'Could not upload image.' });
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  }
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  }

  const handlePublish = async () => {
    if (!firestore || !user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be signed in to publish.' });
      return;
    }
    if (!headline) {
      toast({ variant: 'destructive', title: 'Headline Required', description: 'Please add a headline before publishing.' });
      return;
    }

    try {
      await createArticle(firestore, {
        title: headline,
        summary: subheading,
        content: JSON.stringify(blocks),
        imageUrl: imageUrl,
        authorId: user.uid,
        category: 'Politics', // Hardcoded for now
      });
      toast({ title: 'Published!', description: 'Your story is now live.' });
      router.push('/news');
    } catch(e) {
      console.error(e);
      // Error is handled by global error emitter in createArticle
    }
  }


  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, []);


  return (
    <div className={`min-h-screen pt-20 relative flex transition-colors duration-500 ${isDark ? 'bg-[#121212]' : 'bg-[#FDFBF7]'}`}>
      
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-30 h-16 border-b px-6 flex items-center justify-between transition-colors duration-300 ${isDark ? 'bg-[#121212] border-stone-800' : 'bg-white border-stone-200'}`}>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className={`p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
            <ArrowLeft size={18} />
          </Link>
          <div className="flex flex-col">
            <span className={`text-xs font-bold tracking-widest uppercase ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
              Drafting
            </span>
            <span className={`text-sm font-serif font-bold ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>
               Standard Report
            </span>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pr-0 md:pr-[340px]' : 'pr-0'}`}>
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
          
          <div className="mb-12 border-b border-stone-200 dark:border-stone-800 pb-8">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                   <button className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border transition-colors ${isDark ? 'border-stone-700 text-stone-400' : 'border-stone-300 text-stone-500'}`}>Politics</button>
                   <span className={`text-[10px] ${isDark ? 'text-stone-600' : 'text-stone-400'}`}>/</span>
                   <button className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border transition-colors ${isDark ? 'border-stone-700 text-stone-400' : 'border-stone-300 text-stone-500'}`}>Elections</button>
                </div>
                <div 
                   onClick={() => setIsBreaking(!isBreaking)}
                   className={`flex items-center space-x-2 px-3 py-1 rounded-full cursor-pointer transition-colors ${isBreaking ? 'bg-red-500 text-white' : (isDark ? 'bg-stone-800 text-stone-500' : 'bg-stone-100 text-stone-400')}`}
                >
                   <AlertTriangle size={12} strokeWidth={isBreaking ? 2 : 1.5} />
                   <span className="text-[10px] font-bold uppercase tracking-wider">Breaking News</span>
                </div>
             </div>

             <input 
               type="text" 
               placeholder="Headline" 
               autoFocus
               value={headline}
               onChange={(e) => setHeadline(e.target.value)}
               className={`w-full bg-transparent outline-none font-serif text-5xl md:text-6xl font-bold leading-[1.1] mb-4 placeholder-opacity-30 ${isDark ? 'text-stone-100 placeholder-stone-700' : 'text-stone-900 placeholder-stone-300'}`}
             />
             <input 
               type="text" 
               placeholder="Subheading or summary (optional)" 
               value={subheading}
               onChange={(e) => setSubheading(e.target.value)}
               className={`w-full bg-transparent outline-none text-xl font-light mb-6 placeholder-opacity-50 ${isDark ? 'text-stone-400 placeholder-stone-700' : 'text-stone-600 placeholder-stone-300'}`}
             />

             <div className="flex items-center space-x-6 text-xs">
                <div className={`flex items-center space-x-2 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                   <UserPlus size={14} />
                   <span className="font-medium">{user?.displayName || 'Sarah Jenkins'}</span>
                </div>
                <div className={`flex items-center space-x-2 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                   <MapPin size={14} />
                   <span className="font-medium">Washington, D.C.</span>
                </div>
                <div className={`flex items-center space-x-2 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                   <Calendar size={14} />
                   <span className="font-medium">Draft • {new Date().toLocaleDateString()}</span>
                </div>
             </div>
          </div>

          <div className="min-h-[500px] pb-32 relative">
             <div 
                className={`relative my-8 p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${isDark ? 'border-stone-800 bg-stone-900/50 hover:border-stone-700' : 'border-stone-300 bg-stone-50 hover:border-stone-400'}`}
                onDragOver={onDragOver}
                onDrop={onDrop}
              >
               <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                  accept="image/*"
                />
                {isUploading ? (
                  <div className="text-center">
                    <Loader2 className={`mx-auto h-8 w-8 animate-spin ${isDark ? 'text-stone-400' : 'text-stone-500'}`} />
                    <p className={`text-sm mt-2 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Uploading...</p>
                  </div>
                ) : imageUrl ? (
                  <img src={imageUrl} alt="Uploaded preview" className="max-h-64 rounded-md object-contain" />
                ) : (
                  <div className="text-center">
                    <UploadCloud className={`mx-auto h-10 w-10 ${isDark ? 'text-stone-500' : 'text-stone-400'}`} />
                    <p className={`mt-4 text-sm font-medium ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                      <span className="text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className={`mt-1 text-xs ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
             </div>

             {blocks.map((block, index) => (
                <EditorBlock 
                  key={block.id} 
                  type={block.type} 
                  content={block.content} 
                  isDark={isDark} 
                  placeholder={index === 0 ? "Start your story here..." : "Continue writing..."}
                  onContentChange={(newContent) => handleBlockContentChange(index, newContent)}
                />
             ))}
          </div>

        </div>
      </main>

      {/* Right Sidebar */}
      <aside className={`fixed right-0 top-16 bottom-16 w-[340px] border-l transform transition-transform duration-300 z-20 overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} ${isDark ? 'bg-[#181818] border-stone-800' : 'bg-white border-stone-200'}`}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`absolute -left-8 top-6 p-1.5 rounded-l border-y border-l shadow-sm md:block hidden ${isDark ? 'bg-[#181818] border-stone-800 text-stone-400' : 'bg-white border-stone-200 text-stone-500'}`}>
          {isSidebarOpen ? <ChevronRight size={16} /> : <AlignLeft size={16} />}
        </button>
        
        <div className="p-6 space-y-8">
           {/* Checklist */}
           <div>
            <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 flex items-center ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
              <CheckCircle2 size={12} className="mr-2" /> Pre-Flight
            </h4>
            <div className="space-y-3">
              {[
                  { label: "Headline written", done: !!headline }, 
                  { label: "Lead image added", done: !!imageUrl }, 
                  { label: "Tags selected", done: false }
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 text-sm">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${item.done ? (isDark ? 'bg-green-900/20 border-green-800 text-green-600' : 'bg-green-100 border-green-300 text-green-600') : (isDark ? 'border-stone-700' : 'border-stone-300')}`}>{item.done && <CheckCircle2 size={10} />}</div>
                  <span className={`${item.done ? (isDark ? 'text-stone-400': 'text-stone-600') : (isDark ? 'text-stone-300' : 'text-stone-700')}`}>{item.label}</span>
                </div>
              ))}
            </div>
           </div>

           {/* SEO */}
           <div>
            <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 flex items-center ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
              <Globe size={12} className="mr-2" /> SEO Preview
            </h4>
            <div className={`p-4 rounded text-sm ${isDark ? 'bg-stone-800/50' : 'bg-stone-50'}`}>
               <div className="text-blue-500 text-base font-medium truncate mb-1">{headline || 'Headline Preview'} | Kihumba</div>
               <div className="text-green-600 text-xs mb-2">www.kihumba.com/news/story-slug</div>
               <div className={`text-xs leading-snug ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>{subheading || 'This is how your story will appear in search results.'}</div>
            </div>
           </div>
        </div>
      </aside>

      {/* Footer Actions */}
      <footer className={`fixed bottom-0 left-0 right-0 h-16 border-t px-6 md:px-12 flex items-center justify-between z-30 ${isDark ? 'bg-[#121212] border-stone-800' : 'bg-white border-stone-200'}`}>
         <div className="flex items-center space-x-6">
            <div className={`flex items-center space-x-2 text-xs font-medium cursor-pointer hover:underline ${isDark ? 'text-stone-500' : 'text-stone-400'}`}><Layout size={14} /><span>Preview</span></div>
         </div>
         <div className="flex items-center space-x-4">
            <button className={`px-4 py-2 rounded text-sm font-medium transition-colors ${isDark ? 'text-stone-400 hover:bg-stone-800' : 'text-stone-600 hover:bg-stone-100'}`}>Save Draft</button>
            <button onClick={handlePublish} className={`px-6 py-2 rounded-full text-sm font-bold tracking-wide uppercase text-white shadow-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 transition-colors flex items-center space-x-2`}>
               <span>Publish</span>
               <Send size={14} />
            </button>
         </div>
      </footer>
    </div>
  );
};

    