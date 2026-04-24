import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../test/spec";
import { CLBR_CARD_SPEC, type ClbrCardProps, renderClbrCard } from "./card";

function mountCard(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrCard", () => {
  it("renders the default card contract", () => {
    const root = mountCard(
      renderClbrCard({
        description: "Description",
        title: "Card title",
      }),
    );
    const card = root.querySelector(".clbr-card") as HTMLElement;

    expect(card.tagName).toBe("DIV");
    expect(card.className).toBe("clbr-card");
    expect(card.hasAttribute("data-clbr-surface")).toBe(false);
    expect(card.querySelector(".dots")).toBeTruthy();
    expect(card.querySelector("div.title")?.textContent).toBe("Card title");
    expect(card.querySelector("p.description")?.textContent).toBe(
      "Description",
    );
    expect(card.querySelector("p.note")).toBeNull();
  });

  it("renders a semantic heading when headingLevel is provided", () => {
    const root = mountCard(
      renderClbrCard({
        description: "Description",
        headingLevel: 4,
        title: "Card title",
      }),
    );

    expect(root.querySelector(".clbr-card h4.title")?.textContent).toBe(
      "Card title",
    );
    expect(root.querySelector(".clbr-card div.title")).toBeNull();
  });

  it("renders a linked title and trailing note icon when href and note are provided", () => {
    const root = mountCard(
      renderClbrCard({
        description: "Description",
        href: "/docs",
        note: "Read more",
        title: "Card title",
      }),
    );

    expect(
      root.querySelector(".clbr-card .title a")?.getAttribute("href"),
    ).toBe("/docs");
    expect(root.querySelector(".clbr-card .title a")?.textContent).toBe(
      "Card title",
    );
    expect(root.querySelector(".clbr-card p.note")?.textContent).toContain(
      "Read more",
    );
    expect(root.querySelector(".clbr-card p.note .clbr-icon")).toBeTruthy();
  });

  it("renders trusted HTML for description and note", () => {
    const root = mountCard(
      renderClbrCard({
        description: "Description with <em>emphasis</em>",
        note: 'By <a href="/team">Measured</a>',
        title: "Card title",
      }),
    );

    expect(root.querySelector(".clbr-card p.description em")?.textContent).toBe(
      "emphasis",
    );
    expect(
      root.querySelector(".clbr-card p.note a")?.getAttribute("href"),
    ).toBe("/team");
    expect(root.querySelector(".clbr-card p.note .clbr-icon")).toBeNull();
  });

  it("emits any supported surface variant when provided", () => {
    const root = mountCard(
      renderClbrCard({
        description: "Description",
        surface: "brand-inverse",
        title: "Card title",
      }),
    );

    expect(
      root.querySelector(".clbr-card")?.getAttribute("data-clbr-surface"),
    ).toBe("brand-inverse");
  });

  it("escapes title text", () => {
    const html = renderClbrCard({
      description: "Description",
      title: '<script>alert("xss")</script>',
    });

    expect(html).toContain(
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;",
    );
    expect(html).not.toContain("<script>");
  });
});

describeSpecConsistency<ClbrCardProps>({
  baseProps: { description: "Description", title: "Title" },
  renderer: renderClbrCard,
  spec: CLBR_CARD_SPEC,
});
