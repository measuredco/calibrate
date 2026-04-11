import { describe, expect, it } from "vitest";
import { renderClbrFigure } from "./figure";

function mountFigure(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".figure") as HTMLElement;
}

describe("renderClbrFigure", () => {
  it("renders the default figure contract", () => {
    const figure = mountFigure(
      renderClbrFigure({
        caption: "Caption",
        children: '<img src="/image.jpg" alt="Alt" />',
      }),
    );

    expect(figure.tagName).toBe("FIGURE");
    expect(figure.className).toBe("figure");
    expect(figure.hasAttribute("data-align")).toBe(false);
    expect(figure.querySelector("img")?.getAttribute("src")).toBe(
      "/image.jpg",
    );
    expect(figure.querySelector("figcaption > span.text")?.textContent).toBe(
      "Caption",
    );
    expect(
      figure
        .querySelector("figcaption > span.text")
        ?.getAttribute("data-size"),
    ).toBe("sm");
  });

  it("emits non-default align attributes", () => {
    const figure = mountFigure(
      renderClbrFigure({
        align: "center",
        caption: "Caption",
        children: '<img src="/image.jpg" alt="Alt" />',
      }),
    );

    expect(figure.getAttribute("data-align")).toBe("center");
  });

  it("renders trusted HTML for caption and children", () => {
    const figure = mountFigure(
      renderClbrFigure({
        caption: 'See the <a href="/docs">documentation</a>.',
        children: '<picture><img src="/image.jpg" alt="Alt" /></picture>',
      }),
    );

    expect(figure.querySelector("figcaption a")?.getAttribute("href")).toBe(
      "/docs",
    );
    expect(figure.querySelector("picture img")).toBeTruthy();
  });

  it("passes responsive through to the caption text", () => {
    const figure = mountFigure(
      renderClbrFigure({
        caption: "Caption",
        children: '<img src="/image.jpg" alt="Alt" />',
        responsive: true,
      }),
    );

    expect(
      figure
        .querySelector("figcaption > span.text")
        ?.hasAttribute("data-responsive"),
    ).toBe(true);
  });
});
