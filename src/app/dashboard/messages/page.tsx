'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, MoreVertical, Archive, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MessagesPage = () => {
    const messages = [
        { id: 1, sender: "Editor-in-Chief", subject: "Re: Draft submission for 'Shadow Banking'", preview: "Great work on the latest draft. I have a few suggestions regarding the intro...", time: "10:42 AM", unread: true },
        { id: 3, sender: "Fact Checking Team", subject: "Verification complete: Urban Reforestation", preview: "All distinct claims have been verified. The only outstanding item is the quote from...", time: "Oct 24", unread: false },
        { id: 4, sender: "System", subject: "Your article is trending!", preview: "Congratulations! 'The Future of Agri-Tech' has just passed 10,000 views...", time: "Oct 22", unread: false },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-[calc(100vh-140px)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-serif text-3xl font-bold">Comms Center</h1>
                    <p className="text-muted-foreground text-sm">Secure editorial communications.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">Archive All</Button>
                    <Button size="sm">Compose</Button>
                </div>
            </div>

            <div className="flex-1 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex">
                {/* Sidebar List */}
                <div className="w-1/3 border-r border-border flex flex-col">
                    <div className="p-4 border-b border-border">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                className="w-full bg-muted/50 pl-9 pr-4 py-2 rounded-md text-sm focus:outline-none focus:bg-muted transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`p-4 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors ${msg.unread ? 'bg-primary/5' : ''}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`font-medium text-sm ${msg.unread ? 'font-bold text-primary' : ''}`}>{msg.sender}</span>
                                    <span className="text-[10px] text-muted-foreground/80">{msg.time}</span>
                                </div>
                                <h4 className={`text-sm mb-1 ${msg.unread ? 'font-semibold text-foreground' : 'text-foreground/80'}`}>{msg.subject}</h4>
                                <p className="text-xs text-muted-foreground line-clamp-2">{msg.preview}</p>
                            </div>
                        ))}
                        <div className="p-8 text-center text-muted-foreground text-xs">
                            End of messages
                        </div>
                    </div>
                </div>

                {/* Message View (Placeholder) */}
                <div className="flex-1 flex flex-col bg-background/50">
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50">
                        <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
                        <h3 className="font-serif text-xl font-bold">Select a conversation</h3>
                        <p className="max-w-xs mx-auto text-sm text-muted-foreground">Choose a message from the list to view details or start a new conversation.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MessagesPage;
