import { type ClbrPatternProps, renderClbrPattern } from "./pattern";

const meta = {
  argTypes: {
    children: { control: false },
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xl", "fill"],
    },
    tone: {
      control: { type: "select" },
      options: ["default", "subtle", "support"],
    },
    variant: {
      control: { type: "select" },
      options: [
        "corner",
        "tile-slice-lg",
        "tile-slice-sm",
        "tile-sm",
        "tile-lg",
        "circle-lg",
        "circle-sm",
      ],
    },
  },
  parameters: { padding: 0 },
  title: "Graphic/Pattern",
};

export default meta;

export const Default = {
  args: {
    children: `<div style="block-size: 6rem;"></div>`,
    size: "md",
    tone: undefined,
    variant: "corner",
  } satisfies ClbrPatternProps,
  render: (args: ClbrPatternProps) => renderClbrPattern(args),
};
