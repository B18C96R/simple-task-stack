'use server';

/**
 * @fileOverview An AI agent for suggesting task priorities based on deadlines and estimated effort.
 *
 * - suggestTaskPriorities - A function that handles the task prioritization process.
 * - TaskPrioritizationInput - The input type for the suggestTaskPriorities function.
 * - TaskPrioritizationOutput - The return type for the suggestTaskPriorities function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
// import { openAI } from '@genkit-ai/openai';
// import { anthropic } from '@genkit-ai/anthropic';

const TaskSchema = z.object({
  taskName: z.string().describe('The name of the task.'),
  deadline: z.string().describe('The deadline for the task (e.g., YYYY-MM-DD HH:MM).'),
  estimatedEffort: z
    .string()
    .describe(
      'The estimated effort required to complete the task (e.g., "2 hours", "1 day", "30 minutes").'
    ),
  isCompleted: z.boolean().describe('Whether the task is completed or not.'),
});

const TaskPrioritizationInputSchema = z.object({
  agenda: z.array(TaskSchema).describe('The current agenda of tasks and events.'),
  provider: z.string().optional().describe('The AI provider to use.'),
  apiKey: z.string().optional().describe('The API key for the selected provider.'),
});
export type TaskPrioritizationInput = z.infer<typeof TaskPrioritizationInputSchema>;

const TaskRecommendationSchema = z.object({
  taskName: z.string().describe('The name of the task.'),
  priority: z
    .string()
    .describe(
      'The suggested priority for the task (e.g., "High", "Medium", "Low"). Explain why you suggested this priority based on deadline and estimated effort.'
    ),
});

const TaskPrioritizationOutputSchema = z.object({
  recommendations: z
    .array(TaskRecommendationSchema)
    .describe('The AI-suggested task priorities with explanations.'),
});
export type TaskPrioritizationOutput = z.infer<typeof TaskPrioritizationOutputSchema>;

export async function suggestTaskPriorities(
  input: TaskPrioritizationInput
): Promise<TaskPrioritizationOutput> {
  return intelligentTaskPrioritizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentTaskPrioritizationPrompt',
  input: { schema: TaskPrioritizationInputSchema },
  output: { schema: TaskPrioritizationOutputSchema },
  prompt: `You are an AI assistant designed to analyze a user\'s agenda and suggest task priorities based on deadlines and estimated effort.

  Analyze the following agenda and provide smart recommendations for task priorities. Explain your reasoning for each task\'s priority.

  Agenda:
  {{#each agenda}}
  - Task: {{taskName}}, Deadline: {{deadline}}, Estimated Effort: {{estimatedEffort}}, Completed: {{isCompleted}}
  {{/each}}

  Consider the following factors when determining task priority:
  - Tasks with earlier deadlines should generally have higher priority.
  - Tasks that require more effort should be started earlier, unless the deadline is far off.
  - Completed tasks should be ignored.

  Prioritization Recommendations:
  `,
});

const intelligentTaskPrioritizationFlow = ai.defineFlow(
  {
    name: 'intelligentTaskPrioritizationFlow',
    inputSchema: TaskPrioritizationInputSchema,
    outputSchema: TaskPrioritizationOutputSchema,
  },
  async (input) => {
    let model;
    switch (input.provider) {
      // case 'openai':
      //   // Ensure you have the correct package before uncommenting
      //   // model = openAI('gpt-4o', { apiKey: input.apiKey });
      //   throw new Error('OpenAI provider is not yet configured.');
      // case 'anthropic':
      //   // Ensure you have the correct package before uncommenting
      //   // model = anthropic('claude-3-haiku-20240307', { apiKey: input.apiKey });
      //   throw new Error('Anthropic provider is not yet configured.');
      case 'google':
        model = googleAI('gemini-1.5-flash', { apiKey: input.apiKey });
        break;
      default:
        model = googleAI('gemini-1.5-flash', { apiKey: input.apiKey });
        break;
    }

    const { output } = await ai.generate({
      prompt: prompt.prompt,
      model,
      input: input,
      output: {
        schema: TaskPrioritizationOutputSchema,
      },
    });

    return output!;
  }
);
