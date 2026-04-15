import { describe, expect, it } from "vitest";
import {
  CLBR_BANNER_EVENT_BEFORE_DISMISS,
  CLBR_BANNER_EVENT_DISMISS,
  CLBR_BANNER_TAG_NAME,
  defineClbrBanner,
  renderClbrBanner,
} from "./banner";

function mountBanner(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(CLBR_BANNER_TAG_NAME) as HTMLElement;
}

defineClbrBanner();

describe("renderClbrBanner", () => {
  it("renders the default banner contract", () => {
    const banner = mountBanner(
      renderClbrBanner({
        message: "Body copy",
      }),
    );

    expect(banner.tagName).toBe("CLBR-BANNER");
    expect(banner.className).toBe("banner");
    expect(banner.hasAttribute("data-tone")).toBe(false);
    expect(banner.hasAttribute("role")).toBe(false);
    expect(banner.hasAttribute("data-dismissible")).toBe(true);
    expect(banner.getAttribute("data-dismissible-label")).toBe(
      "Dismiss banner",
    );
    expect(banner.querySelector(".message")?.textContent?.trim()).toBe(
      "Body copy",
    );
    expect(banner.querySelector(".link")).toBeNull();
    expect(banner.querySelector('[data-part="close"] .button')).not.toBeNull();
  });

  it("renders an action link when provided", () => {
    const banner = mountBanner(
      renderClbrBanner({
        action: {
          href: "/docs",
          label: "Learn more",
        },
        message: "Body copy",
      }),
    );

    const action = banner.querySelector(".link");

    expect(banner.querySelector(".message .link")).toBe(action);
    expect(action?.getAttribute("href")).toBe("/docs");
    expect(action?.textContent).toContain("Learn more");
  });

  it("renders dismissible attributes and tone when provided", () => {
    const banner = mountBanner(
      renderClbrBanner({
        dismissible: true,
        dismissibleLabel: "Close banner",
        message: "Body copy",
        tone: "error",
      }),
    );

    expect(banner.getAttribute("data-tone")).toBe("error");
    expect(banner.hasAttribute("data-dismissible")).toBe(true);
    expect(banner.getAttribute("data-dismissible-label")).toBe("Close banner");
  });

  it("escapes message text content", () => {
    const banner = mountBanner(
      renderClbrBanner({
        message: 'Body <em>copy</em> <a href="/docs">docs</a>',
      }),
    );

    expect(banner.querySelector(".message em")).toBeNull();
    expect(banner.querySelector(".message a")).toBeNull();
    expect(banner.querySelector(".message")?.innerHTML).toContain("&lt;em&gt;");
  });
});

describe("defineClbrBanner", () => {
  it("upgrades dismissible SSR markup with a dismiss control", () => {
    const banner = mountBanner(
      renderClbrBanner({
        dismissible: true,
        message: "Body copy",
      }),
    );

    expect(banner.querySelector('[data-part="close"] .button')).not.toBeNull();
    expect(
      banner.querySelector('[data-part="close"] .label')?.textContent,
    ).toBe("Dismiss banner");
  });

  it("uses a custom dismiss label when provided", () => {
    const banner = mountBanner(
      renderClbrBanner({
        dismissible: true,
        dismissibleLabel: "Close banner",
        message: "Body copy",
      }),
    );

    expect(
      banner.querySelector('[data-part="close"] .label')?.textContent,
    ).toBe("Close banner");
  });

  it("falls back to the default dismiss label when provided as an empty string", () => {
    const banner = mountBanner(
      renderClbrBanner({
        dismissible: true,
        dismissibleLabel: "",
        message: "Body copy",
      }),
    );

    expect(banner.getAttribute("data-dismissible-label")).toBe(
      "Dismiss banner",
    );
    expect(
      banner.querySelector('[data-part="close"] .label')?.textContent,
    ).toBe("Dismiss banner");
  });

  it("removes the banner when the dismiss control is clicked", () => {
    const banner = mountBanner(
      renderClbrBanner({
        dismissible: true,
        message: "Body copy",
      }),
    );

    const dismissButton = banner.querySelector(
      '[data-part="close"] .button',
    ) as HTMLButtonElement;

    dismissButton.click();

    expect(document.body.querySelector(CLBR_BANNER_TAG_NAME)).toBeNull();
  });

  it("dispatches a cancelable before-dismiss event and a dismiss event", () => {
    const banner = mountBanner(
      renderClbrBanner({
        dismissible: true,
        message: "Body copy",
      }),
    );

    const receivedEvents: string[] = [];

    banner.addEventListener(CLBR_BANNER_EVENT_BEFORE_DISMISS, () => {
      receivedEvents.push(CLBR_BANNER_EVENT_BEFORE_DISMISS);
    });

    banner.addEventListener(CLBR_BANNER_EVENT_DISMISS, () => {
      receivedEvents.push(CLBR_BANNER_EVENT_DISMISS);
    });

    const dismissButton = banner.querySelector(
      '[data-part="close"] .button',
    ) as HTMLButtonElement;

    dismissButton.click();

    expect(receivedEvents).toEqual([
      CLBR_BANNER_EVENT_BEFORE_DISMISS,
      CLBR_BANNER_EVENT_DISMISS,
    ]);
  });

  it("does not remove the banner when before-dismiss is prevented", () => {
    const banner = mountBanner(
      renderClbrBanner({
        dismissible: true,
        message: "Body copy",
      }),
    );

    let dismissEventFired = false;

    banner.addEventListener(CLBR_BANNER_EVENT_BEFORE_DISMISS, (event) => {
      event.preventDefault();
    });

    banner.addEventListener(CLBR_BANNER_EVENT_DISMISS, () => {
      dismissEventFired = true;
    });

    const dismissButton = banner.querySelector(
      '[data-part="close"] .button',
    ) as HTMLButtonElement;

    dismissButton.click();

    expect(document.body.querySelector(CLBR_BANNER_TAG_NAME)).toBe(banner);
    expect(dismissEventFired).toBe(false);
  });

  it("does not inject a dismiss control when dismissible is false", () => {
    const banner = mountBanner(
      renderClbrBanner({
        dismissible: false,
        message: "Body copy",
      }),
    );

    expect(banner.querySelector('[data-part="close"]')).toBeNull();
  });
});
