/**
 * Navigation field data, available as `data.nav.*`.
 */

export interface NavItem {
  href: string;
  label: string;
  /** Open in new tab + trailing external-link icon. */
  external?: boolean;
}

const sidebar: NavItem[] = [
  { href: "/storybook/", label: "Storybook" },
  {
    href: "https://github.com/measuredco/calibrate",
    label: "GitHub",
    external: true,
  },
];

export default { sidebar };

export type NavData = typeof import("./nav").default;
