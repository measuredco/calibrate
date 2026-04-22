import { getByRole, getByText } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../testing/spec";
import {
  CLBR_SIDEBAR_SPEC,
  CLBR_SIDEBAR_TAG_NAME,
  defineClbrSidebar,
  renderClbrSidebar,
  type ClbrSidebarAboveNotebook,
  type ClbrSidebarProps,
} from "./sidebar";

let mediaQueryChange:
  | ((event: { matches: boolean; media: string }) => void)
  | undefined;
let mediaQueryMatches = false;

function mountSidebar(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

function installMatchMediaMock(): void {
  mediaQueryMatches = false;
  mediaQueryChange = undefined;
  Object.defineProperty(document.defaultView ?? window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
      addEventListener: (
        type: string,
        listener: (event: { matches: boolean; media: string }) => void,
      ) => {
        if (type === "change") {
          mediaQueryChange = listener;
        }
      },
      get matches() {
        return mediaQueryMatches;
      },
      media: query,
      removeEventListener: () => {
        mediaQueryChange = undefined;
      },
    }),
  });
}

function setAboveNotebook(matches: boolean): void {
  mediaQueryMatches = matches;
  mediaQueryChange?.({ matches, media: "(min-width: 68em)" });
}

describe("renderClbrSidebar", () => {
  it("renders semantic sidebar markup inside host", () => {
    const root = mountSidebar(
      renderClbrSidebar({
        children: "<p>Body</p>",
        footer: "<p>Footer</p>",
        header: "<p>Header</p>",
        id: "sidebar",
      }),
    );

    const host = root.querySelector(CLBR_SIDEBAR_TAG_NAME) as HTMLElement;
    const sidebar = root.querySelector(".sidebar") as HTMLElement;

    expect(host).not.toBeNull();
    expect(host.getAttribute("data-above-notebook")).toBe("persistent");
    expect(host.getAttribute("data-size")).toBe("md");
    expect(sidebar.classList.contains("sidebar")).toBe(true);
    expect(root.querySelector('[data-part="backdrop"]')).not.toBeNull();
    expect(getByRole(root, "button", { name: "Open sidebar" })).not.toBeNull();
    expect(getByText(root, "Header")).not.toBeNull();
    expect(getByText(root, "Body")).not.toBeNull();
    expect(getByText(root, "Footer")).not.toBeNull();
  });

  it("emits owned trigger markup in SSR output without runtime close control", () => {
    const html = renderClbrSidebar({
      children: "<p>Body</p>",
      id: "sidebar",
    });

    expect(html.startsWith("<clbr-sidebar ")).toBe(true);
    expect(html.includes('data-part="trigger"')).toBe(true);
    expect(html.includes('data-part="backdrop"')).toBe(true);
    expect(html.includes('data-part="close"')).toBe(false);
    expect(html.includes('aria-controls="sidebar"')).toBe(true);
  });
});

describe("defineClbrSidebar", () => {
  it("injects a close button on upgrade", () => {
    const root = mountSidebar(
      renderClbrSidebar({
        children: "<p>Body</p>",
        id: "sidebar",
        size: "sm",
      }),
    );

    defineClbrSidebar();

    const host = root.querySelector(CLBR_SIDEBAR_TAG_NAME) as HTMLElement;

    expect(host.getAttribute("data-size")).toBe("sm");
    expect(
      getByRole(root, "button", { name: "Collapse sidebar" }),
    ).not.toBeNull();
    expect(
      root
        .querySelector('[data-part="close"] .button')
        ?.getAttribute("data-size"),
    ).toBe("md");
  });

  it("uses a custom collapse label when provided", () => {
    installMatchMediaMock();

    const root = mountSidebar(
      renderClbrSidebar({
        children: "<p>Body</p>",
        collapseLabel: "Collapse navigation",
        id: "sidebar",
      }),
    );

    defineClbrSidebar();

    expect(
      getByRole(root, "button", { name: "Collapse navigation" }),
    ).not.toBeNull();
  });

  it.each([["collapsible"], ["overlay"]] satisfies Array<
    [ClbrSidebarAboveNotebook]
  >)(
    "retains a close button above notebook for %s behavior",
    (aboveNotebook) => {
      installMatchMediaMock();

      const root = mountSidebar(
        renderClbrSidebar({
          aboveNotebook,
          children: "<p>Body</p>",
          id: "sidebar",
        }),
      );

      defineClbrSidebar();
      setAboveNotebook(true);

      expect(root.querySelector('[data-part="close"]')).not.toBeNull();
    },
  );

  it("opens from the owned trigger", async () => {
    installMatchMediaMock();

    const user = userEvent.setup();
    const root = mountSidebar(
      renderClbrSidebar({ children: "<p>Body</p>", id: "sidebar" }),
    );

    defineClbrSidebar();

    const trigger = getByRole(root, "button", { name: "Open sidebar" });
    const host = root.querySelector(CLBR_SIDEBAR_TAG_NAME) as HTMLElement;

    await user.click(trigger);

    expect(host.hasAttribute("data-open")).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(
      document.documentElement.hasAttribute("data-clbr-scroll-locked"),
    ).toBe(true);
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    installMatchMediaMock();

    const user = userEvent.setup();
    const root = mountSidebar(
      renderClbrSidebar({ children: "<p>Body</p>", id: "sidebar" }),
    );

    defineClbrSidebar();

    const trigger = getByRole(root, "button", { name: "Open sidebar" });
    const host = root.querySelector(CLBR_SIDEBAR_TAG_NAME) as HTMLElement;

    await user.click(trigger);
    await user.keyboard("{Escape}");

    expect(host.hasAttribute("data-open")).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
  });

  it("closes on backdrop click", async () => {
    installMatchMediaMock();

    const user = userEvent.setup();
    const root = mountSidebar(
      renderClbrSidebar({ children: "<p>Body</p>", id: "sidebar" }),
    );

    defineClbrSidebar();

    const trigger = getByRole(root, "button", { name: "Open sidebar" });
    const host = root.querySelector(CLBR_SIDEBAR_TAG_NAME) as HTMLElement;
    const backdrop = root.querySelector(
      '[data-part="backdrop"]',
    ) as HTMLElement;

    await user.click(trigger);
    await user.click(backdrop);

    expect(host.hasAttribute("data-open")).toBe(false);
    expect(
      document.documentElement.hasAttribute("data-clbr-scroll-locked"),
    ).toBe(false);
  });

  it("forces open state when resized to desktop width", () => {
    installMatchMediaMock();
    mediaQueryMatches = true;

    defineClbrSidebar();

    const root = mountSidebar(
      renderClbrSidebar({ children: "<p>Body</p>", id: "sidebar" }),
    );

    const trigger = getByRole(root, "button", { name: "Open sidebar" });
    const host = root.querySelector(CLBR_SIDEBAR_TAG_NAME) as HTMLElement;

    expect(host.hasAttribute("data-open")).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(
      document.documentElement.hasAttribute("data-clbr-scroll-locked"),
    ).toBe(false);
  });

  it("removes the close button above notebook when behavior is persistent", () => {
    installMatchMediaMock();
    mediaQueryMatches = true;

    const root = mountSidebar(
      renderClbrSidebar({ children: "<p>Body</p>", id: "sidebar" }),
    );

    defineClbrSidebar();

    expect(root.querySelector('[data-part="close"]')).toBeNull();
  });

  it("stays closed above notebook when behavior is overlay", () => {
    installMatchMediaMock();

    const root = mountSidebar(
      renderClbrSidebar({
        aboveNotebook: "overlay",
        children: "<p>Body</p>",
        id: "sidebar",
      }),
    );

    defineClbrSidebar();
    setAboveNotebook(true);

    const host = root.querySelector(CLBR_SIDEBAR_TAG_NAME) as HTMLElement;
    const trigger = getByRole(root, "button", { name: "Open sidebar" });

    expect(host.hasAttribute("data-open")).toBe(false);
    expect(host.hasAttribute("data-collapsed")).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("toggles collapsed state from the close button above notebook when behavior is collapsible", async () => {
    installMatchMediaMock();
    mediaQueryMatches = true;

    const user = userEvent.setup();
    const root = mountSidebar(
      renderClbrSidebar({
        aboveNotebook: "collapsible",
        children: "<p>Body</p>",
        id: "sidebar",
      }),
    );

    defineClbrSidebar();

    const host = root.querySelector(CLBR_SIDEBAR_TAG_NAME) as HTMLElement;
    const close = getByRole(root, "button", { name: "Collapse sidebar" });

    expect(host.hasAttribute("data-open")).toBe(true);
    expect(host.hasAttribute("data-collapsed")).toBe(false);

    await user.click(close);

    expect(host.hasAttribute("data-open")).toBe(true);
    expect(host.hasAttribute("data-collapsed")).toBe(true);

    await user.click(close);

    expect(host.hasAttribute("data-open")).toBe(true);
    expect(host.hasAttribute("data-collapsed")).toBe(false);
  });
});

describeSpecConsistency<ClbrSidebarProps>({
  baseProps: { id: "sidebar" },
  renderer: renderClbrSidebar,
  spec: CLBR_SIDEBAR_SPEC,
});
