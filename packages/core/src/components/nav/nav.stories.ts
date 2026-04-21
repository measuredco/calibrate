import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import {
  CLBR_NAV_SPEC,
  defineClbrNav,
  renderClbrNav,
  type ClbrNavItem,
  type ClbrNavProps,
} from "./nav";

defineClbrNav();

const baseArgTypes = specToArgTypes(CLBR_NAV_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_NAV_SPEC),
      },
    },
    padding: "1.125rem 1rem",
  },
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
