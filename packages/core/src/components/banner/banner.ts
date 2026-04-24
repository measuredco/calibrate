import { type ClbrNode, serializeClbrNode } from "../../helpers/node";
import type { ClbrComponentSpec } from "../../spec";
import type { ClbrStatusTone } from "../../types";
import { renderClbrButton } from "../button/button";
import { buildClbrLink } from "../link/link";

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
 * Builds the IR tree for the Calibrate banner component.
 *
 * @param props - Banner component props.
 * @returns IR node for a `clbr-banner` host.
 */
export function buildClbrBanner({
  actionHref,
  actionLabel,
  dismissible = true,
  dismissibleLabel = dismissibleLabelDefault,
  message,
  tone,
}: ClbrBannerProps): ClbrNode {
  if (Boolean(actionHref) !== Boolean(actionLabel)) {
    throw new Error("actionHref and actionLabel must be provided together.");
  }

  const normalizedDismissibleLabel =
    dismissibleLabel.trim() === "" ? dismissibleLabelDefault : dismissibleLabel;

  const messageChildren: ClbrNode[] = [{ kind: "text", value: message }];

  if (actionHref && actionLabel) {
    messageChildren.push({ kind: "text", value: " " });
    messageChildren.push(
      buildClbrLink({
        href: actionHref,
        label: actionLabel,
        underline: true,
      }),
    );
  }

  return {
    kind: "element",
    tag: CLBR_BANNER_TAG_NAME,
    attrs: {
      class: "clbr-banner",
      "data-dismissible": dismissible,
      "data-dismissible-label": dismissible
        ? normalizedDismissibleLabel
        : undefined,
      "data-clbr-surface": "inverse",
      "data-tone": tone || undefined,
    },
    children: [
      {
        kind: "element",
        tag: "p",
        attrs: { class: "message" },
        children: messageChildren,
      },
    ],
  };
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
export function renderClbrBanner(props: ClbrBannerProps): string {
  return serializeClbrNode(buildClbrBanner(props));
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
          this.getAttribute("data-dismissible-label") ??
            dismissibleLabelDefault,
          this.ownerDocument,
        ),
      );
    }
  }

  customElements.define(CLBR_BANNER_TAG_NAME, ClbrBannerElement);
}

/** Declarative banner contract mirror for tooling, docs, and adapters. */
export const CLBR_BANNER_SPEC: ClbrComponentSpec = {
  name: "banner",
  description: "Use `banner` to display a prominent site-wide message.",
  output: { element: CLBR_BANNER_TAG_NAME, class: "clbr-banner" },
  content: { kind: "text", prop: "message" },
  props: {
    actionHref: {
      description:
        "URL for an inline link action rendered after the `message`.",
      requiredWhen: "`actionLabel` is provided",
      type: { kind: "string" },
    },
    actionLabel: {
      description:
        "Text label for an inline link action rendered after the `message`.",
      requiredWhen: "`actionHref` is provided",
      type: { kind: "text" },
    },
    dismissible: {
      default: true,
      description: "Shows a dismiss control that removes the banner.",
      type: { kind: "boolean" },
    },
    dismissibleLabel: {
      default: dismissibleLabelDefault,
      description: "Accessible label for the dismiss control.",
      ignoredWhen: "`dismissible` is false",
      type: { kind: "string" },
    },
    message: {
      description: "Body text of the banner.",
      required: true,
      type: { kind: "text" },
    },
    tone: {
      description: "Semantic tone.",
      type: {
        kind: "enum",
        values: ["info", "success", "warning", "error"],
      },
    },
  },
  events: {
    [CLBR_BANNER_EVENT_BEFORE_DISMISS]: {
      bubbles: true,
      cancelable: true,
      description:
        "Fired before the banner is removed by a dismiss action. Call `preventDefault()` to keep the banner mounted.",
    },
    [CLBR_BANNER_EVENT_DISMISS]: {
      bubbles: true,
      description:
        "Fired after the banner has been removed by an allowed dismiss action.",
    },
  },
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-clbr-surface",
        condition: { kind: "always" },
        value: { kind: "literal", text: "inverse" },
      },
      {
        target: { on: "host" },
        attribute: "data-tone",
        condition: { kind: "when-provided", prop: "tone" },
        value: { kind: "prop", prop: "tone" },
      },
      {
        target: { on: "host" },
        attribute: "data-dismissible",
        condition: { kind: "when-truthy", prop: "dismissible" },
      },
    ],
  },
};
