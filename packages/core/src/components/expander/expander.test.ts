import { getByRole } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../testing/spec";
import {
  CLBR_EXPANDER_SPEC,
  type ClbrExpanderProps,
  renderClbrExpander,
} from "./expander";

function mount(html: string): void {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
}

describe("renderClbrExpander", () => {
  it("renders defaults", () => {
    mount(renderClbrExpander());
    const button = getByRole(document.body, "button", { name: "Menu" });

    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.getAttribute("data-size")).toBe("md");
    expect(button.getAttribute("aria-controls")).toBeNull();
  });

  it("renders controls, expanded state, and size when provided", () => {
    mount(
      renderClbrExpander({
        controlsId: "menu-content",
        expanded: true,
        label: "Open navigation",
        size: "sm",
      }),
    );
    const button = getByRole(document.body, "button", {
      name: "Open navigation",
    });

    expect(button.getAttribute("aria-controls")).toBe("menu-content");
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(button.getAttribute("data-size")).toBe("sm");
  });

  it("renders the lg size when provided", () => {
    mount(renderClbrExpander({ label: "Open menu", size: "lg" }));
    const button = getByRole(document.body, "button", { name: "Open menu" });

    expect(button.getAttribute("data-size")).toBe("lg");
  });

  it("normalizes an empty label to the default", () => {
    mount(renderClbrExpander({ label: "" }));
    const button = getByRole(document.body, "button", { name: "Menu" });

    expect(button).not.toBeNull();
  });
});

describeSpecConsistency<ClbrExpanderProps>({
  baseProps: {},
  renderer: renderClbrExpander,
  spec: CLBR_EXPANDER_SPEC,
});
