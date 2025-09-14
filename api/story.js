// api/story.js
import OpenAI from "openai";

export default async function handler(req, res) {
  // --- CORS: allow your static site to call this API ---
  // (You can replace * with your exact origin if you want to lock it down)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Reply OK to the CORS preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST with JSON body." });
    return;
  }

  try {
    // Ensure JSON body exists
    const { hero, sidekick, setting, goal, length } = req.body || {};
    if (!hero || !setting || !goal) {
      res.status(400).json({ error: "Missing required fields (hero, setting, goal)." });
      return;
    }

    // Build the prompt. Ask for plain text (no **markdown**).
    const prompt = `Write a fun, kid-friendly story with a hero (${hero}), a sidekick (${sidekick || "a friend"}), set in ${setting}, where the goal is ${goal}. Length: ${length || "Short (~150-200 words)"}. Keep it G-rated and output plain text only (no markdown, no asterisks).`;

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const story = response?.choices?.[0]?.message?.content?.trim() || "";
    res.status(200).json({ story });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Failed to generate story" });
  }
}
