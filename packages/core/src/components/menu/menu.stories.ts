import {
  type ClbrButtonLabelVisibility,
  type ClbrButtonPlacement,
} from "../button/button";
import { CLBR_ICON_RECOMMENDED } from "../icon/icon";
import type { ClbrIconMirrorMode } from "../icon/icon";
import { type ClbrMenuProps, defineClbrMenu, renderClbrMenu } from "./menu";

defineClbrMenu();

interface ClbrMenuStoryArgs extends Omit<ClbrMenuProps, "trigger"> {
  triggerIcon?: string;
  triggerIconMirrored?: ClbrIconMirrorMode;
  triggerIconPlacement?: ClbrButtonPlacement;
  triggerLabel: string;
  triggerLabelVisibility?: ClbrButtonLabelVisibility;
}

const meta = {
  argTypes: {
    align: {
      control: "select",
      options: ["start", "end"],
    },
    items: { control: false },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
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
