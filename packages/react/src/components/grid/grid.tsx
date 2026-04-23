import { buildClbrGrid, type ClbrGridProps } from "@measured/calibrate-core";
import type { ReactNode } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

const SLOT_GRID_CHILDREN = "__CLBR_SLOT_GRID_CHILDREN__";

export type GridProps = Omit<ClbrGridProps, "children"> & {
  children?: ReactNode;
} & NativeAttrsFor<HTMLDivElement>;

export function Grid(props: GridProps): ReturnType<typeof reactify> {
  const { children, gap, ...rest } = props;
  const hasChildren = children != null && children !== false;
  const node = buildClbrGrid({
    children: hasChildren ? SLOT_GRID_CHILDREN : undefined,
    gap,
  });
  return reactify(
    node,
    pickNativeExtras(rest as unknown as Record<string, unknown>),
    {
      ...(hasChildren ? { [SLOT_GRID_CHILDREN]: children } : {}),
    },
  );
}
