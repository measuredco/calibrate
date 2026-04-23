import {
  buildClbrPoster,
  type ClbrPosterProps,
} from "@measured/calibrate-core";
import type { ReactNode } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

const SLOT_POSTER_IMAGE = "__CLBR_SLOT_POSTER_IMAGE__";
const SLOT_POSTER_CHILDREN = "__CLBR_SLOT_POSTER_CHILDREN__";

export type PosterProps = Omit<ClbrPosterProps, "image" | "children"> & {
  image: ReactNode;
  children?: ReactNode;
} & NativeAttrsFor<HTMLDivElement>;

export function Poster(props: PosterProps): ReturnType<typeof reactify> {
  const { children, contentTheme, image, surface, ...rest } = props;
  const hasChildren = children != null && children !== false;
  const node = buildClbrPoster({
    children: hasChildren ? SLOT_POSTER_CHILDREN : undefined,
    contentTheme,
    image: SLOT_POSTER_IMAGE,
    surface,
  });
  return reactify(
    node,
    pickNativeExtras(rest as unknown as Record<string, unknown>),
    {
      [SLOT_POSTER_IMAGE]: image,
      ...(hasChildren ? { [SLOT_POSTER_CHILDREN]: children } : {}),
    },
  );
}
