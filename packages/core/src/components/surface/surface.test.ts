import { describe, expect, it } from "vitest";
import { renderClbrSurface } from "./surface";

describe("renderClbrSurface", () => {
  it("uses only base surface class by default", () => {
    const html = renderClbrSurface({ children: "<p>content</p>" });
    expect(html).toContain('class="clbr-surface"');
    expect(html).not.toContain("clbr-surface-default");
  });

  it("renders brand surface variant class", () => {
    const html = renderClbrSurface({
      children: "<p>content</p>",
      surface: "brand",
    });
    expect(html).toContain('class="clbr-surface clbr-surface-brand"');
  });

  it("injects children HTML content", () => {
    const children = "<section><h2>Surface</h2><p>Body</p></section>";
    const html = renderClbrSurface({ children });
    expect(html).toContain(children);
  });
});
