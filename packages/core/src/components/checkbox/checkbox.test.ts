import { getByRole, getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { renderClbrCheckbox } from "./checkbox";

function mountCheckbox(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrCheckbox", () => {
  it("renders checkbox with label", () => {
    const root = mountCheckbox(renderClbrCheckbox({ label: "Subscribe" }));
    const checkbox = getByRole(root, "checkbox", { name: "Subscribe" });
    const field = root.querySelector(".checkbox-field");

    expect(field).toBeTruthy();
    expect(checkbox.getAttribute("type")).toBe("checkbox");
  });

  it("emits checked/disabled/required attrs when true", () => {
    const root = mountCheckbox(
      renderClbrCheckbox({
        checked: true,
        disabled: true,
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
        label: "Subscribe",
      }),
    );
    const checkbox = getByRole(root, "checkbox", { name: "Subscribe" });

    expect(checkbox.hasAttribute("checked")).toBe(false);
  });

  it("emits aria-invalid only when invalid is true", () => {
    const validRoot = mountCheckbox(
      renderClbrCheckbox({
        label: "Subscribe",
      }),
    );
    const validCheckbox = getByRole(validRoot, "checkbox", {
      name: "Subscribe",
    });
    expect(validCheckbox.getAttribute("aria-invalid")).toBeNull();

    const invalidRoot = mountCheckbox(
      renderClbrCheckbox({
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

  it("renders description and wires aria-describedby", () => {
    const root = mountCheckbox(
      renderClbrCheckbox({
        description: "Optional helper text",
        descriptionId: "subscribe-description",
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

  it("trims description and descriptionId before render", () => {
    const root = mountCheckbox(
      renderClbrCheckbox({
        description: "  Optional helper text  ",
        descriptionId: "  subscribe-description  ",
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

  it("omits description markup and aria-describedby when description is blank", () => {
    const root = mountCheckbox(
      renderClbrCheckbox({
        description: "   ",
        descriptionId: "subscribe-description",
        label: "Subscribe",
      }),
    );
    const checkbox = getByRole(root, "checkbox", { name: "Subscribe" });

    expect(checkbox.getAttribute("aria-describedby")).toBeNull();
    expect(root.querySelector(".description")).toBeNull();
  });

  it("ignores descriptionId when description is omitted", () => {
    const root = mountCheckbox(
      renderClbrCheckbox({
        descriptionId: "subscribe-description",
        label: "Subscribe",
      }),
    );
    const checkbox = getByRole(root, "checkbox", { name: "Subscribe" });

    expect(checkbox.getAttribute("aria-describedby")).toBeNull();
  });

  it("throws when description is provided without descriptionId", () => {
    expect(() =>
      renderClbrCheckbox({
        description: "Optional helper text",
        label: "Subscribe",
      }),
    ).toThrow("descriptionId must be non-empty when description is provided.");
  });

  it("throws when descriptionId is invalid", () => {
    expect(() =>
      renderClbrCheckbox({
        description: "Optional helper text",
        descriptionId: "not valid",
        label: "Subscribe",
      }),
    ).toThrow(
      "descriptionId must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  });

  it("escapes label and description text", () => {
    const root = mountCheckbox(
      renderClbrCheckbox({
        description: `<img src=x onerror=alert(2)>`,
        descriptionId: "subscribe-description",
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
});
