import { renderClbrLink, type ClbrLinkProps } from "@measured/calibrate-core";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Link, type LinkProps } from "./link";

function toElement(html: string): Element {
  const container = document.createElement("div");
  container.innerHTML = html;
  const child = container.firstElementChild;
  if (!child) throw new Error(`No element in html: ${html}`);
  return child;
}

type Case = { name: string; core: ClbrLinkProps; react: LinkProps };

const CASES: Case[] = [
  {
    name: "basic link",
    core: { href: "/docs", label: "Docs" },
    react: { href: "/docs", label: "Docs" },
  },
  {
    name: "with icon markup",
    core: {
      href: "/docs",
      icon: '<svg class="i" aria-hidden="true"></svg>',
      label: "Docs",
    },
    react: {
      href: "/docs",
      icon: <svg aria-hidden="true" className="i" />,
      label: "Docs",
    },
  },
  {
    name: "external neutral underline",
    core: {
      href: "https://example.com",
      label: "Example",
      rel: "noopener",
      target: "_blank",
      tone: "neutral",
      underline: true,
    },
    react: {
      href: "https://example.com",
      label: "Example",
      rel: "noopener",
      target: "_blank",
      tone: "neutral",
      underline: true,
    },
  },
  {
    name: "escape-sensitive label",
    core: { href: "/x", label: `<script>alert("x")</script>` },
    react: { href: "/x", label: `<script>alert("x")</script>` },
  },
];

describe("Link adapter matches core SSR DOM", () => {
  for (const { name, core, react } of CASES) {
    it(name, () => {
      const coreEl = toElement(renderClbrLink(core));
      const reactEl = toElement(renderToStaticMarkup(<Link {...react} />));
      expect(reactEl.isEqualNode(coreEl)).toBe(true);
    });
  }

  it("accepts JSX label content", () => {
    const html = renderToStaticMarkup(
      <Link href="/x" label={<strong>Bold</strong>} />,
    );
    const el = toElement(html) as HTMLElement;
    expect(el.tagName.toLowerCase()).toBe("a");
    expect(el.querySelector(".label strong")?.textContent).toBe("Bold");
  });
});
