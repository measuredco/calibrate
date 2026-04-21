import { getByRole, getAllByRole } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { defineClbrNav, renderClbrNav, type ClbrNavItem } from "./nav";

function mount(html: string): void {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
}

const items: ClbrNavItem[] = [
  { current: true, href: "/one", label: "Item one" },
  { href: "/two", label: "Item two" },
  { href: "/three", label: "Item three" },
];

describe("renderClbrNav", () => {
  it("renders semantic nav list markup", () => {
    mount(
      renderClbrNav({
        items,
      }),
    );

    const nav = document.body.querySelector(".nav");

    expect(nav?.tagName).toBe("NAV");
    expect(document.body.querySelector("clbr-nav")).not.toBeNull();
    expect(nav?.querySelector(".content")).not.toBeNull();
    expect(nav?.querySelector(".list")).not.toBeNull();
    expect(getAllByRole(document.body, "listitem")).toHaveLength(3);
    expect(getAllByRole(document.body, "link")).toHaveLength(3);
    expect(nav?.querySelector(".content > .list")).not.toBeNull();
  });

  it("emits aria-current for the current item", () => {
    mount(
      renderClbrNav({
        items,
      }),
    );

    const currentLink = getByRole(document.body, "link", { name: "Item one" });

    expect(currentLink.getAttribute("aria-current")).toBe("page");
  });

  it("renders an accessible nav label when provided", () => {
    mount(
      renderClbrNav({
        items,
        label: "Primary",
      }),
    );

    const nav = getByRole(document.body, "navigation", { name: "Primary" });

    expect(nav).not.toBeNull();
  });

  it("emits collapsible hooks in SSR output", () => {
    const html = renderClbrNav({
      collapsible: "belowTablet",
      contentId: "primary-nav-content",
      expanderPosition: "end",
      items,
      size: "sm",
    });

    expect(html.startsWith("<clbr-nav>")).toBe(true);
    expect(html.includes('data-collapsible="belowTablet"')).toBe(true);
    expect(html.includes('data-expander-position="end"')).toBe(true);
    expect(html.includes("data-expander-label=")).toBe(false);
    expect(html.includes('data-size="sm"')).toBe(true);
    expect(html.includes('data-part="expander"')).toBe(false);
  });

  it("does not inject an expander when nav is not collapsible", () => {
    mount(
      renderClbrNav({
        items,
      }),
    );

    defineClbrNav();

    expect(document.body.querySelector('[data-part="expander"]')).toBeNull();
    expect(queryRootLock()).toBe(false);
  });

  it("upgrades collapsible nav with an expander button and closed state", () => {
    mount(
      renderClbrNav({
        collapsible: "belowTablet",
        contentId: "primary-nav-content",
        items,
      }),
    );

    defineClbrNav();

    const expander = document.body.querySelector(
      '.nav [data-part="expander"]',
    ) as HTMLElement;
    const button = getByRole(document.body, "button", { name: "Menu" });

    expect(expander).not.toBeNull();
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  it("throws when collapsible is set without a contentId", () => {
    expect(() =>
      renderClbrNav({
        collapsible: "always",
        items,
      }),
    ).toThrow(/contentId must be a non-empty string/);
  });

  it("throws when contentId is not a valid HTML id", () => {
    expect(() =>
      renderClbrNav({
        collapsible: "always",
        contentId: "123-bad-start",
        items,
      }),
    ).toThrow(/contentId must start with a letter/);
  });

  it("wires aria-controls when contentId is provided", () => {
    mount(
      renderClbrNav({
        collapsible: "always",
        contentId: "primary-nav-content",
        items,
      }),
    );

    defineClbrNav();

    const button = getByRole(document.body, "button", { name: "Menu" });
    const content = document.body.querySelector(".content") as HTMLElement;

    expect(content.id).toBe("primary-nav-content");
    expect(button.getAttribute("aria-controls")).toBe("primary-nav-content");
  });

  it("switches collapsible nav content on button click", () => {
    mount(
      renderClbrNav({
        collapsible: "always",
        contentId: "primary-nav-content",
        items,
      }),
    );

    defineClbrNav();

    const button = getByRole(document.body, "button", { name: "Menu" });

    button.click();

    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(
      document.documentElement.hasAttribute("data-clbr-scroll-locked"),
    ).toBe(true);

    button.click();

    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(
      document.documentElement.hasAttribute("data-clbr-scroll-locked"),
    ).toBe(false);
  });

  it("closes expanded nav on Escape", () => {
    mount(
      renderClbrNav({
        collapsible: "always",
        contentId: "primary-nav-content",
        items,
      }),
    );

    defineClbrNav();

    const button = getByRole(document.body, "button", { name: "Menu" });

    button.click();
    document.defaultView?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape" }),
    );

    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(queryRootLock()).toBe(false);
  });
});

function queryRootLock(): boolean {
  return document.documentElement.hasAttribute("data-clbr-scroll-locked");
}
