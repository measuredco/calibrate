import { renderClbrInline } from "../inline/inline";
import { type ClbrShapeProps, renderClbrShape } from "./shape";

const meta = {
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xl", "fill"],
    },
    tone: {
      control: { type: "select" },
      options: ["default", "brand", "support", "neutral"],
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
  title: "Graphic/Shape",
};

export default meta;

export const Default = {
  args: {
    size: "md",
    tone: undefined,
    variant: "corner",
  } satisfies ClbrShapeProps,
  render: (args: ClbrShapeProps) => renderClbrShape(args),
};

export const Shapes = {
  parameters: { controls: { disable: true } },
  render: () =>
    renderClbrInline({
      children: [
        renderClbrShape({ tone: "brand", variant: "corner" }),
        renderClbrShape({ tone: "brand", variant: "tile-slice-lg" }),
        renderClbrShape({ tone: "brand", variant: "tile-slice-sm" }),
        renderClbrShape({ tone: "brand", variant: "tile-sm" }),
        renderClbrShape({ tone: "brand", variant: "tile-lg" }),
        renderClbrShape({ tone: "brand", variant: "circle-lg" }),
        renderClbrShape({ tone: "brand", variant: "circle-sm" }),
      ].join(""),
    }),
};
