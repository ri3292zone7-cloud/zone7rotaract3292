/* RotaGPT serverless upgrade — Vercel function.
   If DEEPSEEK_API_KEY (or POLLINATIONS_API_KEY) is set as an environment
   variable in Vercel, questions get AI answers grounded in the Zone 7
   knowledge base. Without a key it answers 501, and the widget falls back
   to the built-in knowledge engine — so the bot works either way. */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ engine: "local" });
    return;
  }

  const body = req.body || {};
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const kb = typeof body.kb === "string" ? body.kb : "";

  if (!messages.length) {
    res.status(400).json({ engine: "local" });
    return;
  }

  const system =
    "You are RotaGPT, a friendly assistant for the Zone 7 Rotaract website (Rotaract District 3292, Nepal-Bhutan). " +
    "Answer from the knowledge base context below. Be warm, brief and specific. Use short paragraphs and simple lists when useful. " +
    "If the context does not cover the question, say you are not sure and suggest the website sections. " +
    "Never invent club names, amounts or rules. Only Zone 7 clubs exist: Balkumari, Baneshwor, Liberty, Kathmandu West, " +
    "Kathmandu Heights, Sankhu, New Road City, Sukedhara, Tripureswor.\n\nKnowledge base:\n" + kb.slice(0, 6000);

  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const pollinationsKey = process.env.POLLINATIONS_API_KEY;

  if (deepseekKey) {
    try {
      const r = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: { Authorization: "Bearer " + deepseekKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "system", content: system }].concat(messages.slice(-8)),
          max_tokens: 500,
          temperature: 0.4
        })
      });
      if (r.ok) {
        const j = await r.json();
        const answer = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
        if (answer) {
          res.json({ engine: "llm", provider: "deepseek", answer: answer.trim() });
          return;
        }
      }
    } catch (e) { /* fall through */ }
  }

  if (pollinationsKey) {
    try {
      const r = await fetch("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: { Authorization: "Bearer " + pollinationsKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai",
          messages: [{ role: "system", content: system }].concat(messages.slice(-8)),
          max_tokens: 500
        })
      });
      if (r.ok) {
        const j = await r.json();
        const answer = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
        if (answer) {
          res.json({ engine: "llm", provider: "pollinations", answer: answer.trim() });
          return;
        }
      }
    } catch (e) { /* fall through */ }
  }

  res.status(501).json({ engine: "local" });
}
