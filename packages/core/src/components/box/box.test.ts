import { getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { renderClbrBox } from "./box";

function mountBox(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrBox", () => {
  it("renders a div.box with default emit behavior", () => {
    const root = mountBox(renderClbrBox({ children: "Body" }));
    const box = getByText(root, "Body");

    expect(box.tagName).toBe("DIV");
    expect(box.classList.contains("box")).toBe(true);
    expect(box.hasAttribute("data-background")).toBe(false);
    expect(box.hasAttribute("data-border")).toBe(false);
    expect(box.hasAttribute("data-box-shadow")).toBe(false);
    expect(box.hasAttribute("data-offset-stroke")).toBe(false);
    expect(box.hasAttribute("data-surface")).toBe(false);
    expect(box.getAttribute("data-padding")).toBe("md");
    expect(box.getAttribute("data-radius")).toBe("md");
  });

  it("renders trusted children HTML without escaping", () => {
    const root = mountBox(
      renderClbrBox({
        children: '<p>Lorem <em>ipsum</em> <a href="/docs">docs</a></p>',
      }),
    );

    expect(root.querySelector("p")?.textContent).toContain("Lorem");
    expect(root.querySelector("em")?.textContent).toBe("ipsum");
    expect(root.querySelector("a")?.getAttribute("href")).toBe("/docs");
  });

  it("allows omitted and empty children", () => {
    const omittedRoot = mountBox(renderClbrBox({}));
    const omittedBox = omittedRoot.querySelector(".box");
    expect(omittedBox).toBeTruthy();
    expect(omittedBox?.innerHTML).toBe("");

    const emptyRoot = mountBox(renderClbrBox({ children: "" }));
    const emptyBox = emptyRoot.querySelector(".box");
    expect(emptyBox).toBeTruthy();
    expect(emptyBox?.innerHTML).toBe("");
  });

  it("emits non-default variant attributes", () => {
    const root = mountBox(
      renderClbrBox({
        background: "panel",
        border: "brand",
        children: "Body",
        surface: "brand",
      }),
    );
    const box = getByText(root, "Body");

    expect(box.getAttribute("data-background")).toBe("panel");
    expect(box.getAttribute("data-border")).toBe("brand");
    expect(box.getAttribute("data-surface")).toBe("brand");
  });

  it("always emits padding and radius attrs from props", () => {
    const root = mountBox(
      renderClbrBox({
        children: "Body",
        padding: "xl",
        radius: "lg",
      }),
    );
    const box = getByText(root, "Body");

    expect(box.getAttribute("data-padding")).toBe("xl");
    expect(box.getAttribute("data-radius")).toBe("lg");
  });

  it("emits data-offset-stroke only when offsetStroke is true", () => {
    const enabledRoot = mountBox(
      renderClbrBox({
        border: "default",
        children: "Body",
        offsetStroke: true,
      }),
    );
    const enabled = getByText(enabledRoot, "Body");
    expect(enabled.hasAttribute("data-offset-stroke")).toBe(true);

    const disabledRoot = mountBox(
      renderClbrBox({
        border: "default",
        children: "Body",
        offsetStroke: false,
      }),
    );
    const disabled = getByText(disabledRoot, "Body");
    expect(disabled.hasAttribute("data-offset-stroke")).toBe(false);
  });

  it("emits data-box-shadow only when boxShadow is true", () => {
    const enabledRoot = mountBox(
      renderClbrBox({
        boxShadow: true,
        children: "Body",
      }),
    );
    const enabled = getByText(enabledRoot, "Body");
    expect(enabled.hasAttribute("data-box-shadow")).toBe(true);

    const disabledRoot = mountBox(
      renderClbrBox({
        boxShadow: false,
        children: "Body",
      }),
    );
    const disabled = getByText(disabledRoot, "Body");
    expect(disabled.hasAttribute("data-box-shadow")).toBe(false);
  });
});
