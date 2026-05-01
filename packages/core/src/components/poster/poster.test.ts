import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  CLBR_POSTER_SPEC,
  type ClbrPosterProps,
  renderClbrPoster,
  renderClbrPosterImage,
} from "./poster";

function mountPoster(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

const fixtureMedia = renderClbrPosterImage({ src: "/image.jpg" });

describe("renderClbrPoster", () => {
  it("renders the default poster contract", () => {
    const root = mountPoster(renderClbrPoster({ media: fixtureMedia }));
    const poster = root.querySelector(".clbr-poster") as HTMLElement;

    expect(poster.tagName).toBe("DIV");
    expect(poster.className).toBe("clbr-poster");
    expect(
      poster
        .querySelector(".image-wrapper .clbr-image img")
        ?.getAttribute("src"),
    ).toBe("/image.jpg");
    expect(poster.querySelector(".content")).toBeFalsy();
  });

  it("renders trusted foreground child HTML inside content wrapper", () => {
    const root = mountPoster(
      renderClbrPoster({
        children: '<div class="copy">Poster content</div>',
        media: fixtureMedia,
      }),
    );

    expect(root.querySelector(".clbr-poster .content .copy")?.textContent).toBe(
      "Poster content",
    );
  });

  it("emits data-clbr-surface when surface is provided", () => {
    const root = mountPoster(
      renderClbrPoster({ media: fixtureMedia, surface: "brand" }),
    );

    expect(
      root.querySelector(".clbr-poster")?.getAttribute("data-clbr-surface"),
    ).toBe("brand");
  });

  it("emits content theme and default surface when contentTheme is provided", () => {
    const root = mountPoster(
      renderClbrPoster({ contentTheme: "dark", media: fixtureMedia }),
    );
    const poster = root.querySelector(".clbr-poster") as HTMLElement;

    expect(poster.getAttribute("data-clbr-content-theme")).toBe("dark");
    expect(poster.getAttribute("data-clbr-surface")).toBe("default");
  });

  it("preserves an explicit brand surface when contentTheme is provided", () => {
    const root = mountPoster(
      renderClbrPoster({
        contentTheme: "light",
        media: fixtureMedia,
        surface: "brand",
      }),
    );
    const poster = root.querySelector(".clbr-poster") as HTMLElement;

    expect(poster.getAttribute("data-clbr-content-theme")).toBe("light");
    expect(poster.getAttribute("data-clbr-surface")).toBe("brand");
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountPoster(
      renderClbrPoster({ id: "my-poster", media: fixtureMedia }),
    );
    const poster = root.querySelector(".clbr-poster") as HTMLElement;

    expect(poster.id).toBe("my-poster");
  });

  it("omits id when not provided", () => {
    const root = mountPoster(renderClbrPoster({ media: fixtureMedia }));
    const poster = root.querySelector(".clbr-poster") as HTMLElement;

    expect(poster.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderClbrPoster({ id: "not valid", media: fixtureMedia }),
    ).toThrow();
  });
});

describe("renderClbrPosterImage", () => {
  it("emits cover and high-priority fetch hints regardless of caller", () => {
    const root = mountPoster(
      renderClbrPoster({
        media: renderClbrPosterImage({ src: "/image.jpg" }),
      }),
    );
    const wrapper = root.querySelector(".image-wrapper .clbr-image");
    const img = wrapper?.querySelector("img");

    expect(wrapper?.getAttribute("data-object-fit")).toBe("cover");
    expect(img?.getAttribute("fetchpriority")).toBe("high");
  });

  it("forwards gravity, sizes, src, and srcSet; emits empty alt", () => {
    const root = mountPoster(
      renderClbrPoster({
        media: renderClbrPosterImage({
          gravity: "SE",
          sizes: "(max-width: 30em) 100vw, 60rem",
          src: "/image.jpg",
          srcSet: "/image.jpg 1x, /image-2x.jpg 2x",
        }),
      }),
    );
    const wrapper = root.querySelector(".image-wrapper .clbr-image");
    const img = wrapper?.querySelector("img");

    expect(wrapper?.getAttribute("data-gravity")).toBe("SE");
    expect(img?.getAttribute("alt")).toBe("");
    expect(img?.getAttribute("sizes")).toBe("(max-width: 30em) 100vw, 60rem");
    expect(img?.getAttribute("srcset")).toBe("/image.jpg 1x, /image-2x.jpg 2x");
  });
});

describeSpecConsistency<ClbrPosterProps>({
  baseProps: { media: fixtureMedia },
  renderer: renderClbrPoster,
  spec: CLBR_POSTER_SPEC,
});
