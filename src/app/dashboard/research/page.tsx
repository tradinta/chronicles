'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Link as LinkIcon, Image as ImageIcon, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ResearchPage = () => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="font-serif text-3xl font-bold">Research & Notes</h1>
                    <p className="text-muted-foreground mt-1">Organize your sources, references, and ideas.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm"><LinkIcon className="w-4 h-4 mr-2" /> Add Link</Button>
                    <Button size="sm"><Plus className="w-4 h-4 mr-2" /> New Note</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Search Column */}
                <div className="space-y-4">
                    <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                        <h3 className="font-bold mb-3 flex items-center gap-2"><Search className="w-4 h-4 text-primary" /> Integrated Search</h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search web sources..."
                                className="w-full bg-muted/50 px-3 py-2 rounded-md text-sm border border-transparent focus:border-primary focus:outline-none transition-colors"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono border border-border px-1.5 rounded">CMD+K</div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono mb-2">Recent Searches</p>
                            {['Global warming impact 2025', 'Crypto regulations EU', 'SpaceX Starship timeline', 'Modernist typography'].map((s, i) => (
                                <div key={i} className="text-sm p-2 hover:bg-muted rounded cursor-pointer transition-colors flex items-center justify-between group">
                                    <span>{s}</span>
                                    <ArrowIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Notes Grid */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <NoteCard
                        title="Article Ideas: Feb"
                        preview="1. The rise of bio-hacking in suburban America. 2. Interview with the new AI czar. 3. Photo essay: Abandoned malls."
                        tag="Ideas"
                        date="2h ago"
                    />
                    <NoteCard
                        title="Sources: Financial Crisis"
                        preview="https://bloomberg.com/news/... - Check the graph on page 4. Need to verify the inflation numbers with the Fed report."
                        tag="Sources"
                        type="link"
                        date="Yesterday"
                    />
                    <NoteCard
                        title="Interview Questions for Sarah"
                        preview="- How did you start your journey? - What was the biggest challenge in 2024? - Where do you see the industry going?"
                        tag="Interview"
                        date="Oct 20"
                    />
                    <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors cursor-pointer min-h-[160px] group">
                        <div className="p-3 bg-muted rounded-full group-hover:scale-110 transition-transform mb-3">
                            <Plus className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-sm">Create new note</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

function NoteCard({ title, preview, tag, date, type = 'text' }: any) {
    return (
        <div className="bg-card border border-border p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full min-h-[160px]">
            <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${tag === 'Ideas' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                        tag === 'Sources' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                            'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}>{tag}</span>
                {type === 'link' ? <LinkIcon className="w-3 h-3 text-muted-foreground" /> : <FileText className="w-3 h-3 text-muted-foreground" />}
            </div>
            <h4 className="font-serif font-bold text-lg mb-2 leading-tight">{title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">{preview}</p>
            <div className="text-[10px] text-muted-foreground/60 font-mono mt-auto pt-2 border-t border-border/50 w-full">
                Updated {date}
            </div>
        </div>
    )
}

const ArrowIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg>
)

export default ResearchPage;
