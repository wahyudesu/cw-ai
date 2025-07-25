// document loader pdf -> pinecone embeddings -> store on vector db
import type { AppRouteHandler } from '@/lib/types';
import type { ProcessTextRoute } from './assignment.routes';
import { createClient } from '@supabase/supabase-js';
import { extractText, getDocumentProxy } from 'unpdf';
import { PineconeEmbeddings } from '@langchain/pinecone';
import { cosineSimilarity } from 'ai';
import { z } from 'zod';
import { ChatGroq } from '@langchain/groq';
import { logger } from '@/middlewares/pino-logger';
import type { AppBindings } from '@/lib/types';

// Extract PDF data using unpdf
async function extractPdfData(url: string) {
  // Fetch the PDF as an ArrayBuffer
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  // Get the PDF document proxy from the ArrayBuffer
  const docProxy = await getDocumentProxy(arrayBuffer);
  // Extract all text from the PDF as a single string
  const { totalPages, text: fullText } = await extractText(docProxy, { mergePages: true });
  // Extract text from the first page only
  const { text: firstPageTextArr } = await extractText(docProxy, { mergePages: false });
  const page_one = Array.isArray(firstPageTextArr) ? firstPageTextArr[0]?.trim() || '' : '';
  // Get the number of pages
  const page = totalPages;
  // Count sentences (simple split by . ! ?)
  const sentences = fullText.split(/[.!?]+/).filter(Boolean).length;
  return {
    page,
    sentences,
    isiTugas: fullText.trim(),
    page_one,
  };
}

export const processText: AppRouteHandler<ProcessTextRoute> = async (c) => {
  const logger = c.get('logger'); // ambil dari binding Variables.logger
  const { id, documentUrl } = c.req.valid('json');
  const supabaseUrl = (c.env as { SUPABASE_URL: string }).SUPABASE_URL;
  const supabaseKey = (c.env as { SUPABASE_ANON_KEY: string }).SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const embeddings = new PineconeEmbeddings({
    apiKey: (c.env as { PINECONE_API_KEY: string }).PINECONE_API_KEY,
    model: 'multilingual-e5-large',
  });

  logger.info('Starting processText for document id:', id);

  const { data, error } = await supabase
  .from('documents')
  .select('*')
  .eq('id', id)   // id harus string UUID yang valid
  .single();

  logger.info(data);

  if (error || !data) {
    throw new Error('Dokumen tidak ditemukan di database.');
  }

    const folder = data.folder;
    const uploaded_date = data.uploadedDate;
    
    // Fetch previous records in the same folder uploaded before the current document
    const { data: previousRecords, error: prevError } = await supabase
      .from('documents')
      .select('id, embedding')
      .eq('folder', folder)
      .lt('uploadedDate', uploaded_date);

    if (prevError) throw prevError;

    // Function to check plagiarism by comparing cosine similarity of embeddings
    function checkPlagiarism(
      records: any[],
      currentEmbedding: number[]
    ): { id: any; similarity: number }[] {
      return records
        .filter((record) => Array.isArray(record.embedding))
        .map((record) => {
          const similarity = cosineSimilarity(currentEmbedding, record.embedding);
          return { id: record.id, similarity };
        })
        .filter((result) => result.similarity > 0.5); // threshold, adjust as needed
    }

  try {
    const { page, sentences, isiTugas, page_one } = await extractPdfData(documentUrl);
    const schema = z.object({
      name: z.any().describe('student name'),
      id: z.any().describe('10-digit student identification number'),
    });

    const apiKey = (c.env as { GROQ_API_KEY?: string }).GROQ_API_KEY;
    const llm = new ChatGroq({
      model: 'llama-3.3-70b-versatile',
      temperature: 0,
      maxTokens: undefined,
      maxRetries: 2,
      apiKey,
      // other params...
    });
    const structuredllm = llm.withStructuredOutput(schema);
    const result = await structuredllm.invoke(
      `Extract the student's name and identification number from this text: ${page_one}`
    );
    const parsed = schema.parse(result); // validasi + typing
    const namestudent = String(parsed.name);
    const nrp = String(parsed.id);

    const vector_embeddings = await embeddings.embedQuery(isiTugas);

    const plagiarismResults = checkPlagiarism(previousRecords || [], vector_embeddings);
    const plagiarismScore = plagiarismResults.length > 0
      ? Math.max(...plagiarismResults.map((res) => res.similarity))
      : 0;

    logger.info('Previous records count:', previousRecords?.length);
    logger.info('Current embedding sample:', vector_embeddings.slice(0, 5));
    logger.info('Previous embeddings:', previousRecords?.map(r => r.embedding?.slice(0, 5)));

    const dbResult = await supabase
      .from('documents')
      .update({
        isiTugas,
        page,
        sentences,
        embedding: vector_embeddings,
        NRP: nrp,
        nameStudent: namestudent,
        plagiarism: plagiarismScore,
        // plagiarismDetected: plagiarismScore > 0.8,
      })
      .eq('id', id);

    if (dbResult.error) throw dbResult.error;
    return c.json({
      message: 'Data saved successfully.',
      result,
      data: {
        id,
        documentUrl,
        page,
        sentences,
        isiTugas,
        namestudent,
        nrp,
        plagiarismScore,
        plagiarismDetected: plagiarismScore > 0.5,
      },
    });
  } catch (err) {
    const logger = (c.env as { logger?: any }).logger;
    if (logger) {
      logger.error('Error in processText:', err);
    } else {
      console.error('Error in processText:', err);
    }
    let errorMessage;
    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (err && typeof err === 'object' && 'message' in err) {
      errorMessage = (err as any).message;
    } else {
      errorMessage = JSON.stringify(err);
    }
    return c.json({
      message: `Failed to process PDF and save data: ${errorMessage}`,
      data: {
        id,
        documentUrl,
      },
    });
  }
};
