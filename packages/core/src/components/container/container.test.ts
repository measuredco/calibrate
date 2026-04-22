import { getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../testing/spec";
import {
  CLBR_CONTAINER_SPEC,
  renderClbrContainer,
  type ClbrContainerProps,
} from "./container";

function mountContainer(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrContainer", () => {
  it("renders a container div with default gutter and no max-inline-size/gutter attributes", () => {
    const root = mountContainer(renderClbrContainer({ children: "Body" }));
    const container = getByText(root, "Body");

    expect(container.tagName).toBe("DIV");
    expect(container.classList.contains("container")).toBe(true);
    expect(container.hasAttribute("data-max-inline-size")).toBe(false);
    expect(container.hasAttribute("data-gutter")).toBe(false);
  });

  it("renders trusted HTML content when children is provided", () => {
    const root = mountContainer(
      renderClbrContainer({
        children: '<p>Lorem <em>ipsum</em> <a href="/docs">docs</a></p>',
      }),
    );

    expect(root.querySelector("p")?.textContent).toContain("Lorem");
    expect(root.querySelector("em")?.textContent).toBe("ipsum");
    expect(root.querySelector("a")?.getAttribute("href")).toBe("/docs");
  });

  it("allows omitted and empty children without throwing", () => {
    const omittedRoot = mountContainer(renderClbrContainer({}));
    const omittedContainer = omittedRoot.querySelector(".container");

    expect(omittedContainer).toBeTruthy();
    expect(omittedContainer?.innerHTML).toBe("");

    const emptyRoot = mountContainer(renderClbrContainer({ children: "" }));
    const emptyContainer = emptyRoot.querySelector(".container");

    expect(emptyContainer).toBeTruthy();
    expect(emptyContainer?.innerHTML).toBe("");
  });

  it("does not emit data attributes for explicit default prop values", () => {
    const root = mountContainer(
      renderClbrContainer({
        children: "Body",
        gutter: "default",
        maxInlineSize: "default",
      }),
    );
    const container = getByText(root, "Body");

    expect(container.hasAttribute("data-max-inline-size")).toBe(false);
    expect(container.hasAttribute("data-gutter")).toBe(false);
  });

  it("emits explicit max-inline-size and gutter values", () => {
    const wideRoot = mountContainer(
      renderClbrContainer({
        children: "Body",
        gutter: "narrow",
        maxInlineSize: "wide",
      }),
    );
    const wideContainer = getByText(wideRoot, "Body");

    expect(wideContainer.getAttribute("data-max-inline-size")).toBe("wide");
    expect(wideContainer.getAttribute("data-gutter")).toBe("narrow");

    const noneRoot = mountContainer(
      renderClbrContainer({
        children: "Body",
        gutter: "none",
        maxInlineSize: "none",
      }),
    );
    const noneContainer = getByText(noneRoot, "Body");

    expect(noneContainer.getAttribute("data-max-inline-size")).toBe("none");
    expect(noneContainer.getAttribute("data-gutter")).toBe("none");
  });
});

describeSpecConsistency<ClbrContainerProps>({
  baseProps: {},
  renderer: renderClbrContainer,
  spec: CLBR_CONTAINER_SPEC,
});
