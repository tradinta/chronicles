
'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, AlignLeft, CheckCircle2, Bot, Book, Globe, X, Wand2, BrainCircuit } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { generateHeadlines, improveWriting } from '@/ai/flows/editor-flow';

const SidebarTab = ({ id, icon: Icon, label, activeTab, setActiveTab }) => (
    <button
      onClick={() => setActiveTab(id)}
      className="relative flex-1 flex flex-col items-center justify-center p-4 transition-colors duration-300 group"
    >
      <Icon size={20} className={`transition-colors ${activeTab === id ? 'text-primary' : 'text-stone-500 dark:text-stone-400 group-hover:text-stone-200'}`} />
      <span className={`text-[10px] mt-1 font-bold transition-colors ${activeTab === id ? 'text-primary' : 'text-stone-600 dark:text-stone-500 group-hover:text-stone-300'}`}>{label}</span>
      {activeTab === id && (
        <motion.div layoutId="sidebar-active-indicator" className="absolute bottom-0 h-0.5 w-full bg-primary" />
      )}
    </button>
);
  
const ArticleOutline = ({ blocks }) => {
    const headings = blocks.filter(b => b.type === 'h2');
    if (headings.length === 0) {
        return <div className="text-center text-xs text-stone-500 py-8">Add H2 blocks to see an outline.</div>;
    }
    return (
        <ul className="space-y-2">
            {headings.map(h => (
                <li key={h.id} className="text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors cursor-pointer truncate">
                    {h.content || 'Untitled Heading'}
                </li>
            ))}
        </ul>
    );
};

const SEOPreview = ({ headline, subheading, isDark }) => (
    <div className={`p-4 rounded-lg text-sm border ${isDark ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-stone-200'}`}>
       <div className="text-blue-600 dark:text-blue-400 text-base font-medium truncate mb-1">{headline || "Your Headline Will Appear Here..."} | Kihumba</div>
       <div className="text-green-700 dark:text-green-500 text-xs mb-2">https://kihumba.com/news/story-slug</div>
       <p className={`text-xs leading-snug ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
         {subheading || "This is how your story will appear in search results. Make sure to include relevant keywords and a compelling summary."}
       </p>
    </div>
);

const PreFlightChecklist = ({ checklistItems, isDark }) => (
    <div className="space-y-3">
        {checklistItems.map((item, i) => (
            <div key={i} className="flex items-center space-x-3 text-sm group cursor-pointer">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${item.done ? 'bg-green-500 border-green-500' : (isDark ? 'border-stone-700 group-hover:border-stone-500' : 'border-stone-300 group-hover:border-stone-400')}`}>
                    {item.done && <CheckCircle2 size={10} className="text-white dark:text-stone-900" />}
                </div>
                <span className={`transition-colors ${item.done ? 'text-stone-500 line-through' : (isDark ? 'text-stone-300' : 'text-stone-700')}`}>{item.label}</span>
            </div>
        ))}
    </div>
);


const EditorSidebar = ({ isOpen, setIsOpen, isFocusMode, isDark, headline, subheading, blocks, tags, setTags, coverImageUrl }) => {
    const [activeTab, setActiveTab] = useState('checklist');
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [isLoadingAi, setIsLoadingAi] = useState(false);

    const checklistItems = useMemo(() => [
        { label: "Headline between 40-60 characters", done: headline.length >= 40 && headline.length <= 60 },
        { label: "Add a lead image", done: !!coverImageUrl },
        { label: "Add at least 3 tags", done: tags.length >= 3 },
        { label: "Write more than 300 words", done: blocks.reduce((acc, b) => acc + b.content.split(' ').length, 0) > 300 },
        { label: "Check for passive voice", done: false },
    ], [headline, coverImageUrl, tags.length, blocks]);

    const progress = useMemo(() => {
        const completed = checklistItems.filter(item => item.done).length;
        return (completed / checklistItems.length) * 100;
    }, [checklistItems]);

    const handleGenerateHeadlines = async () => {
        setIsLoadingAi(true);
        setAiSuggestions([]);
        try {
            const content = blocks.map(b => b.content).join(' ');
            const result = await generateHeadlines({ content, existingHeadline: headline });
            setAiSuggestions(result.headlines);
        } catch (error) {
            console.error("AI headline generation failed:", error);
            setAiSuggestions(['AI suggestion failed.']);
        } finally {
            setIsLoadingAi(false);
        }
    };

    const handleImproveWriting = async () => {
        setIsLoadingAi(true);
        setAiSuggestions([]);
         try {
            const content = blocks.map(b => b.content).join(' ');
            const result = await improveWriting({ text: content });
            setAiSuggestions([result.improvedText]);
        } catch (error) {
            console.error("AI writing improvement failed:", error);
            setAiSuggestions(['AI suggestion failed.']);
        } finally {
            setIsLoadingAi(false);
        }
    }
    
    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          const value = e.currentTarget.value.trim();
          if (value && !tags.includes(value)) {
            setTags([...tags, value]);
          }
          e.currentTarget.value = '';
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };
  
    return (
      <div className={`
        flex flex-col h-full
        ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}
      `}>
        <div className={`h-16 border-b flex items-center px-4 ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
           <h3 className="font-serif text-lg font-semibold">Studio</h3>
        </div>

        <div className={`h-16 border-b flex items-center px-2 ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
            <SidebarTab id="checklist" icon={CheckCircle2} label="Checklist" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarTab id="ai" icon={BrainCircuit} label="Co-pilot" activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
           <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
             {activeTab === 'checklist' && (
               <div className="space-y-8">
                 <div>
                    <div className="flex justify-between items-end mb-4">
                       <h4 className="text-xs font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400">Progress</h4>
                       <span className="text-xs font-mono text-primary">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                 </div>
                 <div>
                    <h4 className="text-xs font-bold tracking-widest uppercase mb-4 text-stone-500 dark:text-stone-400">Pre-Flight</h4>
                    <PreFlightChecklist checklistItems={checklistItems} isDark={isDark}/>
                 </div>
                 <div>
                    <h4 className="text-xs font-bold tracking-widest uppercase mb-4 text-stone-500 dark:text-stone-400">Article Outline</h4>
                    <ArticleOutline blocks={blocks} />
                 </div>
                 <div>
                    <h4 className="text-xs font-bold tracking-widest uppercase mb-4 text-stone-500 dark:text-stone-400">Tags</h4>
                    <div className={`flex flex-wrap gap-2 p-2 rounded-lg border min-h-[40px] ${isDark ? 'bg-stone-800/50 border-stone-700' : 'bg-white border-stone-200'}`}>
                        {tags.map(tag => (
                            <div key={tag} className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${isDark ? 'bg-stone-700 text-stone-300' : 'bg-stone-200 text-stone-700'}`}>
                                <span>{tag}</span>
                                <button onClick={() => removeTag(tag)} className='hover:text-red-500'><X size={12} /></button>
                            </div>
                        ))}
                        <input onKeyDown={handleTagKeyDown} type="text" placeholder="Add tag..." className={`flex-1 bg-transparent text-xs outline-none ${isDark ? 'placeholder-stone-600' : 'placeholder-stone-400'}`} />
                    </div>
                 </div>
                 <div>
                    <h4 className="text-xs font-bold tracking-widest uppercase mb-4 text-stone-500 dark:text-stone-400">Search Preview</h4>
                    <SEOPreview headline={headline} subheading={subheading} isDark={isDark} />
                 </div>
               </div>
             )}
             {activeTab === 'ai' && (
                <div className="space-y-6">
                   <div className={`p-4 rounded-lg border flex flex-col text-center space-y-3 ${isDark ? 'bg-indigo-900/10 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200'}`}>
                      <Wand2 size={24} className="text-indigo-500 mx-auto" />
                      <div>
                         <h4 className={`text-sm font-bold ${isDark ? 'text-indigo-200' : 'text-indigo-900'}`}>Headline Assistant</h4>
                         <p className={`text-xs mt-1 ${isDark ? 'text-indigo-300/70' : 'text-indigo-700/70'}`}>Generate variations based on article content.</p>
                      </div>
                      <button onClick={handleGenerateHeadlines} disabled={isLoadingAi} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase rounded shadow-lg transition-colors disabled:opacity-50">
                          {isLoadingAi ? 'Generating...' : 'Generate Headlines'}
                      </button>
                      <button onClick={handleImproveWriting} disabled={isLoadingAi} className="w-full py-2 bg-indigo-600/50 hover:bg-indigo-500/50 text-white text-xs font-bold uppercase rounded shadow-lg transition-colors disabled:opacity-50">
                          {isLoadingAi ? 'Improving...' : 'Improve Writing'}
                      </button>
                   </div>
                   {aiSuggestions.length > 0 && (
                      <div>
                          <h4 className="text-xs font-bold tracking-widest uppercase mb-3 text-stone-500 dark:text-stone-400">Suggestions</h4>
                          <div className="space-y-2">
                              {aiSuggestions.map((s, i) => (
                                  <p key={i} className="text-sm p-3 bg-stone-800 rounded border border-stone-700 text-stone-300 cursor-pointer hover:bg-stone-700">{s}</p>
                              ))}
                          </div>
                      </div>
                   )}
                </div>
             )}
            </motion.div>
           </AnimatePresence>
        </div>
      </div>
    );
};

export default EditorSidebar;
