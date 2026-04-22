import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../testing/spec";
import { CLBR_PANEL_SPEC, type ClbrPanelProps, renderClbrPanel } from "./panel";

function mountPanel(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrPanel", () => {
  it("renders the default panel contract", () => {
    const root = mountPanel(renderClbrPanel({ children: "Body" }));
    const panel = root.querySelector(".clbr-panel") as HTMLElement;

    expect(panel.tagName).toBe("DIV");
    expect(panel.className).toBe("clbr-panel");
    expect(panel.textContent).toBe("Body");
    expect(panel.getAttribute("data-padding")).toBe("md");
    expect(panel.hasAttribute("data-clbr-surface")).toBe(false);
  });

  it("renders trusted child HTML without escaping", () => {
    const root = mountPanel(
      renderClbrPanel({
        children: '<p>Lorem <em>ipsum</em> <a href="/docs">docs</a></p>',
      }),
    );

    expect(root.querySelector(".clbr-panel p")?.textContent).toContain("Lorem");
    expect(root.querySelector(".clbr-panel em")?.textContent).toBe("ipsum");
    expect(root.querySelector(".clbr-panel a")?.getAttribute("href")).toBe("/docs");
  });

  it("supports omitted or empty children", () => {
    const omitted = mountPanel(renderClbrPanel({}));
    const empty = mountPanel(renderClbrPanel({ children: "" }));

    expect(omitted.querySelector(".clbr-panel")?.innerHTML).toBe("");
    expect(empty.querySelector(".clbr-panel")?.innerHTML).toBe("");
  });

  it("emits requested padding and any supported surface variant", () => {
    const root = mountPanel(
      renderClbrPanel({
        children: "Body",
        padding: "xl",
        surface: "inverse",
      }),
    );
    const panel = root.querySelector(".clbr-panel") as HTMLElement;

    expect(panel.getAttribute("data-padding")).toBe("xl");
    expect(panel.getAttribute("data-clbr-surface")).toBe("inverse");
  });
});

describeSpecConsistency<ClbrPanelProps>({
  baseProps: {},
  renderer: renderClbrPanel,
  spec: CLBR_PANEL_SPEC,
});
