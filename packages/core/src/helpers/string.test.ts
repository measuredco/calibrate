import { describe, expect, it } from "vitest";

import { normalizeOptionalHtmlId } from "./string";

describe("normalizeOptionalHtmlId", () => {
  it("returns undefined when input is undefined", () => {
    expect(normalizeOptionalHtmlId(undefined)).toBe(undefined);
  });

  it("returns undefined when input is empty", () => {
    expect(normalizeOptionalHtmlId("")).toBe(undefined);
  });

  it("returns undefined when input is whitespace-only", () => {
    expect(normalizeOptionalHtmlId("   ")).toBe(undefined);
  });

  it("trims surrounding whitespace from a valid id", () => {
    expect(normalizeOptionalHtmlId("  my-id  ")).toBe("my-id");
  });

  it("returns the trimmed id when valid", () => {
    expect(normalizeOptionalHtmlId("section-1")).toBe("section-1");
    expect(normalizeOptionalHtmlId("Section_1")).toBe("Section_1");
    expect(normalizeOptionalHtmlId("ns:thing")).toBe("ns:thing");
  });

  it("throws on syntactically invalid id (whitespace inside)", () => {
    expect(() => normalizeOptionalHtmlId("not valid")).toThrow();
  });

  it("throws on syntactically invalid id (leading digit)", () => {
    expect(() => normalizeOptionalHtmlId("1section")).toThrow();
  });

  it("throws on syntactically invalid id (special chars)", () => {
    expect(() => normalizeOptionalHtmlId("foo$bar")).toThrow();
  });
});
