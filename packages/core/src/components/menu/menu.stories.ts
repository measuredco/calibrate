import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import {
  type ClbrButtonLabelVisibility,
  type ClbrButtonPlacement,
} from "../button/button";
import { CLBR_ICON_RECOMMENDED } from "../icon/icon";
import type { ClbrIconMirrorMode } from "../icon/icon";
import {
  CLBR_MENU_SPEC,
  type ClbrMenuProps,
  defineClbrMenu,
  renderClbrMenu,
} from "./menu";

defineClbrMenu();

interface ClbrMenuStoryArgs extends Omit<ClbrMenuProps, "trigger"> {
  triggerIcon?: string;
  triggerIconMirrored?: ClbrIconMirrorMode;
  triggerIconPlacement?: ClbrButtonPlacement;
  triggerLabel: string;
  triggerLabelVisibility?: ClbrButtonLabelVisibility;
}

const baseArgTypes = specToArgTypes(CLBR_MENU_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    items: { ...baseArgTypes.items, control: false },
    trigger: { ...baseArgTypes.trigger, control: false },
    triggerIcon: {
      control: "select",
      options: CLBR_ICON_RECOMMENDED,
    },
    triggerIconMirrored: {
      control: "select",
      options: ["always", "rtl"],
    },
    triggerIconPlacement: {
      control: "select",
      options: ["start", "end"],
    },
    triggerLabel: { control: "text" },
    triggerLabelVisibility: {
      control: "select",
      options: ["visible", "hidden", "hiddenBelowTablet"],
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
    id: "menuId",
    items: [
      { id: "first", label: "Item one" },
      { id: "second", label: "Item two" },
      { id: "third", label: "Item three" },
      { disabled: true, id: "fourth", label: "Item four" },
    ],
    size: "md",
    triggerLabel: "Label",
    triggerLabelVisibility: "visible",
    triggerIcon: undefined,
    triggerIconMirrored: undefined,
    triggerIconPlacement: "start",
  } satisfies ClbrMenuStoryArgs,
  render: (args: ClbrMenuStoryArgs) =>
    `<div style="min-block-size: 12rem">${renderClbrMenu({
      id: args.id || "storybook-fallback-id",
      align: args.align,
      items: args.items,
      size: args.size,
      trigger: {
        icon: args.triggerIcon || undefined,
        iconMirrored: args.triggerIcon ? args.triggerIconMirrored : undefined,
        iconPlacement: args.triggerIcon ? args.triggerIconPlacement : "start",
        label: args.triggerLabel,
        labelVisibility: args.triggerIcon
          ? args.triggerLabelVisibility
          : "visible",
      },
    })}</div>`,
};
