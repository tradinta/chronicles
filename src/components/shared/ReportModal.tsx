'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useFirestore, useUser } from '@/firebase';
import { submitReport, ReportType } from '@/firebase/firestore/reports';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Flag } from 'lucide-react';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    contentType: ReportType;
    contentId: string;
    parentEventId?: string;
    contentPreview: string;
}

const REPORT_REASONS = [
    "Misinformation",
    "Hate Speech",
    "Harassment",
    "Spam",
    "Inappropriate Content",
    "Copyright Violation",
    "Other"
];

export function ReportModal({ isOpen, onClose, contentType, contentId, parentEventId, contentPreview }: ReportModalProps) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [reason, setReason] = useState(REPORT_REASONS[0]);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!firestore) return;
        if (!user) {
            toast({ variant: "destructive", title: "Sign in required", description: "You must be logged in to report content." });
            return;
        }

        setIsSubmitting(true);
        try {
            await submitReport(firestore, {
                type: contentType,
                contentId,
                ...(parentEventId ? { parentEventId } : {}),
                contentPreview,
                reason,
                description,
                reportedBy: user.uid,
            });

            toast({ title: "Report Submitted", description: "Thank you for helping us keep the community safe." });
            onClose();
        } catch (error) {
            console.error("Report submission error:", error);
            toast({ variant: "destructive", title: "Submission Failed", description: "Could not submit report. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Flag className="w-5 h-5 text-red-500" /> Report Content
                    </DialogTitle>
                    <DialogDescription>
                        Why are you reporting this {contentType.replace('-', ' ')}?
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <RadioGroup value={reason} onValueChange={setReason} className="grid gap-2">
                        {REPORT_REASONS.map((r) => (
                            <div key={r} className="flex items-center space-x-2">
                                <RadioGroupItem value={r} id={r} />
                                <Label htmlFor={r} className="text-sm font-medium leading-none cursor-pointer">
                                    {r}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>

                    <div className="grid gap-2">
                        <Label htmlFor="description" className="text-xs uppercase font-bold text-muted-foreground">Additional Details (Optional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Provide more context..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="h-20"
                        />
                    </div>
                    
                    <div className="p-3 bg-muted rounded-lg text-[10px] text-muted-foreground italic">
                        Preview: "{contentPreview.substring(0, 100)}{contentPreview.length > 100 ? '...' : ''}"
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button variant="destructive" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Submit Report
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
