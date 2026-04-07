import { type ClbrBoxProps, renderClbrBox } from "./box";

const meta = {
  argTypes: {
    background: {
      control: { type: "select" },
      options: ["default", "panel"],
    },
    border: {
      control: { type: "boolean" },
    },
    children: { control: false },
    padding: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    radius: {
      control: { type: "select" },
      options: ["sm", "md"],
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
    border: true,
    children: '<div class="example-content"></div>',
    padding: "md",
    radius: undefined,
    surface: undefined,
  } satisfies ClbrBoxProps,
  render: (args: ClbrBoxProps) => renderClbrBox(args),
};
