import {
  renderClbrSidebar,
  type ClbrSidebarProps,
} from "@measured/calibrate-core";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Sidebar, type SidebarProps } from "./sidebar";

function toElement(html: string): Element {
  const container = document.createElement("div");
  container.innerHTML = html;
  const child = container.firstElementChild;
  if (!child) throw new Error(`No element in html: ${html}`);
  return child;
}

type Case = { name: string; core: ClbrSidebarProps; react: SidebarProps };

const CASES: Case[] = [
  {
    name: "minimal",
    core: { id: "main-nav" },
    react: { id: "main-nav" },
  },
  {
    name: "with header and content",
    core: {
      children: "<p>Body</p>",
      header: "<h2>Nav</h2>",
      id: "main-nav",
    },
    react: {
      children: <p>Body</p>,
      header: <h2>Nav</h2>,
      id: "main-nav",
    },
  },
  {
    name: "with footer, overlay, sm size",
    core: {
      aboveNotebook: "overlay",
      children: "<p>Body</p>",
      footer: "<p>Copyright</p>",
      id: "main-nav",
      size: "sm",
    },
    react: {
      aboveNotebook: "overlay",
      children: <p>Body</p>,
      footer: <p>Copyright</p>,
      id: "main-nav",
      size: "sm",
    },
  },
];

describe("Sidebar adapter matches core SSR DOM", () => {
  for (const { name, core, react } of CASES) {
    it(name, () => {
      const coreEl = toElement(renderClbrSidebar(core));
      const reactEl = toElement(renderToStaticMarkup(<Sidebar {...react} />));
      expect(reactEl.isEqualNode(coreEl)).toBe(true);
    });
  }

  it("throws on invalid id", () => {
    expect(() => renderToStaticMarkup(<Sidebar id="1bad" />)).toThrow(
      "id must start with a letter",
    );
  });
});
