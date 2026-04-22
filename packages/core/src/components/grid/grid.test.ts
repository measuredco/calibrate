import { getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../testing/spec";
import {
  CLBR_GRID_ITEM_SPEC,
  CLBR_GRID_SPEC,
  renderClbrGrid,
  renderClbrGridItem,
  type ClbrGridItemProps,
  type ClbrGridProps,
} from "./grid";

function mountGrid(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrGrid", () => {
  it("renders a grid container with inner grid and default gap omitted", () => {
    const root = mountGrid(renderClbrGrid({ children: "Body" }));
    const gridContainer = root.querySelector(".grid-container");
    const grid = root.querySelector(".grid");

    expect(gridContainer?.tagName).toBe("DIV");
    expect(gridContainer?.classList.contains("grid-container")).toBe(true);
    expect(grid?.classList.contains("grid")).toBe(true);
    expect(grid?.hasAttribute("data-gap")).toBe(false);
  });

  it("emits explicit non-default gap values", () => {
    const expandedRoot = mountGrid(
      renderClbrGrid({ children: "Body", gap: "expanded" }),
    );
    const expandedGrid = expandedRoot.querySelector(".grid");

    expect(expandedGrid?.getAttribute("data-gap")).toBe("expanded");

    const noneRoot = mountGrid(
      renderClbrGrid({ children: "Body", gap: "none" }),
    );
    const noneGrid = noneRoot.querySelector(".grid");

    expect(noneGrid?.getAttribute("data-gap")).toBe("none");
  });

  it("renders trusted HTML children", () => {
    const root = mountGrid(
      renderClbrGrid({
        children: '<p>Lorem <em>ipsum</em> <a href="/docs">docs</a></p>',
      }),
    );

    expect(root.querySelector("p")?.textContent).toContain("Lorem");
    expect(root.querySelector("em")?.textContent).toBe("ipsum");
    expect(root.querySelector("a")?.getAttribute("href")).toBe("/docs");
  });
});

describe("renderClbrGridItem", () => {
  it("renders a grid item div with default attrs omitted", () => {
    const root = mountGrid(renderClbrGridItem({ children: "Item" }));
    const item = getByText(root, "Item");

    expect(item.tagName).toBe("DIV");
    expect(item.classList.contains("grid-item")).toBe(true);
    expect(item.hasAttribute("data-align")).toBe(false);
    expect(item.hasAttribute("data-justify")).toBe(false);
    expect(item.hasAttribute("data-col-span")).toBe(false);
    expect(item.hasAttribute("data-col-span-narrow")).toBe(false);
    expect(item.hasAttribute("data-col-start")).toBe(false);
    expect(item.hasAttribute("data-col-start-narrow")).toBe(false);
    expect(item.hasAttribute("data-col-span-wide")).toBe(false);
    expect(item.hasAttribute("data-col-start-wide")).toBe(false);
    expect(item.hasAttribute("data-row-span-narrow")).toBe(false);
    expect(item.hasAttribute("data-row-span")).toBe(false);
    expect(item.hasAttribute("data-row-span-wide")).toBe(false);
    expect(item.hasAttribute("data-row-start-narrow")).toBe(false);
    expect(item.hasAttribute("data-row-start")).toBe(false);
    expect(item.hasAttribute("data-row-start-wide")).toBe(false);
  });

  it("emits explicit placement and alignment attrs", () => {
    const root = mountGrid(
      renderClbrGridItem({
        align: "center",
        children: "Item",
        colSpan: 6,
        colSpanNarrow: 8,
        colSpanWide: 5,
        colStart: 2,
        colStartNarrow: 3,
        colStartWide: 8,
        justify: "end",
        rowSpanNarrow: 3,
        rowSpan: 2,
        rowSpanWide: 4,
        rowStartNarrow: 1,
        rowStart: 4,
        rowStartWide: 6,
      }),
    );
    const item = getByText(root, "Item");

    expect(item.getAttribute("data-align")).toBe("center");
    expect(item.getAttribute("data-justify")).toBe("end");
    expect(item.getAttribute("data-col-span")).toBe("6");
    expect(item.getAttribute("data-col-span-narrow")).toBe("8");
    expect(item.getAttribute("data-col-span-wide")).toBe("5");
    expect(item.getAttribute("data-col-start")).toBe("2");
    expect(item.getAttribute("data-col-start-narrow")).toBe("3");
    expect(item.getAttribute("data-col-start-wide")).toBe("8");
    expect(item.getAttribute("data-row-span-narrow")).toBe("3");
    expect(item.getAttribute("data-row-span")).toBe("2");
    expect(item.getAttribute("data-row-span-wide")).toBe("4");
    expect(item.getAttribute("data-row-start-narrow")).toBe("1");
    expect(item.getAttribute("data-row-start")).toBe("4");
    expect(item.getAttribute("data-row-start-wide")).toBe("6");
  });

  it('emits "start" when explicitly provided for align/justify', () => {
    const root = mountGrid(
      renderClbrGridItem({
        align: "start",
        children: "Item",
        justify: "start",
      }),
    );
    const item = getByText(root, "Item");

    expect(item.getAttribute("data-align")).toBe("start");
    expect(item.getAttribute("data-justify")).toBe("start");
  });

  it("composes correctly when mapped into grid children", () => {
    const items = [
      renderClbrGridItem({ children: "A", colSpan: 6 }),
      renderClbrGridItem({ children: "B", colSpan: 6 }),
    ];
    const root = mountGrid(renderClbrGrid({ children: items.join("") }));

    expect(getByText(root, "A").classList.contains("grid-item")).toBe(true);
    expect(getByText(root, "B").classList.contains("grid-item")).toBe(true);
  });
});

describeSpecConsistency<ClbrGridProps>({
  baseProps: {},
  renderer: renderClbrGrid,
  spec: CLBR_GRID_SPEC,
});

describeSpecConsistency<ClbrGridItemProps>({
  baseProps: {},
  renderer: renderClbrGridItem,
  spec: CLBR_GRID_ITEM_SPEC,
});
