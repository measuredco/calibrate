import {
  buildClbrContainer,
  type ClbrContainerProps,
} from "@measured/calibrate-core";
import type { ReactNode } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

const SLOT_CHILDREN = "__CLBR_SLOT_CONTAINER_CHILDREN__";

export type ContainerProps = Omit<ClbrContainerProps, "children"> & {
  children?: ReactNode;
} & NativeAttrsFor<HTMLDivElement>;

export function Container(
  props: ContainerProps,
): ReturnType<typeof reactify> {
  const { children, gutter, maxInlineSize, ...rest } = props;
  const hasChildren = children != null && children !== false;
  const node = buildClbrContainer({
    children: hasChildren ? SLOT_CHILDREN : undefined,
    gutter,
    maxInlineSize,
  });
  return reactify(
    node,
    pickNativeExtras(rest as unknown as Record<string, unknown>),
    hasChildren ? { [SLOT_CHILDREN]: children } : {},
  );
}
