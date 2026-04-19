import { getByRole, getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import {
  CLBR_SIDEBAR_TAG_NAME,
  defineClbrSidebar,
  type ClbrSidebarAboveNotebook,
  renderClbrSidebar,
} from "./sidebar";

let mediaQueryChange:
  | ((event: { matches: boolean; media: string }) => void)
  | undefined;
let mediaQueryMatches = false;

function mount(html: string): void {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
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
    mount(
      renderClbrSidebar({
        children: "<p>Body</p>",
        footer: "<p>Footer</p>",
        header: "<p>Header</p>",
        id: "sidebar",
      }),
    );

    const host = document.body.querySelector(CLBR_SIDEBAR_TAG_NAME);
    const sidebar = document.body.querySelector(".sidebar");

    expect(host).not.toBeNull();
    expect(host?.getAttribute("data-above-notebook")).toBe("persistent");
    expect(host?.getAttribute("data-size")).toBe("md");
    expect(sidebar?.classList.contains("sidebar")).toBe(true);
    expect(document.body.querySelector('[data-part="backdrop"]')).toBeTruthy();
    expect(
      getByRole(document.body, "button", { name: "Open sidebar" }),
    ).toBeTruthy();
    expect(getByText(document.body, "Header")).toBeTruthy();
    expect(getByText(document.body, "Body")).toBeTruthy();
    expect(getByText(document.body, "Footer")).toBeTruthy();
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

  it("injects a close button on upgrade", () => {
    mount(
      renderClbrSidebar({
        children: "<p>Body</p>",
        id: "sidebar",
        size: "sm",
      }),
    );

    defineClbrSidebar();

    expect(
      document.body
        .querySelector(CLBR_SIDEBAR_TAG_NAME)
        ?.getAttribute("data-size"),
    ).toBe("sm");
    expect(document.body.querySelector('[data-part="close"]')).not.toBeNull();
    expect(
      getByRole(document.body, "button", { name: "Collapse sidebar" }),
    ).toBeTruthy();
    expect(
      document.body
        .querySelector('[data-part="close"] .button')
        ?.getAttribute("data-size"),
    ).toBe("md");
  });

  it("uses a custom collapse label when provided", () => {
    installMatchMediaMock();

    mount(
      renderClbrSidebar({
        children: "<p>Body</p>",
        collapseLabel: "Collapse navigation",
        id: "sidebar",
      }),
    );

    defineClbrSidebar();

    expect(
      getByRole(document.body, "button", { name: "Collapse navigation" }),
    ).toBeTruthy();
  });

  it.each([["collapsible"], ["overlay"]] satisfies Array<
    [ClbrSidebarAboveNotebook]
  >)(
    "retains a close button above notebook for %s behavior",
    (aboveNotebook) => {
      installMatchMediaMock();

      mount(
        renderClbrSidebar({
          aboveNotebook,
          children: "<p>Body</p>",
          id: "sidebar",
        }),
      );

      defineClbrSidebar();
      setAboveNotebook(true);

      expect(document.body.querySelector('[data-part="close"]')).not.toBeNull();
    },
  );

  it("opens from the owned trigger", () => {
    installMatchMediaMock();

    mount(
      renderClbrSidebar({
        children: "<p>Body</p>",
        id: "sidebar",
      }),
    );

    defineClbrSidebar();

    const trigger = getByRole(document.body, "button", {
      name: "Open sidebar",
    });
    const host = document.body.querySelector(
      CLBR_SIDEBAR_TAG_NAME,
    ) as HTMLElement;

    trigger.click();

    expect(host.hasAttribute("data-open")).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(
      document.documentElement.hasAttribute("data-clbr-scroll-locked"),
    ).toBe(true);
  });

  it("closes on Escape and returns focus to the trigger", () => {
    installMatchMediaMock();

    mount(
      renderClbrSidebar({
        children: "<p>Body</p>",
        id: "sidebar",
      }),
    );

    defineClbrSidebar();

    const trigger = getByRole(document.body, "button", {
      name: "Open sidebar",
    });

    trigger.click();
    document.defaultView?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape" }),
    );

    expect(
      document.body
        .querySelector(CLBR_SIDEBAR_TAG_NAME)
        ?.hasAttribute("data-open"),
    ).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
  });

  it("closes on backdrop click", () => {
    installMatchMediaMock();

    mount(
      renderClbrSidebar({
        children: "<p>Body</p>",
        id: "sidebar",
      }),
    );

    defineClbrSidebar();

    const trigger = getByRole(document.body, "button", {
      name: "Open sidebar",
    });

    trigger.click();
    (
      document.body.querySelector('[data-part="backdrop"]') as HTMLElement
    ).click();

    expect(
      document.body
        .querySelector(CLBR_SIDEBAR_TAG_NAME)
        ?.hasAttribute("data-open"),
    ).toBe(false);
    expect(
      document.documentElement.hasAttribute("data-clbr-scroll-locked"),
    ).toBe(false);
  });

  it("forces open state when resized to desktop width", () => {
    installMatchMediaMock();
    mediaQueryMatches = true;

    defineClbrSidebar();

    mount(
      renderClbrSidebar({
        children: "<p>Body</p>",
        id: "sidebar",
      }),
    );

    const trigger = getByRole(document.body, "button", {
      name: "Open sidebar",
    });

    expect(
      document.body
        .querySelector(CLBR_SIDEBAR_TAG_NAME)
        ?.hasAttribute("data-open"),
    ).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(
      document.documentElement.hasAttribute("data-clbr-scroll-locked"),
    ).toBe(false);
  });

  it("removes the close button above notebook when behavior is persistent", () => {
    installMatchMediaMock();
    mediaQueryMatches = true;

    mount(
      renderClbrSidebar({
        children: "<p>Body</p>",
        id: "sidebar",
      }),
    );

    defineClbrSidebar();

    expect(document.body.querySelector('[data-part="close"]')).toBeNull();
  });

  it("stays closed above notebook when behavior is overlay", () => {
    installMatchMediaMock();

    mount(
      renderClbrSidebar({
        aboveNotebook: "overlay",
        children: "<p>Body</p>",
        id: "sidebar",
      }),
    );

    defineClbrSidebar();
    setAboveNotebook(true);

    const host = document.body.querySelector(
      CLBR_SIDEBAR_TAG_NAME,
    ) as HTMLElement;
    const trigger = getByRole(document.body, "button", {
      name: "Open sidebar",
    });

    expect(host.hasAttribute("data-open")).toBe(false);
    expect(host.hasAttribute("data-collapsed")).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("toggles collapsed state from the close button above notebook when behavior is collapsible", () => {
    installMatchMediaMock();
    mediaQueryMatches = true;

    mount(
      renderClbrSidebar({
        aboveNotebook: "collapsible",
        children: "<p>Body</p>",
        id: "sidebar",
      }),
    );

    defineClbrSidebar();

    const host = document.body.querySelector(
      CLBR_SIDEBAR_TAG_NAME,
    ) as HTMLElement;
    const close = getByRole(document.body, "button", {
      name: "Collapse sidebar",
    });

    expect(host.hasAttribute("data-open")).toBe(true);
    expect(host.hasAttribute("data-collapsed")).toBe(false);

    close.click();

    expect(host.hasAttribute("data-open")).toBe(true);
    expect(host.hasAttribute("data-collapsed")).toBe(true);

    close.click();

    expect(host.hasAttribute("data-open")).toBe(true);
    expect(host.hasAttribute("data-collapsed")).toBe(false);
  });
});
