import { type ClbrBoxProps, renderClbrBox } from "./box";

const meta = {
  argTypes: {
    background: {
      control: { type: "select" },
      options: ["default", "panel", "transparent"],
    },
    children: { control: false },
    paddingBlock: {
      control: { type: "select" },
      options: ["none", "xs", "sm", "md", "lg", "xl"],
    },
    paddingInline: {
      control: { type: "select" },
      options: ["none", "xs", "sm", "md", "lg", "xl"],
    },
    radius: {
      control: { type: "select" },
      options: ["sm", "md"],
    },
    surface: {
      control: { type: "select" },
      options: ["default", "brand", "inverse", "brand-inverse"],
    },
  },
  title: "Layout/Box",
};

export default meta;

export const Default = {
  args: {
    background: "default",
    border: true,
    children: '<div class="example-content"></div>',
    paddingBlock: "md",
    paddingInline: "md",
    radius: undefined,
    responsive: false,
    surface: undefined,
  } satisfies ClbrBoxProps,
  render: (args: ClbrBoxProps) => renderClbrBox(args),
};
