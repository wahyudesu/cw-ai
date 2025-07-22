import { createRoute } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';

import { z } from '@hono/zod-openapi';

// Input schema: expects a JSON object with a 'text' string
export const InputSchema = z.object({
  text: z.string().openapi({ example: 'tell me a joke' }),
});

// Output schema: returns a JSON object with a 'text' string
export const OutputSchema = z.object({
  text: z
    .string()
    .openapi({ example: 'Why did the chicken cross the road? To get to the other side!' }),
});

const tags = ['AI'];

export const processText = createRoute({
  method: 'post',
  path: '/chatbot',
  tags,
  description: 'Simple generative AI chatbot that processes text input.',
  request: {
    body: jsonContentRequired(InputSchema, 'The text to process'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(OutputSchema, 'The processed text'),
  },
});

export type ProcessTextRoute = typeof processText;
