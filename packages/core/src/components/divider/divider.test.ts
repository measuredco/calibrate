import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../test/spec";
import {
  CLBR_DIVIDER_SPEC,
  renderClbrDivider,
  type ClbrDividerProps,
} from "./divider";

function mountDivider(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrDivider", () => {
  it("renders horizontal divider markup by default", () => {
    const root = mountDivider(renderClbrDivider());
    const divider = root.querySelector(".clbr-divider") as HTMLElement;

    expect(divider).toBeTruthy();
    expect(divider.tagName).toBe("HR");
    expect(divider.classList.contains("clbr-divider")).toBe(true);
    expect(divider.hasAttribute("role")).toBe(false);
    expect(divider.hasAttribute("aria-orientation")).toBe(false);
    expect(divider.hasAttribute("data-tone")).toBe(false);
  });

  it("renders vertical divider semantics when orientation is vertical", () => {
    const root = mountDivider(renderClbrDivider({ orientation: "vertical" }));
    const divider = root.querySelector(".clbr-divider") as HTMLElement;

    expect(divider.tagName).toBe("SPAN");
    expect(divider.getAttribute("role")).toBe("separator");
    expect(divider.getAttribute("aria-orientation")).toBe("vertical");
  });

  it("emits data-tone only for non-default tone values", () => {
    const subtleRoot = mountDivider(renderClbrDivider({ tone: "subtle" }));
    const subtle = subtleRoot.querySelector(".clbr-divider") as HTMLElement;
    expect(subtle.getAttribute("data-tone")).toBe("subtle");

    const brandRoot = mountDivider(renderClbrDivider({ tone: "brand" }));
    const brand = brandRoot.querySelector(".clbr-divider") as HTMLElement;
    expect(brand.getAttribute("data-tone")).toBe("brand");

    const defaultRoot = mountDivider(renderClbrDivider({ tone: "default" }));
    const defaultTone = defaultRoot.querySelector(
      ".clbr-divider",
    ) as HTMLElement;
    expect(defaultTone.hasAttribute("data-tone")).toBe(false);
  });
});

describeSpecConsistency<ClbrDividerProps>({
  baseProps: {},
  renderer: renderClbrDivider,
  spec: CLBR_DIVIDER_SPEC,
});
