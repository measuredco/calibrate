import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../testing/spec";
import { CLBR_BOX_SPEC, type ClbrBoxProps, renderClbrBox } from "./box";

function mountBox(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrBox", () => {
  it("renders a div.box with the default contract", () => {
    const root = mountBox(renderClbrBox({ children: "Body" }));
    const box = root.querySelector(".box") as HTMLElement;

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
    const root = mountBox(
      renderClbrBox({
        children: '<p>Lorem <em>ipsum</em> <a href="/docs">docs</a></p>',
      }),
    );

    expect(root.querySelector(".box p")?.textContent).toContain("Lorem");
    expect(root.querySelector(".box em")?.textContent).toBe("ipsum");
    expect(root.querySelector(".box a")?.getAttribute("href")).toBe("/docs");
  });

  it("supports omitted or empty children", () => {
    const omitted = mountBox(renderClbrBox({}));
    const empty = mountBox(renderClbrBox({ children: "" }));

    expect(omitted.querySelector(".box")?.innerHTML).toBe("");
    expect(empty.querySelector(".box")?.innerHTML).toBe("");
  });

  it("emits requested variant attributes", () => {
    const root = mountBox(
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
    const box = root.querySelector(".box") as HTMLElement;

    expect(box.getAttribute("data-background")).toBe("panel");
    expect(box.hasAttribute("data-border")).toBe(true);
    expect(box.getAttribute("data-padding-block")).toBe("xl");
    expect(box.getAttribute("data-padding-inline")).toBe("sm");
    expect(box.getAttribute("data-radius")).toBe("md");
    expect(box.hasAttribute("data-responsive")).toBe(true);
    expect(box.getAttribute("data-surface")).toBe("brand");
  });

  it("omits optional attrs when their variants are unset", () => {
    const root = mountBox(
      renderClbrBox({
        background: "default",
        border: false,
        children: "Body",
        paddingBlock: "sm",
        paddingInline: "xs",
      }),
    );
    const box = root.querySelector(".box") as HTMLElement;

    expect(box.hasAttribute("data-background")).toBe(false);
    expect(box.hasAttribute("data-border")).toBe(false);
    expect(box.getAttribute("data-padding-block")).toBe("sm");
    expect(box.getAttribute("data-padding-inline")).toBe("xs");
    expect(box.hasAttribute("data-radius")).toBe(false);
    expect(box.hasAttribute("data-responsive")).toBe(false);
    expect(box.hasAttribute("data-surface")).toBe(false);
  });

  it("supports none for both padding axes", () => {
    const root = mountBox(
      renderClbrBox({
        children: "Body",
        paddingBlock: "none",
        paddingInline: "none",
      }),
    );
    const box = root.querySelector(".box") as HTMLElement;

    expect(box.getAttribute("data-padding-block")).toBe("none");
    expect(box.getAttribute("data-padding-inline")).toBe("none");
  });

  it("supports 2xs and 2xl padding values", () => {
    const compactRoot = mountBox(
      renderClbrBox({
        children: "Body",
        paddingBlock: "2xs",
        paddingInline: "2xs",
      }),
    );
    const compact = compactRoot.querySelector(".box") as HTMLElement;

    expect(compact.getAttribute("data-padding-block")).toBe("2xs");
    expect(compact.getAttribute("data-padding-inline")).toBe("2xs");

    const spaciousRoot = mountBox(
      renderClbrBox({
        children: "Body",
        paddingBlock: "2xl",
        paddingInline: "2xl",
      }),
    );
    const spacious = spaciousRoot.querySelector(".box") as HTMLElement;

    expect(spacious.getAttribute("data-padding-block")).toBe("2xl");
    expect(spacious.getAttribute("data-padding-inline")).toBe("2xl");
  });

  it("emits transparent background when requested", () => {
    const root = mountBox(
      renderClbrBox({
        background: "transparent",
        children: "Body",
      }),
    );
    const box = root.querySelector(".box") as HTMLElement;

    expect(box.getAttribute("data-background")).toBe("transparent");
  });
});

describeSpecConsistency<ClbrBoxProps>({
  baseProps: {},
  renderer: renderClbrBox,
  spec: CLBR_BOX_SPEC,
});
