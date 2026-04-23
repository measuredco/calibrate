import { renderClbrStack, type ClbrStackProps } from "@measured/calibrate-core";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Stack } from "./stack";

function toElement(html: string): Element {
  const container = document.createElement("div");
  container.innerHTML = html;
  const child = container.firstElementChild;
  if (!child) throw new Error(`No element in html: ${html}`);
  return child;
}

type Case = {
  name: string;
  core: ClbrStackProps;
  react: Omit<ClbrStackProps, "children"> & { children?: React.ReactNode };
};

const CASES: Case[] = [
  { name: "empty default", core: {}, react: {} },
  {
    name: "ul gap lg responsive",
    core: {
      as: "ul",
      children: "<li>A</li>",
      gap: "lg",
      responsive: true,
    },
    react: {
      as: "ul",
      children: <li>A</li>,
      gap: "lg",
      responsive: true,
    },
  },
  {
    name: "align center no gap",
    core: { align: "center", children: "<p>x</p>", gap: "none" },
    react: { align: "center", children: <p>x</p>, gap: "none" },
  },
];

describe("Stack adapter matches core SSR DOM", () => {
  for (const { name, core, react } of CASES) {
    it(name, () => {
      const coreEl = toElement(renderClbrStack(core));
      const reactEl = toElement(renderToStaticMarkup(<Stack {...react} />));
      expect(reactEl.isEqualNode(coreEl)).toBe(true);
    });
  }
});
