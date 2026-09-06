import { describe, expect, it } from "vitest";

import { money, relTime } from "./format";

describe("format helpers", () => {
  it("falls back for non-finite money values", () => {
    expect(money(Number.NaN)).toBe("-");
    expect(money(Number.POSITIVE_INFINITY)).toBe("-");
  });

  it("falls back for non-finite timestamps", () => {
    expect(relTime(Number.NaN)).toBe("just now");
    expect(relTime(Number.NEGATIVE_INFINITY)).toBe("just now");
  });
});
