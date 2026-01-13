
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';
import { Bookmark, Settings, LogOut, Loader, FileText, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAuth } from 'firebase/auth';

const ArticleRow = ({ article, onClick }) => (
  <div onClick={onClick} className="group py-4 border-b border-border cursor-pointer flex items-center space-x-6">
    <div className="flex-shrink-0 w-24 h-16 bg-muted rounded overflow-hidden relative">
      {article.imageUrl && (
        <Image 
          src={article.imageUrl} 
          alt={article.title} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform" 
        />
      )}
    </div>
    <div>
      <h4 className="font-serif text-lg leading-tight group-hover:text-primary transition-colors">{article.title}</h4>
      <p className="text-xs text-muted-foreground mt-1">{new Date(article.publishDate).toLocaleDateString()}</p>
    </div>
  </div>
);

export default function ProfilePage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = getAuth();

  const bookmarksQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'bookmarks'), orderBy('savedDate', 'desc'));
  }, [firestore, user]);

  const { data: bookmarks, isLoading: isLoadingBookmarks } = useCollection(bookmarksQuery);
  
  const handleLogout = async () => {
    await auth.signOut();
    router.push('/auth');
  };

  if (isUserLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-secondary/30 dark:bg-black"
    >
      <div className="pt-32 pb-20">
        <div className="container max-w-5xl mx-auto">
          {/* Profile Header */}
          <Card className="overflow-hidden mb-12 border-border bg-background">
            <div className="h-24 bg-gradient-to-r from-orange-100 to-rose-100 dark:from-orange-900/20 dark:to-rose-900/20" />
            <CardContent className="p-6">
              <div className="flex items-start -mt-16">
                <div className="relative">
                  <Image
                    src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                    alt={user.displayName || 'User'}
                    width={100}
                    height={100}
                    className="rounded-full border-4 border-background bg-muted shadow-md"
                  />
                </div>
                <div className="ml-6 mt-2 flex-grow">
                  <h1 className="font-serif text-3xl font-bold">{user.displayName || 'Anonymous User'}</h1>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings size={16} className="mr-2" /> Edit Profile
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut size={16} className="mr-2" /> Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookmarks and Settings */}
          <Tabs defaultValue="bookmarks" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-sm">
              <TabsTrigger value="bookmarks"><Bookmark className="mr-2" /> My Bookmarks</TabsTrigger>
              <TabsTrigger value="settings"><UserIcon className="mr-2" /> Account</TabsTrigger>
            </TabsList>
            <TabsContent value="bookmarks">
              <Card className="bg-background border-border">
                <CardContent className="p-6">
                  {isLoadingBookmarks && (
                    <div className="text-center py-12">
                      <Loader className="animate-spin text-primary mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">Loading bookmarks...</p>
                    </div>
                  )}
                  {!isLoadingBookmarks && (!bookmarks || bookmarks.length === 0) && (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-lg">
                      <FileText size={40} className="mx-auto text-muted-foreground/50 mb-4" />
                      <h3 className="font-serif text-xl">No Bookmarks Yet</h3>
                      <p className="text-sm text-muted-foreground mt-2">Your saved articles will appear here.</p>
                      <Button variant="outline" className="mt-6" onClick={() => router.push('/news')}>
                        Explore Articles
                      </Button>
                    </div>
                  )}
                  {!isLoadingBookmarks && bookmarks && bookmarks.length > 0 && (
                     <div className="space-y-2">
                       {bookmarks.map(bookmark => (
                         <ArticleRow key={bookmark.id} article={bookmark} onClick={() => router.push(`/article/${bookmark.articleId}`)} />
                       ))}
                     </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings">
              <Card className="bg-background border-border">
                <CardContent className="p-6">
                  <h3 className="font-serif text-lg font-semibold">Account Settings</h3>
                   <p className="text-sm text-muted-foreground">Manage your account details here.</p>
                  {/* Settings form could go here */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </motion.div>
  );
}
