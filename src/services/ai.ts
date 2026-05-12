import Groq from "groq-sdk";
import { GoogleGenAI } from "@google/genai";

const getGroq = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Groq API Key fehlt. Bitte fügen Sie GROQ_API_KEY zu den Secrets hinzu.");
  }
  return new Groq({ apiKey, dangerouslyAllowBrowser: true });
};

export const AIService = {
  // 1. Presentation Generator with Groq
  async generatePresentation(topic: string, count: number, style: string) {
    const groqKey = process.env.GROQ_API_KEY;
    
    if (!groqKey) {
      throw new Error("Präsentations-Generierung erfordert einen Groq API Key.");
    }

    try {
      const groq = new Groq({ apiKey: groqKey, dangerouslyAllowBrowser: true });
      const prompt = `Erstelle eine Präsentation zum Thema: "${topic}". 
      Anzahl der Slides: ${count}. 
      Stil: ${style}. 
      Gib das Ergebnis AUSSCHLIESSLICH als JSON-Array von Objekten zurück. Kein Markdown, kein Text davor oder danach.
      Jedes Objekt soll folgende Struktur haben:
      {
        "title": "Slide Titel",
        "content": ["Punkt 1", "Punkt 2", "Punkt 3"]
      }
      Sprache: Deutsch.`;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "Du bist ein Experte für Präsentationen und antwortest nur in validem JSON." },
          { role: "user", content: prompt },
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        let slides: any[] = [];
        if (Array.isArray(parsed)) slides = parsed;
        else if (parsed.slides && Array.isArray(parsed.slides)) slides = parsed.slides;
        else {
          const firstArray = Object.values(parsed).find(v => Array.isArray(v));
          if (firstArray) slides = firstArray as any[];
          else slides = parsed as any[];
        }
        return slides;
      }
      return [];
    } catch (error) {
      console.error("Groq-Fehler:", error);
      throw error;
    }
  },

  // 2. Image Generator using Groq for Prompt Enhancement + Gemini 3.1 Flash Image
  async generateImage(prompt: string, style: string) {
    const groqKey = process.env.GROQ_API_KEY || (import.meta as any).env?.VITE_GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY || (process.env as any).API_KEY;
    
    let enhancedPrompt = `${prompt} in ${style} style. cinematic, high quality, realistic, masterpiece, highly detailed.`;
    
    // 1. Groq Enhancement (Stronger instructions for instruction following)
    if (groqKey) {
      try {
        const groq = new Groq({ apiKey: groqKey, dangerouslyAllowBrowser: true });
        const completion = await groq.chat.completions.create({
          messages: [
            { 
              role: "system", 
              content: "You are a professional prompt engineer. Your job is to take the user's simple instruction and turn it into a high-quality, descriptive prompt for an image generator (like Flux or Midjourney). Be specific about lighting, composition, camera angle, and textures. KEEP IT IN ENGLISH regardless of the input language. Limit to 400 characters." 
            },
            { role: "user", content: `Transform this into an image prompt: "${prompt}", Style: ${style}` }
          ],
          model: "llama-3.3-70b-versatile",
          max_tokens: 200,
        });
        
        const content = completion.choices[0]?.message?.content;
        if (content) enhancedPrompt = content;
      } catch (error) {
        console.warn("Groq enhancement failed:", error);
      }
    }

    // 2. Generation via Gemini 3.1 Flash Image
    if (geminiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image-preview',
          contents: { parts: [{ text: enhancedPrompt }] },
          config: {
            imageConfig: {
              aspectRatio: "1:1",
              imageSize: "1K"
            },
          },
        });

        const parts = response.candidates?.[0]?.content?.parts;
        if (parts) {
          for (const part of parts) {
            if (part.inlineData) {
              return `data:image/png;base64,${part.inlineData.data}`;
            }
          }
        }
      } catch (error: any) {
        console.error("Gemini Image Generation Error (falling back to Pollinations):", error);
        // Do not throw, allow code to proceed to fallback
      }
    }

    // 3. Fallback (Pollinations) if Gemini key is missing, failing, or denied access
    // This ensures the tool "always works" as requested
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
  },

  // 3. Video Generator (Currently disabled)
  async generateVideo(prompt: string, style: string) {
    throw new Error("Video-Generierung ist derzeit deaktiviert. Bitte nutzen Sie einen anderen Dienst.");
  },

  // 4. Homework AI using Groq (Free Tier)
  async chatHomework(messages: { role: string; text: string }[], input: string, subject: string) {
    const groqKey = process.env.GROQ_API_KEY;
    
    if (!groqKey) {
      throw new Error("Hausaufgaben-KI erfordert einen Groq API Key.");
    }

    try {
      const groq = new Groq({ apiKey: groqKey, dangerouslyAllowBrowser: true });
      
      const chatMessages: any[] = [
        { 
          role: "system", 
          content: `Du bist eine professionelle KI für das Fach ${subject}. 
          Hilf dem Schüler, seine Hausaufgaben zu verstehen. Erkläre Konzepte Schritt für Schritt. 
          Sprache: Deutsch. Sei freundlich und motivierend.` 
        },
        ...messages.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.text
        })),
        { role: "user", content: input }
      ];

      const completion = await groq.chat.completions.create({
        messages: chatMessages,
        model: "llama-3.3-70b-versatile",
      });

      return completion.choices[0]?.message?.content || "Keine Antwort erhalten.";
    } catch (error: any) {
      console.error("Groq Chat Error:", error);
      if (error?.message?.includes("quota") || error?.status === 429) {
        throw new Error("Limit erreicht. Bitte versuchen Sie es in einer Minute erneut.");
      }
      throw error;
    }
  }
};

