'use server';
/**
 * @fileOverview An AI agent for summarizing candidate resumes.
 *
 * - summarizeResume - A function that handles the resume summarization process.
 * - ResumeSummarizerInput - The input type for the summarizeResume function.
 * - ResumeSummarizerOutput - The return type for the summarizeResume function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ResumeSummarizerInputSchema = z.object({
  resumeContent: z
    .string()
    .describe(
      "The full text content of a candidate's resume, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ResumeSummarizerInput = z.infer<typeof ResumeSummarizerInputSchema>;

const ResumeSummarizerOutputSchema = z.object({
  overallSummary: z
    .string()
    .describe("A concise overall summary of the candidate's profile and suitability."),
  keySkills: z
    .array(z.string())
    .describe('A list of key technical and soft skills extracted from the resume.'),
  workExperience: z
    .array(
      z.object({
        title: z.string().describe('The job title.'),
        company: z.string().describe('The company name.'),
        duration: z.string().describe('The duration of employment (e.g., "Jan 2020 - Dec 2022").'),
        responsibilities: z.array(z.string()).describe('Key responsibilities and achievements in this role.'),
      })
    )
    .describe('A detailed list of the candidate\'s work experience.'),
  education: z
    .array(
      z.object({
        degree: z.string().describe('The degree obtained (e.g., "B.S. in Computer Science").'),
        institution: z.string().describe('The educational institution name.'),
        year: z.string().describe('The year of graduation or attendance (e.g., "2021").'),
      })
    )
    .describe('A list of the candidate\'s educational background.'),
  certifications: z.array(z.string()).describe('A list of professional certifications.'),
});
export type ResumeSummarizerOutput = z.infer<typeof ResumeSummarizerOutputSchema>;

export async function summarizeResume(
  input: ResumeSummarizerInput
): Promise<ResumeSummarizerOutput> {
  return resumeSummarizerFlow(input);
}

const resumeSummarizerPrompt = ai.definePrompt({
  name: 'resumeSummarizerPrompt',
  input: { schema: ResumeSummarizerInputSchema },
  output: { schema: ResumeSummarizerOutputSchema },
  prompt: `You are an expert HR assistant tasked with summarizing candidate resumes.

Your goal is to extract key information from the provided resume text, focusing on relevant skills, work experience, education, and certifications. Summarize the overall profile and then break down the details into structured fields.

Resume Content: {{media url=resumeContent}}`,
});

const resumeSummarizerFlow = ai.defineFlow(
  {
    name: 'resumeSummarizerFlow',
    inputSchema: ResumeSummarizerInputSchema,
    outputSchema: ResumeSummarizerOutputSchema,
  },
  async (input) => {
    const { output } = await resumeSummarizerPrompt(input);
    if (!output) {
      throw new Error('Failed to generate resume summary.');
    }
    return output;
  }
);
