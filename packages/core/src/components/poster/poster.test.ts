import { describe, expect, it } from "vitest";
import { renderClbrPoster } from "./poster";

function mountPoster(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".poster") as HTMLElement;
}

describe("renderClbrPoster", () => {
  it("renders the default poster contract", () => {
    const poster = mountPoster(
      renderClbrPoster({
        image: '<div class="image"><img src="/image.jpg" alt="Alt" /></div>',
      }),
    );

    expect(poster.tagName).toBe("DIV");
    expect(poster.className).toBe("poster");
    expect(
      poster.querySelector(".image-wrapper .image img")?.getAttribute("src"),
    ).toBe("/image.jpg");
    expect(poster.querySelector(".content")).toBeFalsy();
  });

  it("renders trusted foreground child HTML inside content wrapper", () => {
    const poster = mountPoster(
      renderClbrPoster({
        children: '<div class="copy">Poster content</div>',
        image: '<div class="image"><img src="/image.jpg" alt="Alt" /></div>',
      }),
    );

    expect(poster.querySelector(".content .copy")?.textContent).toBe(
      "Poster content",
    );
  });

  it("emits data-surface when surface is provided", () => {
    const poster = mountPoster(
      renderClbrPoster({
        image: '<div class="image"><img src="/image.jpg" alt="Alt" /></div>',
        surface: "brand",
      }),
    );

    expect(poster.getAttribute("data-surface")).toBe("brand");
  });

  it("emits content theme and default surface when contentTheme is provided", () => {
    const poster = mountPoster(
      renderClbrPoster({
        contentTheme: "dark",
        image: '<div class="image"><img src="/image.jpg" alt="Alt" /></div>',
      }),
    );

    expect(poster.getAttribute("data-content-theme")).toBe("dark");
    expect(poster.getAttribute("data-surface")).toBe("default");
  });

  it("preserves an explicit brand surface when contentTheme is provided", () => {
    const poster = mountPoster(
      renderClbrPoster({
        contentTheme: "light",
        image: '<div class="image"><img src="/image.jpg" alt="Alt" /></div>',
        surface: "brand",
      }),
    );

    expect(poster.getAttribute("data-content-theme")).toBe("light");
    expect(poster.getAttribute("data-surface")).toBe("brand");
  });
});
