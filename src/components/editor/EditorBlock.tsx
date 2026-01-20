
'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Type, Quote, Heading2, ImageIcon, Sparkles, Bold, Italic, Link as LinkIcon, Heading1 } from 'lucide-react';
import Image from 'next/image';
import { PhotoUploader } from '@/components/shared/photo-uploader';

const EditorFloatingToolbar = ({ isDark, isVisible }) => {
  if (!isVisible) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`absolute -top-12 left-0 flex items-center space-x-1 p-1 rounded-lg shadow-xl border z-20 ${isDark ? 'bg-stone-800 border-stone-700 text-stone-300' : 'bg-white border-stone-200 text-stone-600'}`}
    >
      <button className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded"><Bold size={14} /></button>
      <button className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded"><Italic size={14} /></button>
      <button className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded"><LinkIcon size={14} /></button>
      <div className="w-px h-4 bg-stone-300 dark:bg-stone-600 mx-1"></div>
      <button className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded"><Heading1 size={14} /></button>
      <button className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded"><Heading2 size={14} /></button>
    </motion.div>
  );
};

import { EditorReference } from './EditorReference';
import { EditorEmbed } from './EditorEmbed';

// ... (Toolbar remains same, verify imports)

interface EditorBlockProps {
  block: { id: number; type: string; content: string; source?: string; imageUrl?: string; caption?: string; email?: string; url?: string; };
  updateBlock: (id: number, updatedValues: object) => void;
  isDark: boolean;
}

const EditorBlock = ({ block, updateBlock, isDark }: EditorBlockProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const { id, type, content, source, imageUrl, caption, email, url } = block;

  return (
    <div
      className="relative group mb-6"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div className="absolute -left-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
        {/* Added a remove button for convenience */}
        <div className="cursor-grab text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"><GripVertical size={16} /></div>
      </div>

      <div className="relative">
        <EditorFloatingToolbar isDark={isDark} isVisible={isFocused && type === 'paragraph'} />

        {type === 'h2' && (
          <div contentEditable suppressContentEditableWarning onBlur={e => updateBlock(id, { content: e.currentTarget.innerHTML })} className={`editor-placeholder text-3xl font-serif font-bold tracking-tight mb-4 outline-none ${isDark ? 'text-stone-100' : 'text-stone-900'}`} placeholder="Heading">{content}</div>
        )}

        {type === 'paragraph' && (
          <div contentEditable suppressContentEditableWarning onBlur={e => updateBlock(id, { content: e.currentTarget.innerHTML })} className={`editor-placeholder text-xl font-serif leading-[1.8] outline-none ${isDark ? 'text-stone-300' : 'text-stone-800'}`} placeholder="Start typing...">{content}</div>
        )}

        {type === 'quote' && (
          <div className={`my-8 pl-8 border-l-4 ${isDark ? 'border-primary' : 'border-primary'}`}>
            <div contentEditable suppressContentEditableWarning onBlur={e => updateBlock(id, { content: e.currentTarget.innerHTML })} className={`text-2xl font-serif italic outline-none mb-3 ${isDark ? 'text-stone-200' : 'text-stone-900'}`} placeholder="Quote text...">{content}</div>
            <div className="flex items-center space-x-2">
              <div className="h-px w-8 bg-stone-400"></div>
              <div contentEditable suppressContentEditableWarning onBlur={e => updateBlock(id, { source: e.currentTarget.innerText })} className="text-xs font-bold uppercase tracking-widest opacity-70 outline-none" placeholder="Source Name">{source}</div>
            </div>
          </div>
        )}

        {type === 'reference' && (
          <EditorReference
            initialEmail={email}
            onResolve={(name, email) => updateBlock(id, { content: name, email: email })}
            isDark={isDark}
          />
        )}

        {type === 'embed' && (
          <EditorEmbed
            initialUrl={url}
            onUpdate={(url) => updateBlock(id, { url: url })}
            isDark={isDark}
          />
        )}

        {type === 'image' && (
          <div className={`my-8 relative group rounded-lg overflow-hidden border transition-all ${isDark ? 'border-stone-800 bg-stone-900/50' : 'border-stone-200 bg-stone-50'}`}>
            <PhotoUploader
              initialImage={imageUrl || null}
              onUploadComplete={(url) => updateBlock(id, { imageUrl: url })}
              className="w-full aspect-video flex items-center justify-center"
              imageClassName="w-full h-full object-cover"
            >
              <div className={`aspect-video flex flex-col items-center justify-center transition-colors ${isDark ? 'bg-stone-800/50' : 'bg-stone-100'}`}>
                <ImageIcon size={32} className={`mb-3 ${isDark ? 'text-stone-600' : 'text-stone-400'}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>Drag Media Here</span>
              </div>
            </PhotoUploader>
            <input
              value={caption || ''}
              onChange={(e) => updateBlock(id, { caption: e.target.value })}
              className={`w-full p-3 text-xs bg-transparent border-t outline-none font-mono text-center ${isDark ? 'border-stone-800 text-stone-500' : 'border-stone-200 text-stone-400'}`}
              placeholder="Add caption..." />
          </div>
        )}

        {type === 'infobox' && (
          <div className={`my-8 p-6 rounded-lg border ${isDark ? 'bg-indigo-900/10 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200'}`}>
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles size={16} className="text-indigo-500" />
              <div contentEditable suppressContentEditableWarning className={`text-xs font-bold uppercase tracking-widest outline-none text-indigo-500`} placeholder="FACT BOX TITLE">Key Takeaways</div>
            </div>
            <div contentEditable suppressContentEditableWarning onBlur={e => updateBlock(id, { content: e.currentTarget.innerHTML })} className={`text-base leading-relaxed outline-none ${isDark ? 'text-stone-300' : 'text-stone-700'}`} placeholder="Add context or data points here...">{content}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorBlock;
