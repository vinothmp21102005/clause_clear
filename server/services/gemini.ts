import { GoogleGenAI } from "@google/genai";
import type { AnalysisResult } from "@shared/schema";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
});

export async function analyzeTextWithGemini(text: string): Promise<AnalysisResult> {
  try {
    const systemPrompt = `You are an expert text analyst. Analyze the provided text and return a JSON response with:
1. A single, concise sentence that captures the essence of the entire text
2. An array of 3-5 bullet points highlighting the most important information and conclusions

Return only valid JSON in this exact format:
{
  "summary": "Your single sentence summary here",
  "keyPoints": ["First key point", "Second key point", "Third key point", "Fourth key point"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            keyPoints: {
              type: "array",
              items: { type: "string" },
              minItems: 3,
              maxItems: 5
            }
          },
          required: ["summary", "keyPoints"]
        }
      },
      contents: `Analyze this text:\n\n${text}`
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini model");
    }

    const result = JSON.parse(rawJson) as AnalysisResult;
    
    // Validate the response structure
    if (!result.summary || !Array.isArray(result.keyPoints) || result.keyPoints.length === 0) {
      throw new Error("Invalid response structure from Gemini model");
    }

    return result;
  } catch (error) {
    console.error("Error analyzing text with Gemini:", error);
    throw new Error(`Failed to analyze text: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function answerQuestionFromText(context: string, question: string): Promise<string> {
  try {
    const prompt = `Based ONLY on the context provided below, answer the user's question. 
If the answer cannot be found in the provided context, clearly state that the information is not available in the text.

Context:
---
${context}
---

Question: ${question}

Provide a clear, concise answer based only on the information in the context above.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    const answer = response.text?.trim();
    if (!answer) {
      throw new Error("Empty response from Gemini model");
    }

    return answer;
  } catch (error) {
    console.error("Error answering question with Gemini:", error);
    throw new Error(`Failed to answer question: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
