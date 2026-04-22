import { attrs, escapeHtml } from "../../helpers/html";
import type { ClbrInlineSize, ClbrStatusTone } from "../../types";
import { renderClbrButton } from "../button/button";
import { renderClbrIcon } from "../icon/icon";

export const CLBR_ALERT_TAG_NAME = "clbr-alert";
export const CLBR_ALERT_EVENT_BEFORE_DISMISS = "clbr-alert-before-dismiss";
export const CLBR_ALERT_EVENT_DISMISS = "clbr-alert-dismiss";

const dismissibleLabelDefault = "Dismiss alert";

export interface ClbrAlertProps {
  /** Whether the runtime custom element should inject a dismiss control. @default false */
  dismissible?: boolean;
  /** Accessible label for the runtime dismiss control. Ignored when not dismissible. @default "Dismiss alert" */
  dismissibleLabel?: string;
  /** Inline-size behavior. @default "full" */
  inlineSize?: ClbrInlineSize;
  /** Alert body text (escaped before render). */
  message: string;
  /** Semantic message intent. */
  tone?: ClbrStatusTone;
  /** Optional short heading/title text (escaped before render). */
  title?: string;
}

function createDismissButtonElement(
  dismissibleLabel: string,
  document: Document,
): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("data-part", "close");
  wrapper.innerHTML = renderClbrButton({
    appearance: "text",
    icon: "X",
    label: dismissibleLabel,
    labelVisibility: "hidden",
    size: "sm",
    tone: "neutral",
  });
  return wrapper;
}

function getAlertIconName(tone?: ClbrStatusTone): string {
  switch (tone) {
    case "success":
      return "CircleCheck";
    case "warning":
      return "TriangleAlert";
    case "error":
      return "CircleAlert";
    case "info":
    default:
      return "Info";
  }
}

function getAlertRole(tone?: ClbrStatusTone): "status" | "alert" {
  return tone === "warning" || tone === "error" ? "alert" : "status";
}

/**
 * SSR renderer for the Calibrate alert component.
 *
 * Emits meaningful light-DOM HTML inside a `clbr-alert` host. When
 * `dismissible` is true, runtime hydration may add a dismiss button and remove
 * the host element when that control is activated, subject to the cancelable
 * before-dismiss event.
 *
 * @param props - Alert component props.
 * @returns HTML string for a `clbr-alert` host.
 */
export function renderClbrAlert({
  dismissible,
  dismissibleLabel = dismissibleLabelDefault,
  inlineSize = "full",
  message,
  tone,
  title,
}: ClbrAlertProps): string {
  const normalizedDismissibleLabel =
    dismissibleLabel.trim() === "" ? dismissibleLabelDefault : dismissibleLabel;

  const alertAttrs = attrs({
    class: "clbr-alert",
    "data-dismissible": dismissible,
    "data-dismissible-label": dismissible
      ? normalizedDismissibleLabel
      : undefined,
    "data-inline-size": inlineSize === "fit" ? "fit" : undefined,
    "data-tone": tone || undefined,
    role: getAlertRole(tone),
  });

  const titleMarkup = title ? `<p class="title">${escapeHtml(title)}</p>` : "";
  const iconMarkup = `<div class="icon-wrapper">${renderClbrIcon({
    ariaHidden: true,
    name: getAlertIconName(tone),
    size: "md",
  })}</div>`;

  return `<${CLBR_ALERT_TAG_NAME} ${alertAttrs}>${iconMarkup}<div class="content">${titleMarkup}<p class="message">${escapeHtml(
    message,
  )}</p></div></${CLBR_ALERT_TAG_NAME}>`;
}

class ClbrAlertElement extends HTMLElement {
  #onClick = (event: Event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;
    if (!target.closest('[data-part="close"]')) return;

    const beforeDismissEvent = new CustomEvent(
      CLBR_ALERT_EVENT_BEFORE_DISMISS,
      {
        bubbles: true,
        cancelable: true,
      },
    );

    if (!this.dispatchEvent(beforeDismissEvent)) return;

    this.remove();
    this.dispatchEvent(
      new CustomEvent(CLBR_ALERT_EVENT_DISMISS, {
        bubbles: true,
      }),
    );
  };

  connectedCallback(): void {
    this.removeEventListener("click", this.#onClick);

    if (!this.hasAttribute("data-dismissible")) return;

    this.#ensureDismissControl();
    this.addEventListener("click", this.#onClick);
  }

  disconnectedCallback(): void {
    this.removeEventListener("click", this.#onClick);
  }

  #ensureDismissControl(): void {
    if (this.querySelector('[data-part="close"]')) return;

    this.append(
      createDismissButtonElement(
        this.getAttribute("data-dismissible-label") ?? dismissibleLabelDefault,
        this.ownerDocument,
      ),
    );
  }
}

/**
 * Defines the `clbr-alert` custom element runtime.
 *
 * Safe to call multiple times. Existing SSR-rendered `clbr-alert` hosts will
 * upgrade in place and, when dismissible, receive an interactive dismiss
 * control in light DOM.
 */
export function defineClbrAlert(): void {
  if (customElements.get(CLBR_ALERT_TAG_NAME)) return;

  customElements.define(CLBR_ALERT_TAG_NAME, ClbrAlertElement);
}

/** Declarative alert contract mirror for tooling, docs, and adapters. */
export const CLBR_ALERT_SPEC = {
  name: "alert",
  description: "Use `alert` to surface short, important messages.",
  output: {
    element: CLBR_ALERT_TAG_NAME,
    class: "clbr-alert",
    children: [
      "div.icon-wrapper",
      "div.content",
      'optional runtime div[data-part="close"]',
    ],
  },
  props: {
    dismissible: {
      default: false,
      description: "Shows a dismiss control that removes the alert.",
      required: false,
      type: "boolean",
    },
    dismissibleLabel: {
      default: dismissibleLabelDefault,
      description: "Accessible label for the dismiss control.",
      ignoredWhen: "`dismissible` is false",
      required: false,
      type: "string",
    },
    inlineSize: {
      default: "full",
      description: "Whether the alert fills its container or shrinks to fit.",
      required: false,
      type: "enum",
      values: ["full", "fit"],
    },
    message: {
      description: "Body text of the alert.",
      required: true,
      type: "text",
    },
    tone: {
      description: "Semantic tone.",
      required: false,
      type: "enum",
      values: ["info", "success", "warning", "error"],
    },
    title: {
      description: "Bold text above the message.",
      required: false,
      type: "text",
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "clbr-alert",
      },
      {
        behavior: "emit",
        target: "data-tone",
        value: "{tone}",
        when: "tone is provided",
      },
      {
        behavior: "always",
        target: "role",
        value: "{role}",
      },
      {
        behavior: "emit",
        target: "data-dismissible",
        when: "dismissible is true",
      },
      {
        behavior: "emit",
        target: "data-dismissible-label",
        value: "{dismissibleLabel}",
        when: "dismissible is true",
      },
      {
        behavior: "emit",
        target: "data-inline-size",
        value: "fit",
        when: "inlineSize is fit",
      },
    ],
    composition: [
      {
        behavior: "always",
        value: "div.icon-wrapper",
      },
      {
        behavior: "always",
        value: "{toneIcon}",
        when: "inside div.icon-wrapper as a md icon",
      },
      {
        behavior: "always",
        value: "div.content",
      },
      {
        behavior: "emit",
        value: "p.title",
        when: "title is provided",
      },
      {
        behavior: "always",
        value: "p.message",
      },
      {
        behavior: "runtime",
        value: 'div[data-part="close"] > button',
        when: "dismissible is true and defineClbrAlert() has upgraded the host",
      },
    ],
  },
  events: {
    [CLBR_ALERT_EVENT_BEFORE_DISMISS]: {
      bubbles: true,
      cancelable: true,
      description:
        "Fired before the alert is removed by a dismiss action. Call `preventDefault()` to keep the alert mounted.",
    },
    [CLBR_ALERT_EVENT_DISMISS]: {
      bubbles: true,
      description:
        "Fired after the alert has been removed by an allowed dismiss action.",
    },
  },
} as const;
