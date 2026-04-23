import {
  renderClbrLogo,
  type ClbrLogoProps,
} from "@measured/calibrate-core";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Logo } from "./logo";

function toElement(html: string): Element {
  const container = document.createElement("div");
  container.innerHTML = html;
  const child = container.firstElementChild;
  if (!child) throw new Error(`No element in html: ${html}`);
  return child;
}

const CASES: { name: string; props: ClbrLogoProps }[] = [
  { name: "default", props: { label: "Brand" } },
  { name: "lg neutral", props: { label: "Brand", size: "lg", tone: "neutral" } },
  { name: "graphic variant", props: { label: "Brand", variant: "graphic" } },
];

describe("Logo adapter matches core SSR DOM", () => {
  for (const { name, props } of CASES) {
    it(name, () => {
      const coreEl = toElement(renderClbrLogo(props));
      const reactEl = toElement(renderToStaticMarkup(<Logo {...props} />));
      expect(reactEl.isEqualNode(coreEl)).toBe(true);
    });
  }
});
