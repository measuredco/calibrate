import {
  buildClbrHeading,
  type ClbrHeadingProps,
} from "@measured/calibrate-core";
import type { ReactNode } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

const SLOT_CHILDREN = "__CLBR_SLOT_HEADING_CHILDREN__";

export type HeadingProps = Omit<ClbrHeadingProps, "children"> & {
  children: ReactNode;
} & NativeAttrsFor<HTMLElement>;

export function Heading(props: HeadingProps): ReturnType<typeof reactify> {
  const { align, children, level, opticalInline, responsive, size, ...rest } =
    props;
  const node = buildClbrHeading({
    align,
    children: SLOT_CHILDREN,
    level,
    opticalInline,
    responsive,
    size,
  });
  return reactify(
    node,
    pickNativeExtras(rest as unknown as Record<string, unknown>),
    { [SLOT_CHILDREN]: children },
  );
}
