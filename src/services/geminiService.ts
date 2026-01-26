import { GoogleGenerativeAI } from "@google/generative-ai";

// Your API Key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export interface ScanResult {
  item: string;
  category: string;
  expiresIn: string;
  safeToEat: 'Yes' | 'No';
  confidence: string;
}

export const analyzeFoodImage = async (imageBase64: string): Promise<ScanResult> => {
  // 1. Use the correct model (gemini-pro-vision is dead, use this instead)
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  try {
    // Clean the base64 string
    const base64Data = imageBase64.includes("base64,") 
      ? imageBase64.split("base64,")[1] 
      : imageBase64;

    const prompt = `
      Analyze this image of food. Return ONLY a valid JSON object with these fields:
      - item: Name of the food
      - category: One of [Produce, Bakery, Dairy, Canned, Prepared Meal]
      - expiresIn: Estimated shelf life (e.g., "3 days", "1 week")
      - safeToEat: "Yes" if it looks fresh/edible, "No" if visible mold/rot
      - confidence: A percentage (e.g., "95%")

      Example response:
      {
        "item": "Apple",
        "category": "Produce",
        "expiresIn": "5 days",
        "safeToEat": "Yes",
        "confidence": "98%"
      }
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    return parseGeminiResponse(text);

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

const parseGeminiResponse = (text: string): ScanResult => {
  try {
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    return {
      item: "Unknown Item",
      category: "Uncategorized",
      expiresIn: "Unknown",
      safeToEat: "No",
      confidence: "0%"
    };
  }
};