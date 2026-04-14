import { type ClbrContainerProps, renderClbrContainer } from "./container";

const meta = {
  argTypes: {
    children: { control: false },
    gutter: {
      control: { type: "select" },
      options: ["default", "narrow", "none"],
    },
    maxInlineSize: {
      control: { type: "select" },
      options: ["default", "wide", "none"],
    },
  },
  parameters: { padding: 0 },
  title: "Layout/Container",
};

export default meta;

export const Default = {
  args: {
    children: `<div class="example-content"></div>`,
    gutter: "default",
    maxInlineSize: "default",
  } satisfies ClbrContainerProps,
  render: (args: ClbrContainerProps) => renderClbrContainer(args),
};
