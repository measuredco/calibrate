import { getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { renderClbrRoot } from "./root";

function mountRoot(html: string): HTMLElement {
  document.body.innerHTML = html;
  return document.body.firstElementChild as HTMLElement;
}

describe("renderClbrRoot", () => {
  it("renders root class and default data-brand when brand is omitted", () => {
    const root = mountRoot(renderClbrRoot({ children: "<p>content</p>" }));
    expect(root.classList.contains("clbr")).toBe(true);
    expect(root.getAttribute("data-brand")).toBe("msrd");
  });

  it("does not render data-app-root by default", () => {
    const root = mountRoot(renderClbrRoot({ children: "<p>content</p>" }));
    expect(root.hasAttribute("data-app-root")).toBe(false);
  });

  it("renders data-app-root when appRoot is true", () => {
    const root = mountRoot(
      renderClbrRoot({
        appRoot: true,
        children: "<p>content</p>",
      }),
    );
    expect(root.hasAttribute("data-app-root")).toBe(true);
  });

  it("does not render data-app-root when appRoot is false", () => {
    const root = mountRoot(
      renderClbrRoot({
        appRoot: false,
        children: "<p>content</p>",
      }),
    );
    expect(root.hasAttribute("data-app-root")).toBe(false);
  });

  it("does not render data-app-overscroll-behavior when behavior is omitted", () => {
    const root = mountRoot(
      renderClbrRoot({
        children: "<p>content</p>",
      }),
    );
    expect(root.hasAttribute("data-app-overscroll-behavior")).toBe(false);
  });

  it('renders data-app-overscroll-behavior when behavior is "none"', () => {
    const root = mountRoot(
      renderClbrRoot({
        appOverscrollBehavior: "none",
        children: "<p>content</p>",
      }),
    );
    expect(root.getAttribute("data-app-overscroll-behavior")).toBe("none");
  });

  it("applies explicit brand attribute", () => {
    const root = mountRoot(
      renderClbrRoot({
        brand: "wrfr",
        children: "<p>content</p>",
      }),
    );
    expect(root.getAttribute("data-brand")).toBe("wrfr");
  });

  it("renders theme attribute when provided", () => {
    const root = mountRoot(
      renderClbrRoot({
        children: "<p>content</p>",
        theme: "dark",
      }),
    );
    expect(root.getAttribute("data-theme")).toBe("dark");
  });

  it("does not render theme attribute when omitted", () => {
    const root = mountRoot(renderClbrRoot({ children: "<p>content</p>" }));
    expect(root.hasAttribute("data-theme")).toBe(false);
  });

  it("renders dir when provided", () => {
    const root = mountRoot(
      renderClbrRoot({
        children: "<p>content</p>",
        dir: "rtl",
      }),
    );
    expect(root.getAttribute("dir")).toBe("rtl");
  });

  it("does not render dir when omitted", () => {
    const root = mountRoot(renderClbrRoot({ children: "<p>content</p>" }));
    expect(root.hasAttribute("dir")).toBe(false);
  });

  it("renders lang when provided", () => {
    const root = mountRoot(
      renderClbrRoot({
        children: "<p>content</p>",
        lang: "en-GB",
      }),
    );
    expect(root.getAttribute("lang")).toBe("en-GB");
  });

  it("does not render lang when omitted", () => {
    const root = mountRoot(renderClbrRoot({ children: "<p>content</p>" }));
    expect(root.hasAttribute("lang")).toBe(false);
  });

  it("injects children HTML content", () => {
    const children = "<section><h1>Title</h1><p>Body</p></section>";
    const root = mountRoot(renderClbrRoot({ children }));

    expect(getByText(root, "Title")).toBeTruthy();
    expect(getByText(root, "Body")).toBeTruthy();
  });
});
