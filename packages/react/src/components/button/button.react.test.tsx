import { act, createRef, type ReactElement } from "react";
import { createRoot, hydrateRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "./button";

/**
 * Archetype-level React plumbing tests for Button (button + link modes).
 *
 * DOM equivalence with core SSR is covered in `button.test.tsx`. These tests
 * cover React-specific behavior the equivalence matrix can't reach:
 * hydration, event wiring, re-render, ref forwarding.
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

describe("Button React plumbing", () => {
  it("hydrates SSR output without recoverable errors", () => {
    const vdom = (
      <Button appearance="solid" icon="check" label="Save" size="lg" />
    );
    container.innerHTML = renderToStaticMarkup(vdom);
    const onRecoverableError = vi.fn();

    act(() => {
      root = hydrateRoot(container, vdom, { onRecoverableError });
    });

    expect(onRecoverableError).not.toHaveBeenCalled();
  });

  it("fires onClick with the button element as currentTarget", () => {
    // React nulls `currentTarget` after the handler returns, so capture it
    // synchronously inside the handler.
    const capturedTarget = vi.fn();
    render(
      <Button
        label="Save"
        onClick={(event) => capturedTarget(event.currentTarget)}
      />,
    );

    const button = container.querySelector("button")!;
    act(() => button.click());

    expect(capturedTarget).toHaveBeenCalledOnce();
    expect(capturedTarget.mock.calls[0][0]).toBe(button);
    expect(capturedTarget.mock.calls[0][0]).toBeInstanceOf(HTMLButtonElement);
  });

  it("fires onClick in link mode with the anchor as currentTarget", () => {
    const capturedTarget = vi.fn();
    render(
      <Button
        href="/docs"
        label="Docs"
        mode="link"
        onClick={(event) => {
          event.preventDefault();
          capturedTarget(event.currentTarget);
        }}
      />,
    );

    const anchor = container.querySelector("a")!;
    act(() => anchor.click());

    expect(capturedTarget).toHaveBeenCalledOnce();
    expect(capturedTarget.mock.calls[0][0]).toBe(anchor);
    expect(capturedTarget.mock.calls[0][0]).toBeInstanceOf(HTMLAnchorElement);
  });

  it("re-renders when props change", () => {
    render(<Button appearance="outline" label="First" />);
    const before = container.querySelector("button")!;
    expect(before.textContent).toBe("First");
    expect(before.getAttribute("data-appearance")).toBe("outline");

    rerender(<Button appearance="solid" label="Second" tone="neutral" />);
    const after = container.querySelector("button")!;
    expect(after.textContent).toBe("Second");
    expect(after.getAttribute("data-appearance")).toBe("solid");
    expect(after.getAttribute("data-tone")).toBe("neutral");
  });

  it("forwards ref to the underlying button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button label="Save" ref={ref} />);

    expect(ref.current).toBe(container.querySelector("button"));
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("forwards ref to the underlying anchor element in link mode", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(<Button href="/docs" label="Docs" mode="link" ref={ref} />);

    expect(ref.current).toBe(container.querySelector("a"));
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});
