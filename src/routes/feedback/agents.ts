import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

export async function ai_agent_orchestrator(
  c: any,
  nameAssignment: string,
  description: string,
  isiTugas: string,
  personalization: string
) {
  const groq = createGroq({
    apiKey: c.env.GROQ_API_KEY,
  });

  const model = groq('gemma2-9b-it');

  const tugasContent = `Nama Tugas: ${nameAssignment}\nDeskripsi: ${description}\nIsi Tugas: ${isiTugas}`;

  // Parallel: Analysis & Summary
  const [analysisResponse, summarizerResponse] = await Promise.all([
    generateText({
      model,
      prompt: `Tentukan tingkat kesesuaian tugas berikut dengan kriteria akademik. Pilih satu dari: sangat rendah, rendah, menengah, tinggi, relevan.\n\nTugas: ${tugasContent}`,
    }),

    generateText({
      model,
      system: `
        Anda adalah Agent Summarizer yang bertugas merangkum tugas akademik.
        Fokus pada:
        - Tujuan utama tugas
        - Langkah-langkah kunci
        - Hasil yang diharapkan
        - Kriteria penilaian (jika ada)
        Balas dengan ringkasan inti tugas saja.
      `,
      messages: [
        {
          role: 'user',
          content: tugasContent,
        },
      ],
    }),
  ]);

  // Final Evaluation
  const finalResponse = await generateText({
    model,
    system: `
      Anda adalah Dosen Orchestrator yang mengintegrasikan hasil dari Agent Analysis dan Agent Summarizer.
      Berikan feedback yang komprehensif berdasarkan hasil tersebut.
      Personalisasi: ${personalization.trim()}
    `,
    messages: [
      {
        role: 'user',
        content: `
Tugas:
${tugasContent}

Ringkasan:
${summarizerResponse.text}

Kesesuaian:
${analysisResponse.text}

Berikan evaluasi final dan rekomendasi.
        `.trim(),
      },
    ],
  });

  return {
    analysis_result: analysisResponse.text,
    summary_result: summarizerResponse.text,
    final_evaluation: finalResponse.text,
    metadata: {
      task_name: nameAssignment,
      description,
      content: isiTugas,
      timestamp: new Date().toISOString(),
    },
  };
}
