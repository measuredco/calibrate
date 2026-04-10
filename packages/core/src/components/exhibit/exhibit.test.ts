import { describe, expect, it } from "vitest";
import { renderClbrExhibit } from "./exhibit";

function mountExhibit(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".exhibit") as HTMLElement;
}

describe("renderClbrExhibit", () => {
  it("renders the default exhibit contract", () => {
    const exhibit = mountExhibit(
      renderClbrExhibit({
        caption: "Caption",
        children: '<img src="/image.jpg" alt="Alt" />',
      }),
    );

    expect(exhibit.tagName).toBe("FIGURE");
    expect(exhibit.className).toBe("exhibit");
    expect(exhibit.hasAttribute("data-align")).toBe(false);
    expect(exhibit.querySelector("img")?.getAttribute("src")).toBe(
      "/image.jpg",
    );
    expect(exhibit.querySelector("figcaption > span.text")?.textContent).toBe(
      "Caption",
    );
    expect(
      exhibit
        .querySelector("figcaption > span.text")
        ?.getAttribute("data-size"),
    ).toBe("sm");
  });

  it("emits non-default align attributes", () => {
    const exhibit = mountExhibit(
      renderClbrExhibit({
        align: "center",
        caption: "Caption",
        children: '<img src="/image.jpg" alt="Alt" />',
      }),
    );

    expect(exhibit.getAttribute("data-align")).toBe("center");
  });

  it("renders trusted HTML for caption and children", () => {
    const exhibit = mountExhibit(
      renderClbrExhibit({
        caption: 'See the <a href="/docs">documentation</a>.',
        children: '<picture><img src="/image.jpg" alt="Alt" /></picture>',
      }),
    );

    expect(exhibit.querySelector("figcaption a")?.getAttribute("href")).toBe(
      "/docs",
    );
    expect(exhibit.querySelector("picture img")).toBeTruthy();
  });

  it("passes responsive through to the caption text", () => {
    const exhibit = mountExhibit(
      renderClbrExhibit({
        caption: "Caption",
        children: '<img src="/image.jpg" alt="Alt" />',
        responsive: true,
      }),
    );

    expect(
      exhibit
        .querySelector("figcaption > span.text")
        ?.hasAttribute("data-responsive"),
    ).toBe(true);
  });
});
