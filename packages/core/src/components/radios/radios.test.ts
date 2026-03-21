import { getByRole, getByText, queryByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { renderClbrRadios } from "./radios";

function mountRadios(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrRadios", () => {
  const baseItems = [
    { label: "Email", value: "email" },
    { label: "SMS", value: "sms" },
  ];

  it("renders fieldset with legend and radio options", () => {
    const root = mountRadios(
      renderClbrRadios({
        id: "contact",
        radios: baseItems,
        legend: "Contact Method",
        name: "contact",
      }),
    );

    expect(root.querySelector(".radio-fieldset")?.getAttribute("id")).toBe(
      "contact",
    );
    expect(
      root.querySelector(".radio-fieldset")?.getAttribute("data-orientation"),
    ).toBe("vertical");
    expect(root.querySelectorAll(".radio-field")).toHaveLength(2);
    expect(getByText(root, "Contact Method").tagName).toBe("LEGEND");
    expect(getByRole(root, "radio", { name: "Email" })).toBeTruthy();
    expect(getByRole(root, "radio", { name: "SMS" })).toBeTruthy();
  });

  it("throws when radios has fewer than 2 options", () => {
    expect(() =>
      renderClbrRadios({
        id: "contact",
        radios: [{ label: "Only", value: "only" }],
        legend: "Contact Method",
        name: "contact",
      }),
    ).toThrow("radios must include at least 2 options.");
  });

  it("throws when name is empty", () => {
    expect(() =>
      renderClbrRadios({
        id: "contact",
        radios: baseItems,
        legend: "Contact Method",
        name: "   ",
      }),
    ).toThrow("name must be a non-empty string.");
  });

  it("throws when id is invalid", () => {
    expect(() =>
      renderClbrRadios({
        id: "not valid",
        radios: baseItems,
        legend: "Contact Method",
        name: "contact",
      }),
    ).toThrow(
      "id must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  });

  it("throws when id is empty", () => {
    expect(() =>
      renderClbrRadios({
        id: "   ",
        radios: baseItems,
        legend: "Contact Method",
        name: "contact",
      }),
    ).toThrow("id must be a non-empty string.");
  });

  it("throws when a radio value or label is empty", () => {
    expect(() =>
      renderClbrRadios({
        id: "contact",
        radios: [
          { label: "Email", value: "email" },
          { label: "SMS", value: "   " },
        ],
        legend: "Contact Method",
        name: "contact",
      }),
    ).toThrow("radios[1].value must be non-empty.");

    expect(() =>
      renderClbrRadios({
        id: "contact",
        radios: [
          { label: "Email", value: "email" },
          { label: "   ", value: "sms" },
        ],
        legend: "Contact Method",
        name: "contact",
      }),
    ).toThrow("radios[1].label must be non-empty.");
  });

  it("throws when item values are duplicate", () => {
    expect(() =>
      renderClbrRadios({
        id: "contact",
        radios: [
          { label: "Email", value: "dup" },
          { label: "SMS", value: "dup" },
        ],
        legend: "Contact Method",
        name: "contact",
      }),
    ).toThrow("radios values must be unique.");
  });

  it("maps selected value to checked radio and tolerates unmatched value", () => {
    const selectedRoot = mountRadios(
      renderClbrRadios({
        id: "contact",
        radios: baseItems,
        legend: "Contact Method",
        name: "contact",
        value: "sms",
      }),
    );

    expect(
      getByRole(selectedRoot, "radio", { name: "SMS" }).hasAttribute("checked"),
    ).toBe(true);
    expect(
      getByRole(selectedRoot, "radio", { name: "Email" }).hasAttribute(
        "checked",
      ),
    ).toBe(false);

    const unmatchedRoot = mountRadios(
      renderClbrRadios({
        id: "contact",
        radios: baseItems,
        legend: "Contact Method",
        name: "contact",
        value: "postal",
      }),
    );

    expect(
      getByRole(unmatchedRoot, "radio", { name: "Email" }).hasAttribute(
        "checked",
      ),
    ).toBe(false);
    expect(
      getByRole(unmatchedRoot, "radio", { name: "SMS" }).hasAttribute(
        "checked",
      ),
    ).toBe(false);
  });

  it("wires group description to fieldset aria-describedby", () => {
    const root = mountRadios(
      renderClbrRadios({
        description: "Choose one.",
        id: "contact",
        radios: baseItems,
        legend: "Contact Method",
        name: "contact",
      }),
    );

    const fieldset = root.querySelector("fieldset");
    const firstInput = getByRole(root, "radio", { name: "Email" });

    expect(fieldset?.getAttribute("aria-describedby")).toBe(
      "contact-description",
    );
    expect(firstInput.getAttribute("aria-describedby")).toBeNull();
    expect(getByText(root, "Choose one.").getAttribute("id")).toBe(
      "contact-description",
    );
  });

  it("wires per-item description to matching input only", () => {
    const root = mountRadios(
      renderClbrRadios({
        description: "Choose one.",
        id: "contact",
        radios: [
          { label: "Email", value: "email" },
          { description: "Text messages only.", label: "SMS", value: "sms" },
        ],
        legend: "Contact Method",
        name: "contact",
      }),
    );

    const smsInput = getByRole(root, "radio", { name: /SMS/ });
    const emailInput = getByRole(root, "radio", { name: "Email" });

    expect(smsInput.getAttribute("aria-describedby")).toBe(
      "contact-sms-description",
    );
    expect(emailInput.getAttribute("aria-describedby")).toBeNull();
    expect(getByText(root, "Text messages only.").getAttribute("id")).toBe(
      "contact-sms-description",
    );
    expect(
      getByRole(root, "radio", { name: /SMS/ })
        .closest("label")
        ?.querySelector(".radio-description"),
    ).toBeNull();
  });

  it("applies invalid to fieldset and suppresses it when disabled", () => {
    const invalidRoot = mountRadios(
      renderClbrRadios({
        id: "contact",
        invalid: true,
        radios: baseItems,
        legend: "Contact Method",
        name: "contact",
      }),
    );

    expect(
      invalidRoot.querySelector("fieldset")?.getAttribute("aria-invalid"),
    ).toBe("true");

    const disabledRoot = mountRadios(
      renderClbrRadios({
        disabled: true,
        id: "contact",
        invalid: true,
        radios: baseItems,
        legend: "Contact Method",
        name: "contact",
      }),
    );

    expect(
      disabledRoot.querySelector("fieldset")?.getAttribute("aria-invalid"),
    ).toBeNull();
  });

  it("applies required to all non-disabled radios", () => {
    const root = mountRadios(
      renderClbrRadios({
        id: "contact",
        radios: [
          { disabled: true, label: "Email", value: "email" },
          { label: "SMS", value: "sms" },
          { label: "Phone", value: "phone" },
        ],
        legend: "Contact Method",
        name: "contact",
        required: true,
      }),
    );

    expect(
      getByRole(root, "radio", { name: "Email" }).hasAttribute("required"),
    ).toBe(false);
    expect(
      getByRole(root, "radio", { name: "SMS" }).hasAttribute("required"),
    ).toBe(true);
    expect(
      getByRole(root, "radio", { name: "Phone" }).hasAttribute("required"),
    ).toBe(true);
  });

  it("uses fieldset disabled state without emitting disabled on all inputs", () => {
    const root = mountRadios(
      renderClbrRadios({
        disabled: true,
        id: "contact",
        radios: baseItems,
        legend: "Contact Method",
        name: "contact",
      }),
    );

    expect(root.querySelector("fieldset")?.hasAttribute("disabled")).toBe(true);
    expect(
      getByRole(root, "radio", { name: "Email" }).hasAttribute("disabled"),
    ).toBe(false);
    expect(
      getByRole(root, "radio", { name: "SMS" }).hasAttribute("disabled"),
    ).toBe(false);
  });

  it("suppresses required when group is disabled", () => {
    const root = mountRadios(
      renderClbrRadios({
        disabled: true,
        id: "contact",
        radios: baseItems,
        legend: "Contact Method",
        name: "contact",
        required: true,
      }),
    );

    expect(
      getByRole(root, "radio", { name: "Email" }).hasAttribute("required"),
    ).toBe(false);
    expect(
      getByRole(root, "radio", { name: "SMS" }).hasAttribute("required"),
    ).toBe(false);
  });

  it("escapes legend and descriptions", () => {
    const root = mountRadios(
      renderClbrRadios({
        description: `<img src=x onerror=alert(2)>`,
        id: "contact",
        radios: [
          { label: `<script>alert(1)</script>`, value: "email" },
          { description: `<b>desc</b>`, label: "SMS", value: "sms" },
        ],
        legend: `Contact <Method>`,
        name: "contact",
      }),
    );

    expect(root.querySelector("script")).toBeNull();
    expect(root.querySelector("img")).toBeNull();
    expect(getByText(root, `<img src=x onerror=alert(2)>`)).toBeTruthy();
    expect(
      getByRole(root, "radio", { name: `<script>alert(1)</script>` }),
    ).toBeTruthy();
    expect(getByText(root, `<b>desc</b>`)).toBeTruthy();
    expect(queryByText(root, "alert(1)")).toBeNull();
  });
});
