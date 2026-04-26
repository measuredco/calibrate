import { isValidHtmlId } from "../../helpers/string";
import { type ClbrNode, serializeClbrNode } from "../../helpers/node";
import type { ClbrComponentSpec } from "../../spec";
import { buildClbrButton, renderClbrButton } from "../button/button";

export const CLBR_SIDEBAR_TAG_NAME = "clbr-sidebar";
export type ClbrSidebarAboveNotebook = "persistent" | "collapsible" | "overlay";
export type ClbrSidebarSize = "sm" | "md";

const aboveNotebookMedia = "(min-width: 68em)";
const collapseLabelDefault = "Collapse sidebar";
const triggerLabelDefault = "Open sidebar";

export interface ClbrSidebarProps {
  /** Behavior above the notebook breakpoint. @default "persistent" */
  aboveNotebook?: ClbrSidebarAboveNotebook;
  /** Content region markup rendered inside `.content`. Caller sanitizes untrusted content. */
  children?: string;
  /** Accessible label for the runtime collapse/close button. @default "Collapse sidebar" */
  collapseLabel?: string;
  /** Optional footer region markup. Caller sanitizes untrusted content. */
  footer?: string;
  /** Optional header region markup. Caller sanitizes untrusted content. */
  header?: string;
  /** Required id for the inner `.sidebar`; used by the trigger via `aria-controls`. */
  id: string;
  /** Accessible label for the component-owned trigger. @default "Open sidebar" */
  triggerLabel?: string;
  /** Size variant. @default "md" */
  size?: ClbrSidebarSize;
}

function createCloseButtonMarkup(label: string, size: ClbrSidebarSize): string {
  return `<div data-part="close">${renderClbrButton({
    appearance: "text",
    icon: "PanelLeft",
    iconMirrored: "rtl",
    label,
    labelVisibility: "hidden",
    size: size === "sm" ? "md" : "lg",
    tone: "neutral",
    type: "button",
  })}</div>`;
}

/**
 * Builds the IR tree for the Calibrate sidebar component.
 *
 * @param props - Sidebar component props.
 * @returns IR node for a `clbr-sidebar` host.
 */
export function buildClbrSidebar({
  aboveNotebook = "persistent",
  children,
  collapseLabel = collapseLabelDefault,
  footer,
  header,
  id,
  size = "md",
  triggerLabel = triggerLabelDefault,
}: ClbrSidebarProps): ClbrNode {
  const normalizedId = id.trim();
  const normalizedCollapseLabel = collapseLabel.trim() || collapseLabelDefault;
  const normalizedTriggerLabel = triggerLabel.trim() || triggerLabelDefault;

  if (!normalizedId) {
    throw new Error("id must be a non-empty string.");
  }

  if (!isValidHtmlId(normalizedId)) {
    throw new Error(
      "id must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  }

  const sidebarChildren: ClbrNode[] = [
    {
      kind: "element",
      tag: "div",
      attrs: { class: "header" },
      children: header ? [{ kind: "raw", html: header }] : [],
    },
    {
      kind: "element",
      tag: "div",
      attrs: { class: "content" },
      children: children ? [{ kind: "raw", html: children }] : [],
    },
  ];

  if (footer) {
    sidebarChildren.push({
      kind: "element",
      tag: "div",
      attrs: { class: "footer" },
      children: [{ kind: "raw", html: footer }],
    });
  }

  return {
    kind: "element",
    tag: CLBR_SIDEBAR_TAG_NAME,
    attrs: {
      class: "clbr-sidebar",
      "data-above-notebook": aboveNotebook,
      "data-collapse-label":
        normalizedCollapseLabel !== collapseLabelDefault
          ? normalizedCollapseLabel
          : undefined,
      "data-size": size,
    },
    children: [
      {
        kind: "element",
        tag: "div",
        attrs: { "data-part": "trigger" },
        children: [
          buildClbrButton({
            appearance: "text",
            controls: normalizedId,
            disclosure: true,
            icon: "PanelLeft",
            iconMirrored: "rtl",
            label: normalizedTriggerLabel,
            labelVisibility: "hidden",
            size: size === "sm" ? "md" : "lg",
            tone: "neutral",
            type: "button",
          }),
        ],
      },
      {
        kind: "element",
        tag: "div",
        attrs: { class: "sidebar", id: normalizedId, tabindex: "-1" },
        children: sidebarChildren,
      },
      {
        kind: "element",
        tag: "div",
        attrs: { "data-part": "backdrop" },
        children: [],
      },
    ],
  };
}

/**
 * SSR renderer for the Calibrate sidebar component.
 *
 * Emits a component-owned trigger plus structural sidebar markup inside a
 * `clbr-sidebar` host. The host also owns a backdrop element used for overlay
 * dismissal on narrow screens. Above notebook width, behavior is controlled by
 * `aboveNotebook`. Page-shell layout decisions are intentionally left to parent
 * composition.
 *
 * @param props - Sidebar component props.
 * @returns HTML string for a `clbr-sidebar` host.
 */
export function renderClbrSidebar(props: ClbrSidebarProps): string {
  return serializeClbrNode(buildClbrSidebar(props));
}

/**
 * Defines the `clbr-sidebar` custom element runtime.
 *
 * Safe to call multiple times. Existing SSR-rendered `clbr-sidebar` hosts
 * upgrade in place and receive owned-trigger open/close behavior.
 */
export function defineClbrSidebar(): void {
  if (customElements.get(CLBR_SIDEBAR_TAG_NAME)) return;

  class ClbrSidebarElement extends HTMLElement {
    #mediaQuery?: MediaQueryList;
    #onClick?: (event: Event) => void;
    #onKeyDown?: (event: KeyboardEvent) => void;
    #onMediaChange?: (event: MediaQueryListEvent) => void;

    connectedCallback(): void {
      this.#teardownListeners();
      this.#ensureCloseControl();
      this.#syncResponsiveState();
      this.#setupListeners();
    }

    disconnectedCallback(): void {
      this.close();
      this.#teardownListeners();
    }

    open(): void {
      this.#setOpen(true);
    }

    close(): void {
      this.#setOpen(false);
    }

    #getSidebar(): HTMLElement | null {
      return this.querySelector<HTMLElement>(".sidebar");
    }

    #getCloseButton(): HTMLButtonElement | null {
      return this.querySelector<HTMLButtonElement>(
        '[data-part="close"] .clbr-button',
      );
    }

    #getTriggerButton(): HTMLButtonElement | null {
      return this.querySelector<HTMLButtonElement>(
        '[data-part="trigger"] .clbr-button',
      );
    }

    #isOpen(): boolean {
      return this.hasAttribute("data-open");
    }

    #isCollapsed(): boolean {
      return this.hasAttribute("data-collapsed");
    }

    #getAboveNotebook(): ClbrSidebarAboveNotebook {
      const value = this.getAttribute("data-above-notebook");

      if (value === "collapsible" || value === "overlay") return value;

      return "persistent";
    }

    #ensureCloseControl(): void {
      const sidebar = this.#getSidebar();

      if (!sidebar) return;
      if (sidebar.querySelector('[data-part="close"]')) return;

      const header = sidebar.querySelector<HTMLElement>(".header");
      const collapseLabel =
        this.getAttribute("data-collapse-label") || collapseLabelDefault;
      const size = this.getAttribute("data-size") === "sm" ? "sm" : "md";

      header?.insertAdjacentHTML(
        "beforeend",
        createCloseButtonMarkup(collapseLabel, size),
      );
    }

    #removeCloseControl(): void {
      this.querySelector('[data-part="close"]')?.remove();
    }

    #focusSidebar(): void {
      const closeButton = this.#getCloseButton();

      if (closeButton) {
        closeButton.focus();
        return;
      }

      this.#getSidebar()?.focus();
    }

    #isAboveNotebook(): boolean {
      return this.#mediaQuery?.matches ?? false;
    }

    #setState({
      collapsed,
      open,
    }: {
      collapsed: boolean;
      open: boolean;
    }): void {
      const trigger = this.#getTriggerButton();

      this.toggleAttribute("data-open", open);
      this.toggleAttribute("data-collapsed", collapsed);
      trigger?.setAttribute("aria-expanded", open ? "true" : "false");
    }

    #syncResponsiveState(): void {
      const aboveNotebook = this.#getAboveNotebook();

      if (this.#isAboveNotebook()) {
        if (aboveNotebook === "overlay") {
          this.#ensureCloseControl();
          this.#setState({ collapsed: false, open: false });
          this.#setScrollLocked(false);

          return;
        }

        if (aboveNotebook === "collapsible") {
          this.#ensureCloseControl();
          this.#setState({
            collapsed: this.#isCollapsed(),
            open: true,
          });
          this.#setScrollLocked(false);

          return;
        }

        this.#removeCloseControl();
        this.#setState({ collapsed: false, open: true });
        this.#setScrollLocked(false);

        return;
      }

      this.#ensureCloseControl();
      this.#setState({ collapsed: false, open: false });
      this.#setScrollLocked(false);
    }

    #setOpen(open: boolean): void {
      const aboveNotebook = this.#getAboveNotebook();

      if (this.#isAboveNotebook()) {
        if (aboveNotebook === "persistent") {
          this.#setState({ collapsed: false, open: true });
          this.#setScrollLocked(false);

          return;
        }

        if (aboveNotebook === "collapsible") {
          this.#setState({ collapsed: !open, open: true });
          this.#setScrollLocked(false);

          if (open) this.#focusSidebar();

          return;
        }
      }

      if (this.#isOpen() === open) return;

      if (open) {
        this.#setState({ collapsed: false, open: true });
        this.#setScrollLocked(true);
        this.#focusSidebar();

        return;
      }

      this.#setState({ collapsed: false, open: false });
      this.#setScrollLocked(false);
      this.#getTriggerButton()?.focus();
    }

    #setScrollLocked(locked: boolean): void {
      const root = this.ownerDocument.documentElement;

      if (!root) return;

      if (locked) {
        root.setAttribute("data-clbr-scroll-locked", "");
        return;
      }

      root.removeAttribute("data-clbr-scroll-locked");
    }

    #setupListeners(): void {
      const windowRef = this.ownerDocument.defaultView;

      if (!windowRef) return;

      if (typeof windowRef.matchMedia === "function") {
        this.#mediaQuery = windowRef.matchMedia(aboveNotebookMedia);
        this.#onMediaChange = () => {
          this.#syncResponsiveState();
        };
        this.#mediaQuery.addEventListener("change", this.#onMediaChange);
        this.#syncResponsiveState();
      }

      this.#onClick = (event: Event) => {
        const target = event.target;

        if (!(target instanceof Element)) return;

        if (target.closest('[data-part="trigger"] .clbr-button')) {
          this.open();
          return;
        }

        if (target.closest('[data-part="close"] .clbr-button')) {
          if (
            this.#isAboveNotebook() &&
            this.#getAboveNotebook() === "collapsible"
          ) {
            this.#setOpen(this.#isCollapsed());
            return;
          }

          this.close();
          return;
        }

        if (target.closest('[data-part="backdrop"]')) {
          this.close();
        }
      };

      this.#onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Escape" && event.key !== "Esc") return;
        this.close();
      };

      this.addEventListener("click", this.#onClick);
      this.addEventListener("keydown", this.#onKeyDown);
    }

    #teardownListeners(): void {
      if (this.#onClick) {
        this.removeEventListener("click", this.#onClick);
      }

      if (this.#onKeyDown) {
        this.removeEventListener("keydown", this.#onKeyDown);
      }

      if (this.#mediaQuery && this.#onMediaChange) {
        this.#mediaQuery.removeEventListener("change", this.#onMediaChange);
      }

      this.#onClick = undefined;
      this.#onKeyDown = undefined;
      this.#mediaQuery = undefined;
      this.#onMediaChange = undefined;
    }
  }

  customElements.define(CLBR_SIDEBAR_TAG_NAME, ClbrSidebarElement);
}

/** Declarative sidebar contract mirror for tooling, docs, and adapters. */
export const CLBR_SIDEBAR_SPEC: ClbrComponentSpec = {
  name: "sidebar",
  description: "Use `sidebar` for a side panel alongside main content.",
  output: {
    element: CLBR_SIDEBAR_TAG_NAME,
    class: "clbr-sidebar",
  },
  content: {
    kind: "slots",
    slots: [
      { prop: "header", kind: "html" },
      { prop: "children", kind: "html" },
      { prop: "footer", kind: "html" },
    ],
  },
  props: {
    aboveNotebook: {
      default: "persistent",
      description: "Layout behaviour on wider screens.",
      type: {
        kind: "enum",
        values: ["persistent", "collapsible", "overlay"],
      },
    },
    children: {
      description: "Sidebar body content.",
      type: { kind: "html" },
    },
    collapseLabel: {
      default: collapseLabelDefault,
      description: "Accessible label for the collapse button.",
      type: { kind: "string" },
    },
    footer: {
      description: "Content rendered in the sidebar footer.",
      type: { kind: "html" },
    },
    header: {
      description: "Content rendered in the sidebar header.",
      type: { kind: "html" },
    },
    id: {
      description: "`id` used to wire the trigger to the sidebar.",
      required: true,
      type: { kind: "string" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md"] },
    },
    triggerLabel: {
      default: triggerLabelDefault,
      description: "Accessible label for the open button.",
      type: { kind: "string" },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-above-notebook",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "aboveNotebook" },
      },
      {
        target: { on: "host" },
        attribute: "data-size",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "size" },
      },
      {
        target: { on: "host" },
        attribute: "data-collapse-label",
        condition: {
          kind: "all",
          of: [
            { kind: "when-non-empty", prop: "collapseLabel" },
            {
              kind: "not",
              of: {
                kind: "when-equals",
                prop: "collapseLabel",
                to: collapseLabelDefault,
              },
            },
          ],
        },
        value: { kind: "prop", prop: "collapseLabel" },
      },
      {
        target: { on: "descendant", selector: "div.sidebar" },
        attribute: "id",
        condition: { kind: "always" },
        value: { kind: "template", pattern: "{id}" },
      },
      {
        target: { on: "descendant", selector: "div.sidebar" },
        attribute: "tabindex",
        condition: { kind: "always" },
        value: { kind: "literal", text: "-1" },
      },
    ],
  },
};
