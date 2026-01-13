
'use client';

import { useRouter } from 'next/navigation';
import { ExternalLink, LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';

type Item = {
    time?: string;
    title: string;
};

type ContentCardProps = {
    title: string;
    icon?: Lucide-react.JSX.Element | LucideIcon;
    items: Item[];
    buttonText?: string;
    onButtonClick?: () => void;
    onItemClick?: (item: Item) => void;
};

export default function ContentCard({ title, icon: Icon, items, buttonText, onButtonClick, onItemClick }: ContentCardProps) {
    const router = useRouter();
    return (
        <div className="bg-card border border-border rounded-lg shadow-sm p-8 h-full flex flex-col">
            <div className="flex justify-between items-baseline mb-8">
                <h3 className="font-serif text-2xl text-foreground flex items-center gap-3">
                  {Icon && <Icon className="text-primary" size={20}/>}
                  {title}
                </h3>
            </div>

            <div className="space-y-6 mb-8 flex-grow">
                {items.map((item, i) => (
                    <div key={i} className="group cursor-pointer" onClick={() => onItemClick ? onItemClick(item) : router.push('/news')}>
                        {item.time && <p className="text-xs text-muted-foreground mb-1">{item.time}</p>}
                        <p className="text-foreground group-hover:underline">{item.title}</p>
                    </div>
                ))}
            </div>

            {buttonText && (
              <div className="border-t border-dashed border-border pt-8">
                  <Button
                      onClick={onButtonClick}
                      className="w-full"
                      variant="outline"
                  >
                      {buttonText}
                      <ExternalLink size={16} className="ml-2" />
                  </Button>
              </div>
            )}
        </div>
    );
}
