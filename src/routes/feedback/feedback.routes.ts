import { createRoute, z } from '@hono/zod-openapi';

// Simplified schemas
const FeedbackInputSchema = z.object({
  nameAssignment: z.string(),
  description: z.string(),
  isiTugas: z.string(),
  personalization: z.string().optional(),
}).describe('Input tugas untuk dianalisis');

// Output schema lebih fleksibel
const FeedbackOutputSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
}).describe('Response dari analisis tugas');

// Route definition
export const processText = createRoute({
  method: 'post',
  path: '/feedback',
  tags: ['AI Feedback'],
  description: 'Analisis tugas menggunakan AI agent orchestrator untuk memberikan feedback komprehensif',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: FeedbackInputSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Berhasil memproses tugas',
      content: {
        'application/json': {
          schema: FeedbackOutputSchema,
        },
      },
    },
    400: {
      description: 'Input tidak valid',
      content: {
        'application/json': {
          schema: FeedbackOutputSchema,
        },
      },
    },
    500: {
      description: 'Server error',
      content: {
        'application/json': {
          schema: FeedbackOutputSchema,
        },
      },
    },
  },
});

export type ProcessTextRoute = typeof processText;
