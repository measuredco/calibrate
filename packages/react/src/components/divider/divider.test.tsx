import {
  renderClbrDivider,
  type ClbrDividerProps,
} from "@measured/calibrate-core";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Divider } from "./divider";

function toElement(html: string): Element {
  const container = document.createElement("div");
  container.innerHTML = html;
  const child = container.firstElementChild;
  if (!child) throw new Error(`No element in html: ${html}`);
  return child;
}

const CASES: { name: string; props: ClbrDividerProps }[] = [
  { name: "default horizontal", props: {} },
  { name: "vertical", props: { orientation: "vertical" } },
  { name: "subtle tone", props: { tone: "subtle" } },
  { name: "brand tone vertical", props: { orientation: "vertical", tone: "brand" } },
];

describe("Divider adapter matches core SSR DOM", () => {
  for (const { name, props } of CASES) {
    it(name, () => {
      const coreEl = toElement(renderClbrDivider(props));
      const reactEl = toElement(renderToStaticMarkup(<Divider {...props} />));
      expect(reactEl.isEqualNode(coreEl)).toBe(true);
    });
  }
});
