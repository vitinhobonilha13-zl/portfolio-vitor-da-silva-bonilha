import { GoogleGenAI, Type } from "@google/genai";
import { DotType, CornerSquareType } from 'qr-code-styling';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface AIQRResponse {
  qrType: 'URL' | 'Text' | 'Email' | 'Wi-Fi';
  data: {
    url?: string;
    text?: string;
    email?: string;
    wifiSsid?: string;
    wifiPass?: string;
    wifiEncryption?: 'WPA' | 'WEP' | 'nopass';
  };
  dotType: DotType;
  cornerType: CornerSquareType;
  qrColor: string;
  qrBgColor: string;
  reasoning: string;
}

export async function generateQrWithAi(prompt: string): Promise<AIQRResponse> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a detailed QR code configuration based on this theme/prompt: "${prompt}".
    
    CRITICAL INSTRUCTIONS:
    1. If the theme implies a business, place, or entity, use the SEARCH tool to find their ACTUAL official website or a highly relevant search result.
    2. NEVER use fake or placeholder domains like "example.com" or "site.com".
    3. All URLs MUST be absolute (starting with https://).
    4. For Wi-Fi, if no credentials are provided in the prompt, generate plausible but safe values.
    5. Choose colors and styles that artistically represent the theme.
    
    The response must be a valid JSON matching the schema provided.`,
    config: {
      tools: [
        { googleSearch: {} }
      ],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          qrType: {
            type: Type.STRING,
            enum: ['URL', 'Text', 'Email', 'Wi-Fi'],
            description: "The type of QR code.",
          },
          data: {
            type: Type.OBJECT,
            properties: {
              url: { type: Type.STRING, description: "Full URL starting with https://" },
              text: { type: Type.STRING },
              email: { type: Type.STRING, description: "Email address only (no mailto: prefix)" },
              wifiSsid: { type: Type.STRING },
              wifiPass: { type: Type.STRING },
              wifiEncryption: { type: Type.STRING, enum: ['WPA', 'WEP', 'nopass'] }
            }
          },
          dotType: {
            type: Type.STRING,
            enum: ['rounded', 'dots', 'classy', 'classy-rounded', 'square', 'extra-rounded'],
          },
          cornerType: {
            type: Type.STRING,
            enum: ['rounded', 'dot', 'square', 'extra-rounded'],
          },
          qrColor: {
            type: Type.STRING,
            description: "Hex color",
          },
          qrBgColor: {
            type: Type.STRING,
            description: "Hex color",
          },
          reasoning: {
            type: Type.STRING,
            description: "Explain why these choices were made.",
          }
        },
        required: ["qrType", "data", "dotType", "cornerType", "qrColor", "qrBgColor", "reasoning"],
      },
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("JSON Parse failed", response.text);
    throw e;
  }
}
