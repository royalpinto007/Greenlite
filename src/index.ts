// Greenlite web worker.
//
// The deployment serves two things from one Worker:
//   /            -> the marketing website (dist/index.html + web assets)
//   /app, /app/* -> the actual Expo web app (a client-routed SPA)
//
// Cloudflare's built-in static-assets SPA fallback only supports a single
// root index.html, which would wrongly serve the marketing page for deep
// /app links. So we handle the fallback ourselves: any unmatched path under
// /app is served the Expo app's index.html, letting expo-router take over.

export interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const res = await env.ASSETS.fetch(request);

    if (res.status === 404 && url.pathname.startsWith("/app")) {
      const appIndex = new URL("/app/index.html", url.origin);
      return env.ASSETS.fetch(new Request(appIndex, request));
    }

    return res;
  },
};
