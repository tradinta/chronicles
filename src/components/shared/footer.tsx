
"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { View } from '@/app/page';

type FooterProps = {
  onViewChange: (view: View) => void;
};

const footerLinks = {
  sections: ['World', 'Politics', 'Tech', 'Business', 'Culture'],
  company: [
    { name: 'About', view: 'careers' },
    { name: 'Careers', view: 'careers' },
    { name: 'Contact', view: 'main' },
    { name: 'Privacy Policy', view: 'privacy' },
    { name: 'Terms of Service', view: 'terms' }
  ],
};

export default function Footer({ onViewChange }: FooterProps) {
  return (
    <footer className="py-20 px-6 md:px-12 bg-[#1a1a1a] text-stone-400">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1">
          <h2 className="font-serif text-2xl text-stone-100 mb-6">The Chronicle.</h2>
          <p className="text-sm opacity-70">Intelligent journalism for the modern era.</p>
        </div>
        <div>
          <h4 className="text-stone-100 text-xs tracking-wider mb-6">SECTIONS</h4>
          <ul className="space-y-4 text-sm opacity-80">
            {footerLinks.sections.map(link => <li key={link} className="hover:text-stone-200 cursor-pointer" onClick={() => onViewChange('main')}>{link}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="text-stone-100 text-xs tracking-wider mb-6">COMPANY</h4>
          <ul className="space-y-4 text-sm opacity-80">
            {footerLinks.company.map(link => <li key={link.name} className="hover:text-stone-200 cursor-pointer" onClick={() => onViewChange(link.view as View)}>{link.name}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="text-stone-100 text-xs tracking-wider mb-6">NEWSLETTER</h4>
          <div className="flex border-b border-stone-700 pb-2">
            <Input type="email" placeholder="Email" className="bg-transparent border-none text-stone-200 h-auto p-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
            <Button variant="link" className="text-stone-100 text-xs font-bold tracking-widest p-0 h-auto">JOIN</Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
