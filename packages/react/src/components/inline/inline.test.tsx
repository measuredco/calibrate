import {
  renderClbrInline,
  type ClbrInlineProps,
} from "@measured/calibrate-core";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Inline } from "./inline";

function toElement(html: string): Element {
  const container = document.createElement("div");
  container.innerHTML = html;
  const child = container.firstElementChild;
  if (!child) throw new Error(`No element in html: ${html}`);
  return child;
}

type Case = {
  name: string;
  core: ClbrInlineProps;
  react: Omit<ClbrInlineProps, "children"> & { children?: React.ReactNode };
};

const CASES: Case[] = [
  { name: "empty default", core: {}, react: {} },
  {
    name: "ul with gap and justify",
    core: {
      as: "ul",
      children: "<li>A</li><li>B</li>",
      gap: "lg",
      justify: "between",
    },
    react: {
      as: "ul",
      children: (
        <>
          <li>A</li>
          <li>B</li>
        </>
      ),
      gap: "lg",
      justify: "between",
    },
  },
  {
    name: "nowrap with align",
    core: { align: "end", children: "<span>x</span>", nowrap: true },
    react: { align: "end", children: <span>x</span>, nowrap: true },
  },
];

describe("Inline adapter matches core SSR DOM", () => {
  for (const { name, core, react } of CASES) {
    it(name, () => {
      const coreEl = toElement(renderClbrInline(core));
      const reactEl = toElement(renderToStaticMarkup(<Inline {...react} />));
      expect(reactEl.isEqualNode(coreEl)).toBe(true);
    });
  }
});
