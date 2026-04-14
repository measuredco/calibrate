import { describe, expect, it } from "vitest";
import {
  CLBR_ALERT_EVENT_BEFORE_DISMISS,
  CLBR_ALERT_EVENT_DISMISS,
  CLBR_ALERT_TAG_NAME,
  defineClbrAlert,
  renderClbrAlert,
} from "./alert";

function mountAlert(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(CLBR_ALERT_TAG_NAME) as HTMLElement;
}

defineClbrAlert();

describe("renderClbrAlert", () => {
  it("renders the default alert contract", () => {
    const alert = mountAlert(
      renderClbrAlert({
        message: "Body copy",
      }),
    );

    expect(alert.tagName).toBe("CLBR-ALERT");
    expect(alert.className).toBe("alert");
    expect(alert.hasAttribute("data-tone")).toBe(false);
    expect(alert.getAttribute("role")).toBe("status");
    expect(alert.hasAttribute("data-dismissible")).toBe(false);
    expect(alert.hasAttribute("data-inline-size")).toBe(false);
    expect(alert.querySelector(".icon-wrapper .icon")).not.toBeNull();
    expect(alert.querySelector(".title")).toBeNull();
    expect(alert.querySelector(".message")?.textContent).toBe("Body copy");
  });

  it("renders an optional title and dismissible attributes", () => {
    const alert = mountAlert(
      renderClbrAlert({
        dismissible: true,
        dismissibleLabel: "Close message",
        message: "Body copy",
        title: "Alert title",
        tone: "error",
      }),
    );

    expect(alert.querySelector(".title")?.textContent).toBe("Alert title");
    expect(alert.getAttribute("data-tone")).toBe("error");
    expect(alert.getAttribute("role")).toBe("alert");
    expect(alert.hasAttribute("data-dismissible")).toBe(true);
    expect(alert.getAttribute("data-dismissible-label")).toBe("Close message");
    expect(alert.querySelector(".icon-wrapper .icon")).not.toBeNull();
  });

  it("emits data-inline-size when inlineSize is fit", () => {
    const alert = mountAlert(
      renderClbrAlert({
        inlineSize: "fit",
        message: "Body copy",
      }),
    );

    expect(alert.getAttribute("data-inline-size")).toBe("fit");
  });
});

describe("defineClbrAlert", () => {
  it("upgrades dismissible SSR markup with a dismiss control", () => {
    const alert = mountAlert(
      renderClbrAlert({
        dismissible: true,
        message: "Body copy",
      }),
    );

    expect(alert.querySelector('[data-part="close"] .button')).not.toBeNull();
    expect(alert.querySelector('[data-part="close"] .label')?.textContent).toBe(
      "Dismiss alert",
    );
  });

  it("uses a custom dismiss label when provided", () => {
    const alert = mountAlert(
      renderClbrAlert({
        dismissible: true,
        dismissibleLabel: "Close message",
        message: "Body copy",
      }),
    );

    expect(alert.querySelector('[data-part="close"] .label')?.textContent).toBe(
      "Close message",
    );
  });

  it("falls back to the default dismiss label when provided as an empty string", () => {
    const alert = mountAlert(
      renderClbrAlert({
        dismissible: true,
        dismissibleLabel: "",
        message: "Body copy",
      }),
    );

    expect(alert.getAttribute("data-dismissible-label")).toBe("Dismiss alert");
    expect(alert.querySelector('[data-part="close"] .label')?.textContent).toBe(
      "Dismiss alert",
    );
  });

  it("removes the alert when the dismiss control is clicked", () => {
    const alert = mountAlert(
      renderClbrAlert({
        dismissible: true,
        message: "Body copy",
      }),
    );

    const dismissButton = alert.querySelector(
      '[data-part="close"] .button',
    ) as HTMLButtonElement;

    dismissButton.click();

    expect(document.body.querySelector(CLBR_ALERT_TAG_NAME)).toBeNull();
  });

  it("dispatches a cancelable before-dismiss event and a dismiss event", () => {
    const alert = mountAlert(
      renderClbrAlert({
        dismissible: true,
        message: "Body copy",
      }),
    );

    const receivedEvents: string[] = [];

    alert.addEventListener(CLBR_ALERT_EVENT_BEFORE_DISMISS, () => {
      receivedEvents.push(CLBR_ALERT_EVENT_BEFORE_DISMISS);
    });

    alert.addEventListener(CLBR_ALERT_EVENT_DISMISS, () => {
      receivedEvents.push(CLBR_ALERT_EVENT_DISMISS);
    });

    const dismissButton = alert.querySelector(
      '[data-part="close"] .button',
    ) as HTMLButtonElement;

    dismissButton.click();

    expect(receivedEvents).toEqual([
      CLBR_ALERT_EVENT_BEFORE_DISMISS,
      CLBR_ALERT_EVENT_DISMISS,
    ]);
  });

  it("does not remove the alert when before-dismiss is prevented", () => {
    const alert = mountAlert(
      renderClbrAlert({
        dismissible: true,
        message: "Body copy",
      }),
    );

    let dismissEventFired = false;

    alert.addEventListener(CLBR_ALERT_EVENT_BEFORE_DISMISS, (event) => {
      event.preventDefault();
    });

    alert.addEventListener(CLBR_ALERT_EVENT_DISMISS, () => {
      dismissEventFired = true;
    });

    const dismissButton = alert.querySelector(
      '[data-part="close"] .button',
    ) as HTMLButtonElement;

    dismissButton.click();

    expect(document.body.querySelector(CLBR_ALERT_TAG_NAME)).toBe(alert);
    expect(dismissEventFired).toBe(false);
  });

  it("does not inject a dismiss control for non-dismissible alerts", () => {
    const alert = mountAlert(
      renderClbrAlert({
        message: "Body copy",
      }),
    );

    expect(alert.querySelector('[data-part="close"]')).toBeNull();
  });
});
