import {
  buildClbrDetails,
  type ClbrDetailsProps,
} from "@measured/calibrate-core";
import type { ReactNode } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

const SLOT_DETAILS_CHILDREN = "__CLBR_SLOT_DETAILS_CHILDREN__";

export type DetailsProps = Omit<ClbrDetailsProps, "children"> & {
  children?: ReactNode;
} & NativeAttrsFor<HTMLElement>;

export function Details(props: DetailsProps): ReturnType<typeof reactify> {
  const { children, inlineSize, open, summary, ...rest } = props;
  const hasChildren = children != null && children !== false;
  const node = buildClbrDetails({
    children: hasChildren ? SLOT_DETAILS_CHILDREN : undefined,
    inlineSize,
    open,
    summary,
  });
  return reactify(
    node,
    pickNativeExtras(rest as unknown as Record<string, unknown>),
    {
      ...(hasChildren ? { [SLOT_DETAILS_CHILDREN]: children } : {}),
    },
  );
}
