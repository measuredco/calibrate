import { buildClbrBox, type ClbrBoxProps } from "@measured/calibrate-core";
import type { ReactNode } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

const SLOT_BOX_CHILDREN = "__CLBR_SLOT_BOX_CHILDREN__";

export type BoxProps = Omit<ClbrBoxProps, "children"> & {
  children?: ReactNode;
} & NativeAttrsFor<HTMLDivElement>;

export function Box(props: BoxProps): ReturnType<typeof reactify> {
  const {
    background,
    border,
    children,
    paddingBlock,
    paddingInline,
    radius,
    responsive,
    surface,
    ...rest
  } = props;
  const hasChildren = children != null && children !== false;
  const node = buildClbrBox({
    background,
    border,
    children: hasChildren ? SLOT_BOX_CHILDREN : undefined,
    paddingBlock,
    paddingInline,
    radius,
    responsive,
    surface,
  });
  return reactify(
    node,
    pickNativeExtras(rest as unknown as Record<string, unknown>),
    {
      ...(hasChildren ? { [SLOT_BOX_CHILDREN]: children } : {}),
    },
  );
}
