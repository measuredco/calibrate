import { specToArgTypes, specToComponentDescription } from "../../spec";
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
  title: "Navigation/Nav",
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
    contentId: "content-id",
    expanderLabel: "",
    expanderPosition: "start",
    items,
    label: "",
    size: "md",
  } satisfies ClbrNavProps,
  decorators: [
    (Story: () => string) =>
      `<div style="min-block-size: 12rem">${Story()}</div>`,
  ],
  render: (args: ClbrNavProps) =>
    renderClbrNav({
      ...args,
      contentId: args.collapsible
        ? args.contentId?.trim() || "storybook-fallback-content-id"
        : args.contentId,
    }),
};
