// api/story.js
import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Use POST with JSON body." });
    }

    const { hero = "", sidekick = "", setting = "", goal = "", length = "short" } = req.body || {};

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `Write a fun kid-friendly story about ${hero} and ${sidekick}, in ${setting}, with the goal of ${goal}. Length: ${length}.`;

    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const story = resp.choices?.[0]?.message?.content?.trim() || "";
    return res.status(200).json({ story });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to generate story" });
  }
}
