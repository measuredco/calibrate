/**
 * Footer field data, available as `data.footer.*`.
 */

export interface FooterLink {
  href: string;
  label: string;
}

const links: FooterLink[] = [
  {
    href: "https://github.com/measuredco/calibrate",
    label: "GitHub",
  },
  {
    href: "https://measured.co",
    label: "Measured",
  },
];

export default { links };

export type FooterData = typeof import("./footer").default;
