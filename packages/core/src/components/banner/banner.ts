import { attrs, escapeHtml } from "../../helpers/html";
import type { ClbrStatusTone } from "../../types";
import { renderClbrButton } from "../button/button";
import { renderClbrLink } from "../link/link";

export const CLBR_BANNER_TAG_NAME = "clbr-banner";
export const CLBR_BANNER_EVENT_BEFORE_DISMISS = "clbr-banner-before-dismiss";
export const CLBR_BANNER_EVENT_DISMISS = "clbr-banner-dismiss";

const dismissibleLabelDefault = "Dismiss banner";

/** Props for the Calibrate banner renderer. */
export interface ClbrBannerProps {
  /**
   * Optional secondary link action rendered inline within the message.
   */
  action?: {
    href: string;
    label: string;
  };
  /**
   * Whether a dismiss control is injected by the runtime custom element.
   * In no-JS SSR output, dismissible banners remain visible.
   * @default true
   */
  dismissible?: boolean;
  /**
   * Accessible label for the runtime dismiss control.
   * Escaped before render. Serialized into `data-dismissible-label` as the
   * runtime bridge value used when upgrading SSR markup.
   * Ignored when `dismissible` is false.
   * @default "Dismiss banner"
   */
  dismissibleLabel?: string;
  /**
   * Banner body text content.
   * Escaped before render.
   */
  message: string;
  /**
   * Semantic message intent.
   */
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
  action,
  dismissible = true,
  dismissibleLabel = dismissibleLabelDefault,
  message,
  tone,
}: ClbrBannerProps): string {
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

  const actionMarkup = action
    ? ` ${renderClbrLink({
        href: action.href,
        label: action.label,
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
  output: {
    element: CLBR_BANNER_TAG_NAME,
    class: "banner",
    children: ["p.message", 'optional runtime div[data-part="close"]'],
  },
  props: {
    action: {
      required: false,
      shape: {
        href: {
          required: true,
          type: "string",
        },
        label: {
          required: true,
          type: "text",
        },
      },
      type: "object",
    },
    dismissible: {
      default: true,
      required: false,
      type: "boolean",
    },
    dismissibleLabel: {
      default: dismissibleLabelDefault,
      ignoredWhen: "dismissible is false",
      required: false,
      type: "string",
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
        when: "action is provided",
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
