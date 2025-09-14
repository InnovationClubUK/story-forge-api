// api/story.js
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { hero, sidekick, setting, goal, length } = req.body;
  const prompt = `Write a fun, kid-friendly story with a hero (${hero}), a sidekick (${sidekick}), set in ${setting}, where the goal is ${goal}. Story length: ${length}.`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    res.status(200).json({ story: response.choices[0].message.content.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate story" });
  }
}
