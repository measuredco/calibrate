import { getByRole, getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { renderClbrSwitch } from "./switch";

function mountSwitch(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrSwitch", () => {
  it("renders switch with label and default size", () => {
    const root = mountSwitch(renderClbrSwitch({ label: "Notifications" }));
    const input = getByRole(root, "switch", { name: "Notifications" });
    const field = root.querySelector(".switch-field");

    expect(field?.getAttribute("data-size")).toBe("md");
    expect(input.getAttribute("type")).toBe("checkbox");
    expect(input.getAttribute("role")).toBe("switch");
  });

  it("emits checked and disabled attrs when true", () => {
    const root = mountSwitch(
      renderClbrSwitch({
        checked: true,
        disabled: true,
        label: "Notifications",
      }),
    );
    const input = getByRole(root, "switch", { name: "Notifications" });

    expect(input.hasAttribute("checked")).toBe(true);
    expect(input.hasAttribute("disabled")).toBe(true);
  });

  it("omits checked when checked is false", () => {
    const root = mountSwitch(
      renderClbrSwitch({
        checked: false,
        label: "Notifications",
      }),
    );
    const input = getByRole(root, "switch", { name: "Notifications" });

    expect(input.hasAttribute("checked")).toBe(false);
  });

  it("emits size attribute for sm", () => {
    const root = mountSwitch(
      renderClbrSwitch({
        label: "Notifications",
        size: "sm",
      }),
    );
    const field = root.querySelector(".switch-field");

    expect(field?.getAttribute("data-size")).toBe("sm");
  });

  it("emits name/value and omits empty values", () => {
    const withValuesRoot = mountSwitch(
      renderClbrSwitch({
        label: "Notifications",
        name: "notifications",
        value: "yes",
      }),
    );
    const withValues = getByRole(withValuesRoot, "switch", {
      name: "Notifications",
    });

    expect(withValues.getAttribute("name")).toBe("notifications");
    expect(withValues.getAttribute("value")).toBe("yes");

    const withoutValuesRoot = mountSwitch(
      renderClbrSwitch({
        label: "Notifications",
        name: "",
        value: "",
      }),
    );
    const withoutValues = getByRole(withoutValuesRoot, "switch", {
      name: "Notifications",
    });

    expect(withoutValues.getAttribute("name")).toBeNull();
    expect(withoutValues.getAttribute("value")).toBeNull();
  });

  it("renders description and wires aria-describedby", () => {
    const root = mountSwitch(
      renderClbrSwitch({
        description: "Optional helper text",
        descriptionId: "switch-description",
        label: "Notifications",
      }),
    );
    const input = getByRole(root, "switch", { name: "Notifications" });
    const description = getByText(root, "Optional helper text");

    expect(input.getAttribute("aria-describedby")).toBe("switch-description");
    expect(description.getAttribute("id")).toBe("switch-description");
  });

  it("trims description and descriptionId before render", () => {
    const root = mountSwitch(
      renderClbrSwitch({
        description: "  Optional helper text  ",
        descriptionId: "  switch-description  ",
        label: "Notifications",
      }),
    );
    const input = getByRole(root, "switch", { name: "Notifications" });
    const description = getByText(root, "Optional helper text");

    expect(input.getAttribute("aria-describedby")).toBe("switch-description");
    expect(description.getAttribute("id")).toBe("switch-description");
  });

  it("omits description markup and aria-describedby when description is blank", () => {
    const root = mountSwitch(
      renderClbrSwitch({
        description: "   ",
        descriptionId: "switch-description",
        label: "Notifications",
      }),
    );
    const input = getByRole(root, "switch", { name: "Notifications" });

    expect(input.getAttribute("aria-describedby")).toBeNull();
    expect(root.querySelector(".description")).toBeNull();
  });

  it("ignores descriptionId when description is omitted", () => {
    const root = mountSwitch(
      renderClbrSwitch({
        descriptionId: "switch-description",
        label: "Notifications",
      }),
    );
    const input = getByRole(root, "switch", { name: "Notifications" });

    expect(input.getAttribute("aria-describedby")).toBeNull();
  });

  it("throws when description is provided without descriptionId", () => {
    expect(() =>
      renderClbrSwitch({
        description: "Optional helper text",
        label: "Notifications",
      }),
    ).toThrow("descriptionId must be non-empty when description is provided.");
  });

  it("throws when descriptionId is invalid", () => {
    expect(() =>
      renderClbrSwitch({
        description: "Optional helper text",
        descriptionId: "not valid",
        label: "Notifications",
      }),
    ).toThrow(
      "descriptionId must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  });

  it("escapes label and description text", () => {
    const root = mountSwitch(
      renderClbrSwitch({
        description: `<img src=x onerror=alert(2)>`,
        descriptionId: "switch-description",
        label: `<script>alert(1)</script>`,
      }),
    );

    expect(root.querySelector("script")).toBeNull();
    expect(root.querySelector("img")).toBeNull();
    expect(
      getByRole(root, "switch", { name: `<script>alert(1)</script>` }),
    ).toBeTruthy();
    expect(getByText(root, `<img src=x onerror=alert(2)>`)).toBeTruthy();
  });
});
