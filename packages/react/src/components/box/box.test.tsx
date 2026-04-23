import { renderClbrBox, type ClbrBoxProps } from "@measured/calibrate-core";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Box } from "./box";

function toElement(html: string): Element {
  const container = document.createElement("div");
  container.innerHTML = html;
  const child = container.firstElementChild;
  if (!child) throw new Error(`No element in html: ${html}`);
  return child;
}

type Case = {
  name: string;
  core: ClbrBoxProps;
  react: Omit<ClbrBoxProps, "children"> & { children?: React.ReactNode };
};

const CASES: Case[] = [
  { name: "empty", core: {}, react: {} },
  {
    name: "padded panel",
    core: {
      background: "panel",
      border: true,
      children: "<p>Hi</p>",
      paddingBlock: "lg",
    },
    react: {
      background: "panel",
      border: true,
      children: <p>Hi</p>,
      paddingBlock: "lg",
    },
  },
  {
    name: "transparent with radius",
    core: { background: "transparent", radius: "md" },
    react: { background: "transparent", radius: "md" },
  },
];

describe("Box adapter matches core SSR DOM", () => {
  for (const { name, core, react } of CASES) {
    it(name, () => {
      const coreEl = toElement(renderClbrBox(core));
      const reactEl = toElement(renderToStaticMarkup(<Box {...react} />));
      expect(reactEl.isEqualNode(coreEl)).toBe(true);
    });
  }
});
