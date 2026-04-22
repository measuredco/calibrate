import { getByRole, queryByRole } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../testing/spec";
import {
  CLBR_BANNER_EVENT_BEFORE_DISMISS,
  CLBR_BANNER_EVENT_DISMISS,
  CLBR_BANNER_SPEC,
  CLBR_BANNER_TAG_NAME,
  defineClbrBanner,
  renderClbrBanner,
  type ClbrBannerProps,
} from "./banner";

function mountBanner(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

defineClbrBanner();

describe("renderClbrBanner", () => {
  it("renders the default banner contract", () => {
    const root = mountBanner(renderClbrBanner({ message: "Body copy" }));
    const banner = root.querySelector(CLBR_BANNER_TAG_NAME) as HTMLElement;

    expect(banner.tagName).toBe("CLBR-BANNER");
    expect(banner.className).toBe("clbr-banner");
    expect(banner.hasAttribute("data-tone")).toBe(false);
    expect(banner.hasAttribute("role")).toBe(false);
    expect(banner.hasAttribute("data-dismissible")).toBe(true);
    expect(banner.getAttribute("data-dismissible-label")).toBe(
      "Dismiss banner",
    );
    expect(banner.querySelector(".message")?.textContent?.trim()).toBe(
      "Body copy",
    );
    expect(banner.querySelector(".clbr-link")).toBeNull();
    expect(
      getByRole(root, "button", { name: "Dismiss banner" }),
    ).not.toBeNull();
  });

  it("renders an action link when provided", () => {
    const root = mountBanner(
      renderClbrBanner({
        actionHref: "/docs",
        actionLabel: "Learn more",
        message: "Body copy",
      }),
    );

    const action = getByRole(root, "link", { name: "Learn more" });
    expect(action.getAttribute("href")).toBe("/docs");
    expect(action.classList.contains("clbr-link")).toBe(true);
  });

  it("throws when actionHref and actionLabel are not provided together", () => {
    expect(() =>
      renderClbrBanner({ actionHref: "/docs", message: "Body copy" }),
    ).toThrow("actionHref and actionLabel must be provided together.");
    expect(() =>
      renderClbrBanner({ actionLabel: "Learn more", message: "Body copy" }),
    ).toThrow("actionHref and actionLabel must be provided together.");
  });

  it("renders dismissible attributes and tone when provided", () => {
    const root = mountBanner(
      renderClbrBanner({
        dismissible: true,
        dismissibleLabel: "Close banner",
        message: "Body copy",
        tone: "error",
      }),
    );
    const banner = root.querySelector(CLBR_BANNER_TAG_NAME) as HTMLElement;

    expect(banner.getAttribute("data-tone")).toBe("error");
    expect(banner.hasAttribute("data-dismissible")).toBe(true);
    expect(banner.getAttribute("data-dismissible-label")).toBe("Close banner");
  });

  it("escapes message text content", () => {
    const root = mountBanner(
      renderClbrBanner({
        message: 'Body <em>copy</em> <a href="/docs">docs</a>',
      }),
    );

    expect(root.querySelector(".message em")).toBeNull();
    expect(root.querySelector(".message .clbr-link")).toBeNull();
    expect(root.querySelector(".message")?.innerHTML).toContain("&lt;em&gt;");
  });

  it("escapes action label text", () => {
    const root = mountBanner(
      renderClbrBanner({
        actionHref: "/docs",
        actionLabel: "<strong>Learn more</strong>",
        message: "Body copy",
      }),
    );

    const action = root.querySelector(".clbr-link") as HTMLElement;
    expect(action.innerHTML).toContain(
      "&lt;strong&gt;Learn more&lt;/strong&gt;",
    );
    expect(action.querySelector("strong")).toBeNull();
  });
});

describe("defineClbrBanner", () => {
  it("upgrades dismissible SSR markup with a dismiss control", () => {
    const root = mountBanner(
      renderClbrBanner({ dismissible: true, message: "Body copy" }),
    );

    expect(
      getByRole(root, "button", { name: "Dismiss banner" }),
    ).not.toBeNull();
  });

  it("uses a custom dismiss label when provided", () => {
    const root = mountBanner(
      renderClbrBanner({
        dismissible: true,
        dismissibleLabel: "Close banner",
        message: "Body copy",
      }),
    );

    expect(getByRole(root, "button", { name: "Close banner" })).not.toBeNull();
  });

  it("falls back to the default dismiss label when provided as an empty string", () => {
    const root = mountBanner(
      renderClbrBanner({
        dismissible: true,
        dismissibleLabel: "",
        message: "Body copy",
      }),
    );
    const banner = root.querySelector(CLBR_BANNER_TAG_NAME) as HTMLElement;

    expect(banner.getAttribute("data-dismissible-label")).toBe(
      "Dismiss banner",
    );
    expect(
      getByRole(root, "button", { name: "Dismiss banner" }),
    ).not.toBeNull();
  });

  it("removes the banner when the dismiss control is clicked", async () => {
    const user = userEvent.setup();
    const root = mountBanner(
      renderClbrBanner({ dismissible: true, message: "Body copy" }),
    );

    await user.click(getByRole(root, "button", { name: "Dismiss banner" }));

    expect(root.querySelector(CLBR_BANNER_TAG_NAME)).toBeNull();
  });

  it("dispatches a cancelable before-dismiss event and a dismiss event", async () => {
    const user = userEvent.setup();
    const root = mountBanner(
      renderClbrBanner({ dismissible: true, message: "Body copy" }),
    );
    const banner = root.querySelector(CLBR_BANNER_TAG_NAME) as HTMLElement;

    const received: string[] = [];
    banner.addEventListener(CLBR_BANNER_EVENT_BEFORE_DISMISS, () => {
      received.push(CLBR_BANNER_EVENT_BEFORE_DISMISS);
    });
    banner.addEventListener(CLBR_BANNER_EVENT_DISMISS, () => {
      received.push(CLBR_BANNER_EVENT_DISMISS);
    });

    await user.click(getByRole(root, "button", { name: "Dismiss banner" }));

    expect(received).toEqual([
      CLBR_BANNER_EVENT_BEFORE_DISMISS,
      CLBR_BANNER_EVENT_DISMISS,
    ]);
  });

  it("does not remove the banner when before-dismiss is prevented", async () => {
    const user = userEvent.setup();
    const root = mountBanner(
      renderClbrBanner({ dismissible: true, message: "Body copy" }),
    );
    const banner = root.querySelector(CLBR_BANNER_TAG_NAME) as HTMLElement;

    let dismissFired = false;
    banner.addEventListener(CLBR_BANNER_EVENT_BEFORE_DISMISS, (event) => {
      event.preventDefault();
    });
    banner.addEventListener(CLBR_BANNER_EVENT_DISMISS, () => {
      dismissFired = true;
    });

    await user.click(getByRole(root, "button", { name: "Dismiss banner" }));

    expect(root.querySelector(CLBR_BANNER_TAG_NAME)).toBe(banner);
    expect(dismissFired).toBe(false);
  });

  it("does not inject a dismiss control when dismissible is false", () => {
    const root = mountBanner(
      renderClbrBanner({ dismissible: false, message: "Body copy" }),
    );

    expect(queryByRole(root, "button")).toBeNull();
  });
});

describeSpecConsistency<ClbrBannerProps>({
  baseProps: { message: "Body copy" },
  propOverrides: {
    actionHref: { actionLabel: "Learn more" },
    actionLabel: { actionHref: "/docs" },
  },
  renderer: renderClbrBanner,
  spec: CLBR_BANNER_SPEC,
});
