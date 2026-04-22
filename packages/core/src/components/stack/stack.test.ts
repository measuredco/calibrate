import { getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../testing/spec";
import { CLBR_STACK_SPEC, renderClbrStack, type ClbrStackProps } from "./stack";

function mountStack(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrStack", () => {
  it("renders a stack div with default gap and no responsive attribute", () => {
    const root = mountStack(renderClbrStack({ children: "Body" }));
    const stack = getByText(root, "Body");

    expect(stack.tagName).toBe("DIV");
    expect(stack.classList.contains("stack")).toBe(true);
    expect(stack.hasAttribute("data-align")).toBe(false);
    expect(stack.getAttribute("data-gap")).toBe("md");
    expect(stack.hasAttribute("data-responsive")).toBe(false);
  });

  it("renders a ul when as is ul", () => {
    const root = mountStack(renderClbrStack({ as: "ul", children: "Body" }));
    const stack = getByText(root, "Body");

    expect(stack.tagName).toBe("UL");
    expect(stack.classList.contains("stack")).toBe(true);
  });

  it("renders trusted HTML content when children is provided", () => {
    const root = mountStack(
      renderClbrStack({
        children: '<p>Lorem <em>ipsum</em> <a href="/docs">docs</a></p>',
      }),
    );

    expect(root.querySelector("p")?.textContent).toContain("Lorem");
    expect(root.querySelector("em")?.textContent).toBe("ipsum");
    expect(root.querySelector("a")?.getAttribute("href")).toBe("/docs");
  });

  it("allows omitted and empty children without throwing", () => {
    const omittedRoot = mountStack(renderClbrStack({}));
    const omittedStack = omittedRoot.querySelector(".stack");

    expect(omittedStack).toBeTruthy();
    expect(omittedStack?.innerHTML).toBe("");

    const emptyRoot = mountStack(renderClbrStack({ children: "" }));
    const emptyStack = emptyRoot.querySelector(".stack");

    expect(emptyStack).toBeTruthy();
    expect(emptyStack?.innerHTML).toBe("");
  });

  it("always emits data-gap for all variants", () => {
    const noneRoot = mountStack(
      renderClbrStack({ children: "Body", gap: "none" }),
    );
    const noneStack = getByText(noneRoot, "Body");

    expect(noneStack.getAttribute("data-gap")).toBe("none");

    const xsRoot = mountStack(renderClbrStack({ children: "Body", gap: "xs" }));
    const xsStack = getByText(xsRoot, "Body");

    expect(xsStack.getAttribute("data-gap")).toBe("xs");

    const smRoot = mountStack(renderClbrStack({ children: "Body", gap: "sm" }));
    const smStack = getByText(smRoot, "Body");

    expect(smStack.getAttribute("data-gap")).toBe("sm");

    const lgRoot = mountStack(renderClbrStack({ children: "Body", gap: "lg" }));
    const lgStack = getByText(lgRoot, "Body");

    expect(lgStack.getAttribute("data-gap")).toBe("lg");
  });

  it("emits data-responsive only when responsive is true", () => {
    const responsiveRoot = mountStack(
      renderClbrStack({ children: "Body", responsive: true }),
    );
    const responsiveStack = getByText(responsiveRoot, "Body");

    expect(responsiveStack.hasAttribute("data-responsive")).toBe(true);

    const nonResponsiveRoot = mountStack(
      renderClbrStack({ children: "Body", responsive: false }),
    );
    const nonResponsiveStack = getByText(nonResponsiveRoot, "Body");

    expect(nonResponsiveStack.hasAttribute("data-responsive")).toBe(false);
  });

  it("emits data-align when align is explicitly provided", () => {
    const startRoot = mountStack(
      renderClbrStack({ align: "start", children: "Body" }),
    );
    const startStack = getByText(startRoot, "Body");
    expect(startStack.getAttribute("data-align")).toBe("start");

    const centerRoot = mountStack(
      renderClbrStack({ align: "center", children: "Body" }),
    );
    const centerStack = getByText(centerRoot, "Body");
    expect(centerStack.getAttribute("data-align")).toBe("center");

    const endRoot = mountStack(
      renderClbrStack({ align: "end", children: "Body" }),
    );
    const endStack = getByText(endRoot, "Body");
    expect(endStack.getAttribute("data-align")).toBe("end");

    const stretchRoot = mountStack(
      renderClbrStack({ align: "stretch", children: "Body" }),
    );
    const stretchStack = getByText(stretchRoot, "Body");
    expect(stretchStack.hasAttribute("data-align")).toBe(false);
  });
});

describeSpecConsistency<ClbrStackProps>({
  baseProps: {},
  renderer: renderClbrStack,
  spec: CLBR_STACK_SPEC,
});
