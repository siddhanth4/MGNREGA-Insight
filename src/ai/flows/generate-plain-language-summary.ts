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

const fetchDataTool = ai.defineTool({
  name: 'fetchMGNREGAData',
  description: 'Fetches MGNREGA data for a specific district and state from the data.gov.in API.',
  inputSchema: z.object({
    districtName: z.string().describe('The name of the district.'),
    stateName: z.string().describe('The name of the state.'),
  }),
  outputSchema: z.string(),
  async resolve(input) {
    // TODO: Implement the actual data fetching logic here using the data.gov.in API.
    // This is a placeholder implementation.
    console.log("fetchMGNREGAData called with " + JSON.stringify(input));
    return `{ \"status\": \"success\", \"data\": { \"personDaysGenerated\": 100000, \"fundsUtilized\": 5000000 } }`;
  },
});

const prompt = ai.definePrompt({
  name: 'generatePlainLanguageSummaryPrompt',
  input: {schema: GeneratePlainLanguageSummaryInputSchema},
  output: {schema: GeneratePlainLanguageSummaryOutputSchema},
  tools: [fetchDataTool],
  prompt: `You are an AI assistant that generates plain language summaries of MGNREGA performance for users with low data literacy. The summary should be easy to understand and highlight key achievements, challenges, and trends.

  Here is the MGNREGA performance data for the district:
  {{performanceData}}

  District Name: {{districtName}}
  State Name: {{stateName}}

  Consider the following:
  - Key achievements: Significant accomplishments in MGNREGA implementation.
  - Challenges: Obstacles faced during MGNREGA implementation.
  - Trends: Notable patterns or changes in MGNREGA performance over time.

  Use the fetchDataTool if you need to retrieve more current information about MGNREGA

  Write a concise and informative plain language summary of the district\'s MGNREGA performance.`,
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
