import {
  buildClbrLink,
  type ClbrLinkProps,
} from "@measured/calibrate-core";
import type { ReactNode } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

const SLOT_ICON = "__CLBR_SLOT_LINK_ICON__";
const SLOT_LABEL = "__CLBR_SLOT_LINK_LABEL__";

export type LinkProps = Omit<ClbrLinkProps, "icon" | "label"> & {
  icon?: ReactNode;
  label: ReactNode;
} & NativeAttrsFor<HTMLAnchorElement>;

export function Link(props: LinkProps): ReturnType<typeof reactify> {
  const {
    href,
    icon,
    label,
    rel,
    size,
    target,
    tone,
    underline,
    ...rest
  } = props;
  const hasIcon = icon != null && icon !== false;
  const node = buildClbrLink({
    href,
    icon: hasIcon ? SLOT_ICON : undefined,
    label: SLOT_LABEL,
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
      [SLOT_LABEL]: label,
      ...(hasIcon ? { [SLOT_ICON]: icon } : {}),
    },
  );
}
