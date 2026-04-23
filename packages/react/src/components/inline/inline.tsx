import {
  buildClbrInline,
  type ClbrInlineProps,
} from "@measured/calibrate-core";
import type { ReactNode } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

const SLOT_INLINE_CHILDREN = "__CLBR_SLOT_INLINE_CHILDREN__";

export type InlineProps = Omit<ClbrInlineProps, "children"> & {
  children?: ReactNode;
} & NativeAttrsFor<HTMLElement>;

export function Inline(props: InlineProps): ReturnType<typeof reactify> {
  const { as, align, children, gap, justify, nowrap, ...rest } = props;
  const hasChildren = children != null && children !== false;
  const node = buildClbrInline({
    as,
    align,
    children: hasChildren ? SLOT_INLINE_CHILDREN : undefined,
    gap,
    justify,
    nowrap,
  });
  return reactify(
    node,
    pickNativeExtras(rest as unknown as Record<string, unknown>),
    {
      ...(hasChildren ? { [SLOT_INLINE_CHILDREN]: children } : {}),
    },
  );
}
