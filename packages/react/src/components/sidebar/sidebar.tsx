import {
  buildClbrSidebar,
  type ClbrSidebarProps,
  defineClbrSidebar,
} from "@measured/calibrate-core";
import { type ReactNode, useEffect } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

const SLOT_SIDEBAR_HEADER = "__CLBR_SLOT_SIDEBAR_HEADER__";
const SLOT_SIDEBAR_CHILDREN = "__CLBR_SLOT_SIDEBAR_CHILDREN__";
const SLOT_SIDEBAR_FOOTER = "__CLBR_SLOT_SIDEBAR_FOOTER__";

export type SidebarProps = Omit<
  ClbrSidebarProps,
  "header" | "children" | "footer"
> & {
  header?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
} & NativeAttrsFor<HTMLElement>;

export function Sidebar(props: SidebarProps): ReturnType<typeof reactify> {
  const {
    aboveNotebook,
    children,
    collapseLabel,
    footer,
    header,
    id,
    size,
    triggerLabel,
    ...rest
  } = props;
  const hasHeader = header != null && header !== false;
  const hasChildren = children != null && children !== false;
  const hasFooter = footer != null && footer !== false;
  const node = buildClbrSidebar({
    aboveNotebook,
    children: hasChildren ? SLOT_SIDEBAR_CHILDREN : undefined,
    collapseLabel,
    footer: hasFooter ? SLOT_SIDEBAR_FOOTER : undefined,
    header: hasHeader ? SLOT_SIDEBAR_HEADER : undefined,
    id,
    size,
    triggerLabel,
  });
  useEffect(() => {
    defineClbrSidebar();
  }, []);
  return reactify(
    node,
    pickNativeExtras(rest as unknown as Record<string, unknown>),
    {
      ...(hasHeader ? { [SLOT_SIDEBAR_HEADER]: header } : {}),
      ...(hasChildren ? { [SLOT_SIDEBAR_CHILDREN]: children } : {}),
      ...(hasFooter ? { [SLOT_SIDEBAR_FOOTER]: footer } : {}),
    },
  );
}
