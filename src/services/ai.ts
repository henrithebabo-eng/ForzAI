import Groq from "groq-sdk";
import OpenAI from "openai";

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

  // 2. Image Generator using OpenAI with Free Fallback (Pollinations.ai)
  async generateImage(prompt: string, style: string) {
    const openaiKey = process.env.OPENAI_API_KEY;
    const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " " + style)}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;

    if (!openaiKey) {
      return fallbackUrl;
    }

    try {
      const openai = new OpenAI({ apiKey: openaiKey, dangerouslyAllowBrowser: true });
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `A professional, high-quality image of: ${prompt}. Artistic style: ${style}.`,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json"
      });

      const b64Data = response.data[0].b64_json;
      if (b64Data) {
        return `data:image/png;base64,${b64Data}`;
      }
      return fallbackUrl;
    } catch (error: any) {
      console.error("OpenAI Image Error (using free fallback):", error);
      // If billing limit or quota reached, use the free fallback
      if (
        error?.message?.includes("hard limit") || 
        error?.message?.includes("billing") || 
        error?.message?.includes("quota") ||
        error?.status === 400 ||
        error?.status === 429
      ) {
        return fallbackUrl;
      }
      throw error;
    }
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

