import { getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../testing/spec";
import {
  CLBR_SURFACE_SPEC,
  type ClbrSurfaceProps,
  renderClbrSurface,
} from "./surface";

function mountSurface(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrSurface", () => {
  it("uses base surface class and default variant by default", () => {
    const root = mountSurface(
      renderClbrSurface({ children: "<p>content</p>" }),
    );
    const surface = root.querySelector(".clbr-surface") as HTMLElement;
    expect(surface.classList.contains("clbr-surface")).toBe(true);
    expect(surface.getAttribute("data-clbr-surface")).toBe("default");
  });

  it("renders brand surface variant attribute", () => {
    const root = mountSurface(
      renderClbrSurface({
        children: "<p>content</p>",
        variant: "brand",
      }),
    );
    const surface = root.querySelector(".clbr-surface") as HTMLElement;
    expect(surface.classList.contains("clbr-surface")).toBe(true);
    expect(surface.getAttribute("data-clbr-surface")).toBe("brand");
  });

  it("renders inverse surface variant attribute", () => {
    const root = mountSurface(
      renderClbrSurface({
        children: "<p>content</p>",
        variant: "inverse",
      }),
    );
    const surface = root.querySelector(".clbr-surface") as HTMLElement;
    expect(surface.classList.contains("clbr-surface")).toBe(true);
    expect(surface.getAttribute("data-clbr-surface")).toBe("inverse");
  });

  it("renders brand-inverse surface variant attribute", () => {
    const root = mountSurface(
      renderClbrSurface({
        children: "<p>content</p>",
        variant: "brand-inverse",
      }),
    );
    const surface = root.querySelector(".clbr-surface") as HTMLElement;
    expect(surface.classList.contains("clbr-surface")).toBe(true);
    expect(surface.getAttribute("data-clbr-surface")).toBe("brand-inverse");
  });

  it("injects children HTML content", () => {
    const children = "<section><h2>Surface</h2><p>Body</p></section>";
    const root = mountSurface(renderClbrSurface({ children }));
    const surface = root.querySelector(".clbr-surface") as HTMLElement;
    expect(getByText(surface, "Surface")).toBeTruthy();
    expect(getByText(surface, "Body")).toBeTruthy();
  });
});

describeSpecConsistency<ClbrSurfaceProps>({
  baseProps: { children: "<p>content</p>" },
  renderer: renderClbrSurface,
  spec: CLBR_SURFACE_SPEC,
});
