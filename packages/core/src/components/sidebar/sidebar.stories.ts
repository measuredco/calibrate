import { renderClbrBox } from "../box/box";
import {
  defineClbrSidebar,
  renderClbrSidebar,
  type ClbrSidebarProps,
} from "./sidebar";

defineClbrSidebar();

const meta = {
  argTypes: {
    aboveNotebook: {
      control: { type: "select" },
      options: ["persistent", "collapsible", "overlay"],
    },
    children: { control: false },
    collapseLabel: { control: { type: "text" } },
    footer: { control: false },
    header: { control: false },
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
    },
    triggerLabel: { control: { type: "text" } },
  },
  parameters: { padding: "1rem" },
  title: "Structure/Sidebar",
};

export default meta;

export const Default = {
  args: {
    aboveNotebook: "persistent",
    collapseLabel: "Collapse sidebar",
    id: "storybook-sidebar",
    size: "md",
    triggerLabel: "Open sidebar",
    header: renderClbrBox({
      paddingBlock: "none",
      paddingInline: "xs",
      children: `<span>Header</span>`,
    }),
    children: `<div class="example-content"></div>`,
  } satisfies ClbrSidebarProps,
  render: (args: ClbrSidebarProps) =>
    `<div style="min-block-size: 21rem"><div>${renderClbrSidebar(args)}</div></div>`,
};

export const Footer = {
  args: {
    aboveNotebook: "overlay",
    id: "storybook-footer-sidebar",
    size: "sm",
    header: renderClbrBox({
      paddingBlock: "none",
      paddingInline: "xs",
      children: `<span>Header</span>`,
    }),
    children: `<div class="example-content"></div>`,
    footer: renderClbrBox({
      paddingBlock: "none",
      paddingInline: "xs",
      children: `<span>Footer</span>`,
    }),
  } satisfies ClbrSidebarProps,
  render: (args: ClbrSidebarProps) =>
    `<div style="min-block-size: 21rem"><div>${renderClbrSidebar(args)}</div></div>`,
};
