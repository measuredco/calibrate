import { renderClbrButton } from "../button/button";
import { attrs, escapeHtml } from "../../helpers/html";
import { renderClbrIcon } from "../icon/icon";

export const CLBR_ALERT_BEFORE_DISMISS_EVENT = "clbr-alert-before-dismiss";
export const CLBR_ALERT_DISMISS_EVENT = "clbr-alert-dismiss";
export const CLBR_ALERT_TAG_NAME = "clbr-alert";

const CLBR_ALERT_DEFAULT_DISMISSIBLE_LABEL = "Dismiss alert";

export type ClbrAlertInlineSize = "full" | "fit";
export type ClbrAlertTone = "info" | "success" | "warning" | "error";

/** Props for the Calibrate alert renderer. */
export interface ClbrAlertProps {
  /**
   * Whether a dismiss control is injected by the runtime custom element.
   * In no-JS SSR output, dismissible alerts remain visible.
   * @default false
   */
  dismissible?: boolean;
  /**
   * Accessible label for the runtime dismiss control.
   * Escaped before render. Serialized into `data-dismissible-label` as the
   * runtime bridge value used when upgrading SSR markup.
   * Ignored when `dismissible` is false.
   * @default "Dismiss alert"
   */
  dismissibleLabel?: string;
  /**
   * Alert body text content.
   * Escaped before render.
   */
  message: string;
  /**
   * Inline-size behavior.
   * `full` is default and emits no inline-size attribute.
   * `fit` emits `data-inline-size="fit"` on the alert host.
   * @default "full"
   */
  inlineSize?: ClbrAlertInlineSize;
  /**
   * Semantic message intent.
   */
  tone?: ClbrAlertTone;
  /**
   * Optional short heading/title text.
   * Escaped before render.
   */
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

function getAlertRole(tone?: ClbrAlertTone): "status" | "alert" {
  return tone === "warning" || tone === "error" ? "alert" : "status";
}

function getAlertIconName(tone?: ClbrAlertTone): string {
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
  dismissibleLabel = CLBR_ALERT_DEFAULT_DISMISSIBLE_LABEL,
  inlineSize = "full",
  message,
  tone,
  title,
}: ClbrAlertProps): string {
  const normalizedDismissibleLabel =
    dismissibleLabel.trim() === ""
      ? CLBR_ALERT_DEFAULT_DISMISSIBLE_LABEL
      : dismissibleLabel;

  const alertAttrs = attrs({
    class: "alert",
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
      CLBR_ALERT_BEFORE_DISMISS_EVENT,
      {
        bubbles: true,
        cancelable: true,
      },
    );

    if (!this.dispatchEvent(beforeDismissEvent)) return;

    this.remove();
    this.dispatchEvent(
      new CustomEvent(CLBR_ALERT_DISMISS_EVENT, {
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
        this.getAttribute("data-dismissible-label") ??
          CLBR_ALERT_DEFAULT_DISMISSIBLE_LABEL,
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
  output: {
    element: CLBR_ALERT_TAG_NAME,
    class: "alert",
    children: [
      "div.icon-wrapper",
      "div.content",
      'optional runtime div[data-part="close"]',
    ],
  },
  props: {
    dismissible: {
      default: false,
      required: false,
      type: "boolean",
    },
    dismissibleLabel: {
      default: CLBR_ALERT_DEFAULT_DISMISSIBLE_LABEL,
      ignoredWhen: "dismissible is false",
      required: false,
      type: "string",
    },
    inlineSize: {
      default: "full",
      required: false,
      type: "enum",
      values: ["full", "fit"],
    },
    message: {
      required: true,
      type: "text",
    },
    tone: {
      required: false,
      type: "enum",
      values: ["info", "success", "warning", "error"],
    },
    title: {
      required: false,
      type: "text",
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "alert",
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
      {
        behavior: "runtime",
        value: CLBR_ALERT_BEFORE_DISMISS_EVENT,
        when: "dismiss control is activated before removal; event is cancelable and bubbles",
      },
      {
        behavior: "runtime",
        value: CLBR_ALERT_DISMISS_EVENT,
        when: "alert has been removed after an allowed dismiss action; event bubbles",
      },
    ],
  },
} as const;
