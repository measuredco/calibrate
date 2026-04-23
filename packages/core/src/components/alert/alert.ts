import { attrs, escapeHtml } from "../../helpers/html";
import type { ClbrComponentSpec } from "../../helpers/spec";
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
export const CLBR_ALERT_SPEC: ClbrComponentSpec = {
  name: "alert",
  description: "Use `alert` to surface short, important messages.",
  output: {
    element: CLBR_ALERT_TAG_NAME,
    class: "clbr-alert",
  },
  content: {
    kind: "slots",
    slots: [
      { prop: "title", kind: "text" },
      { prop: "message", kind: "text" },
    ],
  },
  props: {
    dismissible: {
      default: false,
      description: "Shows a dismiss control that removes the alert.",
      type: { kind: "boolean" },
    },
    dismissibleLabel: {
      default: dismissibleLabelDefault,
      description: "Accessible label for the dismiss control.",
      ignoredWhen: "`dismissible` is false",
      type: { kind: "string" },
    },
    inlineSize: {
      default: "full",
      description: "Whether the alert fills its container or shrinks to fit.",
      type: { kind: "enum", values: ["full", "fit"] },
    },
    message: {
      description: "Body text of the alert.",
      required: true,
      type: { kind: "text" },
    },
    title: {
      description: "Bold text above the message.",
      type: { kind: "text" },
    },
    tone: {
      description: "Semantic tone.",
      type: { kind: "enum", values: ["info", "success", "warning", "error"] },
    },
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
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-tone",
        condition: { kind: "when-provided", prop: "tone" },
        value: { kind: "prop", prop: "tone" },
      },
      {
        target: { on: "host" },
        attribute: "role",
        condition: {
          kind: "when-in",
          prop: "tone",
          values: ["warning", "error"],
        },
        value: { kind: "literal", text: "alert" },
      },
      {
        target: { on: "host" },
        attribute: "role",
        condition: {
          kind: "not",
          of: {
            kind: "when-in",
            prop: "tone",
            values: ["warning", "error"],
          },
        },
        value: { kind: "literal", text: "status" },
      },
      {
        target: { on: "host" },
        attribute: "data-dismissible",
        condition: { kind: "when-truthy", prop: "dismissible" },
      },
      {
        target: { on: "host" },
        attribute: "data-dismissible-label",
        condition: {
          kind: "all",
          of: [
            { kind: "when-truthy", prop: "dismissible" },
            { kind: "when-non-empty", prop: "dismissibleLabel" },
          ],
        },
        value: { kind: "prop", prop: "dismissibleLabel" },
      },
      {
        target: { on: "host" },
        attribute: "data-dismissible-label",
        condition: {
          kind: "all",
          of: [
            { kind: "when-truthy", prop: "dismissible" },
            { kind: "not", of: { kind: "when-non-empty", prop: "dismissibleLabel" } },
          ],
        },
        value: { kind: "literal", text: dismissibleLabelDefault },
      },
      {
        target: { on: "host" },
        attribute: "data-inline-size",
        condition: { kind: "when-equals", prop: "inlineSize", to: "fit" },
        value: { kind: "literal", text: "fit" },
      },
    ],
  },
};
