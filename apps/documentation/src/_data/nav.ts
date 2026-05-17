/**
 * Navigation field data, available as `data.nav.*`.
 *
 * A sidebar entry is either a flat link (`NavItem`) or a collapsible group
 * (`NavGroup`, rendered as a details disclosure).
 */

export interface NavItem {
  href: string;
  label: string;
}

export interface NavGroup {
  items: NavItem[];
  label: string;
}

export type NavEntry = NavGroup | NavItem;

const sidebar: NavEntry[] = [
  { href: "/getting-started/", label: "Getting started" },
  { href: "/storybook/", label: "Storybook" },
  {
    items: [
      { href: "/breakpoint/", label: "Breakpoint" },
      { href: "/color/", label: "Color" },
      { href: "/effects/", label: "Effects" },
      { href: "/layout/", label: "Layout" },
      { href: "/motion/", label: "Motion" },
      { href: "/radius/", label: "Radius" },
      { href: "/spacing/", label: "Spacing" },
      { href: "/typography/", label: "Typography" },
    ],
    label: "Foundations",
  },
];

export default { sidebar };

export type NavData = typeof import("./nav").default;
