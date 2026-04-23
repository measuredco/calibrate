import { buildClbrRoot, type ClbrRootProps } from "@measured/calibrate-core";
import type { ReactNode } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

const SLOT_ROOT_CHILDREN = "__CLBR_SLOT_ROOT_CHILDREN__";

export type RootProps = Omit<ClbrRootProps, "children"> & {
  children: ReactNode;
} & NativeAttrsFor<HTMLDivElement>;

export function Root(props: RootProps): ReturnType<typeof reactify> {
  const {
    appOverscrollBehavior,
    appRoot,
    brand,
    children,
    dir,
    lang,
    theme,
    ...rest
  } = props;

  const node = buildClbrRoot({
    appOverscrollBehavior,
    appRoot,
    brand,
    children: SLOT_ROOT_CHILDREN,
    dir,
    lang,
    theme,
  });
  return reactify(
    node,
    pickNativeExtras(rest as unknown as Record<string, unknown>),
    {
      [SLOT_ROOT_CHILDREN]: children,
    },
  );
}
