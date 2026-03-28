import { type ClbrContainerProps, renderClbrContainer } from "./container";

const meta = {
  argTypes: {
    children: { control: false },
    gutter: {
      control: { type: "select" },
      options: ["default", "narrow", "none"],
    },
    maxWidth: {
      control: { type: "select" },
      options: ["default", "wide", "none"],
    },
  },
  parameters: { padding: 0 },
  title: "Components/Container",
};

export default meta;

export const Default = {
  args: {
    children: `<div class="example-content"></div>`,
    gutter: "default",
    maxWidth: "default",
  } satisfies ClbrContainerProps,
  render: (args: ClbrContainerProps) => renderClbrContainer(args),
};
