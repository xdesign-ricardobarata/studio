// src/ai/flows/suggest-tasks.ts
'use server';
/**
 * @fileOverview A task suggestion AI agent that suggests tasks based on the current time of day and location.
 *
 * - suggestTasks - A function that handles the task suggestion process.
 * - SuggestTasksInput - The input type for the suggestTasks function.
 * - SuggestTasksOutput - The return type for the suggestTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTasksInputSchema = z.object({
  timeOfDay: z
    .string()
    .describe('The current time of day (e.g., morning, afternoon, evening).'),
  location: z.string().describe('The user\u2019s current location.'),
});
export type SuggestTasksInput = z.infer<typeof SuggestTasksInputSchema>;

const SuggestTasksOutputSchema = z.object({
  suggestedTasks: z
    .array(z.string())
    .describe('A list of tasks suggested by the AI.'),
});
export type SuggestTasksOutput = z.infer<typeof SuggestTasksOutputSchema>;

export async function suggestTasks(input: SuggestTasksInput): Promise<SuggestTasksOutput> {
  return suggestTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTasksPrompt',
  input: {schema: SuggestTasksInputSchema},
  output: {schema: SuggestTasksOutputSchema},
  prompt: `You are a helpful AI assistant that suggests tasks to users based on the current time of day and their location.

  Time of day: {{{timeOfDay}}}
  Location: {{{location}}}

  Please provide a list of tasks that the user should consider doing. The tasks should be relevant to the time of day and location.
  Format the tasks as a list of strings.
  `,
});

const suggestTasksFlow = ai.defineFlow(
  {
    name: 'suggestTasksFlow',
    inputSchema: SuggestTasksInputSchema,
    outputSchema: SuggestTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
