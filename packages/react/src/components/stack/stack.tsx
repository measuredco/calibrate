import { buildClbrStack, type ClbrStackProps } from "@measured/calibrate-core";
import type { ReactNode } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

const SLOT_STACK_CHILDREN = "__CLBR_SLOT_STACK_CHILDREN__";

export type StackProps = Omit<ClbrStackProps, "children"> & {
  children?: ReactNode;
} & NativeAttrsFor<HTMLElement>;

export function Stack(props: StackProps): ReturnType<typeof reactify> {
  const { align, as, children, gap, responsive, ...rest } = props;
  const hasChildren = children != null && children !== false;
  const node = buildClbrStack({
    align,
    as,
    children: hasChildren ? SLOT_STACK_CHILDREN : undefined,
    gap,
    responsive,
  });
  return reactify(
    node,
    pickNativeExtras(rest as unknown as Record<string, unknown>),
    {
      ...(hasChildren ? { [SLOT_STACK_CHILDREN]: children } : {}),
    },
  );
}
