
"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type ArticleFooterProps = {
  onViewChange: (href: string) => void;
  author?: any;
};

const nextArticles = [
  { title: "Browse more News", cat: "Latest", href: "/news" },
  { title: "View Trending Stories", cat: "Trending", href: "/news" }
];

export default function ArticleFooter({ onViewChange, author }: ArticleFooterProps) {
  const router = useRouter();

  return (
    <div className="py-24 border-t border-border bg-secondary/30 dark:bg-secondary/20">
      <div className="container mx-auto px-6 max-w-4xl">
        {author && (
          <div className="flex items-start space-x-6 mb-16">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => router.push(`/author/${author.id || '#'}`)}>
              <div className="w-20 h-20 rounded-full bg-muted overflow-hidden transition-all duration-300 hover:ring-4 ring-primary ring-offset-4 ring-offset-background flex items-center justify-center">
                {author.profileImageUrl ? (
                  <Image src={author.profileImageUrl} alt="Author" width={80} height={80} className="object-cover w-full h-full" />
                ) : (
                  <div className="text-2xl font-bold text-muted-foreground">{(author.name || 'A').charAt(0)}</div>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-serif text-2xl mb-2 text-foreground">
                <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => router.push(`/author/${author.id || '#'}`)}>
                  About {author.name || 'The Author'}
                </span>
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {author.bio || "Contributor to The Chronicle."}
              </p>
            </div>
          </div>
        )}

        <h4 className="text-xs font-bold tracking-widest uppercase mb-8 text-muted-foreground">Explore More</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {nextArticles.map((item, idx) => (
            <div key={idx} className="group cursor-pointer" onClick={() => router.push(item.href)}>
              <span className="text-xs font-bold text-primary uppercase mb-2 block">{item.cat}</span>
              <h3 className="font-serif text-xl group-hover:underline text-foreground">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}      </div >
    </div >
  );
}

