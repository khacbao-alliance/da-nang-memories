import { GoogleGenerativeAI } from "@google/generative-ai";

const FALLBACK_SUMMARIES = [
  "Ngày 1: Cả team đặt chân xuống Đà Nẵng với năng lượng dồi dào và cơn háo hức chưa biết đang chờ gì phía trước 🛬✨",
  "Ngày 2: Cầu Vàng check-in xong, biển gọi tên — peak chaos chính thức bắt đầu từ đây 🌉🌊",
  "Ngày 3: Hội An huyền ảo với đèn lồng, bánh mì, và không ai còn nhớ lịch trình nữa 🏮😂",
  "Ngày 4: Chia tay Đà Nẵng với bụng no căng, da rám nắng, và tim đầy kỷ niệm 🌅💛",
];

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

export async function generateDailySummary(dayNumber: number, mediaCount: number): Promise<string> {
  const fallback = FALLBACK_SUMMARIES[(dayNumber - 1) % FALLBACK_SUMMARIES.length];
  if (!isGeminiConfigured()) return fallback;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    const prompt = `Viết 1-2 câu tóm tắt ngắn, hài hước và ấm áp cho Ngày ${dayNumber} của chuyến công tác Đà Nẵng 4 ngày 3 đêm. Hôm nay có ${mediaCount} kỷ niệm được chia sẻ. Tone nhẹ nhàng, vui vẻ, dùng 1-2 emoji. Chỉ trả về câu tóm tắt, không giải thích.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch {
    return fallback;
  }
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
