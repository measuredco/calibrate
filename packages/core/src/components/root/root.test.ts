import { describe, expect, it } from "vitest";
import { renderClbrRoot } from "./root";

describe("renderClbrRoot", () => {
  it("renders root class and default data-brand when brand is omitted", () => {
    const html = renderClbrRoot({ children: "<p>content</p>" });
    expect(html).toContain('class="clbr"');
    expect(html).toContain('data-brand="msrd"');
  });

  it("applies explicit brand attribute", () => {
    const html = renderClbrRoot({
      brand: "wrfr",
      children: "<p>content</p>",
    });
    expect(html).toContain('data-brand="wrfr"');
  });

  it("renders theme attribute when provided", () => {
    const html = renderClbrRoot({
      children: "<p>content</p>",
      theme: "dark",
    });
    expect(html).toContain('data-theme="dark"');
  });

  it("does not render theme attribute when omitted", () => {
    const html = renderClbrRoot({ children: "<p>content</p>" });
    expect(html).not.toContain("data-theme=");
  });

  it("renders dir when provided", () => {
    const html = renderClbrRoot({
      children: "<p>content</p>",
      dir: "rtl",
    });
    expect(html).toContain(' dir="rtl"');
  });

  it("does not render dir when omitted", () => {
    const html = renderClbrRoot({ children: "<p>content</p>" });
    expect(html).not.toContain(" dir=");
  });

  it("renders lang when provided", () => {
    const html = renderClbrRoot({
      children: "<p>content</p>",
      lang: "en-GB",
    });
    expect(html).toContain(' lang="en-GB"');
  });

  it("does not render lang when omitted", () => {
    const html = renderClbrRoot({ children: "<p>content</p>" });
    expect(html).not.toContain(" lang=");
  });

  it("injects children HTML content", () => {
    const children = "<section><h1>Title</h1><p>Body</p></section>";
    const html = renderClbrRoot({ children });
    expect(html).toContain(children);
  });
});
