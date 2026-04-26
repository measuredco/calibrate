import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../test/spec";
import {
  CLBR_PATTERN_SPEC,
  renderClbrPattern,
  type ClbrPatternProps,
} from "./pattern";

function mountPattern(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrPattern", () => {
  it("renders the settled default root contract", () => {
    const root = mountPattern(renderClbrPattern());
    const pattern = root.querySelector(".clbr-pattern") as HTMLElement;

    expect(pattern).toBeTruthy();
    expect(pattern.tagName).toBe("DIV");
    expect(pattern.className).toBe("clbr-pattern");
    expect(pattern.getAttribute("data-size")).toBe("md");
    expect(pattern.hasAttribute("data-tone")).toBe(false);
    expect(pattern.getAttribute("data-variant")).toBe("corner");
    expect(pattern.innerHTML).toBe("");
  });

  it("emits explicit kebab-case variant, size, and tone values", () => {
    const root = mountPattern(
      renderClbrPattern({
        size: "fill",
        tone: "support",
        variant: "tile-slice-lg",
      }),
    );
    const pattern = root.querySelector(".clbr-pattern") as HTMLElement;

    expect(pattern.getAttribute("data-size")).toBe("fill");
    expect(pattern.getAttribute("data-tone")).toBe("support");
    expect(pattern.getAttribute("data-variant")).toBe("tile-slice-lg");
  });

  it("emits the subtle tone value", () => {
    const root = mountPattern(renderClbrPattern({ tone: "subtle" }));
    const pattern = root.querySelector(".clbr-pattern") as HTMLElement;

    expect(pattern.getAttribute("data-tone")).toBe("subtle");
  });

  it("renders trusted child HTML inside the root", () => {
    const root = mountPattern(
      renderClbrPattern({
        children: '<div class="content">Pattern content</div>',
      }),
    );
    const pattern = root.querySelector(".clbr-pattern") as HTMLElement;
    const content = pattern.querySelector(".content") as HTMLElement;

    expect(content).toBeTruthy();
    expect(content.textContent).toBe("Pattern content");
  });
});

describeSpecConsistency<ClbrPatternProps>({
  baseProps: {},
  renderer: renderClbrPattern,
  spec: CLBR_PATTERN_SPEC,
});
