import { describe, expect, it } from "vitest";
import { renderClbrRoot } from "./root";

describe("renderClbrRoot", () => {
  it("renders root class and default data-brand when brand is omitted", () => {
    const html = renderClbrRoot({ children: "<p>content</p>" });
    expect(html).toContain('class="clbr"');
    expect(html).toContain('data-brand="msrd"');
  });

  it("does not render data-app-root by default", () => {
    const html = renderClbrRoot({ children: "<p>content</p>" });
    expect(html).not.toContain("data-app-root");
  });

  it("renders data-app-root when appRoot is true", () => {
    const html = renderClbrRoot({
      appRoot: true,
      children: "<p>content</p>",
    });
    expect(html).toContain("data-app-root");
  });

  it("does not render data-app-root when appRoot is false", () => {
    const html = renderClbrRoot({
      appRoot: false,
      children: "<p>content</p>",
    });
    expect(html).not.toContain("data-app-root");
  });

  it('does not render data-app-overscroll-behavior when behavior is "auto"', () => {
    const html = renderClbrRoot({
      appOverscrollBehavior: "auto",
      children: "<p>content</p>",
    });
    expect(html).not.toContain("data-app-overscroll-behavior=");
  });

  it('renders data-app-overscroll-behavior when behavior is "none"', () => {
    const html = renderClbrRoot({
      appOverscrollBehavior: "none",
      children: "<p>content</p>",
    });
    expect(html).toContain('data-app-overscroll-behavior="none"');
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
