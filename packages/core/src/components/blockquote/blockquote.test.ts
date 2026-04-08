import { describe, expect, it } from "vitest";
import { renderClbrBlockquote } from "./blockquote";

function mountBlockquote(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".blockquote") as HTMLElement;
}

describe("renderClbrBlockquote", () => {
  it("renders the default blockquote contract", () => {
    const blockquote = mountBlockquote(
      renderClbrBlockquote({
        attribution: "Measured",
        quote: "Quote",
      }),
    );

    expect(blockquote.tagName).toBe("DIV");
    expect(blockquote.className).toBe("blockquote");
    expect(blockquote.hasAttribute("data-align")).toBe(false);
    expect(blockquote.querySelector("blockquote > p.text")?.textContent).toBe(
      "Quote",
    );
    expect(
      blockquote
        .querySelector("blockquote > p.text")
        ?.getAttribute("data-size"),
    ).toBe("md");
    expect(
      blockquote
        .querySelector("blockquote > p.text")
        ?.hasAttribute("data-measured"),
    ).toBe(true);
    expect(
      blockquote.querySelector("p.attribution > span.text")?.textContent,
    ).toBe("Measured");
    expect(
      blockquote
        .querySelector("p.attribution > span.text")
        ?.getAttribute("data-size"),
    ).toBe("sm");
  });

  it("passes size through to the quote text and keeps attribution at sm", () => {
    const blockquote = mountBlockquote(
      renderClbrBlockquote({
        attribution: "Measured",
        quote: "Quote",
        size: "lg",
      }),
    );

    expect(
      blockquote
        .querySelector("blockquote > p.text")
        ?.getAttribute("data-size"),
    ).toBe("lg");
    expect(
      blockquote
        .querySelector("p.attribution > span.text")
        ?.getAttribute("data-size"),
    ).toBe("sm");
  });

  it("passes responsive through to both composed text elements", () => {
    const blockquote = mountBlockquote(
      renderClbrBlockquote({
        attribution: "Measured",
        quote: "Quote",
        responsive: true,
      }),
    );

    expect(
      blockquote
        .querySelector("blockquote > p.text")
        ?.hasAttribute("data-responsive"),
    ).toBe(true);
    expect(
      blockquote
        .querySelector("p.attribution > span.text")
        ?.hasAttribute("data-responsive"),
    ).toBe(true);
  });

  it("passes align to the root and the composed quote paragraph", () => {
    const blockquote = mountBlockquote(
      renderClbrBlockquote({
        align: "center",
        attribution: "Measured",
        quote: "Quote",
      }),
    );

    expect(blockquote.getAttribute("data-align")).toBe("center");
    expect(
      blockquote
        .querySelector("blockquote > p.text")
        ?.getAttribute("data-align"),
    ).toBe("center");
  });

  it("passes measured through to the quoted paragraph text", () => {
    const blockquote = mountBlockquote(
      renderClbrBlockquote({
        attribution: "Measured",
        measured: false,
        quote: "Quote",
      }),
    );

    expect(
      blockquote
        .querySelector("blockquote > p.text")
        ?.hasAttribute("data-measured"),
    ).toBe(false);
  });

  it("renders trusted HTML through the composed text elements", () => {
    const blockquote = mountBlockquote(
      renderClbrBlockquote({
        attribution: 'By <a href="/team">Measured</a>',
        quote: "Quote with <em>emphasis</em>",
      }),
    );

    expect(blockquote.querySelector("blockquote em")?.textContent).toBe(
      "emphasis",
    );
    expect(
      blockquote.querySelector("p.attribution a")?.getAttribute("href"),
    ).toBe("/team");
  });
});
