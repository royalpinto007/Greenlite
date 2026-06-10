// Greenlite web worker.
//
// One Worker serves three surfaces from the same origin:
//   /               -> marketing website        (dist/index.html + web assets)
//   /app, /app/*    -> web control tower         (Vite/React SPA, dist/app)
//   /mobile, /...   -> Expo mobile-web preview   (expo-router SPA, dist/mobile)
//
// Cloudflare's built-in static-assets SPA fallback only supports one root
// index.html, which would wrongly serve the marketing page for deep links into
// either SPA. So we handle the fallback per-subtree: any unmatched path under
// /app or /mobile is served that app's own index.html, letting its client
// router take over.

export interface Env {
  ASSETS: Fetcher;
}

const SPA_ROOTS = ["/app", "/mobile"];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const res = await env.ASSETS.fetch(request);

    if (res.status === 404) {
      const root = SPA_ROOTS.find(
        (r) => url.pathname === r || url.pathname.startsWith(r + "/"),
      );
      if (root) {
        const index = new URL(`${root}/index.html`, url.origin);
        return env.ASSETS.fetch(new Request(index, request));
      }
    }

    return res;
  },
};
