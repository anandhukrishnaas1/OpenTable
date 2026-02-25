import fs from 'fs';

const OPENROUTER_API_KEY = "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";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

async function test() {
    const imageBase64 = fs.readFileSync('restaurant.jpeg', { encoding: 'base64' });
    const dataUrl = `data:image/jpeg;base64,${imageBase64}`;

    const prompt = `Analyze this image of food. Return ONLY a valid JSON object with these fields:
- item: Name of the food (be specific)
- category: One of [Produce, Bakery, Dairy, Canned, Prepared Meal]
- expiresIn: Estimated shelf life from now (e.g., "3 days", "1 week")
- safeToEat: "Yes" if it looks fresh/edible, "No" if visible mold/rot/spoilage
- confidence: A percentage of how confident you are (e.g., "95%")

Return ONLY the JSON object, no markdown, no code fences, no explanation.`;

    console.log("Sending request to OpenRouter...");
    const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:2005",
            "X-Title": "FreshLink"
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
        const err = await response.text();
        console.error("FAILED:", response.status, err);
        return;
    }

    const data = await response.json();
    console.log("SUCCESS:", JSON.stringify(data, null, 2));
}

test();
