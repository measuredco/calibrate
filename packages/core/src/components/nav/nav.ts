import { attrs, escapeHtml, isValidHtmlId } from "../../helpers/html";
import { renderClbrExpander } from "../expander/expander";

export const CLBR_NAV_TAG_NAME = "clbr-nav";
export type ClbrNavCollapsible = "always" | "belowTablet";
export type ClbrNavExpanderPosition = "start" | "end";
export type ClbrNavSize = "sm" | "md";
const scrollLockAttr = "data-clbr-scroll-locked";

export interface ClbrNavItem {
  /** Emits `aria-current="page"` when true. @default false */
  current?: boolean;
  /** Link destination. */
  href: string;
  /** Link label (escaped before render). */
  label: string;
}

export interface ClbrNavProps {
  /** Collapsible nav behavior. Emits `data-collapsible` as a structural hook for runtime enhancement. */
  collapsible?: ClbrNavCollapsible;
  /** ID applied to `.content`; also used as expander `aria-controls`. Required when `collapsible` is set. */
  contentId?: string;
  /** Accessible label for the runtime expander button when `collapsible` is set. */
  expanderLabel?: string;
  /** Expander placement when collapsible. @default "start" */
  expanderPosition?: ClbrNavExpanderPosition;
  /** Nav items rendered as semantic list links. */
  items: ClbrNavItem[];
  /** Accessible nav label. */
  label?: string;
  /** Size variant. @default "md" */
  size?: ClbrNavSize;
}

/**
 * SSR renderer for the Calibrate nav component.
 *
 * Emits semantic `nav > ul > li > a` markup inside a `clbr-nav` host. When
 * `collapsible` is provided, the renderer emits structural hooks only;
 * interactive expander/menu behavior is deferred to custom element upgrade.
 *
 * @param props - Nav component props.
 * @returns HTML string for a nav wrapper.
 */
export function renderClbrNav({
  collapsible,
  contentId,
  expanderLabel,
  expanderPosition = "start",
  items,
  label,
  size = "md",
}: ClbrNavProps): string {
  const normalizedExpanderLabel = expanderLabel?.trim() || undefined;
  const normalizedContentId = contentId?.trim();

  if (collapsible && !normalizedContentId) {
    throw new Error("contentId must be a non-empty string when collapsible is set.");
  }

  if (normalizedContentId && !isValidHtmlId(normalizedContentId)) {
    throw new Error(
      "contentId must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  }

  const navAttrs = attrs({
    class: "nav",
    "aria-label": label || undefined,
    "data-collapsible": collapsible,
    "data-expander-label":
      collapsible && normalizedExpanderLabel
        ? normalizedExpanderLabel
        : undefined,
    "data-expander-position": collapsible ? expanderPosition : undefined,
    "data-size": size,
  });

  const listMarkup = items
    .map((item) => {
      const linkAttrs = attrs({
        "aria-current": item.current ? "page" : undefined,
        class: "item",
        href: item.href,
      });

      return `<li><a ${linkAttrs}>${escapeHtml(item.label)}</a></li>`;
    })
    .join("");

  const contentAttrs = attrs({
    class: "content",
    id: normalizedContentId,
  });

  return `<${CLBR_NAV_TAG_NAME}><nav ${navAttrs}><div ${contentAttrs}><ul class="list">${listMarkup}</ul></div></nav></${CLBR_NAV_TAG_NAME}>`;
}

class ClbrNavElement extends HTMLElement {
  #onClick?: (event: Event) => void;
  #mediaQueryList?: MediaQueryList;
  #onKeyDown?: (event: KeyboardEvent) => void;
  #onMediaQueryChange?: (event: MediaQueryListEvent) => void;

  connectedCallback(): void {
    this.#teardownClickListener();
    this.#teardownRuntimeListeners();
    this.#ensureExpander();
    this.#setupClickListener();
    this.#setupRuntimeListeners();
  }

  disconnectedCallback(): void {
    this.#setExpanded(false);
    this.#teardownClickListener();
    this.#teardownRuntimeListeners();
  }

  #getNav(): HTMLElement | null {
    return this.querySelector<HTMLElement>(".nav[data-collapsible]");
  }

  #getExpanderButton(): HTMLButtonElement | null {
    return this.querySelector<HTMLButtonElement>(
      '[data-part="expander"] .expander',
    );
  }

  #ensureExpander(): void {
    const nav = this.#getNav();

    if (!nav) return;
    if (nav.querySelector('[data-part="expander"]')) return;

    const content = nav.querySelector<HTMLElement>(".content");

    if (!content) return;

    nav.insertAdjacentHTML(
      "afterbegin",
      `<div data-part="expander">${renderClbrExpander({
        controlsId: content.id || undefined,
        label: nav.getAttribute("data-expander-label") || undefined,
        size: nav.getAttribute("data-size") === "sm" ? "md" : "lg",
      })}</div>`,
    );
  }

  #setExpanded(expanded: boolean): void {
    const button = this.#getExpanderButton();

    if (!button) return;

    const isOpen = button.getAttribute("aria-expanded") === "true";

    if (isOpen === expanded) return;

    button.setAttribute("aria-expanded", expanded ? "true" : "false");
    this.#setScrollLocked(expanded);
  }

  #setupClickListener(): void {
    this.#onClick = (event: Event) => {
      const target = event.target;

      if (!(target instanceof Element)) return;
      if (!target.closest('[data-part="expander"] .expander')) return;

      const button = this.#getExpanderButton();

      if (!button) return;

      this.#setExpanded(button.getAttribute("aria-expanded") !== "true");
    };

    this.addEventListener("click", this.#onClick);
  }

  #setupRuntimeListeners(): void {
    const nav = this.#getNav();
    const windowRef = this.ownerDocument.defaultView;

    if (!nav || !windowRef) return;

    this.#onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" && event.key !== "Esc") return;
      this.#setExpanded(false);
    };

    windowRef.addEventListener("keydown", this.#onKeyDown);

    if (nav.getAttribute("data-collapsible") !== "belowTablet") return;
    if (typeof windowRef.matchMedia !== "function") return;

    const mediaQueryList = windowRef.matchMedia("(min-width: 48em)");

    this.#mediaQueryList = mediaQueryList;
    this.#onMediaQueryChange = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      this.#setExpanded(false);
    };

    mediaQueryList.addEventListener("change", this.#onMediaQueryChange);
  }

  #setScrollLocked(locked: boolean): void {
    const root = this.ownerDocument.documentElement;

    if (!root) return;

    if (locked) {
      root.setAttribute(scrollLockAttr, "");
      return;
    }

    root.removeAttribute(scrollLockAttr);
  }

  #teardownClickListener(): void {
    if (!this.#onClick) return;

    this.removeEventListener("click", this.#onClick);
    this.#onClick = undefined;
  }

  #teardownRuntimeListeners(): void {
    const windowRef = this.ownerDocument.defaultView;

    if (this.#onKeyDown && windowRef) {
      windowRef.removeEventListener("keydown", this.#onKeyDown);
    }

    if (this.#mediaQueryList && this.#onMediaQueryChange) {
      this.#mediaQueryList.removeEventListener(
        "change",
        this.#onMediaQueryChange,
      );
    }

    this.#onKeyDown = undefined;
    this.#onMediaQueryChange = undefined;
    this.#mediaQueryList = undefined;
  }
}

/**
 * Defines the `clbr-nav` custom element runtime.
 *
 * Safe to call multiple times. Existing SSR-rendered `clbr-nav` hosts upgrade
 * in place and receive collapsible runtime behavior when configured.
 */
export function defineClbrNav(): void {
  if (customElements.get(CLBR_NAV_TAG_NAME)) return;

  customElements.define(CLBR_NAV_TAG_NAME, ClbrNavElement);
}

/** Declarative nav contract mirror for tooling, docs, and adapters. */
export const CLBR_NAV_SPEC = {
  name: "nav",
  description: "Use `clbr-nav` to render a primary navigation list.",
  output: {
    element: CLBR_NAV_TAG_NAME,
    class: "nav (inner)",
    children: [
      "nav.nav",
      "nav.nav > div.content",
      "nav.nav > div.content > ul.list > li > a",
      "optional runtime div[data-part='expander'] > button.expander",
    ],
  },
  props: {
    items: {
      description: "Nav links shown in the list.",
      required: true,
      type: "array",
      shape: {
        href: {
          required: true,
          type: "string",
        },
        label: {
          required: true,
          type: "text",
        },
        current: {
          default: false,
          required: false,
          type: "boolean",
        },
      },
    },
    label: {
      description: "Accessible label for the nav landmark.",
      required: false,
      type: "string",
    },
    expanderLabel: {
      description: "Accessible label for the collapsible expander button.",
      required: false,
      type: "string",
    },
    expanderPosition: {
      default: "start",
      description: "Where the expander sits within the compostion.",
      required: false,
      type: "enum",
      values: ["start", "end"],
    },
    collapsible: {
      description: "When to collapse the nav behind an expander.",
      required: false,
      type: "enum",
      values: ["always", "belowTablet"],
    },
    contentId: {
      constraints: ["validHtmlId"],
      description: "HTML id for the collapsible content region.",
      required: false,
      requiredWhen: "collapsible is provided",
      type: "string",
    },
    size: {
      default: "md",
      description: "Size variant.",
      required: false,
      type: "enum",
      values: ["sm", "md"],
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "class",
        value: "nav",
      },
      {
        behavior: "emit",
        target: "aria-label",
        value: "{label}",
        when: "label is provided",
      },
      {
        behavior: "emit",
        target: "data-collapsible",
        value: "{collapsible}",
        when: "collapsible is always or belowTablet",
      },
      {
        behavior: "emit",
        target: "data-expander-position",
        value: "{expanderPosition}",
        when: "collapsible is always or belowTablet",
      },
      {
        behavior: "emit",
        target: ".content@id",
        value: "{contentId}",
        when: "contentId is provided",
      },
      {
        behavior: "emit",
        target: "data-expander-label",
        value: "{expanderLabel}",
        when: "collapsible is provided and expanderLabel is non-empty",
      },
      {
        behavior: "always",
        target: "data-size",
        value: "{size}",
      },
    ],
    composition: [
      {
        behavior: "always",
        value: "div.content",
      },
      {
        behavior: "always",
        value: "div.content > ul.list",
      },
      {
        behavior: "always",
        value: "div.content > ul.list > li > a",
      },
      {
        behavior: "runtime",
        value: 'div[data-part="expander"] > button.expander',
        when: "collapsible is provided and defineClbrNav() has upgraded the host",
      },
      {
        behavior: "runtime",
        value: 'button.expander[aria-expanded="false" | "true"]',
        when: "collapsible is provided and defineClbrNav() has upgraded the host",
      },
      {
        behavior: "runtime",
        value: "Escape closes expanded nav",
        when: "defineClbrNav() has upgraded the host",
      },
      {
        behavior: "runtime",
        value:
          "belowTablet nav closes when viewport crosses to min-width: 48em",
        when: 'collapsible is "belowTablet" and matchMedia is available',
      },
      {
        behavior: "emit",
        value: 'a[aria-current=\"page\"]',
        when: "item.current is true",
      },
    ],
  },
} as const;
