import type { AppRouteHandler } from '@/lib/types';
import type { ProcessTextRoute } from './feedback.routes';
import { ai_agent_orchestrator } from './agents';

export const processFeedback: AppRouteHandler<ProcessTextRoute> = async (c) => {
  try {
    const { nameAssignment, description, isiTugas, personalization } = await c.req.json();

    if (!nameAssignment || !description || !isiTugas) {
      return c.json({
        success: false,
        error: 'nameAssignment, description, dan isiTugas harus diisi',
      }, 400);
    }

    // Panggil AI agent orchestrator
    const result = await ai_agent_orchestrator(
      c,
      nameAssignment,
      description,
      isiTugas,
      personalization || ''
    );

    // Return hasil dari semua agent secara eksplisit
    return c.json({
      success: true,
      error: undefined,
      data: {
        analysis_result: result.analysis_result,
        summary_result: result.summary_result,
        final_evaluation: result.final_evaluation,
        metadata: result.metadata,
      },
    });

  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan saat memproses tugas',
      data: null,
    }, 500);
  }
};
