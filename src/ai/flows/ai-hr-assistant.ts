'use server';
/**
 * @fileOverview An AI-powered HR Assistant for general workspace queries.
 *
 * - aiHrAssistant - A function that handles general HR and workplace queries.
 * - AiHrAssistantInput - The input type for the assistant.
 * - AiHrAssistantOutput - The return type for the assistant.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiHrAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s question or request.'),
  userRole: z.string().describe('The role of the user (e.g., Admin, Manager, Employee).'),
  userName: z.string().describe('The name of the user.'),
});
export type AiHrAssistantInput = z.infer<typeof AiHrAssistantInputSchema>;

const AiHrAssistantOutputSchema = z.object({
  answer: z.string().describe('The helpful response from the AI assistant.'),
  suggestions: z.array(z.string()).optional().describe('Quick follow-up suggestions.'),
});
export type AiHrAssistantOutput = z.infer<typeof AiHrAssistantOutputSchema>;

export async function aiHrAssistant(input: AiHrAssistantInput): Promise<AiHrAssistantOutput> {
  return aiHrAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiHrAssistantPrompt',
  input: {schema: AiHrAssistantInputSchema},
  output: {schema: AiHrAssistantOutputSchema},
  prompt: `You are WorkNest AI, the intelligent backbone of the WorkNest Human Resource Management System. 
Your goal is to be helpful, professional, and empathetic. 

Current User Context:
- Name: {{{userName}}}
- Role: {{{userRole}}}

Instructions:
1. If the user asks about leaves, mention that they can go to the "Leaves" tab to submit a request.
2. If the user is a Manager asking about team performance, suggest checking the "Performance" dashboard for detailed analytics.
3. If an Employee asks about salary, guide them to the "Payroll" section to download their payslips.
4. Always maintain a modern, tech-forward tone.

User Query: {{{query}}}`,
});

const aiHrAssistantFlow = ai.defineFlow(
  {
    name: 'aiHrAssistantFlow',
    inputSchema: AiHrAssistantInputSchema,
    outputSchema: AiHrAssistantOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate response.');
    }
    return output;
  }
);
