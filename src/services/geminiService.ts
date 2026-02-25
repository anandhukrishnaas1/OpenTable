// OpenRouter AI Service for Food Analysis

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export interface ScanResult {
  item: string;
  category: string;
  expiresIn: string;
  safeToEat: 'Yes' | 'No';
  confidence: string;
}

export const analyzeFoodImage = async (imageBase64: string): Promise<ScanResult> => {
  try {
    // Clean the base64 string and build a proper data URL
    let dataUrl: string;
    if (imageBase64.startsWith("data:")) {
      dataUrl = imageBase64;
    } else {
      dataUrl = `data:image/jpeg;base64,${imageBase64}`;
    }

    const prompt = `Analyze this image of food. Return ONLY a valid JSON object with these fields:
- item: Name of the food (be specific, e.g. "Red Grapes", "Banana Bunch")
- category: One of [Produce, Bakery, Dairy, Canned, Prepared Meal]
- expiresIn: Estimated shelf life from now (e.g., "3 days", "1 week")
- safeToEat: "Yes" if it looks fresh/edible, "No" if visible mold/rot/spoilage
- confidence: A percentage of how confident you are (e.g., "95%")

Return ONLY the JSON object, no markdown, no code fences, no explanation.`;

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "OpenTable"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: dataUrl
                }
              }
            ]
          }
        ],
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API Error:", response.status, errorData);
      throw new Error(`API request failed with status ${response.status}: ${errorData}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      console.error("OpenRouter returned no choices:", data);
      throw new Error("No response from AI model");
    }

    const text = data.choices[0].message.content;
    console.log("OpenRouter raw response:", text);
    return parseAIResponse(text);

  } catch (error) {
    console.error("Food Analysis Error:", error);
    throw error;
  }
};

const parseAIResponse = (text: string): ScanResult => {
  try {
    // Remove any markdown code fences if present
    let cleanedText = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

    // Try to extract JSON if there's surrounding text
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    return JSON.parse(cleanedText);
  } catch (e) {
    console.error("Failed to parse AI response:", text);
    return {
      item: "Unknown Item",
      category: "Uncategorized",
      expiresIn: "Unknown",
      safeToEat: "No",
      confidence: "0%"
    };
  }
};