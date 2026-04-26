import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../test/spec";
import {
  CLBR_FIGURE_SPEC,
  type ClbrFigureProps,
  renderClbrFigure,
} from "./figure";

function mountFigure(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrFigure", () => {
  it("renders the default figure contract", () => {
    const root = mountFigure(
      renderClbrFigure({
        caption: "Caption",
        children: '<img src="/image.jpg" alt="Alt" />',
      }),
    );
    const figure = root.querySelector(".clbr-figure") as HTMLElement;

    expect(figure.tagName).toBe("FIGURE");
    expect(figure.className).toBe("clbr-figure");
    expect(figure.hasAttribute("data-align")).toBe(false);
    expect(figure.querySelector("img")?.getAttribute("src")).toBe("/image.jpg");
    expect(figure.querySelector("figcaption.figcaption")).toBeTruthy();
    expect(
      figure.querySelector("figcaption.figcaption > span.clbr-text")
        ?.textContent,
    ).toBe("Caption");
    expect(
      figure
        .querySelector("figcaption.figcaption > span.clbr-text")
        ?.getAttribute("data-size"),
    ).toBe("sm");
  });

  it("emits non-default align attributes", () => {
    const root = mountFigure(
      renderClbrFigure({
        align: "center",
        caption: "Caption",
        children: '<img src="/image.jpg" alt="Alt" />',
      }),
    );

    expect(root.querySelector(".clbr-figure")?.getAttribute("data-align")).toBe(
      "center",
    );
  });

  it("renders trusted HTML for caption and children", () => {
    const root = mountFigure(
      renderClbrFigure({
        caption: 'See the <a href="/docs">documentation</a>.',
        children: '<picture><img src="/image.jpg" alt="Alt" /></picture>',
      }),
    );

    expect(
      root
        .querySelector(".clbr-figure figcaption.figcaption a")
        ?.getAttribute("href"),
    ).toBe("/docs");
    expect(root.querySelector(".clbr-figure picture img")).toBeTruthy();
  });

  it("passes responsive through to the caption text", () => {
    const root = mountFigure(
      renderClbrFigure({
        caption: "Caption",
        children: '<img src="/image.jpg" alt="Alt" />',
        responsive: true,
      }),
    );

    expect(
      root
        .querySelector(".clbr-figure figcaption.figcaption > span.clbr-text")
        ?.hasAttribute("data-responsive"),
    ).toBe(true);
  });
});

describeSpecConsistency<ClbrFigureProps>({
  baseProps: { caption: "Caption", children: '<img src="/i.jpg" alt="" />' },
  renderer: renderClbrFigure,
  spec: CLBR_FIGURE_SPEC,
});
