import { CLBR_BANNER_TAG_NAME } from "@measured/calibrate-core";
import { act, createRef, type ReactElement } from "react";
import { createRoot, hydrateRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Banner } from "./banner";

/**
 * Archetype-level React plumbing tests for Banner (custom element with
 * custom events).
 *
 * DOM equivalence with core SSR is covered in `banner.test.tsx`. These tests
 * cover React-specific behavior the equivalence matrix can't reach:
 * hydration, custom-event wiring, ref forwarding.
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

function getDismissButton(): HTMLButtonElement {
  const banner = container.querySelector(CLBR_BANNER_TAG_NAME);
  if (!banner) throw new Error("banner not found");
  const button = banner.querySelector('[data-part="close"] button');
  if (!button) throw new Error("dismiss button not found");
  return button as HTMLButtonElement;
}

describe("Banner React plumbing", () => {
  it("hydrates SSR output without recoverable errors", () => {
    const vdom = <Banner message="Notice" tone="info" />;
    container.innerHTML = renderToStaticMarkup(vdom);
    const onRecoverableError = vi.fn();

    act(() => {
      root = hydrateRoot(container, vdom, { onRecoverableError });
    });

    expect(onRecoverableError).not.toHaveBeenCalled();
  });

  it("fires onDismiss and removes the banner when dismiss clicked", () => {
    const onDismiss = vi.fn();
    render(<Banner message="Notice" onDismiss={onDismiss} />);

    act(() => getDismissButton().click());

    expect(onDismiss).toHaveBeenCalledOnce();
    expect(container.querySelector(CLBR_BANNER_TAG_NAME)).toBeNull();

    // CE self-removes via `this.remove()`, so React's fiber tree now
    // points at a detached node. Skip the afterEach unmount — in a real
    // app the consumer would re-render with the banner state cleared.
    root = null;
  });

  it("keeps the banner when onBeforeDismiss calls preventDefault", () => {
    const onDismiss = vi.fn();
    render(
      <Banner
        message="Notice"
        onBeforeDismiss={(event) => event.preventDefault()}
        onDismiss={onDismiss}
      />,
    );

    act(() => getDismissButton().click());

    expect(onDismiss).not.toHaveBeenCalled();
    expect(container.querySelector(CLBR_BANNER_TAG_NAME)).not.toBeNull();
  });

  it("forwards ref to the underlying custom element", () => {
    const ref = createRef<HTMLElement>();
    render(<Banner message="Notice" ref={ref} />);

    expect(ref.current).toBe(container.querySelector(CLBR_BANNER_TAG_NAME));
    expect(ref.current?.tagName.toLowerCase()).toBe(CLBR_BANNER_TAG_NAME);
  });
});
