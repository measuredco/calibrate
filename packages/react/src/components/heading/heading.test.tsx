import {
  renderClbrHeading,
  type ClbrHeadingProps,
} from "@measured/calibrate-core";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Heading } from "./heading";

function toElement(html: string): Element {
  const container = document.createElement("div");
  container.innerHTML = html;
  const child = container.firstElementChild;
  if (!child) throw new Error(`No element in html: ${html}`);
  return child;
}

const CASES: { name: string; props: ClbrHeadingProps }[] = [
  { name: "default span", props: { children: "Title" } },
  { name: "h1 xl", props: { children: "Title", level: 1, size: "xl" } },
  { name: "h2 with center align", props: { align: "center", children: "Centered", level: 2 } },
  { name: "escape-sensitive", props: { children: `<script>alert("x")</script>` } },
];

describe("Heading adapter matches core SSR DOM", () => {
  for (const { name, props } of CASES) {
    it(name, () => {
      const coreEl = toElement(renderClbrHeading(props));
      const reactEl = toElement(
        renderToStaticMarkup(<Heading {...props}>{props.children}</Heading>),
      );
      expect(reactEl.isEqualNode(coreEl)).toBe(true);
    });
  }

  it("composes nested React children", () => {
    const html = renderToStaticMarkup(
      <Heading level={1}>
        Title <em>italic</em>
      </Heading>,
    );
    const el = toElement(html) as HTMLElement;
    expect(el.tagName.toLowerCase()).toBe("h1");
    expect(el.querySelector("em")?.textContent).toBe("italic");
  });
});
