import { describe, expect, it } from "vitest";
import { renderClbrPanel } from "./panel";

function mountPanel(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".panel") as HTMLElement;
}

describe("renderClbrPanel", () => {
  it("renders a div.panel with the default contract", () => {
    const panel = mountPanel(renderClbrPanel({ children: "Body" }));

    expect(panel.tagName).toBe("DIV");
    expect(panel.className).toBe("panel");
    expect(panel.textContent).toBe("Body");
    expect(panel.hasAttribute("data-inline-size")).toBe(false);
    expect(panel.hasAttribute("data-offset-stroke")).toBe(false);
    expect(panel.getAttribute("data-padding")).toBe("md");
    expect(panel.hasAttribute("data-surface")).toBe(false);
  });

  it("renders trusted child HTML without escaping", () => {
    const panel = mountPanel(
      renderClbrPanel({
        children: '<p>Lorem <em>ipsum</em> <a href="/docs">docs</a></p>',
      }),
    );

    expect(panel.querySelector("p")?.textContent).toContain("Lorem");
    expect(panel.querySelector("em")?.textContent).toBe("ipsum");
    expect(panel.querySelector("a")?.getAttribute("href")).toBe("/docs");
  });

  it("supports omitted or empty children", () => {
    const omitted = mountPanel(renderClbrPanel({}));
    const empty = mountPanel(renderClbrPanel({ children: "" }));

    expect(omitted.innerHTML).toBe("");
    expect(empty.innerHTML).toBe("");
  });

  it("emits requested variant attributes", () => {
    const panel = mountPanel(
      renderClbrPanel({
        children: "Body",
        inlineSize: "fit",
        offsetStroke: true,
        padding: "xl",
        surface: "brand",
      }),
    );

    expect(panel.getAttribute("data-inline-size")).toBe("fit");
    expect(panel.hasAttribute("data-offset-stroke")).toBe(true);
    expect(panel.getAttribute("data-padding")).toBe("xl");
    expect(panel.getAttribute("data-surface")).toBe("brand");
  });
});
