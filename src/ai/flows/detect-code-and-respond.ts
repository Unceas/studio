'use server';
/**
 * @fileOverview This file defines a Genkit flow that detects code snippets in user prompts and uses them to augment the response from the Gemini API.
 *
 * - detectCodeAndRespond - A function that handles the code detection and response generation process.
 * - DetectCodeAndRespondInput - The input type for the detectCodeAndRespond function.
 * - DetectCodeAndRespondOutput - The return type for the detectCodeAndRespond function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectCodeAndRespondInputSchema = z.object({
  prompt: z.string().describe('The user prompt.'),
});
export type DetectCodeAndRespondInput = z.infer<typeof DetectCodeAndRespondInputSchema>;

const DetectCodeAndRespondOutputSchema = z.object({
  response: z.string().describe('The augmented response from the Gemini API.'),
});
export type DetectCodeAndRespondOutput = z.infer<typeof DetectCodeAndRespondOutputSchema>;

export async function detectCodeAndRespond(input: DetectCodeAndRespondInput): Promise<DetectCodeAndRespondOutput> {
  return detectCodeAndRespondFlow(input);
}

const codeDetectionTool = ai.defineTool({
  name: 'extractCodeSnippet',
  description: 'Extracts code snippets from the user prompt.',
  inputSchema: z.object({
    prompt: z.string().describe('The user prompt to extract code from.'),
  }),
  outputSchema: z.string().describe('The extracted code snippet, if any.  If no code is found, return an empty string.'),
},
async (input) => {
    // Dummy implementation - replace with actual code extraction logic
    // This simple logic just returns the input prompt if it contains the word "code", otherwise, it returns an empty string.
    if (input.prompt.includes("code")) {
      return input.prompt;
    } else {
      return "";
    }
  }
);

const augmentedResponsePrompt = ai.definePrompt({
  name: 'augmentedResponsePrompt',
  input: {schema: DetectCodeAndRespondInputSchema},
  output: {schema: DetectCodeAndRespondOutputSchema},
  tools: [codeDetectionTool],
  prompt: `You are a helpful AI assistant that helps users with code-related questions.

  If the user's question contains code, use the extractCodeSnippet tool to extract the code snippet.  Then, use the code snippet to augment your answer.

  User prompt: {{{prompt}}}
  `,
});

const detectCodeAndRespondFlow = ai.defineFlow(
  {
    name: 'detectCodeAndRespondFlow',
    inputSchema: DetectCodeAndRespondInputSchema,
    outputSchema: DetectCodeAndRespondOutputSchema,
  },
  async input => {
    const {output} = await augmentedResponsePrompt(input);
    return output!;
  }
);
