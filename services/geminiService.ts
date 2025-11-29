import { GoogleGenAI, Type } from "@google/genai";
import { FreebieItem } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a list of initial mock "freebie" items to populate the feed.
 * This simulates a live database query by asking the AI for realistic data.
 */
export const fetchInitialFreebies = async (): Promise<FreebieItem[]> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = "Generate a JSON list of 6 diverse, realistic items that people might give away for free (e.g., furniture, books, plants, electronics). Each item should have a short 'title', a brief 'description', a 'distance' (e.g. '1.2 mi'), 'postedAt' (e.g. '10m ago'), and a keyword for a placeholder image.";

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              distance: { type: Type.STRING },
              postedAt: { type: Type.STRING },
              imageKeyword: { type: Type.STRING, description: "A single keyword to search for an image (e.g. 'sofa', 'bicycle')" }
            },
            required: ["title", "description", "distance", "postedAt", "imageKeyword"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    // Transform to FreebieItem
    return data.map((item: any, index: number) => ({
      id: `gen-${index}-${Date.now()}`,
      title: item.title,
      description: item.description,
      distance: item.distance,
      postedAt: item.postedAt,
      // Use picsum with a hash to ensure different images, but try to use keyword logic if we were using a search API. 
      // Since we are using picsum, we'll just use random IDs but stable ones.
      imageUrl: `https://picsum.photos/seed/${item.imageKeyword || index}/400/400`,
      isLocal: false
    }));

  } catch (error) {
    console.error("Failed to fetch initial items:", error);
    // Fallback data
    return [
      {
        id: '1',
        title: 'Vintage Armchair',
        description: 'Comfortable velvet armchair, slightly worn but good condition.',
        imageUrl: 'https://picsum.photos/seed/chair/400/400',
        distance: '0.8 mi',
        postedAt: '15m ago'
      },
      {
        id: '2',
        title: 'Monstera Plant',
        description: 'Moving out, need to rehome this healthy plant.',
        imageUrl: 'https://picsum.photos/seed/plant/400/400',
        distance: '2.3 mi',
        postedAt: '1h ago'
      }
    ];
  }
};

/**
 * Analyzes an uploaded image to suggest a title and description.
 */
export const analyzeImageForListing = async (base64Image: string, mimeType: string): Promise<{ title: string; description: string }> => {
  try {
    const model = "gemini-2.5-flash";
    
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: "Analyze this image and suggest a catchy short 'title' (max 5 words) and a helpful 'description' (max 20 words) for listing this item as a free giveaway. Return JSON."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["title", "description"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      title: result.title || "",
      description: result.description || ""
    };

  } catch (error) {
    console.error("Failed to analyze image:", error);
    return { title: "", description: "" };
  }
};

/**
 * Helper to convert file to base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};
