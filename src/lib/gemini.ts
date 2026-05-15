import { GoogleGenerativeAI } from "@google/generative-ai";

const FALLBACK_CAPTIONS = [
  "Beach mode activated 🌊",
  "Survived another team-building challenge 😭",
  "Average karaoke warrior behavior 🎤",
  "Main character energy at the beach ✨",
  "Golden Bridge moment unlocked 🌉",
  "Bánh mì > everything else 🥖",
  "Da Nang sunrise hits different 🌅",
  "Marble Mountains side quest complete ⛰️",
  "Dragon Bridge at night 🐉",
  "Hội An vibes loading... 🏮",
  "Peak chaos achieved 🎯",
  "This is fine. (It's not fine.) 😅",
  "When the team bonding hits too hard 💪",
  "Casually becoming a local 🇻🇳",
];

export function isGeminiConfigured(): boolean {
  return !!process.env.GOOGLE_AI_API_KEY;
}

export async function generateCaption(dayNumber: number): Promise<string> {
  if (!isGeminiConfigured()) {
    return FALLBACK_CAPTIONS[Math.floor(Math.random() * FALLBACK_CAPTIONS.length)];
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    const prompt = `Generate a single short, playful, and funny photo caption for Day ${dayNumber} of a 4-day company trip to Da Nang, Vietnam. 
The caption should be 1-2 sentences max, casual, relatable, and include 1-2 relevant emojis.
Examples of tone: "Beach mode activated 🌊", "Survived another team-building challenge 😭", "Main character energy ✨"
Just return the caption text, nothing else.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch {
    return FALLBACK_CAPTIONS[Math.floor(Math.random() * FALLBACK_CAPTIONS.length)];
  }
}
