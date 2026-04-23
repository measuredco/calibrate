import {
  renderClbrButton,
  type ClbrButtonProps,
} from "@measured/calibrate-core";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

/**
 * Parses an HTML fragment into a single root element inside a fresh
 * container, so we can compare DOM structure regardless of attribute
 * order or whitespace quirks.
 */
function toElement(html: string): Element {
  const container = document.createElement("div");
  container.innerHTML = html;
  const child = container.firstElementChild;
  if (!child) throw new Error(`No element in html: ${html}`);
  return child;
}

const CASES: { name: string; props: ClbrButtonProps }[] = [
  { name: "default button", props: { label: "Save" } },
  { name: "neutral tone", props: { label: "Save", tone: "neutral" } },
  {
    name: "submit button with form owner",
    props: {
      form: "profile-form",
      label: "Save",
      mode: "button",
      type: "submit",
      value: "save",
    },
  },
  {
    name: "disclosure button",
    props: {
      controls: "sidebar",
      disclosure: true,
      haspopup: "menu",
      label: "Open sidebar",
    },
  },
  {
    name: "disabled solid button",
    props: {
      appearance: "solid",
      disabled: true,
      label: "Save",
      size: "lg",
    },
  },
  {
    name: "icon-leading button",
    props: {
      icon: "check",
      label: "Save",
    },
  },
  {
    name: "icon-trailing button with hidden label",
    props: {
      icon: "arrow-right",
      iconPlacement: "end",
      label: "Next",
      labelVisibility: "hidden",
    },
  },
  {
    name: "mirrored icon",
    props: {
      icon: "arrow-right",
      iconMirrored: "rtl",
      label: "Back",
    },
  },
  {
    name: "basic link mode",
    props: { href: "/about", label: "About", mode: "link" },
  },
  {
    name: "link with target and rel",
    props: {
      href: "https://example.com",
      label: "Docs",
      mode: "link",
      rel: "noopener",
      target: "_blank",
    },
  },
  {
    name: "link with download ignores rel/target",
    props: {
      download: "report.pdf",
      href: "/files/report.pdf",
      label: "Download",
      mode: "link",
      rel: "noopener",
      target: "_blank",
    },
  },
  {
    name: "escape-sensitive label",
    props: { label: `<script>alert("hi")</script> & "ok"` },
  },
];

describe("Button adapter matches core SSR DOM", () => {
  for (const { name, props } of CASES) {
    it(name, () => {
      const coreHtml = renderClbrButton(props);
      const reactHtml = renderToStaticMarkup(<Button {...props} />);
      const coreEl = toElement(coreHtml);
      const reactEl = toElement(reactHtml);
      expect(reactEl.isEqualNode(coreEl)).toBe(true);
    });
  }

  it("throws when labelVisibility requires an icon", () => {
    expect(() =>
      renderToStaticMarkup(<Button label="Save" labelVisibility="hidden" />),
    ).toThrow("labelVisibility requires icon when label is not visible.");
  });
});
