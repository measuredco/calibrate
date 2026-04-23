import { buildClbrPage, type ClbrPageProps } from "@measured/calibrate-core";
import type { ReactNode } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

const SLOT_PAGE_BANNER = "__CLBR_SLOT_PAGE_BANNER__";
const SLOT_PAGE_HEADER = "__CLBR_SLOT_PAGE_HEADER__";
const SLOT_PAGE_CHILDREN = "__CLBR_SLOT_PAGE_CHILDREN__";
const SLOT_PAGE_FOOTER = "__CLBR_SLOT_PAGE_FOOTER__";

export type PageProps = Omit<
  ClbrPageProps,
  "banner" | "header" | "children" | "footer"
> & {
  banner?: ReactNode;
  header: ReactNode;
  children?: ReactNode;
  footer: ReactNode;
} & NativeAttrsFor<HTMLDivElement>;

export function Page(props: PageProps): ReturnType<typeof reactify> {
  const {
    banner,
    children,
    centerMain,
    header,
    stickyHeader,
    footer,
    ...rest
  } = props;
  const hasBanner = banner != null && banner !== false;
  const hasChildren = children != null && children !== false;
  const node = buildClbrPage({
    banner: hasBanner ? SLOT_PAGE_BANNER : undefined,
    children: hasChildren ? SLOT_PAGE_CHILDREN : undefined,
    centerMain,
    header: SLOT_PAGE_HEADER,
    stickyHeader,
    footer: SLOT_PAGE_FOOTER,
  });
  return reactify(
    node,
    pickNativeExtras(rest as unknown as Record<string, unknown>),
    {
      ...(hasBanner ? { [SLOT_PAGE_BANNER]: banner } : {}),
      [SLOT_PAGE_HEADER]: header,
      ...(hasChildren ? { [SLOT_PAGE_CHILDREN]: children } : {}),
      [SLOT_PAGE_FOOTER]: footer,
    },
  );
}
