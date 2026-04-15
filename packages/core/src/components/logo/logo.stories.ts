import { type ClbrLogoProps, renderClbrLogo } from "./logo";

const meta = {
  argTypes: {
    tone: {
      control: { type: "select" },
      options: ["default", "neutral"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg", "fill"],
    },
    variant: {
      control: { type: "select" },
      options: ["primary", "graphic", "secondary", "typographic"],
    },
  },
  title: "Graphic/Logo",
};

export default meta;

export const Default = {
  args: {
    label: "Measured",
    size: "md",
    tone: undefined,
    variant: "primary",
  } satisfies ClbrLogoProps,
  render: (args: ClbrLogoProps) => renderClbrLogo(args),
};
