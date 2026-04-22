import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../testing/spec";
import {
  CLBR_BLOCKQUOTE_SPEC,
  type ClbrBlockquoteProps,
  renderClbrBlockquote,
} from "./blockquote";

function mountBlockquote(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrBlockquote", () => {
  it("renders the default blockquote contract", () => {
    const root = mountBlockquote(
      renderClbrBlockquote({
        attribution: "Measured",
        quote: "Quote",
      }),
    );
    const blockquote = root.querySelector(".blockquote") as HTMLElement;

    expect(blockquote.tagName).toBe("FIGURE");
    expect(blockquote.className).toBe("blockquote");
    expect(blockquote.hasAttribute("data-align")).toBe(false);
    expect(blockquote.querySelector("blockquote.quote")).toBeTruthy();
    expect(
      blockquote.querySelector("blockquote.quote > p.text")?.textContent,
    ).toBe("Quote");
    expect(
      blockquote
        .querySelector("blockquote.quote > p.text")
        ?.getAttribute("data-size"),
    ).toBe("md");
    expect(
      blockquote
        .querySelector("blockquote.quote > p.text")
        ?.hasAttribute("data-measured"),
    ).toBe(true);
    expect(
      blockquote.querySelector("figcaption.attribution > span.text")
        ?.textContent,
    ).toBe("Measured");
    expect(
      blockquote
        .querySelector("figcaption.attribution > span.text")
        ?.getAttribute("data-size"),
    ).toBe("sm");
  });

  it("passes size through to the quote text and keeps attribution at sm", () => {
    const root = mountBlockquote(
      renderClbrBlockquote({
        attribution: "Measured",
        quote: "Quote",
        size: "lg",
      }),
    );

    expect(
      root
        .querySelector(".blockquote blockquote.quote > p.text")
        ?.getAttribute("data-size"),
    ).toBe("lg");
    expect(
      root
        .querySelector(".blockquote figcaption.attribution > span.text")
        ?.getAttribute("data-size"),
    ).toBe("sm");
  });

  it("passes responsive through to both composed text elements", () => {
    const root = mountBlockquote(
      renderClbrBlockquote({
        attribution: "Measured",
        quote: "Quote",
        responsive: true,
      }),
    );

    expect(
      root
        .querySelector(".blockquote blockquote.quote > p.text")
        ?.hasAttribute("data-responsive"),
    ).toBe(true);
    expect(
      root
        .querySelector(".blockquote figcaption.attribution > span.text")
        ?.hasAttribute("data-responsive"),
    ).toBe(true);
  });

  it("passes align to the root and the composed quote paragraph", () => {
    const root = mountBlockquote(
      renderClbrBlockquote({
        align: "center",
        attribution: "Measured",
        quote: "Quote",
      }),
    );

    expect(root.querySelector(".blockquote")?.getAttribute("data-align")).toBe(
      "center",
    );
    expect(
      root
        .querySelector(".blockquote blockquote.quote > p.text")
        ?.getAttribute("data-align"),
    ).toBe("center");
  });

  it("passes measured through to the quoted paragraph text", () => {
    const root = mountBlockquote(
      renderClbrBlockquote({
        attribution: "Measured",
        measured: false,
        quote: "Quote",
      }),
    );

    expect(
      root
        .querySelector(".blockquote blockquote.quote > p.text")
        ?.hasAttribute("data-measured"),
    ).toBe(false);
  });

  it("renders trusted HTML through the composed text elements", () => {
    const root = mountBlockquote(
      renderClbrBlockquote({
        attribution: 'By <a href="/team">Measured</a>',
        quote: "Quote with <em>emphasis</em>",
      }),
    );

    expect(root.querySelector(".blockquote blockquote em")?.textContent).toBe(
      "emphasis",
    );
    expect(
      root
        .querySelector(".blockquote figcaption.attribution a")
        ?.getAttribute("href"),
    ).toBe("/team");
  });
});

describeSpecConsistency<ClbrBlockquoteProps>({
  baseProps: { attribution: "Measured", quote: "Quote" },
  renderer: renderClbrBlockquote,
  spec: CLBR_BLOCKQUOTE_SPEC,
});
