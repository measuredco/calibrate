import { attrs, escapeHtml } from "../../helpers/html";
import type { ClbrStatusTone } from "../../types";
import { renderClbrButton } from "../button/button";
import { renderClbrLink } from "../link/link";

export const CLBR_BANNER_TAG_NAME = "clbr-banner";
export const CLBR_BANNER_EVENT_BEFORE_DISMISS = "clbr-banner-before-dismiss";
export const CLBR_BANNER_EVENT_DISMISS = "clbr-banner-dismiss";

const dismissibleLabelDefault = "Dismiss banner";

export interface ClbrBannerProps {
  /** URL for an optional secondary link action rendered inline within the message.
   * Must be provided together with `actionLabel`. */
  actionHref?: string;
  /** Text label for an optional secondary link action rendered inline within the message.
   * Must be provided together with `actionHref`. */
  actionLabel?: string;
  /** Whether the runtime custom element should inject a dismiss control. @default true */
  dismissible?: boolean;
  /** Accessible label for the runtime dismiss control. Ignored when not dismissible.
   * @default "Dismiss banner" */
  dismissibleLabel?: string;
  /** Banner body text (escaped before render). */
  message: string;
  /** Semantic message intent. */
  tone?: ClbrStatusTone;
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

/**
 * SSR renderer for the Calibrate banner component.
 *
 * Emits meaningful light-DOM HTML inside a `clbr-banner` host. When
 * `dismissible` is true, runtime hydration may add a dismiss button and remove
 * the host element when that control is activated, subject to the cancelable
 * before-dismiss event.
 *
 * @param props - Banner component props.
 * @returns HTML string for a `clbr-banner` host.
 */
export function renderClbrBanner({
  actionHref,
  actionLabel,
  dismissible = true,
  dismissibleLabel = dismissibleLabelDefault,
  message,
  tone,
}: ClbrBannerProps): string {
  if (Boolean(actionHref) !== Boolean(actionLabel)) {
    throw new Error("actionHref and actionLabel must be provided together.");
  }

  const normalizedDismissibleLabel =
    dismissibleLabel.trim() === "" ? dismissibleLabelDefault : dismissibleLabel;

  const bannerAttrs = attrs({
    class: "banner",
    "data-dismissible": dismissible,
    "data-dismissible-label": dismissible
      ? normalizedDismissibleLabel
      : undefined,
    "data-surface": "inverse",
    "data-tone": tone || undefined,
  });

  const actionMarkup =
    actionHref && actionLabel
      ? ` ${renderClbrLink({
          href: actionHref,
          label: actionLabel,
          underline: true,
        })}`
      : "";

  return `<${CLBR_BANNER_TAG_NAME} ${bannerAttrs}><p class="message">${escapeHtml(
    message,
  )}${actionMarkup}</p></${CLBR_BANNER_TAG_NAME}>`;
}

class ClbrBannerElement extends HTMLElement {
  #onClick = (event: Event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;
    if (!target.closest('[data-part="close"]')) return;

    const beforeDismissEvent = new CustomEvent(
      CLBR_BANNER_EVENT_BEFORE_DISMISS,
      {
        bubbles: true,
        cancelable: true,
      },
    );

    if (!this.dispatchEvent(beforeDismissEvent)) return;

    this.remove();
    this.dispatchEvent(
      new CustomEvent(CLBR_BANNER_EVENT_DISMISS, {
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
 * Defines the `clbr-banner` custom element runtime.
 *
 * Safe to call multiple times. Existing SSR-rendered `clbr-banner` hosts will
 * upgrade in place and, when dismissible, receive an interactive dismiss
 * control in light DOM.
 */
export function defineClbrBanner(): void {
  if (customElements.get(CLBR_BANNER_TAG_NAME)) return;

  customElements.define(CLBR_BANNER_TAG_NAME, ClbrBannerElement);
}

/** Declarative banner contract mirror for tooling, docs, and adapters. */
export const CLBR_BANNER_SPEC = {
  name: "banner",
  description: "Use `clbr-banner` to display a prominent site-wide message.",
  output: {
    element: CLBR_BANNER_TAG_NAME,
    class: "banner",
    children: ["p.message", 'optional runtime div[data-part="close"]'],
  },
  props: {
    actionHref: {
      description:
        "URL for an inline link action rendered after the `message`.",
      required: false,
      requiredWhen: "`actionLabel` is provided",
      type: "string",
    },
    actionLabel: {
      description:
        "Text label for an inline link action rendered after the `message`.",
      required: false,
      requiredWhen: "`actionHref` is provided",
      type: "text",
    },
    dismissible: {
      default: true,
      description: "Shows a dismiss control that removes the banner.",
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
    message: {
      description: "Body text of the banner.",
      required: true,
      type: "text",
    },
    tone: {
      description: "Semantic tone.",
      required: false,
      type: "enum",
      values: ["info", "success", "warning", "error"],
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "banner",
      },
      {
        behavior: "emit",
        target: "data-tone",
        value: "{tone}",
        when: "tone is provided",
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
    ],
    composition: [
      {
        behavior: "always",
        value: "p.message",
      },
      {
        behavior: "emit",
        value: "p.message > a.link",
        when: "actionHref and actionLabel are provided",
      },
      {
        behavior: "runtime",
        value: 'div[data-part="close"] > button',
        when: "dismissible is true and defineClbrBanner() has upgraded the host",
      },
      {
        behavior: "runtime",
        value: CLBR_BANNER_EVENT_BEFORE_DISMISS,
        when: "dismiss control is activated before removal; event is cancelable and bubbles",
      },
      {
        behavior: "runtime",
        value: CLBR_BANNER_EVENT_DISMISS,
        when: "banner has been removed after an allowed dismiss action; event bubbles",
      },
    ],
  },
} as const;
