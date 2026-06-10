// Greenlite has no server of its own, so it calls Resolvd's CORS-enabled
// /api/ai, which proxies to the shared Ollama gateway.
const AI_URL = "https://resolvd.agentpostmortem.workers.dev/api/ai";

export async function askAI(prompt: string): Promise<string> {
  try {
    const r = await fetch(AI_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const d = (await r.json()) as { reply?: string; error?: string };
    return d.reply || `Unavailable (${d.error ?? "?"}).`;
  } catch {
    return "Network error, please try again.";
  }
}
