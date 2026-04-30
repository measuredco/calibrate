import { getByRole, getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  CLBR_CHECKBOX_SPEC,
  type ClbrCheckboxProps,
  renderClbrCheckbox,
} from "./checkbox";

function mountCheckbox(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrCheckbox", () => {
  it("renders checkbox with label", () => {
    const root = mountCheckbox(
      renderClbrCheckbox({ id: "subscribe", label: "Subscribe" }),
    );
    const checkbox = getByRole(root, "checkbox", { name: "Subscribe" });
    const field = root.querySelector(".clbr-checkbox");

    expect(field).toBeTruthy();
    expect(field?.getAttribute("data-size")).toBe("md");
    expect(checkbox.getAttribute("type")).toBe("checkbox");
  });

  it("emits requested size variant", () => {
    const root = mountCheckbox(
      renderClbrCheckbox({
        id: "subscribe",
        label: "Subscribe",
        size: "sm",
      }),
    );
    const field = root.querySelector(".clbr-checkbox");

    expect(field?.getAttribute("data-size")).toBe("sm");
  });

  it("emits checked/disabled/required attrs when true", () => {
    const root = mountCheckbox(
      renderClbrCheckbox({
        checked: true,
        disabled: true,
        id: "subscribe",
        label: "Subscribe",
        required: true,
      }),
    );
    const checkbox = getByRole(root, "checkbox", { name: "Subscribe" });

    expect(checkbox.hasAttribute("checked")).toBe(true);
    expect(checkbox.hasAttribute("disabled")).toBe(true);
    expect(checkbox.hasAttribute("required")).toBe(true);
  });

  it("omits checked when checked is false", () => {
    const root = mountCheckbox(
      renderClbrCheckbox({
        checked: false,
        id: "subscribe",
        label: "Subscribe",
      }),
    );
    const checkbox = getByRole(root, "checkbox", { name: "Subscribe" });

    expect(checkbox.hasAttribute("checked")).toBe(false);
  });

  it("emits aria-invalid only when invalid is true", () => {
    const validRoot = mountCheckbox(
      renderClbrCheckbox({
        id: "subscribe",
        label: "Subscribe",
      }),
    );
    const validCheckbox = getByRole(validRoot, "checkbox", {
      name: "Subscribe",
    });
    expect(validCheckbox.getAttribute("aria-invalid")).toBeNull();

    const invalidRoot = mountCheckbox(
      renderClbrCheckbox({
        id: "subscribe",
        invalid: true,
        label: "Subscribe",
      }),
    );
    const invalidCheckbox = getByRole(invalidRoot, "checkbox", {
      name: "Subscribe",
    });
    expect(invalidCheckbox.getAttribute("aria-invalid")).toBe("true");
  });

  it("suppresses aria-invalid when disabled is true", () => {
    const root = mountCheckbox(
      renderClbrCheckbox({
        disabled: true,
        id: "subscribe",
        invalid: true,
        label: "Subscribe",
      }),
    );
    const checkbox = getByRole(root, "checkbox", { name: "Subscribe" });

    expect(checkbox.getAttribute("aria-invalid")).toBeNull();
  });

  it("emits name/value and omits empty values", () => {
    const withValuesRoot = mountCheckbox(
      renderClbrCheckbox({
        id: "subscribe",
        label: "Subscribe",
        name: "subscribe",
        value: "yes",
      }),
    );
    const withValues = getByRole(withValuesRoot, "checkbox", {
      name: "Subscribe",
    });

    expect(withValues.getAttribute("name")).toBe("subscribe");
    expect(withValues.getAttribute("value")).toBe("yes");

    const withoutValuesRoot = mountCheckbox(
      renderClbrCheckbox({
        id: "subscribe",
        label: "Subscribe",
        name: "",
        value: "",
      }),
    );
    const withoutValues = getByRole(withoutValuesRoot, "checkbox", {
      name: "Subscribe",
    });

    expect(withoutValues.getAttribute("name")).toBeNull();
    expect(withoutValues.getAttribute("value")).toBeNull();
  });

  it("renders description and derives aria-describedby from id", () => {
    const root = mountCheckbox(
      renderClbrCheckbox({
        description: "Optional helper text",
        id: "subscribe",
        label: "Subscribe",
      }),
    );
    const checkbox = getByRole(root, "checkbox", { name: "Subscribe" });
    const description = getByText(root, "Optional helper text");

    expect(checkbox.getAttribute("aria-describedby")).toBe(
      "subscribe-description",
    );
    expect(description.getAttribute("id")).toBe("subscribe-description");
  });

  it("trims description before render", () => {
    const root = mountCheckbox(
      renderClbrCheckbox({
        description: "  Optional helper text  ",
        id: "subscribe",
        label: "Subscribe",
      }),
    );
    const description = getByText(root, "Optional helper text");

    expect(description.getAttribute("id")).toBe("subscribe-description");
  });

  it("omits description markup and aria-describedby when description is blank", () => {
    const root = mountCheckbox(
      renderClbrCheckbox({
        description: "   ",
        id: "subscribe",
        label: "Subscribe",
      }),
    );
    const checkbox = getByRole(root, "checkbox", { name: "Subscribe" });

    expect(checkbox.getAttribute("aria-describedby")).toBeNull();
    expect(root.querySelector(".description")).toBeNull();
  });

  it("throws when id is empty or invalid", () => {
    expect(() => renderClbrCheckbox({ id: "", label: "Subscribe" })).toThrow(
      "id must be a non-empty string.",
    );
    expect(() =>
      renderClbrCheckbox({ id: "not valid", label: "Subscribe" }),
    ).toThrow();
  });

  it("escapes label and description text", () => {
    const root = mountCheckbox(
      renderClbrCheckbox({
        description: `<img src=x onerror=alert(2)>`,
        id: "subscribe",
        label: `<script>alert(1)</script>`,
      }),
    );

    expect(root.querySelector("script")).toBeNull();
    expect(root.querySelector("img")).toBeNull();
    expect(
      getByRole(root, "checkbox", { name: `<script>alert(1)</script>` }),
    ).toBeTruthy();
    expect(getByText(root, `<img src=x onerror=alert(2)>`)).toBeTruthy();
  });

  it("renders consumer-provided id on the underlying input", () => {
    const root = mountCheckbox(
      renderClbrCheckbox({ id: "my-checkbox", label: "Label" }),
    );
    const input = root.querySelector("input.checkbox") as HTMLInputElement;

    expect(input.id).toBe("my-checkbox");
  });
});

describeSpecConsistency<ClbrCheckboxProps>({
  baseProps: { id: "cb", label: "Label" },
  renderer: renderClbrCheckbox,
  spec: CLBR_CHECKBOX_SPEC,
});
