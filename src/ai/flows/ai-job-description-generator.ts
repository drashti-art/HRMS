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
  prompt: `You are an expert HR job description writer for a modern Human Resource Management System. Your task is to craft clear, comprehensive, and well-formatted job descriptions based on the provided details.

Generate a detailed job description that includes a brief company overview (assume a fictional tech company named 'WorkNest HR'), the main responsibilities, required qualifications, preferred qualifications, and benefits. Use the provided job title, department, and key responsibilities as the core information.

# Job Title: {{{jobTitle}}}

## Department: {{{department}}}

## About WorkNest HR

WorkNest HR is a leading innovator in HR management solutions, dedicated to empowering businesses and their employees through cutting-edge technology. We foster a collaborative and dynamic environment where talent thrives.

## Key Responsibilities

{{{keyResponsibilities}}}

## Required Qualifications

- Bachelor's degree in a relevant field (or equivalent practical experience).
- Strong communication and interpersonal skills.
- Ability to work effectively in a team environment.
- Proven problem-solving abilities.

## Preferred Qualifications

- Master's degree or professional certifications relevant to the role.
- Experience with HR management systems or similar software.
- Demonstrated ability to adapt to new technologies and processes.

## Benefits

- Competitive salary and comprehensive health, dental, and vision benefits.
- Generous paid time off, including holidays and sick leave.
- Flexible work arrangements and a supportive work-life balance culture.
- Opportunities for continuous professional development, training, and career advancement.
- A vibrant, inclusive, and collaborative company culture with regular team events.`,
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
