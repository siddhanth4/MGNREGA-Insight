'use server';

/**
 * @fileOverview Generates a plain language summary of a district's MGNREGA performance.
 *
 * - generatePlainLanguageSummary - A function that generates the plain language summary.
 * - GeneratePlainLanguageSummaryInput - The input type for the generatePlainLanguageSummary function.
 * - GeneratePlainLanguageSummaryOutput - The return type for the generatePlainLanguageSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePlainLanguageSummaryInputSchema = z.object({
  districtName: z.string().describe('The name of the district.'),
  stateName: z.string().describe('The name of the state.'),
  performanceData: z.string().describe('MGNREGA performance data for the district, in JSON format.'),
});
export type GeneratePlainLanguageSummaryInput = z.infer<typeof GeneratePlainLanguageSummaryInputSchema>;

const GeneratePlainLanguageSummaryOutputSchema = z.object({
  summary: z.string().describe('A plain language summary of the district\'s MGNREGA performance.'),
});
export type GeneratePlainLanguageSummaryOutput = z.infer<typeof GeneratePlainLanguageSummaryOutputSchema>;

export async function generatePlainLanguageSummary(
  input: GeneratePlainLanguageSummaryInput
): Promise<GeneratePlainLanguageSummaryOutput> {
  return generatePlainLanguageSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePlainLanguageSummaryPrompt',
  input: {schema: GeneratePlainLanguageSummaryInputSchema},
  output: {schema: GeneratePlainLanguageSummaryOutputSchema},
  prompt: `You are an AI assistant that generates plain language summaries of MGNREGA performance for users with low data literacy. The summary should be easy to understand and highlight key achievements, challenges, and trends based *only* on the data provided.

  Here is the MGNREGA performance data for {{districtName}}, {{stateName}}:
  {{performanceData}}

  Consider the following when creating the summary:
  - Key achievements: Significant accomplishments in MGNREGA implementation reflected in the data.
  - Challenges: Obstacles faced during MGNREGA implementation that can be inferred from the data.
  - Trends: Notable patterns or changes in MGNREGA performance shown in the data.

  Write a concise and informative plain language summary of the district's MGNREGA performance based *only* on the provided data. Do not invent or fetch external data.`,
});

const generatePlainLanguageSummaryFlow = ai.defineFlow(
  {
    name: 'generatePlainLanguageSummaryFlow',
    inputSchema: GeneratePlainLanguageSummaryInputSchema,
    outputSchema: GeneratePlainLanguageSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
