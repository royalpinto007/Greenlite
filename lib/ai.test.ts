import { afterEach, describe, expect, it, vi } from "vitest";

import { askAI } from "./ai";

describe("askAI", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a prompt-needed message for whitespace prompts without calling fetch", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ reply: "should not be used" })),
    );

    await expect(askAI("   ")).resolves.toMatch(/prompt/i);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
