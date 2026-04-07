import { describe, expect, it } from "vitest";
import { renderClbrBox } from "./box";

function mountBox(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".box") as HTMLElement;
}

describe("renderClbrBox", () => {
  it("renders a div.box with the default contract", () => {
    const box = mountBox(renderClbrBox({ children: "Body" }));

    expect(box.tagName).toBe("DIV");
    expect(box.className).toBe("box");
    expect(box.textContent).toBe("Body");
    expect(box.hasAttribute("data-background")).toBe(false);
    expect(box.hasAttribute("data-border")).toBe(false);
    expect(box.getAttribute("data-padding")).toBe("md");
    expect(box.hasAttribute("data-radius")).toBe(false);
    expect(box.hasAttribute("data-surface")).toBe(false);
  });

  it("renders trusted child HTML without escaping", () => {
    const box = mountBox(
      renderClbrBox({
        children: '<p>Lorem <em>ipsum</em> <a href="/docs">docs</a></p>',
      }),
    );

    expect(box.querySelector("p")?.textContent).toContain("Lorem");
    expect(box.querySelector("em")?.textContent).toBe("ipsum");
    expect(box.querySelector("a")?.getAttribute("href")).toBe("/docs");
  });

  it("supports omitted or empty children", () => {
    const omitted = mountBox(renderClbrBox({}));
    const empty = mountBox(renderClbrBox({ children: "" }));

    expect(omitted.innerHTML).toBe("");
    expect(empty.innerHTML).toBe("");
  });

  it("emits requested variant attributes", () => {
    const box = mountBox(
      renderClbrBox({
        background: "panel",
        border: true,
        children: "Body",
        padding: "xl",
        radius: "md",
        surface: "brand",
      }),
    );

    expect(box.getAttribute("data-background")).toBe("panel");
    expect(box.hasAttribute("data-border")).toBe(true);
    expect(box.getAttribute("data-padding")).toBe("xl");
    expect(box.getAttribute("data-radius")).toBe("md");
    expect(box.getAttribute("data-surface")).toBe("brand");
  });

  it("omits optional attrs when their variants are unset", () => {
    const box = mountBox(
      renderClbrBox({
        background: "default",
        border: false,
        children: "Body",
        padding: "sm",
      }),
    );

    expect(box.hasAttribute("data-background")).toBe(false);
    expect(box.hasAttribute("data-border")).toBe(false);
    expect(box.getAttribute("data-padding")).toBe("sm");
    expect(box.hasAttribute("data-radius")).toBe(false);
    expect(box.hasAttribute("data-surface")).toBe(false);
  });
});
