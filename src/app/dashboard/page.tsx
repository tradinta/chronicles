
"use client";
import { useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Newspaper,
  Radio,
  EyeOff,
  Feather,
  DraftingCompass,
  CalendarClock,
  Archive,
  Search,
  Plus,
  ChevronDown,
} from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const router = useRouter();
  const [openSections, setOpenSections] = useState<string[]>(['news']);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  }

  const contentSections = [
    { id: 'news', label: 'News', icon: Newspaper, subItems: ['Drafts', 'Scheduled', 'Archived'] },
    { id: 'live', label: 'Live', icon: Radio, subItems: [] },
    { id: 'off-the-record', label: 'Off the Record', icon: EyeOff, subItems: ['Drafts', 'Scheduled', 'Archived'] },
    { id: 'opinion', label: 'Opinion', icon: Feather, subItems: ['Drafts', 'Scheduled', 'Archived'] },
  ];

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="font-serif text-xl tracking-tighter font-bold">
            Dashboard
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {contentSections.map(section => (
              <Collapsible key={section.id} open={openSections.includes(section.id)} onOpenChange={() => toggleSection(section.id)}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <div className='flex items-center justify-between w-full'>
                        <div className='flex items-center gap-2'>
                          <section.icon />
                          <span>{section.label}</span>
                        </div>
                        {section.subItems.length > 0 && (
                          <ChevronDown className={cn("transform transition-transform duration-200", openSections.includes(section.id) && "rotate-180")} />
                        )}
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                {section.subItems.length > 0 && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuItem>
                        <SidebarMenuSubButton href="/dashboard/new-story">
                          <DraftingCompass />
                          Drafts
                        </SidebarMenuSubButton>
                      </SidebarMenuItem>
                       <SidebarMenuItem>
                        <SidebarMenuSubButton href="/dashboard">
                          <CalendarClock />
                          Scheduled
                        </SidebarMenuSubButton>
                      </SidebarMenuItem>
                       <SidebarMenuItem>
                        <SidebarMenuSubButton href="/dashboard">
                          <Archive />
                          Archived
                        </SidebarMenuSubButton>
                      </SidebarMenuItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
          <SidebarTrigger />
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground hover:text-foreground">
              <Search size={20} />
            </button>
            <button 
              onClick={() => router.push('/dashboard/new-story')}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
              <Plus size={16} />
              New Post
            </button>
          </div>
        </header>
        <main className="p-8">
          <h1 className="text-3xl font-bold mb-8">Content Dashboard</h1>
          <div className="border rounded-lg p-8 text-center text-muted-foreground">
            <p>Story list and editor workspace will appear here.</p>
          </div>
        </main>
      </SidebarInset>
    </>
  );
}
