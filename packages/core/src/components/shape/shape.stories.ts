import { specToArgTypes, specToComponentDescription } from "../../spec";
import { renderClbrInline } from "../inline/inline";
import { CLBR_SHAPE_SPEC, type ClbrShapeProps, renderClbrShape } from "./shape";

const meta = {
  argTypes: specToArgTypes(CLBR_SHAPE_SPEC),
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_SHAPE_SPEC),
      },
    },
  },
  title: "Graphic/Shape",
};

export default meta;

export const Default = {
  args: {
    size: "md",
    tone: "brand",
    variant: "corner",
  } satisfies ClbrShapeProps,
  render: (args: ClbrShapeProps) => renderClbrShape(args),
};

export const Variant = {
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
