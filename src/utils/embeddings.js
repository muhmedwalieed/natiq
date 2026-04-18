import axios from 'axios';
import config from '../config/index.js';

const EMBEDDING_MODEL = 'BAAI/bge-small-en-v1.5';
const HF_API_URL = `https://router.huggingface.co/hf-inference/models/${EMBEDDING_MODEL}`;

export const generateEmbedding = async (text) => {
  if (!config.huggingface.apiToken) {
    throw new Error('HuggingFace API token is not configured');
  }

  const response = await axios.post(
    HF_API_URL,
    { inputs: text },
    {
      headers: {
        Authorization: `Bearer ${config.huggingface.apiToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  );

  return response.data;
};

export const generateEmbeddings = async (texts) => {
  if (!config.huggingface.apiToken) {
    throw new Error('HuggingFace API token is not configured');
  }

  const response = await axios.post(
    HF_API_URL,
    { inputs: texts },
    {
      headers: {
        Authorization: `Bearer ${config.huggingface.apiToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    }
  );

  return response.data;
};

export const cosineSimilarity = (a, b) => {
  if (a.length !== b.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
};
