import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../testing/spec";
import {
  CLBR_POSTER_SPEC,
  type ClbrPosterProps,
  renderClbrPoster,
} from "./poster";

function mountPoster(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrPoster", () => {
  it("renders the default poster contract", () => {
    const root = mountPoster(
      renderClbrPoster({
        image: '<div class="clbr-image"><img src="/image.jpg" alt="Alt" /></div>',
      }),
    );
    const poster = root.querySelector(".clbr-poster") as HTMLElement;

    expect(poster.tagName).toBe("DIV");
    expect(poster.className).toBe("clbr-poster");
    expect(
      poster.querySelector(".image-wrapper .clbr-image img")?.getAttribute("src"),
    ).toBe("/image.jpg");
    expect(poster.querySelector(".content")).toBeFalsy();
  });

  it("renders trusted foreground child HTML inside content wrapper", () => {
    const root = mountPoster(
      renderClbrPoster({
        children: '<div class="copy">Poster content</div>',
        image: '<div class="clbr-image"><img src="/image.jpg" alt="Alt" /></div>',
      }),
    );

    expect(root.querySelector(".clbr-poster .content .copy")?.textContent).toBe(
      "Poster content",
    );
  });

  it("emits data-clbr-surface when surface is provided", () => {
    const root = mountPoster(
      renderClbrPoster({
        image: '<div class="clbr-image"><img src="/image.jpg" alt="Alt" /></div>',
        surface: "brand",
      }),
    );

    expect(root.querySelector(".clbr-poster")?.getAttribute("data-clbr-surface")).toBe(
      "brand",
    );
  });

  it("emits content theme and default surface when contentTheme is provided", () => {
    const root = mountPoster(
      renderClbrPoster({
        contentTheme: "dark",
        image: '<div class="clbr-image"><img src="/image.jpg" alt="Alt" /></div>',
      }),
    );
    const poster = root.querySelector(".clbr-poster") as HTMLElement;

    expect(poster.getAttribute("data-clbr-content-theme")).toBe("dark");
    expect(poster.getAttribute("data-clbr-surface")).toBe("default");
  });

  it("preserves an explicit brand surface when contentTheme is provided", () => {
    const root = mountPoster(
      renderClbrPoster({
        contentTheme: "light",
        image: '<div class="clbr-image"><img src="/image.jpg" alt="Alt" /></div>',
        surface: "brand",
      }),
    );
    const poster = root.querySelector(".clbr-poster") as HTMLElement;

    expect(poster.getAttribute("data-clbr-content-theme")).toBe("light");
    expect(poster.getAttribute("data-clbr-surface")).toBe("brand");
  });
});

describeSpecConsistency<ClbrPosterProps>({
  baseProps: { image: '<img src="/i.jpg" alt="" />' },
  renderer: renderClbrPoster,
  spec: CLBR_POSTER_SPEC,
});
