import { getByRole } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { renderClbrButton } from "./button";

describe("renderClbrButton", () => {
  it("renders native button semantics by default", () => {
    document.body.innerHTML = `<div class="clbr">${renderClbrButton({ children: "Save" })}</div>`;
    const button = getByRole(document.body, "button", { name: "Save" });
    expect(button).toBeTruthy();
    expect(button.getAttribute("data-mode")).toBe("button");
  });

  it("renders native link semantics when href is present", () => {
    document.body.innerHTML = `<div class="clbr">${renderClbrButton({ children: "Docs", href: "/docs" })}</div>`;
    const link = getByRole(document.body, "link", { name: "Docs" });
    expect(link.getAttribute("href")).toBe("/docs");
    expect(link.getAttribute("data-mode")).toBe("link");
  });

  it("throws for iconOnly without ariaLabel", () => {
    expect(() =>
      renderClbrButton({
        children: "X",
        iconOnly: true,
      }),
    ).toThrow("iconOnly");
  });
});
