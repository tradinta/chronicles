"use client";

import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Users, MapPin, CheckCircle, ExternalLink } from 'lucide-react';

const knownInfo = [
  "8.2 magnitude earthquake struck at 10:47 AM local time.",
  "Epicenter located 50 miles off the coast.",
  "Tsunami waves expected to reach shores within 2 hours.",
  "Evacuation orders are in effect for all coastal zones."
];

const keyPeople = [
  { name: "Dr. Elena Vance", title: "Lead Seismologist", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vance" },
  { name: "Governor Miller", title: "State Governor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Miller" }
];

const officialSources = [
    { name: "National Tsunami Warning Center", url: "#" },
    { name: "State Emergency Services", url: "#" },
    { name: "Live Governor's Press Conference", url: "#" },
]

export default function LiveContextSidebar() {
  return (
    <div className="sticky top-40 space-y-8">
      <Accordion type="multiple" defaultValue={['what-we-know', 'map']} className="w-full">
        <AccordionItem value="what-we-know">
          <AccordionTrigger className="text-sm font-bold tracking-widest uppercase text-muted-foreground">
            <div className='flex items-center'>
              <CheckCircle size={14} className="mr-2" /> What We Know
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-3 pt-4 text-sm text-muted-foreground list-disc pl-5">
              {knownInfo.map((info, i) => <li key={i}>{info}</li>)}
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="key-people">
          <AccordionTrigger className="text-sm font-bold tracking-widest uppercase text-muted-foreground">
            <div className='flex items-center'>
              <Users size={14} className="mr-2" /> Key People
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              {keyPeople.map(person => (
                <div key={person.name} className="flex items-center space-x-3">
                  <Image src={person.avatar} alt={person.name} width={40} height={40} className="rounded-full bg-muted" />
                  <div>
                    <p className="font-semibold text-sm text-foreground">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{person.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="map">
          <AccordionTrigger className="text-sm font-bold tracking-widest uppercase text-muted-foreground">
            <div className='flex items-center'>
              <MapPin size={14} className="mr-2" /> Location
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="aspect-video bg-muted rounded-md mt-4 flex items-center justify-center">
              <p className="text-xs text-muted-foreground italic">Map Visualization</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="official-sources" className="border-b-0">
          <AccordionTrigger className="text-sm font-bold tracking-widest uppercase text-muted-foreground">
            <div className='flex items-center'>
              <ExternalLink size={14} className="mr-2" /> Official Sources
            </div>
          </AccordionTrigger>
          <AccordionContent>
             <ul className="space-y-3 pt-4">
              {officialSources.map((source, i) => (
                <li key={i} className="text-sm text-primary hover:underline flex items-center">
                    <a href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a>
                    <ExternalLink size={12} className="ml-1.5" />
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
