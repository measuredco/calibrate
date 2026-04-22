import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../testing/spec";
import { CLBR_SHAPE_SPEC, renderClbrShape, type ClbrShapeProps } from "./shape";

function mountShape(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrShape", () => {
  it("renders the settled default root contract", () => {
    const root = mountShape(renderClbrShape());
    const shape = root.querySelector(".clbr-shape") as HTMLElement;

    expect(shape).toBeTruthy();
    expect(shape.tagName).toBe("DIV");
    expect(shape.className).toBe("clbr-shape");
    expect(shape.getAttribute("data-variant")).toBe("corner");
    expect(shape.hasAttribute("data-tone")).toBe(false);
    expect(shape.getAttribute("data-size")).toBe("md");
  });

  it("emits explicit non-default size and tone attributes", () => {
    const root = mountShape(
      renderClbrShape({ size: "fill", tone: "brand", variant: "circle-sm" }),
    );
    const shape = root.querySelector(".clbr-shape") as HTMLElement;

    expect(shape.getAttribute("data-variant")).toBe("circle-sm");
    expect(shape.getAttribute("data-tone")).toBe("brand");
    expect(shape.getAttribute("data-size")).toBe("fill");
  });

  it("emits each supported non-default tone value", () => {
    const neutral = mountShape(
      renderClbrShape({ tone: "neutral", variant: "tile-lg" }),
    ).querySelector(".clbr-shape") as HTMLElement;
    const support = mountShape(
      renderClbrShape({ tone: "support", variant: "tile-slice-sm" }),
    ).querySelector(".clbr-shape") as HTMLElement;

    expect(neutral.getAttribute("data-tone")).toBe("neutral");
    expect(support.getAttribute("data-tone")).toBe("support");
  });

  it("emits kebab-case variant values directly", () => {
    const root = mountShape(
      renderClbrShape({ variant: "tile-slice-lg", size: "xl" }),
    );
    const shape = root.querySelector(".clbr-shape") as HTMLElement;

    expect(shape.getAttribute("data-variant")).toBe("tile-slice-lg");
    expect(shape.getAttribute("data-size")).toBe("xl");
  });
});

describeSpecConsistency<ClbrShapeProps>({
  baseProps: {},
  renderer: renderClbrShape,
  spec: CLBR_SHAPE_SPEC,
});
