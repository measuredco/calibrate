import {
  defineClbrNav,
  renderClbrNav,
  type ClbrNavItem,
  type ClbrNavProps,
} from "./nav";

defineClbrNav();

const meta = {
  argTypes: {
    collapsible: {
      control: { type: "select" },
      options: ["always", "belowTablet"],
    },
    contentId: { control: { type: "text" } },
    expanderLabel: { control: { type: "text" } },
    items: { control: false },
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
    },
    expanderPosition: {
      control: { type: "select" },
      options: ["start", "end"],
    },
  },
  parameters: { padding: "1.125rem 1rem" },
  title: "Structure/Nav",
};

const items: ClbrNavItem[] = [
  { current: true, href: "#", label: "About" },
  { href: "#", label: "Work" },
  { href: "#", label: "Blog" },
];

export default meta;

export const Default = {
  args: {
    collapsible: undefined,
    contentId: "",
    expanderLabel: "",
    expanderPosition: "start",
    items,
    label: "",
    size: "md",
  } satisfies ClbrNavProps,
  render: (args: ClbrNavProps) =>
    `<div style="min-block-size: 21rem">${renderClbrNav(args)}</div>`,
};
