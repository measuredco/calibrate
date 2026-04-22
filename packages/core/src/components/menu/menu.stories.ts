import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import { CLBR_ICON_RECOMMENDED } from "../icon/icon";
import {
  CLBR_MENU_SPEC,
  type ClbrMenuProps,
  defineClbrMenu,
  renderClbrMenu,
} from "./menu";

defineClbrMenu();

const baseArgTypes = specToArgTypes(CLBR_MENU_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    items: { ...baseArgTypes.items, control: false },
    triggerIcon: {
      ...baseArgTypes.triggerIcon,
      control: { type: "select" as const },
      options: [undefined, ...CLBR_ICON_RECOMMENDED],
    },
  },
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_MENU_SPEC),
      },
    },
  },
  title: "Control/Menu",
};

export default meta;

export const Default = {
  args: {
    align: "start",
    id: "menu-id",
    items: [
      { id: "first", label: "Item one" },
      { id: "second", label: "Item two" },
      { id: "third", label: "Item three" },
      { disabled: true, id: "fourth", label: "Item four" },
    ],
    size: "md",
    triggerIcon: undefined,
    triggerIconMirrored: undefined,
    triggerIconPlacement: "start",
    triggerLabel: "Label",
    triggerLabelVisibility: "visible",
  } satisfies ClbrMenuProps,
  render: (args: ClbrMenuProps) =>
    `<div style="min-block-size: 12rem">${renderClbrMenu({
      ...args,
      id: args.id || "storybook-fallback-id",
    })}</div>`,
};
