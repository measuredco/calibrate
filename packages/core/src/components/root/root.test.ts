import { describe, expect, it } from "vitest";
import { renderClbrRoot } from "./root";

describe("renderClbrRoot", () => {
  it("uses msrd brand by default", () => {
    const html = renderClbrRoot({ children: "<p>content</p>" });
    expect(html).toContain('class="clbr clbr-brand-msrd"');
  });

  it("applies explicit brand class", () => {
    const html = renderClbrRoot({
      brand: "wrfr",
      children: "<p>content</p>",
    });
    expect(html).toContain('class="clbr clbr-brand-wrfr"');
  });

  it("renders theme class when provided", () => {
    const html = renderClbrRoot({
      children: "<p>content</p>",
      theme: "dark",
    });
    expect(html).toContain("clbr-theme-dark");
  });

  it("does not render theme class when omitted", () => {
    const html = renderClbrRoot({ children: "<p>content</p>" });
    expect(html).not.toContain("clbr-theme-");
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
