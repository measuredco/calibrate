import { describe, expect, it } from "vitest";
import { renderClbrSurface } from "./surface";

describe("renderClbrSurface", () => {
  it("uses base surface class and default variant by default", () => {
    const html = renderClbrSurface({ children: "<p>content</p>" });
    expect(html).toContain('class="surface"');
    expect(html).toContain('data-variant="default"');
  });

  it("renders brand surface variant attribute", () => {
    const html = renderClbrSurface({
      children: "<p>content</p>",
      variant: "brand",
    });
    expect(html).toContain('class="surface"');
    expect(html).toContain('data-variant="brand"');
  });

  it("injects children HTML content", () => {
    const children = "<section><h2>Surface</h2><p>Body</p></section>";
    const html = renderClbrSurface({ children });
    expect(html).toContain(children);
  });
});
