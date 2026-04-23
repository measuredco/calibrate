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

const SLOT_CHILDREN = "__CLBR_SLOT_SIDEBAR_CHILDREN__";
const SLOT_FOOTER = "__CLBR_SLOT_SIDEBAR_FOOTER__";
const SLOT_HEADER = "__CLBR_SLOT_SIDEBAR_HEADER__";

export type SidebarProps = Omit<
  ClbrSidebarProps,
  "children" | "footer" | "header"
> & {
  children?: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
} & NativeAttrsFor<HTMLElement>;

export function Sidebar(props: SidebarProps): ReturnType<typeof reactify> {
  useEffect(() => {
    defineClbrSidebar();
  }, []);

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

  const hasChildren = children != null && children !== false;
  const hasFooter = footer != null && footer !== false;
  const hasHeader = header != null && header !== false;

  const node = buildClbrSidebar({
    aboveNotebook,
    children: hasChildren ? SLOT_CHILDREN : undefined,
    collapseLabel,
    footer: hasFooter ? SLOT_FOOTER : undefined,
    header: hasHeader ? SLOT_HEADER : undefined,
    id,
    size,
    triggerLabel,
  });

  return reactify(
    node,
    pickNativeExtras(rest as unknown as Record<string, unknown>),
    {
      ...(hasChildren ? { [SLOT_CHILDREN]: children } : {}),
      ...(hasFooter ? { [SLOT_FOOTER]: footer } : {}),
      ...(hasHeader ? { [SLOT_HEADER]: header } : {}),
    },
  );
}
