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
      description: "A modern building with natural materials and a unique, non-traditional design.",
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
};

export const articles: Article[] = [
    {
      id: 101,
      type: 'article',
      category: 'World',
      title: "The Silent Migration: Why Nordic Citizens are Moving South",
      summary: "A shift in climate patterns and remote work policies has triggered an unexpected demographic flow across Europe.",
      time: "2h",
      readTime: "6 min read",
      image: placeholderImages.find(p => p.id === 'nordic-migration')
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
