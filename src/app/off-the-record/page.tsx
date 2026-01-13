
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  Eye, 
  EyeOff, 
  Flame, 
  Clock, 
  Search, 
  Bookmark, 
  ThumbsUp, 
  MessageSquare, 
  ShieldAlert, 
  Lock, 
  X, 
  Send,
  ChevronRight,
  TrendingUp,
  Crown,
  Video,
  File,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

// --- Mock Data ---
const MOCK_TIPS = [
  {
    id: 1,
    title: "Merger talks between Tech Giant A and B have stalled completely.",
    category: "Business",
    timestamp: "2 hours ago",
    author: "Insider #992",
    verified: true,
    nsfw: false,
    userType: 'premium',
    likes: 342,
    comments: 45,
    content: "Sources close to the deal say the valuation gap is simply too wide. Expect a public statement withdrawing the offer by Friday.",
    image: null,
    videoUrl: null,
  },
  {
    id: 2,
    title: "Leaked set video from 'Galactic' sequel shows new ship design.",
    category: "Entertainment",
    timestamp: "4 hours ago",
    author: "SetRunner",
    verified: false,
    nsfw: true,
    userType: 'premium',
    likes: 1205,
    comments: 890,
    content: "They are definitely bringing back the original villain. Here is a short clip of the new starship landing.",
    image: null,
    videoUrl: "https://file-examples.com/storage/fe52cb0c4862dc676a1b341/2017/04/file_example_MP4_480_1_5MG.mp4"
  },
  {
    id: 3,
    title: "Cabinet Minister planning resignation over budget dispute.",
    category: "Politics",
    timestamp: "5 hours ago",
    author: "DeepThroat2.0",
    verified: true,
    nsfw: false,
    userType: 'standard',
    likes: 89,
    comments: 12,
    content: "The whispers in the capital are getting louder. The budget cuts to infrastructure were the final straw.",
    image: null,
    videoUrl: null
  },
  {
    id: 4,
    title: "Famous Pop Star seen arguing with label exec at fancy bistro.",
    category: "Celebrity",
    timestamp: "8 hours ago",
    author: "LatteSpy",
    verified: false,
    nsfw: false,
    userType: 'standard',
    likes: 567,
    comments: 201,
    content: "Voices were raised. Something about 'creative control' and 'contract breach'.",
    image: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=600",
    videoUrl: null
  },
  {
    id: 5,
    title: "Prototype for the new foldable phone breaks easily in cold weather.",
    category: "Tech",
    timestamp: "12 hours ago",
    author: "BetaTester",
    verified: true,
    nsfw: false,
    userType: 'premium',
    likes: 210,
    comments: 55,
    content: "Don't buy the first gen. Screen cracks at sub-zero temps.",
    image: null,
    videoUrl: null
  },
];

const TRENDING_TOPICS = ["#TechMerger", "#RoyalFamilyLeak", "#Election2026", "#CryptoCrash", "#SpaceX"];

// --- Components ---

const Badge = ({ children, variant = 'default', className = '' }) => {
  const styles = {
    default: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    premium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    outline: "border-slate-600 text-slate-400 bg-transparent hover:bg-slate-800"
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-emerald-900/20"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const TipCard = ({ tip, showNSFW }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBlurRevealed, setIsBlurRevealed] = useState(false);

  const isSensitive = tip.nsfw && !showNSFW;
  
  return (
    <div 
      className={`
        group relative overflow-hidden rounded-xl border transition-all duration-300
        ${isHovered ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/10 -translate-y-1' : 'border-white/5 bg-white/5'}
        backdrop-blur-md
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="p-5 relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-2">
            <Badge variant="default">{tip.category}</Badge>
            {tip.verified && (
              <Badge variant="warning" className="flex items-center gap-1">
                <ShieldAlert size={10} /> Verified
              </Badge>
            )}
            {tip.nsfw && <Badge variant="danger">NSFW</Badge>}
          </div>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock size={12} /> {tip.timestamp}
          </span>
        </div>

        <div 
          className={`transition-all duration-500 ${isSensitive && !isBlurRevealed ? 'blur-md select-none grayscale opacity-60' : ''}`}
          onMouseEnter={() => isSensitive && setIsBlurRevealed(true)}
          onMouseLeave={() => isSensitive && setIsBlurRevealed(false)}
        >
          <h3 className="text-lg font-serif font-medium text-slate-100 mb-2 leading-snug group-hover:text-emerald-300 transition-colors">
            {tip.title}
          </h3>
          
          <p className="text-sm text-slate-400 mb-4 line-clamp-3">
            {tip.content}
          </p>

          {(tip.image || tip.videoUrl) && (
            <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden bg-slate-950">
              {tip.videoUrl ? (
                <video src={tip.videoUrl} controls className="w-full h-full object-cover" />
              ) : (
                <Image 
                  src={tip.image} 
                  alt="Evidence" 
                  width={600}
                  height={338}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-700"
                />
              )}
            </div>
          )}
        </div>

        {isSensitive && !isBlurRevealed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
            <EyeOff className="text-slate-400 mb-2" size={32} />
            <span className="text-slate-400 text-sm font-medium">Sensitive Content</span>
            <span className="text-slate-600 text-xs mt-1">Hover to reveal</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {tip.userType === 'premium' && (
              <Badge variant="premium" className="flex items-center gap-1">
                <Crown size={10} /> Premium
              </Badge>
            )}
            <span className="bg-slate-800/50 px-2 py-1 rounded text-slate-400 font-mono">
              {tip.author}
            </span>
          </div>
          
          <div className="flex gap-3">
            <button className="text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-1 text-xs">
              <ThumbsUp size={14} /> {tip.likes}
            </button>
            <button className="text-slate-500 hover:text-blue-400 transition-colors flex items-center gap-1 text-xs">
              <MessageSquare size={14} /> {tip.comments}
            </button>
            <button className="text-slate-500 hover:text-yellow-400 transition-colors">
              <Bookmark size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FileUploader = ({ onFileSelect }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = React.useRef(null);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please select a file smaller than 50MB.",
        });
        return;
      }
      setFile(selectedFile);
      onFileSelect(selectedFile);
      // Simulate upload
      setIsUploading(true);
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const clearFile = () => {
    setFile(null);
    onFileSelect(null);
    setUploadProgress(0);
    setIsUploading(false);
    if(inputRef.current) {
        (inputRef.current as HTMLInputElement).value = '';
    }
  };

  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Evidence (Video/Image)</label>
      <input type="file" ref={inputRef} onChange={handleFileChange} accept="video/*,image/*" className="hidden" />
      
      {!file ? (
        <button type="button" onClick={() => inputRef.current?.click()} className="w-full border-2 border-dashed border-slate-700 rounded-lg p-6 text-slate-500 hover:text-white hover:border-slate-500 text-sm transition-all text-center">
          + Click to upload or drag & drop
          <span className="block text-xs mt-1">Max file size: 50MB</span>
        </button>
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center gap-3">
          {file.type.startsWith('video') ? <Video className="text-emerald-400" /> : <File className="text-emerald-400" />}
          <div className="flex-1">
            <p className="text-sm font-medium text-white truncate">{file.name}</p>
            <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          {isUploading && <Loader2 className="animate-spin text-slate-500" />}
          {!isUploading && uploadProgress === 100 && <CheckCircle2 className="text-green-500" />}
          <button type="button" onClick={clearFile} className="text-slate-500 hover:text-white"><X size={16} /></button>
        </div>
      )}
      
      {isUploading && (
        <div className="mt-2">
          <Progress value={uploadProgress} className="h-1 bg-slate-800" />
        </div>
      )}
    </div>
  );
};


export default function OffTheRecord() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showNSFW, setShowNSFW] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTips, setFilteredTips] = useState(MOCK_TIPS);
  const [fileToUpload, setFileToUpload] = useState(null);

  // Filtering Logic
  useEffect(() => {
    let result = MOCK_TIPS;

    if (activeCategory !== "All") {
      result = result.filter(tip => tip.category === activeCategory);
    }

    if (searchTerm) {
      result = result.filter(tip => 
        tip.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        tip.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTips(result);
  }, [activeCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-black pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-900 via-emerald-500 to-emerald-900 z-50 opacity-50" />

      <header className="relative z-10 pt-16 pb-12 px-4 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative">
          <Badge variant="outline" className="mb-4 inline-flex items-center gap-2 border-emerald-500/30 text-emerald-400">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Insider Feed
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-4 tracking-tight drop-shadow-lg">
            Off the Record
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8 font-light">
            Anonymous tips, unverified rumors, and behind-the-scenes updates. 
            <br className="hidden md:block" />
            <span className="text-slate-500 text-sm">Read with caution. Sources are protected.</span>
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-24 relative z-10">
        
        <div className="sticky top-0 z-30 py-4 mb-8 -mx-4 px-4 bg-slate-950/90 backdrop-blur-xl border-y border-white/5 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
              {["All", "Politics", "Business", "Celebrity", "Tech", "Entertainment"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                    ${activeCategory === cat 
                      ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'}
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden md:block group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search tips..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-full py-1.5 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 w-48 transition-all"
                />
              </div>

              <div className="h-6 w-px bg-slate-800 mx-1 hidden md:block" />

              <button 
                onClick={() => setShowNSFW(!showNSFW)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all
                  ${showNSFW 
                    ? 'border-rose-500/30 bg-rose-500/10 text-rose-400' 
                    : 'border-slate-800 bg-slate-900 text-slate-500 hover:text-slate-300'}
                `}
              >
                {showNSFW ? <Eye size={14} /> : <EyeOff size={14} />}
                {showNSFW ? 'Hide NSFW' : 'Show NSFW'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-slate-200 flex items-center gap-2">
                <Flame size={18} className="text-emerald-500" /> 
                Trending Tips
              </h2>
              <div className="flex gap-2">
                 <span className="text-xs text-slate-500">Sorted by: Newest</span>
              </div>
            </div>

            {filteredTips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTips.map((tip) => (
                  <TipCard key={tip.id} tip={tip} showNSFW={showNSFW} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl">
                <p className="text-slate-500">No tips found matching your criteria.</p>
                <button 
                  onClick={() => {setActiveCategory("All"); setSearchTerm("");}}
                  className="mt-4 text-emerald-400 hover:underline text-sm"
                >
                  Clear filters
                </button>
              </div>
            )}
            
            <div className="mt-12 text-center">
               <button className="px-6 py-3 rounded-full border border-slate-800 text-slate-400 hover:text-white hover:border-emerald-500/50 transition-all text-sm group">
                  Load older secrets <ChevronRight className="inline ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>

          <div className="hidden lg:block space-y-8">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-sm">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-400" />
                Hot Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TOPICS.map(topic => (
                  <button key={topic} className="px-3 py-1 bg-slate-800 hover:bg-emerald-900/30 hover:text-emerald-400 rounded text-xs text-slate-400 transition-colors">
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Bookmark size={64} className="text-white" />
               </div>
               <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Editor's Pick</h3>
               <p className="text-sm text-slate-400 italic mb-3">
                 "This story about the merger has been corroborated by three independent sources. Watch this space."
               </p>
               <div className="flex items-center gap-2 mt-4">
                 <div className="w-6 h-6 rounded-full bg-emerald-500" />
                 <span className="text-xs text-slate-300 font-medium">Chief Editor</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/30 border border-white/5 text-center">
                    <div className="text-2xl font-serif text-white">124</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Tips Today</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/30 border border-white/5 text-center">
                    <div className="text-2xl font-serif text-white">89%</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Anon Rate</div>
                </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setIsSubmitOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 md:w-auto md:h-auto md:px-6 md:py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95"
        >
          <Send size={20} className="md:mr-2" />
          <span className="hidden md:inline font-bold">Submit a Tip</span>
          
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        </button>
      </div>

      <Modal isOpen={isSubmitOpen} onClose={() => setIsSubmitOpen(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <h3 className="text-xl font-serif text-white flex items-center gap-2">
              <Lock size={20} className="text-emerald-400" />
              Secure Submission
            </h3>
            <button onClick={() => setIsSubmitOpen(false)} className="text-slate-500 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-emerald-900/20 border border-emerald-500/20 p-3 rounded-lg flex gap-3">
              <ShieldAlert className="text-emerald-400 shrink-0" size={20} />
              <p className="text-xs text-emerald-100/80">
                Your digital fingerprint is scrubbed before submission. Sources are never stored in our primary database.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Headline</label>
              <input 
                type="text" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all"
                placeholder="What's the scoop?" 
              />
            </div>
            
            <FileUploader onFileSelect={setFileToUpload} />

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Details</label>
              <textarea 
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all"
                placeholder="Provide as much context as possible..." 
              />
            </div>

            <div className="pt-2">
              <button className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                Encrypt & Submit <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <footer className="mt-20 border-t border-white/5 py-12 bg-black/40 text-center">
        <p className="text-slate-500 text-sm mb-4">
          Off the Record is a subsidiary of Kihumba. 
          <br />Content is largely unverified and should be treated as speculation until confirmed.
        </p>
        <div className="flex justify-center gap-6 text-xs text-slate-600 font-medium">
          <a href="#" className="hover:text-emerald-400 transition-colors">Anonymous Guidelines</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Report Harmful Content</a>
        </div>
      </footer>

    </div>
  );
}
