import { buildClbrLink, type ClbrLinkProps } from "@measured/calibrate-core";
import type { ReactNode } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

const SLOT_LINK_ICON = "__CLBR_SLOT_LINK_ICON__";

export type LinkProps = Omit<ClbrLinkProps, "icon"> & {
  icon?: ReactNode;
} & NativeAttrsFor<HTMLAnchorElement>;

export function Link(props: LinkProps): ReturnType<typeof reactify> {
  const {
    appearance,
    download,
    href,
    icon,
    iconPlacement,
    label,
    labelVisibility,
    rel,
    size,
    target,
    tone,
    underline,
    ...rest
  } = props;
  const hasIcon = icon != null && icon !== false;
  const node = buildClbrLink({
    appearance,
    download,
    href,
    icon: hasIcon ? SLOT_LINK_ICON : undefined,
    iconPlacement,
    label,
    labelVisibility,
    rel,
    size,
    target,
    tone,
    underline,
  });
  return reactify(
    node,
    pickNativeExtras(rest as unknown as Record<string, unknown>),
    {
      ...(hasIcon ? { [SLOT_LINK_ICON]: icon } : {}),
    },
  );
}
