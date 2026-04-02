
'use server';
/**
 * @fileOverview An AI-powered job description generator.
 *
 * - aiJobDescriptionGenerator - A function that handles generating job descriptions.
 * - AiJobDescriptionGeneratorInput - The input type for the aiJobDescriptionGenerator function.
 * - AiJobDescriptionGeneratorOutput - The return type for the aiJobDescriptionGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiJobDescriptionGeneratorInputSchema = z.object({
  jobTitle: z.string().describe('The title of the job to be described.'),
  department: z.string().describe('The department the job belongs to.'),
  keyResponsibilities: z
    .string()
    .describe('A list of key responsibilities for the role, separated by bullet points or new lines.'),
});
export type AiJobDescriptionGeneratorInput = z.infer<
  typeof AiJobDescriptionGeneratorInputSchema
>;

const AiJobDescriptionGeneratorOutputSchema = z.object({
  jobDescription: z.string().describe('The comprehensive, well-formatted job description.'),
});
export type AiJobDescriptionGeneratorOutput = z.infer<
  typeof AiJobDescriptionGeneratorOutputSchema
>;

export async function aiJobDescriptionGenerator(
  input: AiJobDescriptionGeneratorInput
): Promise<AiJobDescriptionGeneratorOutput> {
  return aiJobDescriptionGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiJobDescriptionGeneratorPrompt',
  input: {schema: AiJobDescriptionGeneratorInputSchema},
  output: {schema: AiJobDescriptionGeneratorOutputSchema},
  prompt: `You are an expert HR job description writer for Banas Dairy. Your task is to craft clear, comprehensive, and professional job descriptions based on the provided details.

Generate a detailed job description that includes a brief company overview for Banas Dairy (Palanpur, Gujarat), the main responsibilities, required qualifications, preferred qualifications, and benefits. Use the provided job title, department, and key responsibilities as the core information.

# Job Title: {{{jobTitle}}}

## Department: {{{department}}}

## About Banas Dairy

Banas Dairy (Banaskantha District Co-operative Milk Producers' Union Ltd.) is a state-of-the-art dairy processing unit and Asia's largest milk producer. We are committed to the socio-economic development of rural milk producers and providing the highest quality dairy products to our consumers.

## Key Responsibilities

{{{keyResponsibilities}}}

## Required Qualifications

- Bachelor's degree in a relevant field (or equivalent practical experience).
- Strong communication and interpersonal skills.
- Ability to work effectively in a team environment.
- Proven problem-solving abilities.

## Preferred Qualifications

- Master's degree or professional certifications relevant to the role.
- Experience in the FMCG or dairy industry.
- Knowledge of local cooperative structures and dairy operations.

## Benefits

- Competitive salary and comprehensive benefits package.
- Contribution to rural development and social impact.
- Supportive work environment and growth opportunities.
- Training and professional development.`,
});

const aiJobDescriptionGeneratorFlow = ai.defineFlow(
  {
    name: 'aiJobDescriptionGeneratorFlow',
    inputSchema: AiJobDescriptionGeneratorInputSchema,
    outputSchema: AiJobDescriptionGeneratorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate job description.');
    }
    return output;
  }
);
