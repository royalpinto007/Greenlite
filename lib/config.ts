import Constants from "expo-constants";

// Config comes from app.json -> expo.extra (or EAS secrets at build time).
// Greenlite talks only to the agents' own APIs (server-side), never to a
// database directly, so the app ships no database credentials.
const extra = (Constants.expoConfig?.extra ?? {}) as {
  resolvdUrl?: string;
  resolvdToken?: string;
};

export const CONFIG = {
  resolvdUrl: extra.resolvdUrl ?? "",
  resolvdToken: extra.resolvdToken ?? "",
};

export const isConfigured = () => !!CONFIG.resolvdUrl && !!CONFIG.resolvdToken;
