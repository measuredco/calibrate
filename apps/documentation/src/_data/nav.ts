/**
 * Navigation field data, available as `data.nav.*`.
 */

export interface NavItem {
  href: string;
  label: string;
}

const sidebar: NavItem[] = [
  { href: "/getting-started/", label: "Getting started" },
  { href: "/storybook/", label: "Storybook" },
];

export default { sidebar };

export type NavData = typeof import("./nav").default;
