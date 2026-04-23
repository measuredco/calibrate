import {
  renderClbrPage,
  type ClbrPageProps,
} from "@measured/calibrate-core";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Page, type PageProps } from "./page";

function toElement(html: string): Element {
  const container = document.createElement("div");
  container.innerHTML = html;
  const child = container.firstElementChild;
  if (!child) throw new Error(`No element in html: ${html}`);
  return child;
}

type Case = {
  name: string;
  core: ClbrPageProps;
  react: PageProps;
};

const CASES: Case[] = [
  {
    name: "minimal page with required slots",
    core: {
      footer: "<p>Footer</p>",
      header: "<h1>Home</h1>",
    },
    react: {
      footer: <p>Footer</p>,
      header: <h1>Home</h1>,
    },
  },
  {
    name: "page with main content",
    core: {
      children: "<p>Main body</p>",
      footer: "<p>Footer</p>",
      header: "<h1>Home</h1>",
    },
    react: {
      children: <p>Main body</p>,
      footer: <p>Footer</p>,
      header: <h1>Home</h1>,
    },
  },
  {
    name: "page with banner",
    core: {
      banner: `<div class="banner">Announcement</div>`,
      footer: "<p>Footer</p>",
      header: "<h1>Home</h1>",
    },
    react: {
      banner: <div className="banner">Announcement</div>,
      footer: <p>Footer</p>,
      header: <h1>Home</h1>,
    },
  },
  {
    name: "page with centerMain and stickyHeader",
    core: {
      centerMain: true,
      children: "<p>Centered</p>",
      footer: "<p>Footer</p>",
      header: "<h1>Home</h1>",
      stickyHeader: "always",
    },
    react: {
      centerMain: true,
      children: <p>Centered</p>,
      footer: <p>Footer</p>,
      header: <h1>Home</h1>,
      stickyHeader: "always",
    },
  },
  {
    name: "page with banner + main + sticky belowNotebook",
    core: {
      banner: `<div class="banner">Notice</div>`,
      children: "<section>Content</section>",
      footer: "<p>Footer</p>",
      header: "<nav>Nav</nav>",
      stickyHeader: "belowNotebook",
    },
    react: {
      banner: <div className="banner">Notice</div>,
      children: <section>Content</section>,
      footer: <p>Footer</p>,
      header: <nav>Nav</nav>,
      stickyHeader: "belowNotebook",
    },
  },
];

describe("Page adapter matches core SSR DOM", () => {
  for (const { name, core, react } of CASES) {
    it(name, () => {
      const coreHtml = renderClbrPage(core);
      const reactHtml = renderToStaticMarkup(<Page {...react} />);
      const coreEl = toElement(coreHtml);
      const reactEl = toElement(reactHtml);
      expect(reactEl.isEqualNode(coreEl)).toBe(true);
    });
  }

  it("composes nested React slot content", () => {
    const reactHtml = renderToStaticMarkup(
      <Page
        banner={<span>Banner text</span>}
        footer={<p>Footer paragraph</p>}
        header={
          <>
            <h1>Title</h1>
            <p>Tagline</p>
          </>
        }
      >
        <article>
          <h2>Article</h2>
          <p>Body</p>
        </article>
      </Page>,
    );
    const el = toElement(reactHtml) as HTMLElement;
    expect(el.className).toBe("clbr-page");
    expect(el.querySelector("header")!.children).toHaveLength(2);
    expect(el.querySelector("main > article > h2")!.textContent).toBe(
      "Article",
    );
    expect(el.querySelector("footer > p")!.textContent).toBe("Footer paragraph");
  });

  it("omits banner when not provided", () => {
    const reactHtml = renderToStaticMarkup(
      <Page footer={<p>F</p>} header={<h1>H</h1>} />,
    );
    const el = toElement(reactHtml) as HTMLElement;
    expect(el.children).toHaveLength(3);
    expect(el.children[0].tagName.toLowerCase()).toBe("header");
    expect(el.children[1].tagName.toLowerCase()).toBe("main");
    expect(el.children[2].tagName.toLowerCase()).toBe("footer");
  });

  const nodeCases: { name: string; slot: ReactNode }[] = [
    { name: "null", slot: null },
    { name: "false", slot: false },
    { name: "empty string", slot: "" },
  ];

  for (const { name, slot } of nodeCases) {
    it(`treats ${name} banner as not provided`, () => {
      const reactHtml = renderToStaticMarkup(
        <Page banner={slot} footer={<p>F</p>} header={<h1>H</h1>} />,
      );
      const el = toElement(reactHtml) as HTMLElement;
      expect(el.children).toHaveLength(3);
      expect(el.children[0].tagName.toLowerCase()).toBe("header");
    });
  }
});
