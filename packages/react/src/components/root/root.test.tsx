import { type ClbrRootProps, renderClbrRoot } from "@measured/calibrate-core";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Root } from "./root";

function toElement(html: string): Element {
  const container = document.createElement("div");
  container.innerHTML = html;
  const child = container.firstElementChild;
  if (!child) throw new Error(`No element in html: ${html}`);
  return child;
}

type Case = {
  name: string;
  core: ClbrRootProps;
  react: Omit<ClbrRootProps, "children"> & { children: React.ReactNode };
};

const CASES: Case[] = [
  {
    name: "defaults with children",
    core: { children: "<p>Body</p>" },
    react: { children: <p>Body</p> },
  },
  {
    name: "brand + theme + dir + lang",
    core: {
      brand: "wrfr",
      children: "<p>Body</p>",
      dir: "rtl",
      lang: "en-GB",
      theme: "dark",
    },
    react: {
      brand: "wrfr",
      children: <p>Body</p>,
      dir: "rtl",
      lang: "en-GB",
      theme: "dark",
    },
  },
  {
    name: "appRoot + appOverscrollBehavior",
    core: {
      appOverscrollBehavior: "none",
      appRoot: true,
      children: "<p>Body</p>",
    },
    react: {
      appOverscrollBehavior: "none",
      appRoot: true,
      children: <p>Body</p>,
    },
  },
];

describe("Root adapter matches core SSR DOM", () => {
  for (const { name, core, react } of CASES) {
    it(name, () => {
      const coreEl = toElement(renderClbrRoot(core));
      const reactEl = toElement(renderToStaticMarkup(<Root {...react} />));
      expect(reactEl.isEqualNode(coreEl)).toBe(true);
    });
  }
});
