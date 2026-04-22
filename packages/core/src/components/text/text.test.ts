import { getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../testing/spec";
import { CLBR_TEXT_SPEC, renderClbrText, type ClbrTextProps } from "./text";

function mountText(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

function renderAndGetText(content = "Body text"): HTMLElement {
  const root = mountText(renderClbrText({ children: content }));
  return getByText(root, content);
}

describe("renderClbrText", () => {
  it("renders span by default", () => {
    const text = renderAndGetText();

    expect(text.tagName).toBe("SPAN");
    expect(text.classList.contains("clbr-text")).toBe(true);
  });

  it("renders paragraph when as is p", () => {
    const root = mountText(renderClbrText({ as: "p", children: "Body text" }));
    const text = getByText(root, "Body text");

    expect(text.tagName).toBe("P");
  });

  it.each(["xs", "sm", "md", "lg"] as const)('emits data-size="%s"', (size) => {
    const root = mountText(renderClbrText({ children: "Body text", size }));
    const text = getByText(root, "Body text");

    expect(text.getAttribute("data-size")).toBe(size);
  });

  it("defaults to md size", () => {
    const text = renderAndGetText();
    expect(text.getAttribute("data-size")).toBe("md");
  });

  it("omits data-responsive by default and emits it when true", () => {
    const withoutResponsive = renderAndGetText();
    expect(withoutResponsive.hasAttribute("data-responsive")).toBe(false);

    const root = mountText(
      renderClbrText({ children: "Body text", responsive: true }),
    );
    const withResponsive = getByText(root, "Body text");
    expect(withResponsive.hasAttribute("data-responsive")).toBe(true);
  });

  it("emits muted tone and omits default tone attr", () => {
    const mutedRoot = mountText(
      renderClbrText({ children: "Body text", tone: "muted" }),
    );
    const muted = getByText(mutedRoot, "Body text");
    expect(muted.getAttribute("data-tone")).toBe("muted");

    const defaultRoot = mountText(
      renderClbrText({ children: "Body text", tone: "default" }),
    );
    const defaultTone = getByText(defaultRoot, "Body text");
    expect(defaultTone.hasAttribute("data-tone")).toBe(false);
  });

  it('omits data-link-visited by default and emits "off" when disabled', () => {
    const withDefaultLinks = mountText(
      renderClbrText({ children: 'Body text with <a href="/docs">link</a>.' }),
    );
    const defaultLinksText = getByText(withDefaultLinks, /Body text with/i);
    expect(defaultLinksText.hasAttribute("data-link-visited")).toBe(false);

    const withDisabledVisited = mountText(
      renderClbrText({
        children: 'Body text with <a href="/docs">link</a>.',
        linkVisited: false,
      }),
    );
    const disabledVisitedText = getByText(
      withDisabledVisited,
      /Body text with/i,
    );
    expect(disabledVisitedText.getAttribute("data-link-visited")).toBe("off");
  });

  it("paragraph mode defaults measured to true", () => {
    const root = mountText(renderClbrText({ as: "p", children: "Body text" }));
    const text = getByText(root, "Body text");

    expect(text.hasAttribute("data-measured")).toBe(true);
  });

  it("paragraph mode supports measured override", () => {
    const measuredRoot = mountText(
      renderClbrText({ as: "p", children: "Body text", measured: true }),
    );
    const measured = getByText(measuredRoot, "Body text");
    expect(measured.hasAttribute("data-measured")).toBe(true);

    const unmeasuredRoot = mountText(
      renderClbrText({ as: "p", children: "Body text", measured: false }),
    );
    const unmeasured = getByText(unmeasuredRoot, "Body text");
    expect(unmeasured.hasAttribute("data-measured")).toBe(false);
  });

  it("paragraph mode omits default align and emits non-default align", () => {
    const defaultAlignRoot = mountText(
      renderClbrText({ as: "p", align: "start", children: "Body text" }),
    );
    const defaultAlign = getByText(defaultAlignRoot, "Body text");
    expect(defaultAlign.hasAttribute("data-align")).toBe(false);

    const nonDefaultAlignRoot = mountText(
      renderClbrText({ as: "p", align: "end", children: "Body text" }),
    );
    const nonDefaultAlign = getByText(nonDefaultAlignRoot, "Body text");
    expect(nonDefaultAlign.getAttribute("data-align")).toBe("end");
  });

  it("ignores paragraph-only props when rendered as span", () => {
    const unsafeSpanProps = {
      as: "span",
      children: "Body text",
      // Runtime-guard test for non-typed callers.
      align: "end",
      measured: true,
    } as unknown as Parameters<typeof renderClbrText>[0];

    const root = mountText(renderClbrText(unsafeSpanProps));
    const text = getByText(root, "Body text");

    expect(text.hasAttribute("data-align")).toBe(false);
    expect(text.hasAttribute("data-measured")).toBe(false);
  });

  it("renders trusted inline HTML content", () => {
    const root = mountText(
      renderClbrText({
        children:
          'Body text with <em>emphasis</em>, <strong>strength</strong>, and <a href="/docs">link</a>.',
      }),
    );

    expect(getByText(root, /Body text with/i)).toBeTruthy();
    expect(root.querySelector("em")?.textContent).toBe("emphasis");
    expect(root.querySelector("strong")?.textContent).toBe("strength");
    expect(root.querySelector("a")?.getAttribute("href")).toBe("/docs");
  });
});

describeSpecConsistency<ClbrTextProps>({
  baseProps: { children: "Body" },
  renderer: renderClbrText,
  spec: CLBR_TEXT_SPEC,
});
