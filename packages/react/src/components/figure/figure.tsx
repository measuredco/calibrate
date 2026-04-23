import {
  buildClbrFigure,
  type ClbrFigureProps,
} from "@measured/calibrate-core";
import type { ReactNode } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

const SLOT_FIGURE_CHILDREN = "__CLBR_SLOT_FIGURE_CHILDREN__";
const SLOT_FIGURE_CAPTION = "__CLBR_SLOT_FIGURE_CAPTION__";

export type FigureProps = Omit<ClbrFigureProps, "children" | "caption"> & {
  children: ReactNode;
  caption: ReactNode;
} & NativeAttrsFor<HTMLElement>;

export function Figure(props: FigureProps): ReturnType<typeof reactify> {
  const { align, caption, children, responsive, ...rest } = props;
  const node = buildClbrFigure({
    align,
    caption: SLOT_FIGURE_CAPTION,
    children: SLOT_FIGURE_CHILDREN,
    responsive,
  });
  return reactify(
    node,
    pickNativeExtras(rest as unknown as Record<string, unknown>),
    {
      [SLOT_FIGURE_CHILDREN]: children,
      [SLOT_FIGURE_CAPTION]: caption,
    },
  );
}
