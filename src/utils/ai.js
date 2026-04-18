import axios from 'axios';
import config from '../config/index.js';

export const getAIResponse = async ({ systemPrompt, messages = [], userMessage, knowledgeContext = [] }) => {
  if (!config.groq.apiKey) {
    throw new Error('Groq API key is not configured');
  }

  const knowledgeStr = knowledgeContext.length > 0
    ? `\n\nRelevant knowledge base information:\n${knowledgeContext.join('\n---\n')}`
    : '';

  const fullSystemPrompt = `${systemPrompt}${knowledgeStr}

IMPORTANT: You must respond with valid JSON in the following format:
{
  "answer": "Your helpful response to the customer",
  "detectedIntent": "short intent label like billing_inquiry, package_info, complaint, greeting, goodbye, etc.",
  "confidence": 0.85,
  "shouldEscalate": false,
  "shouldClose": false,
  "category": "billing|network|packages|complaint|payment|refund|other",
  "priority": "low|medium|high|urgent"
}

Rules:
- Set shouldEscalate to true if: customer explicitly asks for human agent, issue is too complex, or confidence is below 0.5
- Set shouldClose to true ONLY IF the customer confirms they don't need anything else (e.g. "شكرا مش عايز حاجة", "لا شكرا"). Do NOT set to true if they simply say "شكرا", instead you should ask if they need any more help.
- Set confidence based on how well the knowledge base covers the question (0-1)
- Always be helpful, professional, and concise
- If the knowledge base doesn't have relevant info, acknowledge it and offer to connect to a human agent
- Respond in the same language the customer uses`;

  const apiMessages = [
    { role: 'system', content: fullSystemPrompt },
    ...messages.slice(-10).map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    })),
    { role: 'user', content: userMessage },
  ];

  const response = await axios.post(
    `${config.groq.baseUrl}/chat/completions`,
    {
      model: config.groq.model,
      messages: apiMessages,
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    },
    {
      headers: {
        Authorization: `Bearer ${config.groq.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  );

  const content = response.data.choices[0].message.content;
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {

        parsed = {
      answer: content,
      detectedIntent: 'unknown',
      confidence: 0.5,
      shouldEscalate: false,
      category: 'other',
      priority: 'medium',
    };
  }

  return {
    answer: parsed.answer || content,
    detectedIntent: parsed.detectedIntent || 'unknown',
    confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
    shouldEscalate: !!parsed.shouldEscalate,
    shouldClose: !!parsed.shouldClose,
    category: parsed.category || 'other',
    priority: parsed.priority || 'medium',
  };
};

