import { CLBR_MENU_TAG_NAME } from "@measured/calibrate-core";
import { act, createRef, type ReactElement } from "react";
import { createRoot, hydrateRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Menu, type MenuChooseEvent } from "./menu";

/**
 * Archetype-level React plumbing tests for Menu (custom element with a
 * structured-items prop and a custom choose event carrying detail).
 *
 * DOM equivalence with core SSR is covered in `menu.test.tsx`. These tests
 * cover React-specific behavior the equivalence matrix can't reach:
 * hydration, choose-event wiring (detail payload), re-render on items
 * change, ref forwarding.
 */

let container: HTMLDivElement;
let root: Root | null = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  if (root) act(() => root!.unmount());
  root = null;
  container.remove();
});

function render(element: ReactElement): void {
  act(() => {
    root = createRoot(container);
    root.render(element);
  });
}

function rerender(element: ReactElement): void {
  act(() => root!.render(element));
}

function getTrigger(): HTMLButtonElement {
  const trigger = container.querySelector<HTMLButtonElement>(
    '[data-part="trigger"] .clbr-button',
  );
  if (!trigger) throw new Error("trigger not found");
  return trigger;
}

function getMenuItems(): HTMLButtonElement[] {
  return Array.from(
    container.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'),
  );
}

describe("Menu React plumbing", () => {
  it("hydrates SSR output without recoverable errors", () => {
    const vdom = (
      <Menu
        id="actions"
        items={[{ label: "Edit" }, { label: "Delete" }]}
        triggerLabel="Actions"
      />
    );
    container.innerHTML = renderToStaticMarkup(vdom);
    const onRecoverableError = vi.fn();

    act(() => {
      root = hydrateRoot(container, vdom, { onRecoverableError });
    });

    expect(onRecoverableError).not.toHaveBeenCalled();
  });

  it("fires onChoose with detail payload when an item is activated", () => {
    const onChoose = vi.fn();
    render(
      <Menu
        id="actions"
        items={[
          { id: "edit", label: "Edit" },
          { id: "delete", label: "Delete" },
        ]}
        onChoose={onChoose}
        triggerLabel="Actions"
      />,
    );

    act(() => getTrigger().click());
    act(() => getMenuItems()[1]!.click());

    expect(onChoose).toHaveBeenCalledOnce();
    const event = onChoose.mock.calls[0][0] as MenuChooseEvent;
    expect(event.detail).toEqual({ id: "delete", index: 1, label: "Delete" });
  });

  it("re-renders when items prop changes", () => {
    render(
      <Menu id="actions" items={[{ label: "Edit" }]} triggerLabel="Actions" />,
    );
    expect(getMenuItems()).toHaveLength(1);

    rerender(
      <Menu
        id="actions"
        items={[{ label: "Edit" }, { label: "Delete" }, { label: "Archive" }]}
        triggerLabel="Actions"
      />,
    );
    expect(getMenuItems()).toHaveLength(3);
    expect(getMenuItems()[2]!.textContent).toBe("Archive");
  });

  it("forwards ref to the underlying custom element", () => {
    const ref = createRef<HTMLElement>();
    render(
      <Menu
        id="actions"
        items={[{ label: "Edit" }]}
        ref={ref}
        triggerLabel="Actions"
      />,
    );

    expect(ref.current).toBe(container.querySelector(CLBR_MENU_TAG_NAME));
    expect(ref.current?.tagName.toLowerCase()).toBe(CLBR_MENU_TAG_NAME);
  });
});
