import { getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { renderClbrSurface } from "./surface";

function mountSurface(html: string): HTMLElement {
  document.body.innerHTML = html;
  return document.body.firstElementChild as HTMLElement;
}

describe("renderClbrSurface", () => {
  it("uses base surface class and default variant by default", () => {
    const surface = mountSurface(
      renderClbrSurface({ children: "<p>content</p>" }),
    );
    expect(surface.classList.contains("surface")).toBe(true);
    expect(surface.getAttribute("data-variant")).toBe("default");
  });

  it("renders brand surface variant attribute", () => {
    const surface = mountSurface(
      renderClbrSurface({
        children: "<p>content</p>",
        variant: "brand",
      }),
    );
    expect(surface.classList.contains("surface")).toBe(true);
    expect(surface.getAttribute("data-variant")).toBe("brand");
  });

  it("injects children HTML content", () => {
    const children = "<section><h2>Surface</h2><p>Body</p></section>";
    const surface = mountSurface(renderClbrSurface({ children }));
    expect(getByText(surface, "Surface")).toBeTruthy();
    expect(getByText(surface, "Body")).toBeTruthy();
  });
});
