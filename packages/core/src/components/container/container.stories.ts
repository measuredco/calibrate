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

const demoContent =
  '<div style="background: #ff69b480;  padding: 1.75rem 0; text-align: center">Example content</div>';

export const Default = {
  args: {
    children: demoContent,
    gutter: "default",
    maxWidth: "default",
  } satisfies ClbrContainerProps,
  render: (args: ClbrContainerProps) => renderClbrContainer(args),
};
