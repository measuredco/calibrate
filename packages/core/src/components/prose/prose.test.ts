import { getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../testing/spec";
import { CLBR_PROSE_SPEC, renderClbrProse, type ClbrProseProps } from "./prose";

function mountProse(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrProse", () => {
  it("renders a prose div wrapper", () => {
    const root = mountProse(renderClbrProse({ children: "Hello world" }));
    const prose = getByText(root, "Hello world");

    expect(prose.tagName).toBe("DIV");
    expect(prose.classList.contains("prose")).toBe(true);
  });

  it("omits default align and emits non-default align", () => {
    const defaultRoot = mountProse(
      renderClbrProse({ align: "start", children: "Body" }),
    );
    const defaultProse = getByText(defaultRoot, "Body");
    expect(defaultProse.hasAttribute("data-align")).toBe(false);

    const centeredRoot = mountProse(
      renderClbrProse({ align: "center", children: "Body" }),
    );
    const centeredProse = getByText(centeredRoot, "Body");
    expect(centeredProse.getAttribute("data-align")).toBe("center");
  });

  it("omits hanging punctuation by default and emits enum values", () => {
    const defaultRoot = mountProse(renderClbrProse({ children: "Body" }));
    const defaultProse = getByText(defaultRoot, "Body");
    expect(defaultProse.hasAttribute("data-hanging-punctuation")).toBe(false);

    const alwaysRoot = mountProse(
      renderClbrProse({ children: "Body", hangingPunctuation: "always" }),
    );
    const alwaysProse = getByText(alwaysRoot, "Body");
    expect(alwaysProse.getAttribute("data-hanging-punctuation")).toBe("always");

    const notebookRoot = mountProse(
      renderClbrProse({ children: "Body", hangingPunctuation: "notebook" }),
    );
    const notebookProse = getByText(notebookRoot, "Body");
    expect(notebookProse.getAttribute("data-hanging-punctuation")).toBe("notebook");
  });

  it("emits measured by default and omits responsive by default", () => {
    const root = mountProse(renderClbrProse({ children: "Body" }));
    const prose = getByText(root, "Body");
    expect(prose.hasAttribute("data-measured")).toBe(true);
    expect(prose.hasAttribute("data-responsive")).toBe(false);

    const explicitRoot = mountProse(
      renderClbrProse({ children: "Body", measured: false, responsive: true }),
    );
    const explicitProse = getByText(explicitRoot, "Body");
    expect(explicitProse.hasAttribute("data-measured")).toBe(false);
    expect(explicitProse.hasAttribute("data-responsive")).toBe(true);
  });

  it("renders trusted HTML content", () => {
    const root = mountProse(
      renderClbrProse({
        children:
          '<p>Lorem ipsum <em>dolor</em> sit amet, <a href="/docs">docs</a>.</p>',
      }),
    );

    expect(root.querySelector("p")?.textContent).toContain("Lorem ipsum");
    expect(root.querySelector("em")?.textContent).toBe("dolor");
    expect(root.querySelector("a")?.getAttribute("href")).toBe("/docs");
  });

  it("allows empty or whitespace children without throwing", () => {
    const emptyRoot = mountProse(renderClbrProse({ children: "" }));
    const emptyProse = emptyRoot.querySelector(".prose");
    expect(emptyProse).toBeTruthy();
    expect(emptyProse?.innerHTML).toBe("");

    const whitespaceRoot = mountProse(renderClbrProse({ children: "   " }));
    const whitespaceProse = whitespaceRoot.querySelector(".prose");
    expect(whitespaceProse).toBeTruthy();
    expect(whitespaceProse?.innerHTML).toBe("   ");
  });
});

describeSpecConsistency<ClbrProseProps>({
  baseProps: { children: "<p>Body</p>" },
  renderer: renderClbrProse,
  spec: CLBR_PROSE_SPEC,
});
