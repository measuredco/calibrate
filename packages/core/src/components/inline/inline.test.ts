import { getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { renderClbrInline } from "./inline";

function mountInline(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrInline", () => {
  it("renders an inline div with default align/gap and no nowrap attribute", () => {
    const root = mountInline(renderClbrInline({ children: "Body" }));
    const inline = getByText(root, "Body");

    expect(inline.tagName).toBe("DIV");
    expect(inline.classList.contains("inline")).toBe(true);
    expect(inline.hasAttribute("data-align")).toBe(false);
    expect(inline.getAttribute("data-gap")).toBe("md");
    expect(inline.hasAttribute("data-justify")).toBe(false);
    expect(inline.hasAttribute("data-nowrap")).toBe(false);
  });

  it("renders a ul when as is ul", () => {
    const root = mountInline(
      renderClbrInline({ as: "ul", children: "<li>Body</li>" }),
    );
    const inline = root.querySelector(".inline");

    expect(inline?.tagName).toBe("UL");
    expect(inline?.getAttribute("data-gap")).toBe("md");
    expect(inline?.hasAttribute("data-align")).toBe(false);
    expect(inline?.hasAttribute("data-justify")).toBe(false);
    expect(inline?.hasAttribute("data-nowrap")).toBe(false);
  });

  it("renders trusted HTML content when children is provided", () => {
    const root = mountInline(
      renderClbrInline({
        children: '<p>Lorem <em>ipsum</em> <a href="/docs">docs</a></p>',
      }),
    );

    expect(root.querySelector("p")?.textContent).toContain("Lorem");
    expect(root.querySelector("em")?.textContent).toBe("ipsum");
    expect(root.querySelector("a")?.getAttribute("href")).toBe("/docs");
  });

  it("allows omitted and empty children without throwing", () => {
    const omittedRoot = mountInline(renderClbrInline({}));
    const omittedInline = omittedRoot.querySelector(".inline");

    expect(omittedInline).toBeTruthy();
    expect(omittedInline?.innerHTML).toBe("");

    const emptyRoot = mountInline(renderClbrInline({ children: "" }));
    const emptyInline = emptyRoot.querySelector(".inline");

    expect(emptyInline).toBeTruthy();
    expect(emptyInline?.innerHTML).toBe("");
  });

  it("always emits data-gap for all variants", () => {
    const twoxsRoot = mountInline(
      renderClbrInline({ children: "Body", gap: "2xs" }),
    );
    const twoxsInline = getByText(twoxsRoot, "Body");
    expect(twoxsInline.getAttribute("data-gap")).toBe("2xs");

    const xsRoot = mountInline(
      renderClbrInline({ children: "Body", gap: "xs" }),
    );
    const xsInline = getByText(xsRoot, "Body");
    expect(xsInline.getAttribute("data-gap")).toBe("xs");

    const smRoot = mountInline(
      renderClbrInline({ children: "Body", gap: "sm" }),
    );
    const smInline = getByText(smRoot, "Body");
    expect(smInline.getAttribute("data-gap")).toBe("sm");

    const lgRoot = mountInline(
      renderClbrInline({ children: "Body", gap: "lg" }),
    );
    const lgInline = getByText(lgRoot, "Body");
    expect(lgInline.getAttribute("data-gap")).toBe("lg");
  });

  it("emits data-align for non-default variants", () => {
    const startRoot = mountInline(
      renderClbrInline({ align: "start", children: "Body" }),
    );
    const startInline = getByText(startRoot, "Body");
    expect(startInline.getAttribute("data-align")).toBe("start");

    const centerRoot = mountInline(
      renderClbrInline({ align: "center", children: "Body" }),
    );
    const centerInline = getByText(centerRoot, "Body");
    expect(centerInline.hasAttribute("data-align")).toBe(false);

    const endRoot = mountInline(
      renderClbrInline({ align: "end", children: "Body" }),
    );
    const endInline = getByText(endRoot, "Body");
    expect(endInline.getAttribute("data-align")).toBe("end");
  });

  it("emits data-nowrap only when nowrap is true", () => {
    const nowrapRoot = mountInline(
      renderClbrInline({ children: "Body", nowrap: true }),
    );
    const nowrapInline = getByText(nowrapRoot, "Body");
    expect(nowrapInline.hasAttribute("data-nowrap")).toBe(true);

    const wrapRoot = mountInline(
      renderClbrInline({ children: "Body", nowrap: false }),
    );
    const wrapInline = getByText(wrapRoot, "Body");
    expect(wrapInline.hasAttribute("data-nowrap")).toBe(false);
  });

  it("emits data-justify for non-default variants", () => {
    const startRoot = mountInline(
      renderClbrInline({ children: "Body", justify: "start" }),
    );
    const startInline = getByText(startRoot, "Body");
    expect(startInline.hasAttribute("data-justify")).toBe(false);

    const centerRoot = mountInline(
      renderClbrInline({ children: "Body", justify: "center" }),
    );
    const centerInline = getByText(centerRoot, "Body");
    expect(centerInline.getAttribute("data-justify")).toBe("center");

    const endRoot = mountInline(
      renderClbrInline({ children: "Body", justify: "end" }),
    );
    const endInline = getByText(endRoot, "Body");
    expect(endInline.getAttribute("data-justify")).toBe("end");

    const betweenRoot = mountInline(
      renderClbrInline({ children: "Body", justify: "between" }),
    );
    const betweenInline = getByText(betweenRoot, "Body");
    expect(betweenInline.getAttribute("data-justify")).toBe("between");
  });
});
