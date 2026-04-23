import {
  type ClbrSurfaceProps,
  renderClbrSurface,
} from "@measured/calibrate-core";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Surface } from "./surface";

function toElement(html: string): Element {
  const container = document.createElement("div");
  container.innerHTML = html;
  const child = container.firstElementChild;
  if (!child) throw new Error(`No element in html: ${html}`);
  return child;
}

type Case = {
  name: string;
  core: ClbrSurfaceProps;
  react: Omit<ClbrSurfaceProps, "children"> & { children: React.ReactNode };
};

const CASES: Case[] = [
  {
    name: "default variant",
    core: { children: "<p>Body</p>" },
    react: { children: <p>Body</p> },
  },
  {
    name: "brand variant",
    core: { children: "<p>Body</p>", variant: "brand" },
    react: { children: <p>Body</p>, variant: "brand" },
  },
  {
    name: "brand-inverse variant",
    core: { children: "<p>Body</p>", variant: "brand-inverse" },
    react: { children: <p>Body</p>, variant: "brand-inverse" },
  },
];

describe("Surface adapter matches core SSR DOM", () => {
  for (const { name, core, react } of CASES) {
    it(name, () => {
      const coreEl = toElement(renderClbrSurface(core));
      const reactEl = toElement(renderToStaticMarkup(<Surface {...react} />));
      expect(reactEl.isEqualNode(coreEl)).toBe(true);
    });
  }
});
