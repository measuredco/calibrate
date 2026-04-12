import { describe, expect, it } from "vitest";
import { renderClbrCard } from "./card";

function mountCard(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".card") as HTMLElement;
}

describe("renderClbrCard", () => {
  it("renders the default card contract", () => {
    const card = mountCard(
      renderClbrCard({
        description: "Description",
        title: "Card title",
      }),
    );

    expect(card.tagName).toBe("DIV");
    expect(card.className).toBe("card");
    expect(card.hasAttribute("data-surface")).toBe(false);
    expect(card.querySelector(".dots")).toBeTruthy();
    expect(card.querySelector("div.title")?.textContent).toBe("Card title");
    expect(card.querySelector("p.description")?.textContent).toBe(
      "Description",
    );
    expect(card.querySelector("p.note")).toBeNull();
  });

  it("renders a semantic heading when headingLevel is provided", () => {
    const card = mountCard(
      renderClbrCard({
        description: "Description",
        headingLevel: 4,
        title: "Card title",
      }),
    );

    expect(card.querySelector("h4.title")?.textContent).toBe("Card title");
    expect(card.querySelector("div.title")).toBeNull();
  });

  it("renders a linked title and trailing note icon when href and note are provided", () => {
    const card = mountCard(
      renderClbrCard({
        description: "Description",
        href: "/docs",
        note: "Read more",
        title: "Card title",
      }),
    );

    expect(card.querySelector(".title a")?.getAttribute("href")).toBe("/docs");
    expect(card.querySelector(".title a")?.textContent).toBe("Card title");
    expect(card.querySelector("p.note")?.textContent).toContain("Read more");
    expect(card.querySelector("p.note .icon")).toBeTruthy();
  });

  it("renders trusted HTML for description and note", () => {
    const card = mountCard(
      renderClbrCard({
        description: "Description with <em>emphasis</em>",
        note: 'By <a href="/team">Measured</a>',
        title: "Card title",
      }),
    );

    expect(card.querySelector("p.description em")?.textContent).toBe(
      "emphasis",
    );
    expect(card.querySelector("p.note a")?.getAttribute("href")).toBe("/team");
    expect(card.querySelector("p.note .icon")).toBeNull();
  });

  it("emits any supported surface variant when provided", () => {
    const card = mountCard(
      renderClbrCard({
        description: "Description",
        surface: "brand-inverse",
        title: "Card title",
      }),
    );

    expect(card.getAttribute("data-surface")).toBe("brand-inverse");
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
