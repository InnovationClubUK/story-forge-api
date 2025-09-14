// api/story.js  — plain Node serverless function (no Express)
const OpenAI = require("openai");

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Use POST with JSON body." });
    }

    const { hero = "", sidekick = "", setting = "", goal = "", length = "short" } = req.body || {};

    const lengthText =
      length === "long" ? "around 400–500 words"
      : length === "medium" ? "around 250–300 words"
      : "around 150–200 words";

    const prompt =
      `Write a fun, kid-friendly story with a hero (${hero || "a brave kid"}), ` +
      `a sidekick (${sidekick || "a helpful friend"}), set in ${setting || "a magical place"}, ` +
      `where the goal is ${goal || "to help someone"}. Keep it ${lengthText}. ` +
      `Output PLAIN TEXT only — no markdown, no asterisks, no emojis, no headings.`;

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const story = resp.choices?.[0]?.message?.content?.trim() || "";
    return res.status(200).json({ story });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err?.message || "Failed to generate");
  }
};
