import { renderClbrNav, type ClbrNavProps } from "@measured/calibrate-core";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Nav } from "./nav";

function toElement(html: string): Element {
  const container = document.createElement("div");
  container.innerHTML = html;
  const child = container.firstElementChild;
  if (!child) throw new Error(`No element in html: ${html}`);
  return child;
}

const CASES: { name: string; props: ClbrNavProps }[] = [
  {
    name: "minimal nav",
    props: {
      items: [
        { href: "/", label: "Home" },
        { href: "/docs", label: "Docs" },
      ],
    },
  },
  {
    name: "with label and current item",
    props: {
      items: [
        { current: true, href: "/", label: "Home" },
        { href: "/docs", label: "Docs" },
      ],
      label: "Primary",
    },
  },
  {
    name: "collapsible with contentId",
    props: {
      collapsible: "belowTablet",
      contentId: "nav-content",
      expanderLabel: "Menu",
      items: [{ href: "/", label: "Home" }],
      size: "sm",
    },
  },
];

describe("Nav adapter matches core SSR DOM", () => {
  for (const { name, props } of CASES) {
    it(name, () => {
      const coreEl = toElement(renderClbrNav(props));
      const reactEl = toElement(renderToStaticMarkup(<Nav {...props} />));
      expect(reactEl.isEqualNode(coreEl)).toBe(true);
    });
  }

  it("throws when collapsible is set without contentId", () => {
    expect(() =>
      renderToStaticMarkup(
        <Nav collapsible="always" items={[{ href: "/", label: "Home" }]} />,
      ),
    ).toThrow("contentId must be a non-empty string when collapsible is set.");
  });
});
