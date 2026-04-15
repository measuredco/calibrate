import { type ClbrStackProps, renderClbrStack } from "./stack";

const meta = {
  argTypes: {
    align: {
      control: { type: "select" },
      options: ["stretch", "start", "center", "end"],
    },
    as: {
      control: { type: "select" },
      options: ["div", "ul"],
    },
    children: { control: false },
    gap: {
      control: { type: "select" },
      options: ["none", "xs", "sm", "md", "lg"],
    },
  },
  parameters: { padding: 0 },
  title: "Layout/Stack",
};

export default meta;

export const Default = {
  args: {
    align: "stretch",
    as: "div",
    children:
      '<div class="example-content"></div><div class="example-content"></div><div class="example-content"></div>',
    gap: "md",
    responsive: false,
  } satisfies ClbrStackProps,
  render: (args: ClbrStackProps) => renderClbrStack(args),
};
