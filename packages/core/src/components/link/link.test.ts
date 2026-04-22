import { getByRole } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../testing/spec";
import { CLBR_LINK_SPEC, type ClbrLinkProps, renderClbrLink } from "./link";

function mount(html: string): void {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
}

describe("renderClbrLink", () => {
  it("renders a link with the standard attrs", () => {
    mount(renderClbrLink({ href: "/docs", label: "Docs" }));
    const link = getByRole(document.body, "link", { name: "Docs" });

    expect(link.getAttribute("href")).toBe("/docs");
    expect(link.getAttribute("data-size")).toBe("md");
    expect(link.getAttribute("data-tone")).toBeNull();
    expect(link.hasAttribute("data-underline")).toBe(false);
  });

  it("escapes the label text", () => {
    mount(renderClbrLink({ href: "/docs", label: "<Docs>" }));
    const link = getByRole(document.body, "link", { name: "<Docs>" });

    expect(link.querySelector(".label")?.innerHTML).toBe("&lt;Docs&gt;");
  });

  it("renders trusted icon markup when provided", () => {
    mount(
      renderClbrLink({
        href: "/docs",
        icon: '<svg class="brand-icon" aria-hidden="true"></svg>',
        label: "Docs",
      }),
    );
    const link = getByRole(document.body, "link", { name: "Docs" });

    expect(link.firstElementChild?.className).toBe("icon-wrapper");
    expect(link.querySelector(".icon-wrapper .brand-icon")).toBeTruthy();
  });

  it("emits rel and target when values are provided", () => {
    mount(
      renderClbrLink({
        href: "/docs",
        label: "Docs",
        rel: "noreferrer",
        target: "_blank",
      }),
    );
    const link = getByRole(document.body, "link", { name: "Docs" });

    expect(link.getAttribute("rel")).toBe("noreferrer");
    expect(link.getAttribute("target")).toBe("_blank");
  });

  it("emits neutral tone and small size when provided", () => {
    mount(
      renderClbrLink({
        href: "/docs",
        label: "Docs",
        size: "sm",
        tone: "neutral",
      }),
    );
    const link = getByRole(document.body, "link", { name: "Docs" });

    expect(link.getAttribute("data-size")).toBe("sm");
    expect(link.getAttribute("data-tone")).toBe("neutral");
  });

  it("emits underline when provided", () => {
    mount(renderClbrLink({ href: "/docs", label: "Docs", underline: true }));
    const link = getByRole(document.body, "link", { name: "Docs" });

    expect(link.hasAttribute("data-underline")).toBe(true);
  });
});

describeSpecConsistency<ClbrLinkProps>({
  baseProps: { href: "/docs", label: "Docs" },
  renderer: renderClbrLink,
  spec: CLBR_LINK_SPEC,
});
