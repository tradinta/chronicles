
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
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
} from "lucide-react";

export default function AdminDashboard() {
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
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin" isActive>
                <Newspaper />
                News
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin">
                <Radio />
                Live
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin">
                <EyeOff />
                Off the Record
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin">
                <Feather />
                Opinion
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin">
                <DraftingCompass />
                Drafts
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin">
                <CalendarClock />
                Scheduled
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin">
                <Archive />
                Archived
              </SidebarMenuButton>
            </SidebarMenuItem>
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
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
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
