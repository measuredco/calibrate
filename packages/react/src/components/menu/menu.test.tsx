import {
  renderClbrMenu,
  type ClbrMenuProps,
} from "@measured/calibrate-core";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Menu } from "./menu";

function toElement(html: string): Element {
  const container = document.createElement("div");
  container.innerHTML = html;
  const child = container.firstElementChild;
  if (!child) throw new Error(`No element in html: ${html}`);
  return child;
}

const CASES: { name: string; props: ClbrMenuProps }[] = [
  {
    name: "minimal menu",
    props: {
      id: "actions",
      items: [{ label: "Edit" }, { label: "Delete" }],
      triggerLabel: "Actions",
    },
  },
  {
    name: "align end with size sm",
    props: {
      align: "end",
      id: "tools",
      items: [{ id: "share", label: "Share" }],
      size: "sm",
      triggerLabel: "Tools",
    },
  },
  {
    name: "items with id and disabled",
    props: {
      id: "row",
      items: [
        { id: "edit", label: "Edit" },
        { disabled: true, id: "delete", label: "Delete" },
      ],
      triggerLabel: "Row actions",
    },
  },
  {
    name: "icon trigger with hidden label",
    props: {
      id: "more",
      items: [{ label: "Copy" }],
      triggerIcon: "more-horizontal",
      triggerLabel: "More",
      triggerLabelVisibility: "hidden",
    },
  },
  {
    name: "escape-sensitive label content",
    props: {
      id: "html",
      items: [{ label: `<script>alert("x")</script>` }],
      triggerLabel: `<strong>Trigger</strong>`,
    },
  },
];

describe("Menu adapter matches core SSR DOM", () => {
  for (const { name, props } of CASES) {
    it(name, () => {
      const coreHtml = renderClbrMenu(props);
      const reactHtml = renderToStaticMarkup(<Menu {...props} />);
      const coreEl = toElement(coreHtml);
      const reactEl = toElement(reactHtml);
      expect(reactEl.isEqualNode(coreEl)).toBe(true);
    });
  }

  it("throws on empty id", () => {
    expect(() =>
      renderToStaticMarkup(
        <Menu id="" items={[{ label: "X" }]} triggerLabel="T" />,
      ),
    ).toThrow("id must be a non-empty string.");
  });

  it("throws on invalid id", () => {
    expect(() =>
      renderToStaticMarkup(
        <Menu id="1bad" items={[{ label: "X" }]} triggerLabel="T" />,
      ),
    ).toThrow(
      "id must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  });
});
