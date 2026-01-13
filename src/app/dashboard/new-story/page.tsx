
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewStoryPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft />
            </Link>
          </Button>
          <h1 className="text-xl font-bold">New Story</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">Save Draft</Button>
          <Button>Publish</Button>
        </div>
      </header>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <Input
              placeholder="Story Title..."
              className="text-4xl font-serif h-auto p-0 border-none focus-visible:ring-0"
            />
          </div>
          <div>
            <Textarea
              placeholder="Tell your story..."
              className="text-lg font-serif leading-relaxed h-auto p-0 border-none focus-visible:ring-0 min-h-[400px]"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
