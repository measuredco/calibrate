import { getAllByRole, getByRole } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../testing/spec";
import {
  CLBR_NAV_SPEC,
  defineClbrNav,
  renderClbrNav,
  type ClbrNavItem,
  type ClbrNavProps,
} from "./nav";

function mountNav(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

const items: ClbrNavItem[] = [
  { current: true, href: "/one", label: "Item one" },
  { href: "/two", label: "Item two" },
  { href: "/three", label: "Item three" },
];

describe("renderClbrNav", () => {
  it("renders semantic nav list markup", () => {
    const root = mountNav(renderClbrNav({ items }));

    const nav = getByRole(root, "navigation");

    expect(nav.tagName).toBe("NAV");
    expect(root.querySelector("clbr-nav")).not.toBeNull();
    expect(getAllByRole(root, "listitem")).toHaveLength(3);
    expect(getAllByRole(root, "link")).toHaveLength(3);
  });

  it("emits aria-current for the current item", () => {
    const root = mountNav(renderClbrNav({ items }));

    expect(
      getByRole(root, "link", { name: "Item one" }).getAttribute(
        "aria-current",
      ),
    ).toBe("page");
  });

  it("renders an accessible nav label when provided", () => {
    const root = mountNav(renderClbrNav({ items, label: "Primary" }));

    expect(getByRole(root, "navigation", { name: "Primary" })).not.toBeNull();
  });

  it("escapes item labels", () => {
    const root = mountNav(
      renderClbrNav({
        items: [{ href: "/x", label: "<strong>boom</strong>" }],
      }),
    );

    const link = getByRole(root, "link");
    expect(link.innerHTML).toBe("&lt;strong&gt;boom&lt;/strong&gt;");
    expect(link.querySelector("strong")).toBeNull();
  });

  it("emits collapsible hooks in SSR output", () => {
    const html = renderClbrNav({
      collapsible: "belowTablet",
      contentId: "primary-nav-content",
      expanderPosition: "end",
      items,
      size: "sm",
    });

    expect(html.startsWith("<clbr-nav ")).toBe(true);
    expect(html.includes('data-collapsible="belowTablet"')).toBe(true);
    expect(html.includes('data-expander-position="end"')).toBe(true);
    expect(html.includes("data-expander-label=")).toBe(false);
    expect(html.includes('data-size="sm"')).toBe(true);
    expect(html.includes('data-part="expander"')).toBe(false);
  });

  it("throws when collapsible is set without a contentId", () => {
    expect(() => renderClbrNav({ collapsible: "always", items })).toThrow(
      /contentId must be a non-empty string/,
    );
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
});

describe("defineClbrNav", () => {
  it("does not inject an expander when nav is not collapsible", () => {
    const root = mountNav(renderClbrNav({ items }));

    defineClbrNav();

    expect(root.querySelector('[data-part="expander"]')).toBeNull();
    expect(isRootLocked()).toBe(false);
  });

  it("upgrades collapsible nav with an expander button and closed state", () => {
    const root = mountNav(
      renderClbrNav({
        collapsible: "belowTablet",
        contentId: "primary-nav-content",
        items,
      }),
    );

    defineClbrNav();

    const button = getByRole(root, "button", { name: "Menu" });

    expect(root.querySelector('[data-part="expander"]')).not.toBeNull();
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  it("wires aria-controls when contentId is provided", () => {
    const root = mountNav(
      renderClbrNav({
        collapsible: "always",
        contentId: "primary-nav-content",
        items,
      }),
    );

    defineClbrNav();

    const button = getByRole(root, "button", { name: "Menu" });
    const content = root.querySelector(".content") as HTMLElement;

    expect(content.id).toBe("primary-nav-content");
    expect(button.getAttribute("aria-controls")).toBe("primary-nav-content");
  });

  it("toggles collapsible nav content on button click", async () => {
    const user = userEvent.setup();
    const root = mountNav(
      renderClbrNav({
        collapsible: "always",
        contentId: "primary-nav-content",
        items,
      }),
    );

    defineClbrNav();

    const button = getByRole(root, "button", { name: "Menu" });

    await user.click(button);

    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(isRootLocked()).toBe(true);

    await user.click(button);

    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(isRootLocked()).toBe(false);
  });

  it("closes expanded nav on Escape", async () => {
    const user = userEvent.setup();
    const root = mountNav(
      renderClbrNav({
        collapsible: "always",
        contentId: "primary-nav-content",
        items,
      }),
    );

    defineClbrNav();

    const button = getByRole(root, "button", { name: "Menu" });

    await user.click(button);
    await user.keyboard("{Escape}");

    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(isRootLocked()).toBe(false);
  });
});

describeSpecConsistency<ClbrNavProps>({
  baseProps: { items },
  propOverrides: {
    collapsible: { contentId: "nav-content" },
  },
  renderer: renderClbrNav,
  spec: CLBR_NAV_SPEC,
});

function isRootLocked(): boolean {
  return document.documentElement.hasAttribute("data-clbr-scroll-locked");
}
