import { getByRole, getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  CLBR_SWITCH_SPEC,
  type ClbrSwitchProps,
  renderClbrSwitch,
} from "./switch";

function mountSwitch(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrSwitch", () => {
  it("renders switch with label and default size", () => {
    const root = mountSwitch(
      renderClbrSwitch({ id: "notifications", label: "Notifications" }),
    );
    const input = getByRole(root, "switch", { name: "Notifications" });
    const field = root.querySelector(".clbr-switch");

    expect(field?.getAttribute("data-size")).toBe("md");
    expect(input.getAttribute("type")).toBe("checkbox");
    expect(input.getAttribute("role")).toBe("switch");
  });

  it("emits checked and disabled attrs when true", () => {
    const root = mountSwitch(
      renderClbrSwitch({
        checked: true,
        disabled: true,
        id: "notifications",
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
        id: "notifications",
        label: "Notifications",
      }),
    );
    const input = getByRole(root, "switch", { name: "Notifications" });

    expect(input.hasAttribute("checked")).toBe(false);
  });

  it("emits size attribute for sm", () => {
    const root = mountSwitch(
      renderClbrSwitch({
        id: "notifications",
        label: "Notifications",
        size: "sm",
      }),
    );
    const field = root.querySelector(".clbr-switch");

    expect(field?.getAttribute("data-size")).toBe("sm");
  });

  it("emits name/value and omits empty values", () => {
    const withValuesRoot = mountSwitch(
      renderClbrSwitch({
        id: "notifications",
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
        id: "notifications",
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

  it("renders description and derives aria-describedby from id", () => {
    const root = mountSwitch(
      renderClbrSwitch({
        description: "Optional helper text",
        id: "notifications",
        label: "Notifications",
      }),
    );
    const input = getByRole(root, "switch", { name: "Notifications" });
    const description = getByText(root, "Optional helper text");

    expect(input.getAttribute("aria-describedby")).toBe(
      "notifications-description",
    );
    expect(description.getAttribute("id")).toBe("notifications-description");
  });

  it("trims description before render", () => {
    const root = mountSwitch(
      renderClbrSwitch({
        description: "  Optional helper text  ",
        id: "notifications",
        label: "Notifications",
      }),
    );
    const description = getByText(root, "Optional helper text");

    expect(description.getAttribute("id")).toBe("notifications-description");
  });

  it("omits description markup and aria-describedby when description is blank", () => {
    const root = mountSwitch(
      renderClbrSwitch({
        description: "   ",
        id: "notifications",
        label: "Notifications",
      }),
    );
    const input = getByRole(root, "switch", { name: "Notifications" });

    expect(input.getAttribute("aria-describedby")).toBeNull();
    expect(root.querySelector(".description")).toBeNull();
  });

  it("throws when id is empty or invalid", () => {
    expect(() => renderClbrSwitch({ id: "", label: "Notifications" })).toThrow(
      "id must be a non-empty string.",
    );
    expect(() =>
      renderClbrSwitch({ id: "not valid", label: "Notifications" }),
    ).toThrow();
  });

  it("escapes label and description text", () => {
    const root = mountSwitch(
      renderClbrSwitch({
        description: `<img src=x onerror=alert(2)>`,
        id: "notifications",
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

  it("renders consumer-provided id on the inner input", () => {
    const root = mountSwitch(
      renderClbrSwitch({ id: "my-switch", label: "Label" }),
    );
    const input = root.querySelector("input.switch") as HTMLInputElement;

    expect(input.id).toBe("my-switch");
  });
});

describeSpecConsistency<ClbrSwitchProps>({
  baseProps: { id: "sw", label: "Label" },
  renderer: renderClbrSwitch,
  spec: CLBR_SWITCH_SPEC,
});
