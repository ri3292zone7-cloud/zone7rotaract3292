/* RotaGPT serverless upgrade — Vercel function.
   If GEMINI_API_KEY / OPENROUTER_API_KEY (or DEEPSEEK_API_KEY / POLLINATIONS_API_KEY)
   is set as an environment variable in Vercel, questions get AI answers grounded
   in the Zone 7 knowledge base. Without a key it answers 501, and the widget
   falls back to the built-in knowledge engine — so the bot works either way. */
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
    "You are RotaGPT, a friendly, knowledgeable assistant for the Zone 7 Rotaract website (Rotaract District 3292, Nepal-Bhutan).\n\n" +
    "RULES:\n" +
    "1. Answer from the knowledge base context below. Be warm, specific, and helpful.\n" +
    "2. Use short paragraphs, bullet points, and clear structure when useful.\n" +
    "3. Always include relevant links when the KB provides them.\n" +
    "4. If the context does not cover the question, say you are not sure and suggest the most relevant website section.\n" +
    "5. Never invent club names, amounts, rules, or dates. Only cite information from the context.\n" +
    "6. Only Zone 7 clubs exist: Balkumari, Baneshwor, Liberty, Kathmandu West, Kathmandu Heights, Sankhu, New Road City, Sukedhara, Tripureswor.\n" +
    "7. Format responses with **bold** for key terms and use line breaks for readability.\n\n" +
    "CLUB DIRECTORY:\n" +
    "- Rotaract Club of Balkumari | Sponsor: Rotary Club of Butwal | Chartered: 18 October 2023\n" +
    "- Rotaract Club of Baneshwor | Sponsor: Rotary Club of Baneshwor | Chartered: 13 October 2020\n" +
    "- Rotaract Club of Liberty College | Sponsor: Rotary Club of Nagarjun | Chartered: 1 May 2012\n" +
    "- Rotaract Club of Kathmandu West | Sponsor: Rotary Club of Kathmandu West | Chartered: 10 September 2007\n" +
    "- Rotaract Club of Kathmandu Height | Sponsor: Rotary Club of Kathmandu Height | Chartered: 6 January 2026\n" +
    "- Rotaract Club of Sankhu | Sponsor: Rotary Club of Sankhu | Chartered: 25 June 2020\n" +
    "- Rotaract Club of New Road City | Sponsor: Rotary Club of New Road City | Chartered: 1 September 2004\n" +
    "- Rotaract Club of Sukedhara | Sponsor: Rotary Club of Nagarjun | Chartered: 1 July 2019\n" +
    "- Rotaract Club of Tripureswor | Sponsor: Rotary Club of Tripureswor | Chartered: 24 November 2003\n\n" +
    "BAROMETER SCORING:\n" +
    "- Star Excellence: 96-100 points\n" +
    "- Diamond Excellence: 86-95 points\n" +
    "- Premier Excellence: 71-85 points\n" +
    "- Distinguished Excellence: 60-70 points\n" +
    "- 40 items across 5 groups: Governance (1-7), Meetings (8-16), Reporting (17-24), Projects (25-31), Service (32-40)\n" +
    "- Community clubs: 24 GMs + 12 BODs, 20% membership growth, 80% retention\n" +
    "- University clubs: 18 GMs + 12 BODs, 50% membership growth, 40% retention\n\n" +
    "KNOWLEDGE BASE:\n" + kb.slice(0, 8000);

  const geminiKey = process.env.GEMINI_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const pollinationsKey = process.env.POLLINATIONS_API_KEY;

  if (geminiKey) {
    try {
      const contents = messages.slice(-8).map(function (m) {
        return { role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] };
      });
      const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: contents,
          generationConfig: { maxOutputTokens: 600, temperature: 0.3 }
        })
      });
      if (r.ok) {
        const j = await r.json();
        const answer = j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts && j.candidates[0].content.parts[0] && j.candidates[0].content.parts[0].text;
        if (answer) {
          res.json({ engine: "llm", provider: "gemini", answer: answer.trim() });
          return;
        }
      }
    } catch (e) { /* fall through */ }
  }

  if (openrouterKey) {
    try {
      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + openrouterKey,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://zone7rotaract3292.vercel.app",
          "X-Title": "Zone 7 RotaGPT"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct:free",
          messages: [{ role: "system", content: system }].concat(messages.slice(-8)),
          max_tokens: 600,
          temperature: 0.3
        })
      });
      if (r.ok) {
        const j = await r.json();
        const answer = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
        if (answer) {
          res.json({ engine: "llm", provider: "openrouter", answer: answer.trim() });
          return;
        }
      }
    } catch (e) { /* fall through */ }
  }

  if (deepseekKey) {
    try {
      const r = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: { Authorization: "Bearer " + deepseekKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "system", content: system }].concat(messages.slice(-8)),
          max_tokens: 600,
          temperature: 0.3
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
      const r = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: "Bearer " + pollinationsKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai",
          messages: [{ role: "system", content: system }].concat(messages.slice(-8)),
          max_tokens: 600,
          temperature: 0.3
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
