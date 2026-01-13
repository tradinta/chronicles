
'use server';
/**
 * @fileOverview AI flows for the news editor.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateHeadlinesInputSchema = z.object({
  content: z.string().describe("The main content of the article."),
});
export type GenerateHeadlinesInput = z.infer<typeof GenerateHeadlinesInputSchema>;

const GenerateHeadlinesOutputSchema = z.object({
  headlines: z.array(z.string()).describe("An array of three catchy and relevant headline suggestions."),
});
export type GenerateHeadlinesOutput = z.infer<typeof GenerateHeadlinesOutputSchema>;

export async function generateHeadlines(input: GenerateHeadlinesInput): Promise<GenerateHeadlinesOutput> {
  return generateHeadlinesFlow(input);
}

const generateHeadlinesPrompt = ai.definePrompt({
  name: 'generateHeadlinesPrompt',
  input: { schema: GenerateHeadlinesInputSchema },
  output: { schema: GenerateHeadlinesOutputSchema },
  prompt: `You are an expert copywriter for a major news organization. Based on the following article content, generate three distinct, compelling, and SEO-friendly headlines.

Article Content:
{{{content}}}

Provide three headline options.`,
});

const generateHeadlinesFlow = ai.defineFlow(
  {
    name: 'generateHeadlinesFlow',
    inputSchema: GenerateHeadlinesInputSchema,
    outputSchema: GenerateHeadlinesOutputSchema,
  },
  async (input) => {
    if (!input.content.trim()) {
      return { headlines: [] };
    }
    const { output } = await generateHeadlinesPrompt(input);
    return output!;
  }
);
