import { NextRequest, NextResponse } from 'next/server';

/**
 * AI Auto-Tagging API Route
 * Uses keyword extraction for tag suggestions.
 * In production, integrate with Genkit or OpenAI for semantic tagging.
 */
export async function POST(request: NextRequest) {
    try {
        const { content, title, maxTags = 5 } = await request.json();

        if (!content && !title) {
            return NextResponse.json({ error: 'Content or title is required' }, { status: 400 });
        }

        const tags = extractTags(content || '', title || '', maxTags);

        return NextResponse.json({ tags });
    } catch (error: any) {
        console.error('Auto-tagging error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate tags' },
            { status: 500 }
        );
    }
}

/**
 * Extract relevant tags from content using keyword analysis.
 */
function extractTags(content: string, title: string, maxTags: number): string[] {
    // Strip HTML and normalize
    const text = (title + ' ' + content).replace(/<[^>]*>/g, '').toLowerCase();
    const words = text.split(/\W+/).filter(w => w.length > 3);

    // Common stop words to ignore
    const stopWords = new Set([
        'this', 'that', 'with', 'from', 'have', 'been', 'were', 'they', 'their',
        'which', 'would', 'could', 'should', 'about', 'after', 'before', 'these',
        'those', 'being', 'there', 'where', 'when', 'what', 'will', 'just', 'than',
        'then', 'also', 'more', 'some', 'such', 'very', 'most', 'other', 'into'
    ]);

    // Count word frequency
    const wordCounts: Record<string, number> = {};
    words.forEach(word => {
        if (!stopWords.has(word) && isNaN(Number(word))) {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
    });

    // Boost words that appear in the title
    const titleWords = title.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    titleWords.forEach(word => {
        if (wordCounts[word]) {
            wordCounts[word] *= 3; // Triple the weight for title words
        }
    });

    // Common category/tag keywords for news
    const categoryKeywords: Record<string, string[]> = {
        'technology': ['ai', 'tech', 'software', 'digital', 'app', 'computer', 'internet', 'data'],
        'politics': ['government', 'president', 'congress', 'election', 'vote', 'policy', 'law'],
        'business': ['company', 'market', 'stock', 'economy', 'trade', 'finance', 'investment'],
        'science': ['research', 'study', 'scientist', 'discovery', 'experiment', 'space'],
        'health': ['medical', 'health', 'doctor', 'hospital', 'disease', 'treatment', 'covid'],
        'sports': ['game', 'team', 'player', 'championship', 'league', 'score', 'win'],
        'entertainment': ['movie', 'film', 'music', 'celebrity', 'show', 'actor', 'album'],
        'climate': ['climate', 'environment', 'carbon', 'renewable', 'energy', 'pollution'],
    };

    // Check for category matches
    const detectedCategories: string[] = [];
    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
        const matches = keywords.filter(kw => text.includes(kw));
        if (matches.length >= 2) {
            detectedCategories.push(category);
        }
    });

    // Sort by frequency and take top words
    const sortedWords = Object.entries(wordCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, maxTags * 2)
        .map(([word]) => word);

    // Combine categories and keywords
    const tags = [...new Set([...detectedCategories, ...sortedWords])].slice(0, maxTags);

    // Capitalize first letter for better display
    return tags.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1));
}
