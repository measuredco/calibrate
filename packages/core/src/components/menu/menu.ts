import { attrs, escapeHtml, isValidHtmlId } from "../../helpers/html";
import type { ClbrControlSize } from "../../types";
import {
  type ClbrButtonLabelVisibility,
  type ClbrButtonPlacement,
  renderClbrButton,
} from "../button/button";
import type { ClbrIconMirrorMode } from "../icon/icon";

export const CLBR_MENU_TAG_NAME = "clbr-menu";
export const CLBR_MENU_EVENT_CHOOSE = "clbr-menu-choose";
export type ClbrMenuAlign = "start" | "end";

export interface ClbrMenuItem {
  /** Disables selection for this item. */
  disabled?: boolean;
  /** Optional authored identifier surfaced in the choose event payload. */
  id?: string;
  /** Visible item label text. Escaped before render. */
  label: string;
}

export interface ClbrMenuProps {
  /** Popup alignment relative to the trigger. @default "start" */
  align?: ClbrMenuAlign;
  /** Required HTML id seed for the menu popup and trigger relationship. */
  id: string;
  /** Action items rendered inside the popup menu. */
  items: ClbrMenuItem[];
  /** Control size applied to the host and composed trigger button. @default "md" */
  size?: ClbrControlSize;
  /** Icon name for the trigger button. */
  triggerIcon?: string;
  /** Icon mirroring mode for the trigger button icon. */
  triggerIconMirrored?: ClbrIconMirrorMode;
  /** Icon placement within the trigger button. @default "start" */
  triggerIconPlacement?: ClbrButtonPlacement;
  /** Accessible and visible trigger label text. Escaped before render. */
  triggerLabel: string;
  /** Trigger label visibility treatment. @default "visible" */
  triggerLabelVisibility?: ClbrButtonLabelVisibility;
}

/**
 * SSR renderer for the Calibrate menu component.
 *
 * Emits a `clbr-menu` host containing a trigger button and a semantic
 * `role="menu"` menu of button actions. Interactive open/close, focus
 * management, and choose events are deferred to custom element upgrade.
 *
 * @param props - Menu component props.
 * @returns HTML string for a `clbr-menu` host.
 */
export function renderClbrMenu({
  align = "start",
  id,
  items,
  size = "md",
  triggerIcon,
  triggerIconMirrored,
  triggerIconPlacement,
  triggerLabel,
  triggerLabelVisibility,
}: ClbrMenuProps): string {
  const normalizedId = id.trim();

  if (!normalizedId) {
    throw new Error("id must be a non-empty string.");
  }

  if (!isValidHtmlId(normalizedId)) {
    throw new Error(
      "id must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  }

  if (!Array.isArray(items)) {
    throw new Error("items must be an array.");
  }

  const triggerId = `${normalizedId}-button`;
  const menuId = `${normalizedId}-popup`;
  const hostAttrs = attrs({
    "data-align": align === "start" ? undefined : align,
    "data-size": size === "md" ? undefined : size,
  });
  const menuWrapperAttrs = attrs({
    class: "menu",
  });
  const menuAttrs = attrs({
    "aria-labelledby": triggerId,
    class: "popup",
    hidden: true,
    id: menuId,
    role: "menu",
  });
  const triggerMarkup = renderClbrButton({
    appearance: "outline",
    controls: menuId,
    disclosure: true,
    haspopup: "menu",
    icon: triggerIcon,
    iconMirrored: triggerIconMirrored,
    iconPlacement: triggerIconPlacement,
    id: triggerId,
    label: triggerLabel,
    labelVisibility: triggerLabelVisibility,
    mode: "button",
    size,
    tone: "neutral",
    type: "button",
  });
  const itemsMarkup = items
    .map((item) => {
      const itemAttrs = attrs({
        "aria-disabled": item.disabled ? "true" : undefined,
        "data-item-id": item.id || undefined,
        role: "menuitem",
        tabindex: "-1",
        type: "button",
      });

      return `<button ${itemAttrs}>${escapeHtml(item.label)}</button>`;
    })
    .join("");

  return `<${CLBR_MENU_TAG_NAME} ${hostAttrs}><div ${menuWrapperAttrs}><div data-part="trigger">${triggerMarkup}</div><div ${menuAttrs}>${itemsMarkup}</div></div></${CLBR_MENU_TAG_NAME}>`;
}

class ClbrMenuElement extends HTMLElement {
  #onClick?: (event: Event) => void;
  #onDocumentClick?: (event: Event) => void;
  #onFocusOut?: (event: FocusEvent) => void;
  #onKeyDown?: (event: KeyboardEvent) => void;

  connectedCallback(): void {
    this.#teardownListeners();
    this.#close(false);
    this.#setupListeners();
  }

  disconnectedCallback(): void {
    this.#teardownListeners();
  }

  #getTriggerButton(): HTMLButtonElement | null {
    return this.querySelector<HTMLButtonElement>(
      '[data-part="trigger"] .button',
    );
  }

  #getMenu(): HTMLElement | null {
    return this.querySelector<HTMLElement>('[role="menu"]');
  }

  #getMenuItems(): HTMLButtonElement[] {
    return Array.from(
      this.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'),
    );
  }

  #isMenuItemDisabled(item: HTMLButtonElement): boolean {
    return item.getAttribute("aria-disabled") === "true";
  }

  #isOpen(): boolean {
    return this.hasAttribute("data-open");
  }

  #setFocusedItem(index: number): void {
    const items = this.#getMenuItems();

    if (items.length === 0) return;

    const normalizedIndex =
      ((index % items.length) + items.length) % items.length;

    items[normalizedIndex]?.focus();
  }

  #open(focusIndex = 0): void {
    const menu = this.#getMenu();
    const trigger = this.#getTriggerButton();

    if (!menu || !trigger) return;

    menu.hidden = false;
    this.setAttribute("data-open", "");
    trigger.setAttribute("aria-expanded", "true");
    this.#setFocusedItem(focusIndex);
  }

  #close(restoreTriggerFocus = false): void {
    const menu = this.#getMenu();
    const trigger = this.#getTriggerButton();

    if (!menu || !trigger) return;

    menu.hidden = true;
    this.removeAttribute("data-open");
    trigger.setAttribute("aria-expanded", "false");

    if (restoreTriggerFocus) {
      trigger.focus();
    }
  }

  #choose(item: HTMLButtonElement): void {
    const allItems = Array.from(
      this.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'),
    );
    const index = allItems.indexOf(item);

    this.dispatchEvent(
      new CustomEvent(CLBR_MENU_EVENT_CHOOSE, {
        bubbles: true,
        detail: {
          id: item.getAttribute("data-item-id") || undefined,
          index,
          label: item.textContent || "",
        },
      }),
    );
  }

  #setupListeners(): void {
    this.#onClick = (event: Event) => {
      const target = event.target;

      if (!(target instanceof Element)) return;

      if (target.closest('[data-part="trigger"] .button')) {
        if (this.#isOpen()) {
          this.#close();
          return;
        }

        this.#open(0);
        return;
      }

      const menuItem = target.closest<HTMLButtonElement>('[role="menuitem"]');

      if (menuItem && this.contains(menuItem)) {
        if (!this.#isMenuItemDisabled(menuItem)) {
          this.#choose(menuItem);
          this.#close(true);
        }
        return;
      }
    };

    this.#onDocumentClick = (event: Event) => {
      const target = event.target;

      if (!(target instanceof Node)) return;

      if (this.#isOpen() && !this.contains(target)) {
        this.#close();
      }
    };

    this.#onKeyDown = (event: KeyboardEvent) => {
      const trigger = this.#getTriggerButton();
      const menu = this.#getMenu();

      if (!trigger || !menu) return;

      if ((event.key === "Escape" || event.key === "Esc") && this.#isOpen()) {
        event.preventDefault();
        this.#close(true);
        return;
      }

      const activeElement = this.ownerDocument.activeElement;
      const items = this.#getMenuItems();
      const currentIndex = items.indexOf(activeElement as HTMLButtonElement);

      if (activeElement === trigger) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          this.#open(0);
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          this.#open(0);
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          this.#open(items.length - 1);
        }

        return;
      }

      if (!menu.contains(activeElement)) return;

      if (
        activeElement instanceof HTMLButtonElement &&
        (event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault();

        if (!this.#isMenuItemDisabled(activeElement)) {
          this.#choose(activeElement);
          this.#close(true);
        }

        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        this.#setFocusedItem(currentIndex + 1);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        this.#setFocusedItem(currentIndex - 1);
      }

      if (event.key === "Home") {
        event.preventDefault();
        this.#setFocusedItem(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        this.#setFocusedItem(items.length - 1);
      }

      if (event.key === "Tab") {
        this.#close(false);
      }
    };

    this.#onFocusOut = (event: FocusEvent) => {
      const nextTarget = event.relatedTarget;

      if (!(nextTarget instanceof Node)) {
        this.#close();
        return;
      }

      if (!this.contains(nextTarget)) {
        this.#close();
      }
    };

    this.addEventListener("click", this.#onClick);
    this.addEventListener("keydown", this.#onKeyDown);
    this.addEventListener("focusout", this.#onFocusOut);
    this.ownerDocument.addEventListener("click", this.#onDocumentClick);
  }

  #teardownListeners(): void {
    if (this.#onClick) {
      this.removeEventListener("click", this.#onClick);
    }

    if (this.#onDocumentClick) {
      this.ownerDocument.removeEventListener("click", this.#onDocumentClick);
    }

    if (this.#onKeyDown) {
      this.removeEventListener("keydown", this.#onKeyDown);
    }

    if (this.#onFocusOut) {
      this.removeEventListener("focusout", this.#onFocusOut);
    }

    this.#onClick = undefined;
    this.#onDocumentClick = undefined;
    this.#onFocusOut = undefined;
    this.#onKeyDown = undefined;
  }
}

/**
 * Defines the `clbr-menu` custom element runtime.
 *
 * Safe to call multiple times. Existing SSR-rendered `clbr-menu` hosts upgrade
 * in place and receive menu interaction behavior.
 */
export function defineClbrMenu(): void {
  if (customElements.get(CLBR_MENU_TAG_NAME)) return;

  customElements.define(CLBR_MENU_TAG_NAME, ClbrMenuElement);
}

/** Declarative menu contract mirror for tooling, docs, and adapters. */
export const CLBR_MENU_SPEC = {
  name: "menu",
  description:
    "Use `clbr-menu` to show a list of actions from a trigger button.",
  output: {
    element: CLBR_MENU_TAG_NAME,
    children: [
      "div.menu",
      'div[data-part="trigger"] > button.button',
      'div.popup[role="menu"] > button[role="menuitem"]',
    ],
  },
  props: {
    align: {
      default: "start",
      description: "Popup alignment relative to the trigger.",
      required: false,
      type: "enum",
      values: ["start", "end"],
    },
    id: {
      constraints: ["non-empty", "validHtmlId"],
      description: "HTML id seed used for the trigger and popup.",
      required: true,
      type: "string",
    },
    items: {
      description: "Action items listed inside the popup.",
      required: true,
      type: "array",
      shape: {
        disabled: {
          default: false,
          required: false,
          type: "boolean",
        },
        id: {
          required: false,
          type: "string",
        },
        label: {
          required: true,
          type: "text",
        },
      },
    },
    size: {
      default: "md",
      description: "Size variant.",
      required: false,
      type: "enum",
      values: ["sm", "md"],
    },
    triggerIcon: {
      description: "Icon name for the trigger button.",
      required: false,
      type: "iconName",
    },
    triggerIconMirrored: {
      description: "Icon mirroring mode for the trigger button icon.",
      required: false,
      type: "enum",
      values: ["always", "rtl"],
    },
    triggerIconPlacement: {
      default: "start",
      description: "Icon placement within the trigger button.",
      required: false,
      type: "enum",
      values: ["start", "end"],
    },
    triggerLabel: {
      description: "Accessible and visible trigger label text.",
      required: true,
      type: "text",
    },
    triggerLabelVisibility: {
      default: "visible",
      description: "Trigger label visibility treatment.",
      required: false,
      type: "enum",
      values: ["visible", "hidden", "hiddenBelowTablet"],
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "div.menu@class",
        value: "menu",
      },
      {
        behavior: "always",
        target: 'div[data-part="trigger"] > button@id',
        value: "{id}-button",
      },
      {
        behavior: "always",
        target: "div.popup@aria-labelledby",
        value: "{id}-button",
      },
      {
        behavior: "always",
        target: "div.popup@id",
        value: "{id}-popup",
      },
      {
        behavior: "emit",
        target: `${CLBR_MENU_TAG_NAME}@data-align`,
        value: "{align}",
        when: "align is 'end'",
      },
      {
        behavior: "emit",
        target: `${CLBR_MENU_TAG_NAME}@data-size`,
        value: "{size}",
        when: "size is not 'md'",
      },
      {
        behavior: "always",
        target: "div.popup@role",
        value: "menu",
      },
      {
        behavior: "always",
        target: "div.popup@hidden",
        value: "true",
      },
    ],
    composition: [
      {
        behavior: "always",
        value:
          "renderClbrButton({ appearance: 'outline', controls: `${id}-popup`, disclosure: true, haspopup: 'menu', icon: triggerIcon, iconMirrored: triggerIconMirrored, iconPlacement: triggerIconPlacement, id: `${id}-button`, label: triggerLabel, labelVisibility: triggerLabelVisibility, mode: 'button', size, tone: 'neutral', type: 'button' })",
      },
      {
        behavior: "always",
        value: 'div.popup[role="menu"] > button[role="menuitem"]',
      },
      {
        behavior: "emit",
        value:
          'div.popup[role="menu"] > button[role="menuitem"][aria-disabled="true"]',
        when: "an item has disabled: true",
      },
      {
        behavior: "runtime",
        value: `${CLBR_MENU_TAG_NAME}[data-open]`,
        when: "the popup menu is open after defineClbrMenu() has upgraded the host",
      },
    ],
  },
  events: {
    [CLBR_MENU_EVENT_CHOOSE]: {
      bubbles: true,
      description: "Fired when a menu item is activated.",
      detail: "{ id?: string; index: number; label: string }",
    },
  },
} as const;
