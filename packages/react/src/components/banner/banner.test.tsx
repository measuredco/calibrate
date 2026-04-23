import {
  renderClbrBanner,
  type ClbrBannerProps,
} from "@measured/calibrate-core";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Banner } from "./banner";

function toElement(html: string): Element {
  const container = document.createElement("div");
  container.innerHTML = html;
  const child = container.firstElementChild;
  if (!child) throw new Error(`No element in html: ${html}`);
  return child;
}

const CASES: { name: string; props: ClbrBannerProps }[] = [
  { name: "default dismissible banner", props: { message: "Notice" } },
  {
    name: "not dismissible",
    props: { dismissible: false, message: "Notice" },
  },
  {
    name: "custom dismiss label",
    props: {
      dismissible: true,
      dismissibleLabel: "Close banner",
      message: "Notice",
    },
  },
  {
    name: "with action link",
    props: {
      actionHref: "/docs",
      actionLabel: "Learn more",
      message: "Notice",
    },
  },
  {
    name: "tone success",
    props: { message: "Saved", tone: "success" },
  },
  {
    name: "tone error with action",
    props: {
      actionHref: "/retry",
      actionLabel: "Retry",
      message: "Something broke",
      tone: "error",
    },
  },
  {
    name: "escape-sensitive message",
    props: { message: `<script>alert("hi")</script> & "ok"` },
  },
];

describe("Banner adapter matches core SSR DOM", () => {
  for (const { name, props } of CASES) {
    it(name, () => {
      const coreHtml = renderClbrBanner(props);
      const reactHtml = renderToStaticMarkup(<Banner {...props} />);
      const coreEl = toElement(coreHtml);
      const reactEl = toElement(reactHtml);
      expect(reactEl.isEqualNode(coreEl)).toBe(true);
    });
  }

  it("throws when actionHref/actionLabel are not both provided", () => {
    expect(() =>
      renderToStaticMarkup(<Banner actionHref="/docs" message="Notice" />),
    ).toThrow("actionHref and actionLabel must be provided together.");
  });
});
