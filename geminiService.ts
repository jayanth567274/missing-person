import { GoogleGenAI, Part } from "@google/genai";
import { MissingPersonData, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: "AIzaSyB_7VapuO3_Zx_jeNd46zByBZ1wdBsM_nw" });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data url prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

export const analyzeCase = async (data: MissingPersonData): Promise<AnalysisResult> => {
  try {
    let imagePart: Part | undefined;
    
    if (data.image) {
      const base64Data = await fileToBase64(data.image);
      imagePart = {
        inlineData: {
          mimeType: data.image.type,
          data: base64Data
        }
      };
    }

    const promptText = `
      You are an advanced expert Search and Rescue AI named "Sentinels".
      
      CASE DETAILS:
      Name: ${data.name}
      Reported Age: ${data.age}
      Last Known Location: ${data.lastKnownLocation} (Use Google Maps to find real places near here)
      Date Last Seen: ${data.lastSeenDate}
      Reported Clothing: ${data.clothing}
      Reported Features: ${data.features}
      Additional Notes: ${data.notes}

      TASKS:
      1. Analyze the provided image (if any) and the text details. Describe the person's appearance and identify key visual identifiers.
      2. Using the "Last Known Location", SEARCH for nearby transport hubs (bus stations, train stations), hospitals, and homeless shelters using the Google Maps tool.
      3. Predict likely movement patterns based on the time elapsed and location context.
      4. Simulate a database check and generate 3 plausible "Potential Matches" based on typical missing person database formats (this is for a demo, so create realistic synthetic data).

      OUTPUT FORMAT:
      You MUST return a valid JSON object wrapped in \`\`\`json code blocks.
      The structure must be exactly:
      {
        "personOverview": {
          "summary": "Brief professional summary of the subject",
          "estimatedBiometrics": "Analysis of height/build/age from image vs report",
          "clothingAnalysis": "Detailed breakdown of clothing for search teams",
          "distinctiveFeatures": ["List", "of", "features"]
        },
        "potentialMatches": [
          { "id": "MATCH-001", "confidence": 85, "source": "City Shelter Intake", "location": "123 Main St", "description": "Individual matching description seen checking in." },
          ... (3 matches)
        ],
        "searchLeads": [
          { "locationName": "Name of real place found via Maps", "type": "Transport/Medical/Shelter", "reason": "Why look here?", "address": "Address if available" }
          ... (List 4-5 real places found via the tool)
        ],
        "movementPrediction": {
          "prediction": "Narrative of likely direction or behavior",
          "radiusKm": 5,
          "timeElapsedAnalysis": "Assessment of distance possible since last seen"
        }
      }
    `;

    const parts: Part[] = [{ text: promptText }];
    if (imagePart) {
      parts.push(imagePart);
    }

    // Using gemini-2.5-flash for Maps Grounding support
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        tools: [{ googleMaps: {} }],
        // Note: responseMimeType is NOT set because it conflicts with googleMaps tool
      }
    });

    const textResponse = response.text || "";
    
    // Extract JSON from Markdown block
    const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) || textResponse.match(/```([\s\S]*?)```/);
    let parsedJson: any = {};
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        parsedJson = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error("Failed to parse JSON from AI response", e);
        // Fallback or partial error handling
        parsedJson = { personOverview: { summary: "Error parsing AI response." } };
      }
    } else {
       // Attempt to parse raw text if no code blocks
       try {
        parsedJson = JSON.parse(textResponse);
       } catch (e) {
         console.warn("Could not parse JSON directly", e);
       }
    }

    // Extract Grounding Chunks (Google Maps Links)
    const groundingUrls: { title: string; uri: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          groundingUrls.push({ title: chunk.web.title || "Web Source", uri: chunk.web.uri });
        }
        // Google Maps grounding chunks structure
        if (chunk.groundingChunk?.web?.uri) { // Sometimes nested differently depending on API version
             groundingUrls.push({ title: chunk.groundingChunk.web.title, uri: chunk.groundingChunk.web.uri });
        }
      });
    }

    return {
      personOverview: parsedJson.personOverview || { summary: "Analysis failed.", distinctiveFeatures: [], estimatedBiometrics: "", clothingAnalysis: "" },
      potentialMatches: parsedJson.potentialMatches || [],
      searchLeads: parsedJson.searchLeads || [],
      movementPrediction: parsedJson.movementPrediction || { prediction: "N/A", radiusKm: 0, timeElapsedAnalysis: "" },
      groundingUrls
    };

  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};