import { buildClbrText, type ClbrTextProps } from "@measured/calibrate-core";
import type { ReactNode } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

const SLOT_TEXT_CHILDREN = "__CLBR_SLOT_TEXT_CHILDREN__";

export type TextProps = Omit<ClbrTextProps, "children"> & {
  children: ReactNode;
} & NativeAttrsFor<HTMLElement>;

export function Text(props: TextProps): ReturnType<typeof reactify> {
  const {
    as,
    children,
    linkVisited,
    responsive,
    align,
    measured,
    size,
    tone,
    ...rest
  } = props;
  const node = buildClbrText({
    as,
    children: SLOT_TEXT_CHILDREN,
    linkVisited,
    responsive,
    align,
    measured,
    size,
    tone,
  });
  return reactify(
    node,
    pickNativeExtras(rest as unknown as Record<string, unknown>),
    {
      [SLOT_TEXT_CHILDREN]: children,
    },
  );
}
