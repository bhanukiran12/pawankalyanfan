import {
  createServiceApp,
  success,
  error,
  asyncHandler,
  optionalAuth,
  SERVICE_PORTS,
} from "@pkf/shared";
import { prisma } from "@pkf/database";

const app = createServiceApp("ai-service");

const DEFAULT_PROMPT = `You are PK Fan AI, a knowledgeable assistant for the Pawan Kalyan fan community.
Help fans with movie recommendations, famous dialogues, quote suggestions, and timeline questions.
Be enthusiastic but respectful. Always clarify you are an unofficial fan AI.
Keep responses concise and helpful.`;

async function getPrompt(name: string): Promise<string> {
  const prompt = await prisma.aiPrompt.findUnique({ where: { name } });
  return prompt?.system ?? DEFAULT_PROMPT;
}

function fallbackResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("movie") || lower.includes("film")) {
    return "Check out our Movies section for Pawan Kalyan's complete filmography including Gabbar Singh, Attarintiki Daredi, and OG!";
  }
  if (lower.includes("quote") || lower.includes("dialogue")) {
    return "Visit our Quotes section for iconic dialogues and motivational quotes!";
  }
  return "Welcome to PK Fan AI! Ask me about movies, quotes, or Pawan Kalyan's journey.";
}

async function chatWithAI(message: string, history: { role: string; content: string }[] = []): Promise<string> {
  const systemPrompt = await getPrompt("chatbot");
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) return fallbackResponse(message);

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.SITE_URL || "https://pawankalyanfan.com",
        "X-Title": "PawanKalyanFan",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...history,
          { role: "user", content: message },
        ],
        max_tokens: 500,
      }),
    });

    if (!res.ok) throw new Error("AI request failed");
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? fallbackResponse(message);
  } catch {
    return fallbackResponse(message);
  }
}

app.post("/chat", optionalAuth, asyncHandler(async (req, res) => {
  const { message, history } = req.body;
  if (!message) return error(res, "Message required");

  const response = await chatWithAI(message, history ?? []);

  if (req.user?.id) {
    await prisma.analyticsEvent.create({
      data: {
        event: "ai_chat",
        userId: req.user.id,
        metadata: JSON.stringify({ messageLength: message.length }),
      },
    });
  }

  success(res, { response });
}));

app.put("/prompts/:name", asyncHandler(async (req, res) => {
  const prompt = await prisma.aiPrompt.upsert({
    where: { name: req.params.name },
    create: { name: req.params.name, system: req.body.system },
    update: { system: req.body.system },
  });
  success(res, prompt);
}));

const PORT = process.env.PORT || SERVICE_PORTS.AI;
app.listen(PORT, () => console.log(`🤖 AI Service running on :${PORT}`));

export default app;
