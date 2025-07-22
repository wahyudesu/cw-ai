import { createRoute } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { z } from '@hono/zod-openapi';

// Input schema: expects a JSON object with 'id' (uuid) and 'documentUrl' (string), plus any additional properties
export const InputSchema = z
  .object({
    id: z.string().uuid().openapi({ example: 'b3b7c7e2-8c2a-4e2a-9c2a-7e2a8c2a4e2a' }),
    documentUrl: z.string().openapi({ example: 'https://example.com/file.pdf' }),
  })
  .catchall(z.any());

// Output schema: returns a JSON object with 'message' and 'data' (which includes id, documentUrl, and any additional properties)
export const OutputSchema = z.object({
  message: z.string().openapi({ example: 'Data saved successfully.' }),
  data: z
    .object({
      id: z.string().uuid().openapi({ example: 'b3b7c7e2-8c2a-4e2a-9c2a-7e2a8c2a4e2a' }),
      documentUrl: z.string().openapi({ example: 'https://example.com/file.pdf' }),
    })
    .catchall(z.any()),
});

const tags = ['AI'];

export const processText = createRoute({
  method: 'post',
  path: '/assignment',
  tags,
  description: 'Simple generative AI chatbot that processes text input.',
  request: {
    body: jsonContentRequired(InputSchema, 'The document to process'),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(OutputSchema, 'The processed document'),
  },
});

export type ProcessTextRoute = typeof processText;
