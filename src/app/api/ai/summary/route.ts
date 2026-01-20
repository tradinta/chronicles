import { NextRequest, NextResponse } from 'next/server';

/**
 * AI TL;DR Summary Generator API Route
 * Uses simple extractive summarization as a fallback.
 * In production, integrate with Genkit or OpenAI for better results.
 */
export async function POST(request: NextRequest) {
    try {
        const { content, maxBullets = 3 } = await request.json();

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        // Simple extractive summarization algorithm
        // In production: Replace with Genkit AI call
        const summary = generateSimpleSummary(content, maxBullets);

        return NextResponse.json({ summary, bullets: summary.split('\n').filter(Boolean) });
    } catch (error: any) {
        console.error('TL;DR generation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate summary' },
            { status: 500 }
        );
    }
}

/**
 * Simple extractive summarization algorithm.
 * Extracts key sentences based on position and keywords.
 */
function generateSimpleSummary(content: string, maxBullets: number): string {
    // Strip HTML tags
    const text = content.replace(/<[^>]*>/g, '').trim();

    // Split into sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

    if (sentences.length === 0) {
        return '• No summary available for this article.';
    }

    // Score sentences based on various factors
    const scoredSentences = sentences.map((sentence, index) => {
        let score = 0;
        const cleanSentence = sentence.trim();

        // Position scoring (first and last sentences often contain key info)
        if (index === 0) score += 3;
        if (index === sentences.length - 1) score += 2;

        // Length scoring (medium-length sentences are often better summaries)
        const wordCount = cleanSentence.split(/\s+/).length;
        if (wordCount >= 10 && wordCount <= 30) score += 2;
        if (wordCount < 5) score -= 2;

        // Keyword scoring
        const keywords = ['key', 'important', 'significant', 'major', 'first', 'new', 'announced', 'revealed', 'according'];
        keywords.forEach(keyword => {
            if (cleanSentence.toLowerCase().includes(keyword)) score += 1;
        });

        // Quote penalty (quotes are often not good for summaries)
        if (cleanSentence.includes('"')) score -= 1;

        return { sentence: cleanSentence, score };
    });

    // Sort by score and take top sentences
    const topSentences = scoredSentences
        .sort((a, b) => b.score - a.score)
        .slice(0, maxBullets)
        .map(s => s.sentence);

    // Reorder by original position
    const orderedSummary = sentences
        .filter(s => topSentences.includes(s.trim()))
        .slice(0, maxBullets);

    // Format as bullet points
    return orderedSummary.map(s => `• ${s.trim()}`).join('\n');
}
