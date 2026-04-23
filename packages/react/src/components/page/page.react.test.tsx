import { act, createRef, type ReactElement } from "react";
import { createRoot, hydrateRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Page } from "./page";

/**
 * Archetype-level React plumbing tests for Page (named slots).
 *
 * DOM equivalence with core SSR is covered in `page.test.tsx`. These tests
 * cover React-specific behavior the equivalence matrix can't reach:
 * hydration, ref forwarding, and slot re-render on prop change.
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

describe("Page React plumbing", () => {
  it("hydrates SSR output without recoverable errors", () => {
    const vdom = (
      <Page
        banner={<span>Notice</span>}
        centerMain
        footer={<p>F</p>}
        header={<h1>H</h1>}
      >
        <article>Body</article>
      </Page>
    );
    container.innerHTML = renderToStaticMarkup(vdom);
    const onRecoverableError = vi.fn();

    act(() => {
      root = hydrateRoot(container, vdom, { onRecoverableError });
    });

    expect(onRecoverableError).not.toHaveBeenCalled();
  });

  it("re-renders when slot props change", () => {
    render(
      <Page footer={<p>F1</p>} header={<h1>H1</h1>}>
        <p>Body 1</p>
      </Page>,
    );
    expect(container.querySelector("h1")!.textContent).toBe("H1");
    expect(container.querySelector("main > p")!.textContent).toBe("Body 1");
    expect(container.querySelector("footer > p")!.textContent).toBe("F1");

    rerender(
      <Page footer={<p>F2</p>} header={<h1>H2</h1>}>
        <p>Body 2</p>
      </Page>,
    );
    expect(container.querySelector("h1")!.textContent).toBe("H2");
    expect(container.querySelector("main > p")!.textContent).toBe("Body 2");
    expect(container.querySelector("footer > p")!.textContent).toBe("F2");
  });

  it("adds banner when prop becomes truthy", () => {
    render(<Page footer={<p>F</p>} header={<h1>H</h1>} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.children).toHaveLength(3);

    rerender(
      <Page banner={<span>Notice</span>} footer={<p>F</p>} header={<h1>H</h1>} />,
    );
    const afterRoot = container.firstElementChild as HTMLElement;
    expect(afterRoot.children).toHaveLength(4);
    expect(afterRoot.children[0].tagName.toLowerCase()).toBe("span");
  });

  it("forwards ref to the underlying div element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Page footer={<p>F</p>} header={<h1>H</h1>} ref={ref} />);

    expect(ref.current).toBe(container.firstElementChild);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
