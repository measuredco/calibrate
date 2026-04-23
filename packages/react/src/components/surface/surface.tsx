import {
  buildClbrSurface,
  type ClbrSurfaceProps,
} from "@measured/calibrate-core";
import type { ReactNode } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

const SLOT_CHILDREN = "__CLBR_SLOT_SURFACE_CHILDREN__";

export type SurfaceProps = Omit<ClbrSurfaceProps, "children"> & {
  children: ReactNode;
} & NativeAttrsFor<HTMLDivElement>;

export function Surface(props: SurfaceProps): ReturnType<typeof reactify> {
  const { children, variant, ...rest } = props;
  const node = buildClbrSurface({
    children: SLOT_CHILDREN,
    variant,
  });
  return reactify(
    node,
    pickNativeExtras(rest as unknown as Record<string, unknown>),
    { [SLOT_CHILDREN]: children },
  );
}
