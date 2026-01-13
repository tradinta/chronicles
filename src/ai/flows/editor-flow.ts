
'use server';
/**
 * @fileOverview AI flows for the news editor.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// === Generate Headlines Flow ===

const GenerateHeadlinesInputSchema = z.object({
  content: z.string().describe("The main content of the article."),
  existingHeadline: z.string().optional().describe("The current headline, if one exists.")
});
export type GenerateHeadlinesInput = z.infer<typeof GenerateHeadlinesInputSchema>;

const GenerateHeadlinesOutputSchema = z.object({
  headlines: z.array(z.string()).describe("An array of three catchy, diverse, and relevant headline suggestions."),
});
export type GenerateHeadlinesOutput = z.infer<typeof GenerateHeadlinesOutputSchema>;

export async function generateHeadlines(input: GenerateHeadlinesInput): Promise<GenerateHeadlinesOutput> {
  return generateHeadlinesFlow(input);
}

const generateHeadlinesPrompt = ai.definePrompt({
  name: 'generateHeadlinesPrompt',
  input: { schema: GenerateHeadlinesInputSchema },
  output: { schema: GenerateHeadlinesOutputSchema },
  prompt: `You are an expert copywriter for a major Kenyan news organization. Your audience is sharp, informed, and appreciates nuance. Based on the following article content, generate three distinct, compelling, and SEO-friendly headlines.

Article Content:
{{{content}}}

{{#if existingHeadline}}
The author has already written a headline: "{{existingHeadline}}". Your suggestions should be significantly different and offer new angles.
{{/if}}

Provide three headline options. Ensure they are varied in tone: one can be direct, one more intriguing, and one focused on a specific detail.`,
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


// === Improve Writing Flow ===

const ImproveWritingInputSchema = z.object({
  text: z.string().describe("A piece of text to be improved."),
});
export type ImproveWritingInput = z.infer<typeof ImproveWritingInputSchema>;

const ImproveWritingOutputSchema = z.object({
  improvedText: z.string().describe("The improved version of the text."),
});
export type ImproveWritingOutput = z.infer<typeof ImproveWritingOutputSchema>;

export async function improveWriting(input: ImproveWritingInput): Promise<ImproveWritingOutput> {
  return improveWritingFlow(input);
}

const improveWritingPrompt = ai.definePrompt({
  name: 'improveWritingPrompt',
  input: { schema: ImproveWritingInputSchema },
  output: { schema: ImproveWritingOutputSchema },
  prompt: `You are a world-class editor for The Economist. Your task is to take the following text and elevate it. Focus on clarity, conciseness, and impact. Eliminate jargon, fix grammatical errors, and improve sentence structure. Do not change the core meaning or intent of the text.

Original Text:
{{{text}}}

Return only the improved text in the response.`,
});

const improveWritingFlow = ai.defineFlow(
  {
    name: 'improveWritingFlow',
    inputSchema: ImproveWritingInputSchema,
    outputSchema: ImproveWritingOutputSchema,
  },
  async (input) => {
    if (!input.text.trim()) {
      return { improvedText: "" };
    }
    const { output } = await improveWritingPrompt(input);
    return output!;
  }
);
