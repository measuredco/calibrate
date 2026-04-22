import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import { renderClbrBox } from "../box/box";
import {
  CLBR_SIDEBAR_SPEC,
  defineClbrSidebar,
  renderClbrSidebar,
  type ClbrSidebarProps,
} from "./sidebar";

defineClbrSidebar();

const baseArgTypes = specToArgTypes(CLBR_SIDEBAR_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_SIDEBAR_SPEC),
      },
    },
    padding: "1rem",
  },
  title: "Structure/Sidebar",
};

export default meta;

export const Default = {
  args: {
    aboveNotebook: "persistent",
    collapseLabel: "Collapse sidebar",
    id: "sidebar-id",
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
    `<div style="min-block-size: 21rem">${renderClbrSidebar({
      ...args,
      id: args.id?.trim() || "storybook-fallback-sidebar-id",
    })}</div>`,
};

export const Footer = {
  args: {
    aboveNotebook: "overlay",
    id: "footer-sidebar-id",
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
    `<div style="min-block-size: 21rem">${renderClbrSidebar({
      ...args,
      id: args.id?.trim() || "storybook-fallback-sidebar-id",
    })}</div>`,
};
