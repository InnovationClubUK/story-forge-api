// api/story.js — Vercel serverless function (no Express)

export const config = { runtime: 'nodejs18.x' };

function allowCors(res) {
  // If you want to lock it down later, replace * with your GitHub Pages origin.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
}

export default async function handler(req, res) {
  allowCors(res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { hero='a brave kid', sidekick='a friendly robot', setting='a sunny park', goal='find a treasure', length='short' } = req.body || {};

    // If you don't have a model key yet, this simple stub will still work:
    const story = `Once upon a time, ${hero} and ${sidekick} set off through ${setting} to ${goal}. They met challenges, helped each other, and learned something new. In the end, they succeeded—together.`;

    // If you later want OpenAI, you’ll drop it in here and return its text instead.
    return res.status(200).json({ story });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to generate story' });
  }
}
