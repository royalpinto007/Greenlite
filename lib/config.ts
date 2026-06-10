import Constants from "expo-constants";

// Config comes from app.json -> expo.extra (or EAS secrets at build time).
const extra = (Constants.expoConfig?.extra ?? {}) as {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  resolvdUrl?: string;
  resolvdToken?: string;
};

export const CONFIG = {
  supabaseUrl: extra.supabaseUrl ?? "",
  supabaseAnonKey: extra.supabaseAnonKey ?? "",
  resolvdUrl: extra.resolvdUrl ?? "",
  resolvdToken: extra.resolvdToken ?? "",
};

export const isConfigured = () =>
  !!CONFIG.supabaseUrl && !!CONFIG.supabaseAnonKey;
