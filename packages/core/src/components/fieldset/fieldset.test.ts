import { getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../testing/spec";
import {
  CLBR_FIELDSET_SPEC,
  renderClbrFieldset,
  type ClbrFieldsetProps,
} from "./fieldset";

function mountFieldset(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrFieldset", () => {
  it("renders fieldset with id, legend, class, and trusted children", () => {
    const root = mountFieldset(
      renderClbrFieldset({
        children: '<div class="content">Body</div>',
        id: "contact",
        legend: "Legend",
      }),
    );

    const fieldset = root.querySelector("fieldset");

    expect(fieldset?.getAttribute("id")).toBe("contact");
    expect(fieldset?.classList.contains("fieldset")).toBe(true);
    expect(fieldset?.hasAttribute("data-inline-size")).toBe(false);
    expect(getByText(root, "Legend").tagName).toBe("LEGEND");
    expect(root.querySelector(".content")?.textContent).toBe("Body");
  });

  it("emits data-inline-size only when inlineSize is fit", () => {
    const root = mountFieldset(
      renderClbrFieldset({
        id: "contact",
        inlineSize: "fit",
        legend: "Legend",
      }),
    );

    expect(
      root.querySelector("fieldset")?.getAttribute("data-inline-size"),
    ).toBe("fit");
  });

  it("wires group description to derived aria-describedby id", () => {
    const root = mountFieldset(
      renderClbrFieldset({
        description: "Choose one.",
        id: "contact",
        legend: "Legend",
      }),
    );

    const fieldset = root.querySelector("fieldset");

    expect(fieldset?.getAttribute("aria-describedby")).toBe(
      "contact-description",
    );
    expect(getByText(root, "Choose one.").getAttribute("id")).toBe(
      "contact-description",
    );
  });

  it("emits aria-invalid only when invalid and not disabled", () => {
    const invalidRoot = mountFieldset(
      renderClbrFieldset({
        id: "contact",
        invalid: true,
        legend: "Legend",
      }),
    );

    expect(
      invalidRoot.querySelector("fieldset")?.getAttribute("aria-invalid"),
    ).toBe("true");

    const disabledRoot = mountFieldset(
      renderClbrFieldset({
        disabled: true,
        id: "contact",
        invalid: true,
        legend: "Legend",
      }),
    );

    expect(
      disabledRoot.querySelector("fieldset")?.getAttribute("aria-invalid"),
    ).toBeNull();
  });

  it("allows omitted and empty children without throwing", () => {
    const omittedRoot = mountFieldset(
      renderClbrFieldset({
        id: "contact",
        legend: "Legend",
      }),
    );

    const omittedFieldset = omittedRoot.querySelector(".fieldset");

    expect(omittedFieldset).toBeTruthy();
    expect(omittedFieldset?.innerHTML).toContain("<legend");

    const emptyRoot = mountFieldset(
      renderClbrFieldset({
        children: "",
        id: "contact",
        legend: "Legend",
      }),
    );

    expect(emptyRoot.querySelector(".fieldset")?.innerHTML).toContain(
      "<legend",
    );
  });

  it("throws for empty or invalid id", () => {
    expect(() =>
      renderClbrFieldset({
        id: "   ",
        legend: "Legend",
      }),
    ).toThrow("id must be a non-empty string.");

    expect(() =>
      renderClbrFieldset({
        id: "not valid",
        legend: "Legend",
      }),
    ).toThrow(
      "id must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  });

  it("escapes legend and description content", () => {
    const root = mountFieldset(
      renderClbrFieldset({
        description: `<img src=x onerror=alert(2)>`,
        id: "contact",
        legend: `<script>alert(1)</script>`,
      }),
    );

    expect(root.querySelector("script")).toBeNull();
    expect(root.querySelector("img")).toBeNull();
    expect(getByText(root, `<script>alert(1)</script>`)).toBeTruthy();
    expect(getByText(root, `<img src=x onerror=alert(2)>`)).toBeTruthy();
  });
});

describeSpecConsistency<ClbrFieldsetProps>({
  baseProps: { id: "fs", legend: "Legend" },
  renderer: renderClbrFieldset,
  spec: CLBR_FIELDSET_SPEC,
});
