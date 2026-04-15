import { describe, expect, it } from "vitest";
import { renderClbrPage } from "./page";

function mountPage(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".page") as HTMLElement;
}

describe("renderClbrPage", () => {
  it("renders the page shell with prescribed regions", () => {
    const page = mountPage(
      renderClbrPage({
        children: "Main",
        centered: true,
        footer: "<div>Footer</div>",
        header: "<div>Header</div>",
      }),
    );

    expect(page.tagName).toBe("DIV");
    expect(page.className).toBe("page");
    expect(page.hasAttribute("data-centered")).toBe(true);
    expect(page.hasAttribute("data-sticky-header")).toBe(false);
    expect(page.querySelector("header")?.textContent).toBe("Header");
    expect(page.querySelector(".main")?.textContent).toBe("Main");
    expect(page.querySelector("footer")?.textContent).toBe("Footer");
  });

  it("renders trusted main HTML without escaping", () => {
    const page = mountPage(
      renderClbrPage({
        children: "<p>Main <em>body</em></p>",
        footer: '<a href="/footer">Footer</a>',
        header: '<a href="/header">Header</a>',
      }),
    );

    expect(page.querySelector(".main em")?.textContent).toBe("body");
    expect(page.querySelector("header a")?.getAttribute("href")).toBe(
      "/header",
    );
    expect(page.querySelector("footer a")?.getAttribute("href")).toBe(
      "/footer",
    );
  });

  it("omits data-centered when centered is false", () => {
    const page = mountPage(
      renderClbrPage({
        children: "Main",
        footer: "<div>Footer</div>",
        header: "<div>Header</div>",
      }),
    );

    expect(page.hasAttribute("data-centered")).toBe(false);
  });

  it("emits data-sticky-header when provided", () => {
    const page = mountPage(
      renderClbrPage({
        children: "Main",
        footer: "<div>Footer</div>",
        header: "<div>Header</div>",
        stickyHeader: "always",
      }),
    );

    expect(page.getAttribute("data-sticky-header")).toBe("always");
  });
});
