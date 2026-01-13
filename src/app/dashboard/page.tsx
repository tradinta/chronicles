
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PenTool,
  BarChart2,
  TrendingUp,
  Users,
  Clock,
  FileText,
  MessageSquare,
  MoreHorizontal,
  ChevronRight,
  Wifi,
  Coffee,
  Plus,
  User as UserIcon,
  Save,
  Loader2,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { PhotoUploader } from '@/components/shared/photo-uploader';

// --- Data Types ---
interface ArticleStat {
  id: string;
  title: string;
  status: 'draft' | 'review' | 'published';
  views: string;
  deadline: string;
  category: string;
}

interface Notification {
  id: number;
  user: string;
  action: string;
  time: string;
  urgent: boolean;
}

// --- Mock Data ---
const articles: ArticleStat[] = [
  { id: '1', title: "The Shadow Banking Crisis: A Deep Dive", status: 'published', views: '24.5k', deadline: 'Complete', category: 'Finance' },
  { id: '2', title: "Whispers in the Senate", status: 'review', views: '-', deadline: 'Today, 4pm', category: 'Politics' },
  { id: '3', title: "Urban Reforestation Initiatives", status: 'draft', views: '-', deadline: 'Fri, 12pm', category: 'Environment' },
  { id: '4', title: "Tech Giants & Privacy Laws", status: 'draft', views: '-', deadline: 'Mon, 9am', category: 'Tech' },
];

const notifications: Notification[] = [
  { id: 1, user: "Editor-in-Chief", action: "requested changes on 'Whispers'", time: "10m ago", urgent: true },
  { id: 2, user: "Fact Checker", action: "verified your sources", time: "1h ago", urgent: false },
  { id: 3, user: "System", action: "Daily analytics report ready", time: "3h ago", urgent: false },
];

export default function AuthorDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProfileTab, setIsProfileTab] = useState(false);

  useEffect(() => {
    setIsProfileTab(searchParams.get('tab') === 'profile');
  }, [searchParams]);

  if (isProfileTab) {
    return <ProfileForm />;
  }

  return <Overview />;
}

// --- Dashboard Sub-Components ---

function Overview() {
    const router = useRouter();
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => router.push('/dashboard/new')}
                className="flex justify-between items-center bg-card border border-border p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-lg transition-shadow"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <PenTool className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Create New Assignment</h3>
                        <p className="text-xs text-muted-foreground">Start a new draft, report, or editorial.</p>
                    </div>
                </div>
                <button className="group flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    <span>Create Piece</span>
                </button>
            </motion.div>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Reads" value="128.4k" trend="+12%" icon={TrendingUp} delay={0.1}/>
                <StatCard label="Avg. Read Time" value="4m 12s" trend="+0.8%" icon={Clock} delay={0.2}/>
                <StatCard label="Subscribers" value="8,942" trend="+45" icon={Users} delay={0.3}/>
                <StatCard label="Coffee Consumed" value="4 Cups" trend="Critical" icon={Coffee} delay={0.4} isAlert/>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                <div className="lg:col-span-2 space-y-6">
                    <ChartWidget />
                    <AssignmentsWidget />
                </div>
                <div className="space-y-6">
                    <NotificationsWidget />
                    <QuoteWidget />
                </div>
            </div>
        </>
    );
}

function StatCard({ label, value, trend, icon: Icon, delay, isAlert }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className={`p-6 border border-border rounded-lg relative group overflow-hidden ${isAlert ? 'bg-red-500/5' : 'bg-card'} hover:shadow-md transition-shadow`}>
       <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</span>
          <div className={`p-2 rounded-full ${isAlert ? 'bg-red-500/10' : 'bg-primary/10'}`}>
            <Icon className={`w-4 h-4 ${isAlert ? 'text-red-500' : 'text-primary'}`} />
          </div>
       </div>
       <div className="flex items-baseline gap-2 relative z-10">
          <span className="font-serif text-3xl xl:text-4xl font-bold text-foreground">{value}</span>
       </div>
       <div className={`text-xs mt-2 font-medium flex items-center gap-1 ${isAlert ? 'text-red-600' : 'text-green-600'}`}>
          {isAlert ? <MoreHorizontal className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
          {trend} {isAlert ? '' : 'vs last week'}
       </div>
       <div className="absolute bottom-0 left-0 h-1 bg-primary w-0 group-hover:w-full transition-all duration-500 ease-out" />
    </motion.div>
  )
}

function ChartWidget() {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card border border-border p-6 relative overflow-hidden group min-h-[320px] flex flex-col rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                    <h3 className="font-serif text-xl font-bold">Reader Engagement</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Last 7 Days • Realtime Data</p>
                </div>
                <div className="flex gap-2">
                     {['1D', '1W', '1M'].map(t => (<button key={t} className={`text-[10px] font-mono border border-border px-3 py-1 rounded transition-colors ${t === '1W' ? 'bg-foreground text-background' : 'hover:bg-muted'}`}>{t}</button>))}
                </div>
            </div>
            <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2 relative z-10">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end group/bar cursor-pointer h-full">
                    <div className="w-full bg-foreground/80 hover:bg-primary transition-all duration-300 relative rounded-t-sm" style={{ height: `${h}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20">{h * 124} views</div>
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px)' }}></div>
                    </div>
                </div>
                ))}
            </div>
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 pt-20 pb-8 opacity-10">
                {[1,2,3,4].map(i => <div key={i} className="w-full h-px bg-foreground border-t border-dashed border-foreground/50"></div>)}
            </div>
        </motion.div>
    )
}

function AssignmentsWidget() {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="font-serif text-lg font-bold">Active Assignments</h3>
                <button className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors">View All</button>
            </div>
            <div className="divide-y divide-border">
                {articles.map((article) => (
                    <div key={article.id} className="group flex items-center justify-between p-4 hover:bg-foreground/5 transition-colors cursor-pointer">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-background border border-border rounded-md group-hover:border-primary transition-colors"><FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary" /></div>
                            <div>
                                <h4 className="font-serif font-bold text-base group-hover:text-primary transition-colors">{article.title}</h4>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground font-mono uppercase tracking-wider">
                                    <span>{article.category}</span>
                                    <span>•</span>
                                    <span className={`flex items-center gap-1 ${article.deadline === 'Today, 4pm' ? 'text-orange-500 font-bold' : ''}`}><Clock className="w-3 h-3" /> {article.deadline}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block"><StatusBadge status={article.status} /></div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

function NotificationsWidget() {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="bg-card border border-border p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-border">
                <h3 className="font-serif text-lg font-bold flex items-center gap-2"><Wifi className="w-4 h-4 text-primary" /> The Wire</h3>
                <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span>
            </div>
            <div className="space-y-6 relative">
                <div className="absolute left-1.5 top-2 bottom-2 w-px bg-border"></div>
                {notifications.map((note) => (
                <div key={note.id} className="relative pl-6 group cursor-pointer">
                    <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-background transition-transform group-hover:scale-125 ${note.urgent ? 'bg-red-500' : 'bg-muted-foreground'}`}></div>
                    <p className="text-sm font-medium leading-snug text-foreground/90 group-hover:text-primary transition-colors"><span className="font-bold text-foreground">{note.user}</span> {note.action}</p>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1 block">{note.time}</span>
                </div>
                ))}
            </div>
            <button className="w-full mt-6 py-2 text-xs font-mono uppercase tracking-widest border border-border hover:bg-foreground hover:text-background transition-colors rounded">View All Comms</button>
        </motion.div>
    )
}

function QuoteWidget() {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="bg-foreground text-background p-6 relative overflow-hidden rounded-lg shadow-lg group">
            <div className="absolute -top-4 -right-4 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500"><PenTool className="w-32 h-32 rotate-12" /></div>
            <h4 className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3">Editor's Note</h4>
            <p className="font-serif text-xl leading-relaxed italic opacity-90 relative z-10">"Journalism can never be silent: that is its greatest virtue and its greatest fault."</p>
            <div className="mt-4 flex items-center gap-2 opacity-60"><div className="h-px w-8 bg-background"></div><p className="text-xs font-bold">Henry Anatole Grunwald</p></div>
        </motion.div>
    )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    published: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    review: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    draft: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
  };
  return (<span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${styles[status as keyof typeof styles] || styles.draft}`}>{status}</span>)
}

export function EmptyState({ tab }: { tab: string }) {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-[60vh] text-center border-2 border-dashed border-border rounded-xl bg-card/50">
            <div className="p-6 bg-background rounded-full mb-6 shadow-sm">
                {tab === 'stories' && <FileText className="w-12 h-12 text-muted-foreground" />}
                {tab === 'analytics' && <BarChart2 className="w-12 h-12 text-muted-foreground" />}
                {tab === 'messages' && <MessageSquare className="w-12 h-12 text-muted-foreground" />}
                {tab === 'research' && <UserIcon className="w-12 h-12 text-muted-foreground" />}
            </div>
            <h2 className="font-serif text-3xl font-bold mb-2 capitalize">{tab}</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">This section is currently empty. Start writing or wait for data to populate.</p>
            <button className="bg-foreground text-background px-6 py-2 rounded-md font-medium text-sm hover:bg-foreground/80 transition-colors">Initialize {tab}</button>
        </motion.div>
    )
}

function ProfileForm() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
    if (userProfile) {
      setUsername((userProfile as any).username || '');
      setBio((userProfile as any).bio || '');
    }
  }, [user, userProfile]);

  const handleSaveProfile = async () => {
    if (!user || !userDocRef) return;
    setIsSaving(true);
    
    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: fullName,
        photoURL: photoURL,
      });

      // Update Firestore document
      const profileData = {
        username,
        email: user.email,
        profileImageUrl: photoURL,
        bio,
        joinDate: userProfile?.joinDate || user.metadata.creationTime,
        id: user.uid,
      };
      
      await setDoc(userDocRef, profileData, { merge: true });

      toast({ title: "Profile Updated", description: "Your changes have been saved successfully." });
      // Force a reload of the user object in the app
      router.refresh();

    } catch (error) {
      console.error("Profile update error:", error);
      toast({ variant: "destructive", title: "Update Failed", description: "Could not save your profile." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isProfileLoading) {
    return <div className="flex justify-center items-center h-[60vh]"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-card border border-border rounded-lg shadow-sm">
        <div className="p-6 border-b border-border">
          <h2 className="font-serif text-2xl font-bold">Author Profile</h2>
          <p className="text-sm text-muted-foreground">This information will appear on your published articles.</p>
        </div>
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-6">
                <PhotoUploader
                  initialImage={photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`}
                  onUploadComplete={setPhotoURL}
                  className="w-20 h-20 rounded-full"
                  imageClassName="w-20 h-20 rounded-full"
                />
                <div className="grid gap-1.5 flex-1">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g., Jane Doe" />
                </div>
            </div>
             <div className="grid gap-1.5">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                    <Input id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g., janedoe" className="pl-7" />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                </div>
             </div>
             <div className="grid gap-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." rows={4} />
                <p className="text-xs text-muted-foreground">A brief bio that will appear on your author page.</p>
             </div>
        </div>
        <div className="p-6 bg-secondary/30 dark:bg-secondary/10 border-t border-border flex justify-end">
            <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
            </Button>
        </div>
      </div>
    </motion.div>
  );
}
