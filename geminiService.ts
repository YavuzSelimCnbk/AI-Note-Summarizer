/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from '@google/genai';
import { Note } from '../types';

/**
 * Initializes the Google GenAI SDK with the API key from environment variables.
 */
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Interface representing the expected JSON response from the Gemini model.
 */
export interface GeminiNoteResponse {
  originalText: string;
  summary: string;
  keyTakeaways: string[];
  actionItems: string[];
}

/**
 * Processes an image of a note using the Gemini API.
 * Performs OCR, generates a summary, and extracts key takeaways and action items.
 *
 * @param base64Image - The base64 encoded image string (including the data URI prefix).
 * @returns A promise that resolves to the extracted note data.
 */
export async function summarizeNoteImage(base64Image: string): Promise<GeminiNoteResponse> {
  // Extract the mime type and the raw base64 data from the data URI
  const mimeTypeMatch = base64Image.match(/^data:(image\/[a-zA-Z+]+);base64,/);
  if (!mimeTypeMatch) {
    throw new Error('Invalid image format. Expected a base64 data URI.');
  }
  const mimeType = mimeTypeMatch[1];
  const base64Data = base64Image.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-preview',
    contents: [
      {
        inlineData: {
          data: base64Data,
          mimeType,
        },
      },
      "Analyze this image of handwritten or printed notes. Perform OCR to extract the original text. Then, provide a smart summary, a list of key takeaways, and a list of actionable items. Return the result as JSON."
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          originalText: {
            type: Type.STRING,
            description: 'The extracted text from the image via OCR.',
          },
          summary: {
            type: Type.STRING,
            description: 'A concise, smart summary of the notes.',
          },
          keyTakeaways: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of key points extracted from the notes.',
          },
          actionItems: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of actionable tasks or items identified in the notes.',
          },
        },
        required: ['originalText', 'summary', 'keyTakeaways', 'actionItems'],
      },
    },
  });

  if (!response.text) {
    throw new Error('Failed to generate content from the image.');
  }

  try {
    const result: GeminiNoteResponse = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error('Failed to parse Gemini response as JSON:', response.text);
    throw new Error('Invalid response format from AI.');
  }
}
