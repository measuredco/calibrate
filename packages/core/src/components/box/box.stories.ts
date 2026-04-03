import { type ClbrBoxProps, renderClbrBox } from "./box";

const meta = {
  argTypes: {
    background: {
      control: { type: "select" },
      options: ["default", "panel"],
    },
    border: {
      control: { type: "select" },
      options: ["default", "subtle", "brand"],
    },
    children: { control: false },
    padding: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    radius: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    surface: {
      control: { type: "select" },
      options: ["default", "brand"],
    },
  },
  title: "Layout/Box",
};

export default meta;

export const Default = {
  args: {
    background: "default",
    border: "default",
    shadow: false,
    children: '<div class="example-content"></div>',
    offsetStroke: false,
    padding: "md",
    radius: "md",
    surface: undefined,
  } satisfies ClbrBoxProps,
  render: (args: ClbrBoxProps) => renderClbrBox(args),
};
