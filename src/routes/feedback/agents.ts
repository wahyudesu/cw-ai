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
      Kamu adalah seorang guru. Baca jawaban siswa di bawah ini dan berikan umpan balik. Identifikasi kekuatan dalam tulisannya dan berikan saran untuk perbaikan. Buat koneksi yang spesifik antara tulisan siswa dan kriteria penilaian tugas.

Saat menulis umpan balik, tulislah langsung kepada siswa, kutip kekuatan spesifik dari tulisan mereka secara akurat, dan tunjukkan cara untuk mengatur dan menghubungkan tulisan mereka dengan lebih baik.
(contoh: "Kamu memberikan bukti yang kuat untuk... dengan menyatakan bahwa...")
Gunakan hanya kutipan langsung dari tulisan siswa. JANGAN MENAMBAHKAN APA PUN.

Siswa sedang dalam mode belajar, jadi gunakan saran untuk memancing pemahaman mereka atau mengajak berpikir lebih dalam, tapi jangan langsung memberikan jawabannya (gunakan gaya Socratic).
Gunakan bahasa yang jelas, ringkas, dan nada yang mendukung serta memberi semangat.
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
