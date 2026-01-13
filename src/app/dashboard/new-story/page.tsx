'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Send,
  Layout,
  ChevronDown,
  Hash,
  ChevronRight,
  AlignLeft,
  CheckCircle2,
  Globe,
  Plus,
  MoreVertical,
  Type,
  Quote,
  Image as ImageIcon,
  User,
  MapPin,
  Calendar as CalendarIcon,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// --- Reusable Editor Block Components ---

const EditorParagraph = ({ content, placeholder, isDark }) => (
  <div
    contentEditable
    suppressContentEditableWarning
    className={`editor-placeholder outline-none text-lg md:text-xl leading-[1.8] font-serif transition-colors
      ${isDark ? 'text-stone-300' : 'text-stone-700'}
    `}
    placeholder={placeholder}
  >
    {content}
  </div>
);

const EditorH2 = ({ content, placeholder, isDark }) => (
  <div
    contentEditable
    suppressContentEditableWarning
    className={`editor-placeholder outline-none text-3xl font-serif font-medium my-8
       ${isDark ? 'text-stone-100' : 'text-stone-900'}
    `}
    placeholder={placeholder}
  >
    {content}
  </div>
);

const EditorQuote = ({ content, placeholder, isDark }) => (
  <div className={`my-12 py-8 border-y-2 text-center ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
    <Quote size={24} className={`mx-auto mb-4 ${isDark ? 'text-orange-500' : 'text-orange-400'}`} />
    <div
      contentEditable
      suppressContentEditableWarning
      className={`editor-placeholder text-2xl md:text-3xl font-serif font-bold italic outline-none ${isDark ? 'text-stone-100' : 'text-stone-900'}`}
      placeholder={placeholder}
    >
      {content}
    </div>
  </div>
);

const EditorBlock = ({ type, content, placeholder }) => {
  const isDark = false; // Simplified for block scope

  const renderBlock = () => {
    switch (type) {
      case 'h2':
        return <EditorH2 content={content} placeholder={placeholder} isDark={isDark} />;
      case 'quote':
        return <EditorQuote content={content} placeholder={placeholder} isDark={isDark} />;
      case 'paragraph':
      default:
        return <EditorParagraph content={content} placeholder={placeholder} isDark={isDark} />;
    }
  };

  return (
    <div className="relative group my-4">
      {renderBlock()}
      <div className="absolute -left-12 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
        <button className={`p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-800 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}><Plus size={16} /></button>
        <button className={`p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-800 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}><MoreVertical size={16} /></button>
      </div>
    </div>
  );
};


// --- Main Page Component ---

export default function NewsEditorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isBreaking, setIsBreaking] = useState(false);
  const isDark = false; // Simplified

  return (
    <div className={`min-h-screen relative flex flex-col transition-colors duration-500 ${isDark ? 'bg-[#121212]' : 'bg-[#FDFBF7]'}`}>
      
      {/* --- Header --- */}
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
        <div className="flex items-center space-x-6">
            <div className={`flex items-center space-x-2 text-xs font-mono ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               <span>Saved moments ago</span>
            </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className={`flex-1 pt-16 pb-16 transition-all duration-300 ${isSidebarOpen ? 'pr-0 md:pr-[320px]' : 'pr-0'}`}>
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
          
          {/* --- Story Metadata Header --- */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12 space-y-6">
            <input type="text" placeholder="Headline" autoFocus className={`w-full bg-transparent outline-none font-serif text-5xl md:text-6xl font-bold leading-[1.1] placeholder-opacity-30 ${isDark ? 'text-stone-100 placeholder-stone-700' : 'text-stone-900 placeholder-stone-300'}`} />
            <Textarea placeholder="Optional subheading to provide a short summary..." className="bg-transparent text-lg font-sans text-muted-foreground placeholder:text-muted-foreground/50 border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none" rows={2} />
            <Input type="text" placeholder="Add tags... (e.g. #election, #economy)" className={`bg-transparent w-full text-sm outline-none px-0 border-0 border-b rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 ${isDark ? 'text-stone-300 placeholder-stone-700 border-stone-800 focus:border-stone-400' : 'text-stone-700 placeholder-stone-300 border-stone-200 focus:border-stone-500'}`} />
          </motion.div>

          {/* --- Editor Body --- */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="min-h-[500px]">
            <EditorBlock type="paragraph" placeholder="Tell your story..." />
            <EditorBlock type="h2" placeholder="An Optional Subheading" />
            <EditorBlock type="paragraph" content="The quick brown fox jumps over the lazy dog. A compelling narrative often contains a mix of exposition, rising action, and a satisfying conclusion." />
            <EditorBlock type="quote" placeholder="A powerful quote goes here..." />
            <EditorBlock type="paragraph" content="" />
          </motion.div>

        </div>
      </main>
      
      {/* --- Right Sidebar --- */}
      <aside className={`fixed right-0 top-16 bottom-16 w-[320px] border-l transform transition-transform duration-300 z-20 overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} ${isDark ? 'bg-[#181818] border-stone-800' : 'bg-white border-stone-200'}`}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`absolute -left-8 top-6 p-1.5 rounded-l border-y border-l shadow-sm md:block hidden ${isDark ? 'bg-[#181818] border-stone-800 text-stone-400' : 'bg-white border-stone-200 text-stone-500'}`}>
          {isSidebarOpen ? <ChevronRight size={16} /> : <AlignLeft size={16} />}
        </button>
        
        <div className="p-6 space-y-8">
          {/* Story Metadata Panel */}
          <div>
            <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 flex items-center ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
              <CheckCircle2 size={12} className="mr-2" /> Story Metadata
            </h4>
            <div className="space-y-4 text-sm">
                <Select>
                  <SelectTrigger className="w-full text-xs"><SelectValue placeholder="Select Category" /></SelectTrigger>
                  <SelectContent>
                    {['World', 'Politics', 'Business', 'Technology', 'Culture', 'Science'].map(cat => <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full text-xs"><SelectValue placeholder="Select Author" /></SelectTrigger>
                  <SelectContent>
                    {['Sarah Jenkins', 'Felix R.', 'Anonymous'].map(author => <SelectItem key={author} value={author}>{author}</SelectItem>)}
                  </SelectContent>
                </Select>
                 <Input type="text" placeholder="Location (e.g. London, UK)" className="text-xs" />
                <div className="flex items-center justify-between pt-2">
                    <label htmlFor="breaking-news" className={`flex items-center space-x-2 text-xs font-medium cursor-pointer ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                      <AlertTriangle size={14} />
                      <span>Breaking News</span>
                    </label>
                    <Switch id="breaking-news" checked={isBreaking} onCheckedChange={setIsBreaking} />
                </div>
            </div>
          </div>
          
          {/* Pre-Flight Checklist */}
          <div>
            <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 flex items-center ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
               Pre-Flight
            </h4>
            <div className="space-y-3">
              {[
                { label: "Headline optimized", done: true }, 
                { label: "Subheading added", done: false },
                { label: "Featured image added", done: false },
                { label: "Category selected", done: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 text-sm">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${item.done ? (isDark ? 'bg-green-900/20 border-green-800 text-green-600' : 'bg-green-100 border-green-300 text-green-600') : (isDark ? 'border-stone-700' : 'border-stone-300')}`}>
                    {item.done && <CheckCircle2 size={10} />}
                  </div>
                  <span className={`${item.done ? 'opacity-50 line-through' : ''} ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Preview */}
          <div>
            <h4 className={`text-xs font-bold tracking-widest uppercase mb-4 flex items-center ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
              <Globe size={12} className="mr-2" /> SEO Preview
            </h4>
            <div className={`p-4 rounded text-sm ${isDark ? 'bg-stone-800/50' : 'bg-stone-50'}`}>
              <div className="text-blue-500 text-base font-medium truncate mb-1">Headline Preview | The Chronicle</div>
              <div className="text-green-600 text-xs mb-2">www.chronicle.com/news/story-slug</div>
              <div className={`text-xs leading-snug ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>This is how your story will appear in search results.</div>
            </div>
          </div>
        </div>
      </aside>

      {/* --- Footer --- */}
      <footer className={`fixed bottom-0 left-0 right-0 h-16 border-t px-6 md:px-12 flex items-center justify-between z-30 ${isDark ? 'bg-[#121212] border-stone-800' : 'bg-white border-stone-200'}`}>
        <div className="flex items-center space-x-6">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Layout size={14} />
            <span>Preview</span>
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Save size={16} />
            <span>Save Draft</span>
          </Button>
          <Button variant="outline" size="sm">
            <CalendarIcon size={14} />
            <span>Schedule</span>
          </Button>
          <Button className="shadow-lg">
            <span>Publish</span>
            <Send size={14} />
          </Button>
        </div>
      </footer>
    </div>
  );
}
