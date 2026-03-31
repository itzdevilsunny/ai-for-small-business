import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Interface for what the UI expects
export interface AIResponse {
  type: 'insight' | 'text';
  text?: string;
  insight?: {
    title: string;
    suggestions: string[];
    actions: string[];
  };
}

export const generateBusinessInsight = async (
  query: string,
  language: 'EN' | 'HI',
  businessData: any
): Promise<AIResponse> => {
  try {
    const prompt = `
You are an expert AI business advisor for an Indian small business (like a Kirana store).
You need to help the store owner understand their financial and inventory data and make profitable decisions.

Current Business Data:
${JSON.stringify(businessData, null, 2)}

User Question: ${query}

Important Rules:
1. If the user asks a simple conversational question, you can reply with simple text.
2. If the user asks about business metrics, profits, losses, or stock, YOU MUST provide a structured insight.
3. Language: The response must be in ${language === 'HI' ? 'Hinglish (Hindi written in English alphabet, e.g., "Aapka profit...")' : 'English'}.
4. Be brief, practical, and action-oriented. Max 2-3 short sentences for text. Focus on numbers if applicable.

You MUST respond ONLY with a valid JSON object matching this schema (do NOT use markdown \`\`\`json blocks, just raw JSON text):

{
  "type": "insight" | "text",
  "text": "Only populated if type is 'text'. A direct conversational reply.",
  "insight": {
    "title": "A short, punchy sentence explaining the main problem or opportunity based on data.",
    "suggestions": ["1st action step", "2nd action step"],
    "actions": ["Short Button Label 1", "Short Button Label 2"] 
  }
}
`;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    
    // Attempt to parse JSON
    try {
      // Strip out markdown formatting if Gemini includes it accidentally
      const cleanJson = textResponse.replace(/^```json\n|\n```$/g, '').trim();
      const parsed: AIResponse = JSON.parse(cleanJson);
      return parsed;
    } catch (parseError) {
      console.error("Gemini JSON Parse Error:", parseError, "Raw format:", textResponse);
      // Fallback
      return {
        type: 'text',
        text: textResponse
      };
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      type: 'text',
      text: "I'm having trouble connecting right now. Please check my configuration."
    };
  }
};
