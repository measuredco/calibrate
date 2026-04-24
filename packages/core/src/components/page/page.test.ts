import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../test/spec";
import { CLBR_PAGE_SPEC, type ClbrPageProps, renderClbrPage } from "./page";

function mountPage(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrPage", () => {
  it("renders the page shell with prescribed regions", () => {
    const root = mountPage(
      renderClbrPage({
        banner: '<div class="page-banner">Banner</div>',
        children: "Main",
        centerMain: true,
        footer: "<div>Footer</div>",
        header: "<div>Header</div>",
      }),
    );
    const page = root.querySelector(".clbr-page") as HTMLElement;

    expect(page.tagName).toBe("DIV");
    expect(page.className).toBe("clbr-page");
    expect(page.hasAttribute("data-center-main")).toBe(true);
    expect(page.hasAttribute("data-sticky-header")).toBe(false);
    expect(page.firstElementChild?.className).toBe("page-banner");
    expect(page.querySelector("header")?.textContent).toBe("Header");
    expect(page.querySelector(".main")?.textContent).toBe("Main");
    expect(page.querySelector("footer")?.textContent).toBe("Footer");
  });

  it("renders trusted main HTML without escaping", () => {
    const root = mountPage(
      renderClbrPage({
        banner: '<a href="/banner">Banner</a>',
        children: "<p>Main <em>body</em></p>",
        footer: '<a href="/footer">Footer</a>',
        header: '<a href="/header">Header</a>',
      }),
    );
    const page = root.querySelector(".clbr-page") as HTMLElement;

    expect(page.querySelector(".main em")?.textContent).toBe("body");
    expect(page.firstElementChild?.getAttribute("href")).toBe("/banner");
    expect(page.querySelector("header a")?.getAttribute("href")).toBe(
      "/header",
    );
    expect(page.querySelector("footer a")?.getAttribute("href")).toBe(
      "/footer",
    );
  });

  it("omits data-center-main when centerMain is false", () => {
    const root = mountPage(
      renderClbrPage({
        children: "Main",
        footer: "<div>Footer</div>",
        header: "<div>Header</div>",
      }),
    );

    expect(
      root.querySelector(".clbr-page")?.hasAttribute("data-center-main"),
    ).toBe(false);
  });

  it("omits banner content when banner is not provided", () => {
    const root = mountPage(
      renderClbrPage({
        children: "Main",
        footer: "<div>Footer</div>",
        header: "<div>Header</div>",
      }),
    );

    expect(root.querySelector(".clbr-page")?.firstElementChild?.tagName).toBe(
      "HEADER",
    );
  });

  it("emits data-sticky-header when provided", () => {
    const root = mountPage(
      renderClbrPage({
        children: "Main",
        footer: "<div>Footer</div>",
        header: "<div>Header</div>",
        stickyHeader: "always",
      }),
    );

    expect(
      root.querySelector(".clbr-page")?.getAttribute("data-sticky-header"),
    ).toBe("always");
  });
});

describeSpecConsistency<ClbrPageProps>({
  baseProps: { footer: "<div>F</div>", header: "<div>H</div>" },
  renderer: renderClbrPage,
  spec: CLBR_PAGE_SPEC,
});
