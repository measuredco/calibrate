import { getByRole } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../testing/spec";
import {
  CLBR_BUTTON_SPEC,
  type ClbrButtonProps,
  renderClbrButton,
} from "./button";

function mount(html: string): void {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
}

describe("renderClbrButton", () => {
  it("defaults to standard attrs", () => {
    mount(renderClbrButton({ label: "Save" }));
    const button = getByRole(document.body, "button", { name: "Save" });

    expect(button.getAttribute("data-appearance")).toBe("outline");
    expect(button.getAttribute("data-size")).toBe("md");
    expect(button.getAttribute("data-tone")).toBeNull();
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("data-label-visibility")).toBeNull();
  });

  it("emits neutral tone only when provided", () => {
    mount(renderClbrButton({ label: "Save", tone: "neutral" }));
    const button = getByRole(document.body, "button", { name: "Save" });

    expect(button.getAttribute("data-tone")).toBe("neutral");
  });

  it("supports submit type", () => {
    mount(renderClbrButton({ label: "Save", type: "submit" }));
    const button = getByRole(document.body, "button", { name: "Save" });

    expect(button.getAttribute("type")).toBe("submit");
  });

  it("emits non-empty form attrs and omits empty values", () => {
    mount(
      renderClbrButton({
        form: "profile-form",
        label: "Save",
        name: "",
        value: "save",
      }),
    );
    const button = getByRole(document.body, "button", { name: "Save" });

    expect(button.getAttribute("form")).toBe("profile-form");
    expect(button.getAttribute("name")).toBeNull();
    expect(button.getAttribute("value")).toBe("save");
  });

  it("supports disclosure semantics", () => {
    mount(
      renderClbrButton({
        controls: "sidebar",
        disclosure: true,
        label: "Open sidebar",
      }),
    );
    const button = getByRole(document.body, "button", {
      name: "Open sidebar",
    });

    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.getAttribute("aria-controls")).toBe("sidebar");
  });

  it("supports haspopup", () => {
    mount(
      renderClbrButton({
        haspopup: "menu",
        label: "Open menu",
      }),
    );
    const button = getByRole(document.body, "button", { name: "Open menu" });

    expect(button.getAttribute("aria-haspopup")).toBe("menu");
  });

  it("ignores controls when disclosure is omitted", () => {
    mount(
      renderClbrButton({
        controls: "sidebar",
        label: "Open sidebar",
      }),
    );
    const button = getByRole(document.body, "button", {
      name: "Open sidebar",
    });

    expect(button.getAttribute("aria-expanded")).toBeNull();
    expect(button.getAttribute("aria-controls")).toBeNull();
  });

  it("renders icon at start by default when icon is provided", () => {
    mount(
      renderClbrButton({
        icon: "arrow-right",
        label: "Continue",
      }),
    );
    const button = getByRole(document.body, "button", { name: "Continue" });

    expect(button.firstElementChild?.className).toBe("icon-wrapper");
    expect(button.querySelector(".icon-wrapper .clbr-icon")).toBeTruthy();
  });

  it("renders icon at end when iconPlacement is end", () => {
    mount(
      renderClbrButton({
        icon: "arrow-right",
        iconPlacement: "end",
        label: "Continue",
      }),
    );
    const button = getByRole(document.body, "button", { name: "Continue" });

    expect(button.lastElementChild?.className).toBe("icon-wrapper");
  });

  it("emits label visibility and mirrored attrs when provided", () => {
    mount(
      renderClbrButton({
        icon: "arrow-right",
        iconMirrored: "rtl",
        label: "Continue",
        labelVisibility: "hiddenBelowTablet",
      }),
    );
    const button = getByRole(document.body, "button", { name: "Continue" });
    const icon = button.querySelector("svg.clbr-icon");

    expect(button.getAttribute("data-label-visibility")).toBe(
      "hiddenBelowTablet",
    );
    expect(icon?.getAttribute("data-mirrored")).toBe("rtl");
  });

  it("supports always-hidden labels when icon is present", () => {
    mount(
      renderClbrButton({
        icon: "arrow-right",
        label: "Continue",
        labelVisibility: "hidden",
      }),
    );
    const button = getByRole(document.body, "button", { name: "Continue" });

    expect(button.getAttribute("data-label-visibility")).toBe("hidden");
    expect(button.querySelector(".label")?.textContent).toBe("Continue");
  });

  it("treats empty icon string as omitted", () => {
    mount(
      renderClbrButton({
        icon: "",
        label: "Continue",
      }),
    );
    const button = getByRole(document.body, "button", { name: "Continue" });

    expect(button.getAttribute("data-label-visibility")).toBeNull();
    expect(button.querySelector(".icon-wrapper")).toBeNull();
  });

  it("throws when label is hidden but no icon is present", () => {
    expect(() =>
      renderClbrButton({
        label: "Continue",
        labelVisibility: "hidden",
      }),
    ).toThrow("labelVisibility requires icon when label is not visible.");
  });

  it("renders button icon as decorative", () => {
    mount(
      renderClbrButton({
        icon: "arrow-right",
        label: "Continue",
      }),
    );
    const button = getByRole(document.body, "button", { name: "Continue" });
    const icon = button.querySelector("svg.clbr-icon");

    expect(icon?.getAttribute("aria-hidden")).toBe("true");
    expect(icon?.getAttribute("role")).toBeNull();
    expect(icon?.querySelector("title")).toBeNull();
  });

  describe("escaping", () => {
    it("escapes label content", () => {
      const html = renderClbrButton({ label: "<script>alert(1)</script>" });

      expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
      expect(html).not.toContain("<script>");
    });
  });
});

describeSpecConsistency<ClbrButtonProps>({
  baseProps: { label: "Label" },
  propOverrides: {
    labelVisibility: { icon: "arrow-right" },
  },
  renderer: renderClbrButton,
  spec: CLBR_BUTTON_SPEC,
});
