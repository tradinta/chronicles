
export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const placeholderImages: ImagePlaceholder[] = [
    {
      id: "hero-analogue",
      description: "Close-up of a vintage typewriter with warm lighting.",
      imageUrl: "https://images.unsplash.com/photo-1493728639209-4091a1829910?q=80&w=2574&auto=format&fit=crop",
      imageHint: "vintage typewriter",
    },
    {
      id: "abstract-memory",
      description: "Abstract swirling colors representing neural pathways or memory.",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
      imageHint: "abstract color",
    },
    {
      id: "nordic-migration",
      description: "A serene house by a lake in a Nordic country.",
      imageUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2670&auto=format&fit=crop",
      imageHint: "lake house",
    },
    {
      id: "silicon-valley-hardware",
      description: "A computer motherboard with intricate circuits.",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop",
      imageHint: "circuit board",
    },
    {
      id: "deep-sea-currents",
      description: "Sunlight filtering through the deep blue ocean water.",
      imageUrl: "https://images.unsplash.com/photo-1468581264429-2548ef9eb732?q=80&w=2670&auto=format&fit=crop",
      imageHint: "ocean water",
    },
    {
      id: "vernacular-architecture",
      description: "A modern building with a unique, non-traditional design.",
      imageUrl: "https://images.unsplash.com/photo-1502005229766-939cb9a27fea?q=80&w=2670&auto=format&fit=crop",
      imageHint: "modern architecture",
    },
    {
      id: "4-day-week",
      description: "An office setting with a clock and documents, representing work.",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop",
      imageHint: "office work",
    },
    {
      id: "gdp-alternative",
      description: "A vintage weighing scale, symbolizing measurement and economy.",
      imageUrl: "https://images.unsplash.com/photo-1526304640152-d4619684e484?q=80&w=2670&auto=format&fit=crop",
      imageHint: "vintage scale",
    },
    {
      id: "ethics-synthetic-memory",
      description: "An abstract image with a robotic hand and glowing lights, representing AI.",
      imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop",
      imageHint: "ai robot",
    },
];

export type Article = {
  id: number;
  type: 'article' | 'quote';
  category?: string;
  title?: string;
  summary?: string;
  time?: string;
  readTime?: string;
  image?: ImagePlaceholder;
  content?: string;
  author?: string;
  isBreaking?: boolean;
};

export const breakingNews: Article[] = [
    {
      id: 401,
      type: 'article',
      title: "Central Bank unexpectedly raises interest rates by 50 basis points.",
      time: "2m ago"
    },
    {
      id: 402,
      type: 'article',
      title: "Major undersea cable connecting East Africa to Europe has been severed; widespread internet outages reported.",
      time: "15m ago"
    },
];


export const articles: Article[] = [
    {
      id: 101,
      type: 'article',
      category: 'World',
      title: "The Silent Migration: Why Nordic Citizens are Moving South",
      summary: "A shift in climate patterns and remote work policies has triggered an unexpected demographic flow across Europe.",
      time: "2h",
      readTime: "6 min read",
      image: placeholderImages.find(p => p.id === 'nordic-migration'),
      isBreaking: true,
    },
    {
      id: 102,
      type: 'article',
      category: 'Technology',
      title: "Silicon Valley's Return to Hardware",
      summary: "After a decade of software dominance, VCs are pouring billions into tangible tech, from robotics to bio-manufacturing.",
      time: "4h",
      readTime: "8 min read",
      image: placeholderImages.find(p => p.id === 'silicon-valley-hardware')
    },
    {
      id: 103,
      type: 'quote',
      content: "We are drowning in information, while starving for wisdom.",
      author: "E.O. Wilson"
    },
    {
      id: 104,
      type: 'article',
      category: 'Science',
      title: "The Ocean's Memory: Mapping Deep Sea Currents",
      summary: "New sensor networks reveal how deep ocean currents store heat signatures for centuries, predicting future climate shifts.",
      time: "5h",
      readTime: "12 min read",
      image: placeholderImages.find(p => p.id === 'deep-sea-currents')
    },
    {
      id: 105,
      type: 'article',
      category: 'Culture',
      title: "Architecture Without Architects",
      summary: "Exploring the resurgence of vernacular building methods in modern sustainable housing projects.",
      time: "6h",
      readTime: "5 min read",
      image: placeholderImages.find(p => p.id === 'vernacular-architecture')
    }
  ];
  
export const newArticles: Article[] = [
  {
    id: 201,
    type: 'article',
    category: 'Economy',
    title: "The 4-Day Work Week: A Global Assessment",
    summary: "Two years into the massive experiment, the data paints a complex but optimistic picture for productivity.",
    time: "1d",
    readTime: "10 min read",
    image: placeholderImages.find(p => p.id === '4-day-week')
  },
  {
    id: 202,
    type: 'article',
    category: 'Opinion',
    title: "Why We Should Stop Measuring GDP",
    summary: "Alternative metrics for national health are gaining traction among top economists.",
    time: "1d",
    readTime: "7 min read",
    image: placeholderImages.find(p => p.id === 'gdp-alternative')
  }
];

export type LiveUpdate = {
  id: number;
  type: 'New' | 'Confirmed' | 'Correction';
  time: string;
  headline: string;
  body: string;
  source: string;
  imageUrl?: string;
}

export const liveUpdates: LiveUpdate[] = [
  {
    id: 301,
    type: 'Confirmed',
    time: '11:15 AM',
    headline: 'Wave Arrival Times Confirmed',
    body: 'The National Tsunami Warning Center has confirmed initial wave arrivals for major coastal cities. The first waves are smaller than anticipated but a larger second wave is expected.',
    source: 'National Tsunami Warning Center',
  },
  {
    id: 302,
    type: 'New',
    time: '11:05 AM',
    headline: 'International Aid Mobilized',
    body: 'Neighboring countries have begun mobilizing aid and response teams as the scale of the potential disaster becomes clear.',
    source: 'International Red Cross',
    imageUrl: 'https://picsum.photos/seed/aid/1200/675'
  },
  {
    id: 303,
    type: 'New',
    time: '10:52 AM',
    headline: 'Evacuation Routes Experiencing Heavy Traffic',
    body: 'State transportation officials report significant congestion on all major evacuation routes. Residents are advised to stay calm and follow directions from law enforcement.',
    source: 'State Department of Transportation',
  }
];

export const newLiveUpdates: Omit<LiveUpdate, 'id'>[] = [
    {
    type: 'Correction',
    time: '11:25 AM',
    headline: 'Correction: Initial Magnitude Downgraded to 8.1',
    body: 'The USGS has issued a correction, downgrading the initial earthquake magnitude from 8.2 to 8.1. The tsunami warning remains in full effect.',
    source: 'USGS',
  },
  {
    type: 'Confirmed',
    time: '11:30 AM',
    headline: 'First Wave Makes Landfall',
    body: 'Minor waves of approximately 1-2 meters have made landfall in northern coastal towns. No major damage has been reported from this initial surge. The larger, more dangerous wave is still expected.',
    source: 'Local Media Reports',
  }
];

export const featuredStories = [
  { title: "Tokyo's Hidden Jazz Bars", cat: "Culture", href: "/article/1" },
  { title: "Death of Open Plan Offices", cat: "Business", href: "/article/1" }
];

export const dispatchItems = [
    { time: "12m ago", title: "Global markets react to new trade sanctions" },
    { time: "45m ago", title: "Tech giant announces surprise CEO departure" },
    { time: "1h ago", title: "Climate summit reaches tentative agreement" },
];

export const trendingItems = [
    "Why the global supply chain is shifting to localized hubs faster than predicted.",
    "The surprising link between gut health and mental focus.",
    "AI's impact on creative industries: A one-year retrospective.",
    "Urban planning reimagined: The 15-minute city model gains traction."
];

export const marketPulseItems = [
  { title: "Central Bank holds interest rates steady, citing 'cautious optimism'.", time: '2h ago' },
  { title: "Analysis: Are tech stocks overvalued in the current climate?", time: '5h ago' },
  { title: "New agricultural fund launches to support small-scale farmers.", time: '8h ago' },
];

export const cityBeatItems = [
  { title: "Proposed high-rise development in Westlands faces resident opposition.", time: '30m ago' },
  { title: "Nairobi traffic reform: Is the new bus rapid transit system working?", time: '3h ago' },
  { title: "The cultural revival of Nairobi's downtown arts scene.", time: '1d ago' },
];
