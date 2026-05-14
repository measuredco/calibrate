/**
 * Navigation field data, available as `data.nav.*`.
 */

export interface NavItem {
  href: string;
  label: string;
}

const sidebar: NavItem[] = [
  { href: "/getting-started/", label: "Getting started" },
  { href: "/color/", label: "Color" },
  { href: "/typography/", label: "Typography" },
  { href: "/storybook/", label: "Storybook" },
];

export default { sidebar };

export type NavData = typeof import("./nav").default;
