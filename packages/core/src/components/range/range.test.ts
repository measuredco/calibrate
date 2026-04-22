import { fireEvent, getByLabelText, getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../testing/spec";
import {
  CLBR_RANGE_SPEC,
  CLBR_RANGE_TAG_NAME,
  defineClbrRange,
  renderClbrRange,
  type ClbrRangeProps,
} from "./range";

function mountRange(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrRange", () => {
  it("renders semantic range markup inside host", () => {
    const root = mountRange(renderClbrRange({ id: "volume", label: "Volume" }));
    const host = root.querySelector(CLBR_RANGE_TAG_NAME);
    const input = getByLabelText(root, "Volume") as HTMLInputElement;
    const field = root.querySelector(".range-field");
    const output = root.querySelector(".output");

    expect(host).not.toBeNull();
    expect(field?.getAttribute("data-size")).toBe("md");
    expect(field?.getAttribute("data-inline-size")).toBeNull();
    expect(input.getAttribute("type")).toBe("range");
    expect(output?.getAttribute("for")).toBe("volume");
    expect(output?.textContent).toBe("");
  });

  it('emits data-inline-size="fit" only when inlineSize is fit', () => {
    const fitRoot = mountRange(
      renderClbrRange({ id: "volume", inlineSize: "fit", label: "Volume" }),
    );
    expect(
      fitRoot.querySelector(".range-field")?.getAttribute("data-inline-size"),
    ).toBe("fit");

    const fullRoot = mountRange(
      renderClbrRange({ id: "volume", inlineSize: "full", label: "Volume" }),
    );
    expect(
      fullRoot.querySelector(".range-field")?.getAttribute("data-inline-size"),
    ).toBeNull();
  });

  it("renders description and wires aria-describedby", () => {
    const root = mountRange(
      renderClbrRange({
        description: "Select a value",
        id: "volume",
        label: "Volume",
      }),
    );
    const input = getByLabelText(root, "Volume") as HTMLInputElement;
    const description = getByText(root, "Select a value");

    expect(description.getAttribute("id")).toBe("volume-description");
    expect(input.getAttribute("aria-describedby")).toBe("volume-description");
  });

  it("emits min, max, step, value, and name when provided", () => {
    const root = mountRange(
      renderClbrRange({
        id: "volume",
        label: "Volume",
        max: 10,
        min: 0,
        name: "volume",
        step: 2,
        value: 4,
      }),
    );
    const input = getByLabelText(root, "Volume") as HTMLInputElement;

    expect(input.getAttribute("min")).toBe("0");
    expect(input.getAttribute("max")).toBe("10");
    expect(input.getAttribute("step")).toBe("2");
    expect(input.getAttribute("value")).toBe("4");
    expect(input.getAttribute("name")).toBe("volume");
  });

  it("hydrates the output from the current input value", () => {
    const root = mountRange(
      renderClbrRange({
        id: "volume",
        label: "Volume",
        value: 30,
      }),
    );

    defineClbrRange();

    expect(root.querySelector(".output")?.textContent).toBe("30");
  });

  it("updates the output on input", () => {
    const root = mountRange(
      renderClbrRange({
        id: "volume",
        label: "Volume",
        value: 30,
      }),
    );

    defineClbrRange();

    const input = getByLabelText(root, "Volume") as HTMLInputElement;
    const output = root.querySelector(".output") as HTMLOutputElement;

    input.value = "75";
    fireEvent.input(input);

    expect(output.textContent).toBe("75");
  });

  it("throws on invalid id", () => {
    expect(() => renderClbrRange({ id: "not valid", label: "Volume" })).toThrow(
      "id must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  });

  it("escapes label and description text", () => {
    const root = mountRange(
      renderClbrRange({
        description: `<img src=x onerror=alert(2)>`,
        id: "volume",
        label: `<script>alert(1)</script>`,
      }),
    );

    expect(root.querySelector("script")).toBeNull();
    expect(root.querySelector("img")).toBeNull();
    expect(getByLabelText(root, `<script>alert(1)</script>`)).toBeTruthy();
    expect(getByText(root, `<img src=x onerror=alert(2)>`)).toBeTruthy();
  });
});

describeSpecConsistency<ClbrRangeProps>({
  baseProps: { id: "r", label: "Range" },
  renderer: renderClbrRange,
  spec: CLBR_RANGE_SPEC,
});
