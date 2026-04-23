import {
  buildClbrPage,
  type ClbrPageProps,
} from "@measured/calibrate-core";
import type { ReactNode } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

const SLOT_BANNER = "__CLBR_SLOT_PAGE_BANNER__";
const SLOT_CHILDREN = "__CLBR_SLOT_PAGE_CHILDREN__";
const SLOT_FOOTER = "__CLBR_SLOT_PAGE_FOOTER__";
const SLOT_HEADER = "__CLBR_SLOT_PAGE_HEADER__";

type PageSlotKey = "banner" | "children" | "footer" | "header";

export type PageProps = Omit<ClbrPageProps, PageSlotKey> & {
  banner?: ReactNode;
  children?: ReactNode;
  footer: ReactNode;
  header: ReactNode;
} & NativeAttrsFor<HTMLDivElement>;

export function Page(props: PageProps) {
  const {
    banner,
    centerMain,
    children,
    footer,
    header,
    stickyHeader,
    ...rest
  } = props;
  const node = buildClbrPage({
    banner: banner ? SLOT_BANNER : undefined,
    centerMain,
    children: children ? SLOT_CHILDREN : undefined,
    footer: SLOT_FOOTER,
    header: SLOT_HEADER,
    stickyHeader,
  });
  return reactify(
    node,
    pickNativeExtras(rest as unknown as Record<string, unknown>),
    {
      [SLOT_BANNER]: banner,
      [SLOT_CHILDREN]: children,
      [SLOT_FOOTER]: footer,
      [SLOT_HEADER]: header,
    },
  );
}
