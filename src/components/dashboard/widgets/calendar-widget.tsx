'use client';

import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function CalendarWidget() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-6 flex flex-col justify-center items-center min-h-[350px]">
            <div className="w-full mb-4 px-2">
                <h3 className="text-lg font-bold text-white font-serif">Calendar</h3>
                <p className="text-xs text-gray-500">{date?.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <style jsx global>{`
         .rdp { --rdp-cell-size: 40px; --rdp-accent-color: #8b5cf6; margin: 0; }
         .rdp-day_selected:not([disabled]) { font-weight: bold; border: 2px solid #8b5cf6; background-color: transparent; color: white; }
         .rdp-day_selected:hover:not([disabled]) { border-color: #7c3aed; background-color: transparent; }
         .rdp-month_caption { font-family: var(--font-serif); font-weight: bold; color: white; margin-bottom: 1rem; }
         .rdp-nav { color: white; }
         .rdp-button:hover:not([disabled]) { background-color: rgba(255,255,255,0.1); }
         .rdp-weekdays { color: #71717a; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
         .rdp-day { color: #d4d4d8; font-size: 0.875rem; }
         .rdp-day:hover:not([disabled]) { background-color: rgba(255,255,255,0.05); }
         .rdp-day_today { color: #8b5cf6; font-weight: bold; position: relative; }
         .rdp-day_today:after { content: ''; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; background-color: #8b5cf6; rounded-full: 50%; }
       `}</style>

            <DayPicker
                mode="single"
                selected={date}
                onSelect={setDate}
                showOutsideDays
                classNames={{
                    root: 'bg-transparent',
                    month_caption: 'text-white text-lg font-bold flex justify-center mb-4',
                    nav: 'flex items-center justify-between absolute w-full px-4 top-6',
                    button_previous: 'p-1 hover:bg-white/10 rounded-full transition-colors',
                    button_next: 'p-1 hover:bg-white/10 rounded-full transition-colors',
                    month_grid: 'w-full',
                }}
                components={{
                    Chevron: ({ orientation }) => orientation === "left" ? <ChevronLeft size={16} /> : <ChevronRight size={16} />
                }}
            />
        </div>
    );
}
