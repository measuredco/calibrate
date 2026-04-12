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
    expect(box.getAttribute("data-padding-block")).toBe("md");
    expect(box.getAttribute("data-padding-inline")).toBe("md");
    expect(box.hasAttribute("data-radius")).toBe(false);
    expect(box.hasAttribute("data-responsive")).toBe(false);
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
        paddingBlock: "xl",
        paddingInline: "sm",
        radius: "md",
        responsive: true,
        surface: "brand",
      }),
    );

    expect(box.getAttribute("data-background")).toBe("panel");
    expect(box.hasAttribute("data-border")).toBe(true);
    expect(box.getAttribute("data-padding-block")).toBe("xl");
    expect(box.getAttribute("data-padding-inline")).toBe("sm");
    expect(box.getAttribute("data-radius")).toBe("md");
    expect(box.hasAttribute("data-responsive")).toBe(true);
    expect(box.getAttribute("data-surface")).toBe("brand");
  });

  it("omits optional attrs when their variants are unset", () => {
    const box = mountBox(
      renderClbrBox({
        background: "default",
        border: false,
        children: "Body",
        paddingBlock: "sm",
        paddingInline: "xs",
      }),
    );

    expect(box.hasAttribute("data-background")).toBe(false);
    expect(box.hasAttribute("data-border")).toBe(false);
    expect(box.getAttribute("data-padding-block")).toBe("sm");
    expect(box.getAttribute("data-padding-inline")).toBe("xs");
    expect(box.hasAttribute("data-radius")).toBe(false);
    expect(box.hasAttribute("data-responsive")).toBe(false);
    expect(box.hasAttribute("data-surface")).toBe(false);
  });

  it("supports none for both padding axes", () => {
    const box = mountBox(
      renderClbrBox({
        children: "Body",
        paddingBlock: "none",
        paddingInline: "none",
      }),
    );

    expect(box.getAttribute("data-padding-block")).toBe("none");
    expect(box.getAttribute("data-padding-inline")).toBe("none");
  });

  it("emits transparent background when requested", () => {
    const box = mountBox(
      renderClbrBox({
        background: "transparent",
        children: "Body",
      }),
    );

    expect(box.getAttribute("data-background")).toBe("transparent");
  });
});
