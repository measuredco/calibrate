import {
  renderClbrContainer,
  type ClbrContainerProps,
} from "@measured/calibrate-core";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Container } from "./container";

function toElement(html: string): Element {
  const container = document.createElement("div");
  container.innerHTML = html;
  const child = container.firstElementChild;
  if (!child) throw new Error(`No element in html: ${html}`);
  return child;
}

type Case = {
  name: string;
  core: ClbrContainerProps;
  react: Omit<ClbrContainerProps, "children"> & {
    children?: React.ReactNode;
  };
};

const CASES: Case[] = [
  { name: "empty", core: {}, react: {} },
  {
    name: "narrow gutter with children",
    core: { children: "<p>Body</p>", gutter: "narrow" },
    react: { children: <p>Body</p>, gutter: "narrow" },
  },
  {
    name: "wide max inline size",
    core: { maxInlineSize: "wide" },
    react: { maxInlineSize: "wide" },
  },
];

describe("Container adapter matches core SSR DOM", () => {
  for (const { name, core, react } of CASES) {
    it(name, () => {
      const coreEl = toElement(renderClbrContainer(core));
      const reactEl = toElement(renderToStaticMarkup(<Container {...react} />));
      expect(reactEl.isEqualNode(coreEl)).toBe(true);
    });
  }
});
