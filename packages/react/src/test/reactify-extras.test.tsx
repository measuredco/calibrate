import { Checkbox, Input, Switch, Textarea } from "@measured/calibrate-react";
import { act, createRef, type Ref } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";

// -----------------------------------------------------------------------------
// Form-control event-handler routing.
//
// Caller-supplied `on*` handlers and `autoFocus` should land on the inner
// input/textarea, not the wrapper, so React's controlled-input checks pass.
// `ref` stays on the host wrapper.
//
// Verifies routing by reading React's stored props on the rendered DOM
// nodes (the `__reactProps$<id>` symbol React 18 uses for delegated event
// listeners). Bypasses fragile event simulation in jsdom.
// -----------------------------------------------------------------------------

function mount(node: React.ReactNode): {
  container: HTMLElement;
  unmount: () => void;
} {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  act(() => {
    root.render(node);
  });
  return {
    container,
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

function reactProps(element: Element): Record<string, unknown> {
  // React 18 attaches props as a non-enumerable string-keyed property
  // (e.g. `__reactProps$abc123`). Use getOwnPropertyNames; Object.keys
  // skips non-enumerable.
  const key = Object.getOwnPropertyNames(element).find((k) =>
    k.startsWith("__reactProps$"),
  );
  return (
    key ? (element as unknown as Record<string, unknown>)[key] : {}
  ) as Record<string, unknown>;
}

describe("form-control event-handler routing", () => {
  it("attaches onChange to the inner input on Checkbox, not the wrapper", () => {
    const onChange = (): void => undefined;
    const { container, unmount } = mount(
      <Checkbox
        checked={false}
        id="cb"
        label="Agree"
        onChange={onChange}
        value="yes"
      />,
    );
    const wrapper = container.querySelector(".clbr-checkbox") as HTMLElement;
    const input = container.querySelector("input.checkbox") as HTMLInputElement;
    expect(reactProps(input).onChange).toBe(onChange);
    expect(reactProps(wrapper).onChange).toBeUndefined();
    unmount();
  });

  it("attaches onChange to the inner input on Switch, not the wrapper", () => {
    const onChange = (): void => undefined;
    const { container, unmount } = mount(
      <Switch
        checked={false}
        id="sw"
        label="Notifications"
        onChange={onChange}
        value="yes"
      />,
    );
    const wrapper = container.querySelector(".clbr-switch") as HTMLElement;
    const input = container.querySelector("input.switch") as HTMLInputElement;
    expect(reactProps(input).onChange).toBe(onChange);
    expect(reactProps(wrapper).onChange).toBeUndefined();
    unmount();
  });

  it("attaches onChange to the inner input on Input, not the wrapper", () => {
    const onChange = (): void => undefined;
    const { container, unmount } = mount(
      <Input
        id="email"
        label="Email"
        onChange={onChange}
        type="email"
        value=""
      />,
    );
    const wrapper = container.querySelector(".clbr-input") as HTMLElement;
    const input = container.querySelector("input.input") as HTMLInputElement;
    expect(reactProps(input).onChange).toBe(onChange);
    expect(reactProps(wrapper).onChange).toBeUndefined();
    unmount();
  });

  it("attaches onChange to the inner textarea on Textarea, not the wrapper", () => {
    const onChange = (): void => undefined;
    const { container, unmount } = mount(
      <Textarea id="msg" label="Message" onChange={onChange} value="" />,
    );
    const wrapper = container.querySelector(".clbr-textarea") as HTMLElement;
    const textarea = container.querySelector(
      "textarea.textarea",
    ) as HTMLTextAreaElement;
    expect(reactProps(textarea).onChange).toBe(onChange);
    expect(reactProps(wrapper).onChange).toBeUndefined();
    unmount();
  });

  it("keeps ref on the wrapper, not on the inner control", () => {
    const ref = createRef<HTMLDivElement>();
    const { unmount } = mount(
      <Checkbox
        checked={false}
        id="cb"
        label="Agree"
        ref={ref as Ref<HTMLDivElement>}
        value="yes"
      />,
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current?.classList.contains("clbr-checkbox")).toBe(true);
    unmount();
  });

  it("attaches autoFocus to the inner input only on Input", () => {
    const { container, unmount } = mount(
      <Input autoFocus id="email" label="Email" type="email" />,
    );
    const wrapper = container.querySelector(".clbr-input") as HTMLElement;
    const input = container.querySelector("input.input") as HTMLInputElement;
    expect(reactProps(input).autoFocus).toBe(true);
    expect(reactProps(wrapper).autoFocus).toBeUndefined();
    unmount();
  });
});
