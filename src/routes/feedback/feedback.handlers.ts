import type { AppRouteHandler } from '@/lib/types';
import type { ProcessTextRoute } from './feedback.routes';
// import { groq } from '@ai-sdk/groq';
import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

export const processText: AppRouteHandler<ProcessTextRoute> = async (c) => {
  const { text } = c.req.valid('json');
  const apiKey = (c.env as { GROQ_API_KEY?: string }).GROQ_API_KEY;
  if (!apiKey) {
    // Always return 200 with a valid response shape for OpenAPI contract
    return c.json({
      text: '[ERROR] Groq API key is missing. Please set GROQ_API_KEY in your environment.',
    });
  }

  const groq = createGroq({ apiKey });
  const result = await generateText({
    model: groq('gemma2-9b-it'),
    prompt: text,
  });
  return c.json({ text: result.text });
};
