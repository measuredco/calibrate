import { buildClbrProse, type ClbrProseProps } from "@measured/calibrate-core";
import type { ReactNode } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

const SLOT_PROSE_CHILDREN = "__CLBR_SLOT_PROSE_CHILDREN__";

export type ProseProps = Omit<ClbrProseProps, "children"> & {
  children: ReactNode;
} & NativeAttrsFor<HTMLDivElement>;

export function Prose(props: ProseProps): ReturnType<typeof reactify> {
  const { children, align, hangingPunctuation, measured, responsive, ...rest } =
    props;
  const node = buildClbrProse({
    children: SLOT_PROSE_CHILDREN,
    align,
    hangingPunctuation,
    measured,
    responsive,
  });
  return reactify(
    node,
    pickNativeExtras(rest as unknown as Record<string, unknown>),
    {
      [SLOT_PROSE_CHILDREN]: children,
    },
  );
}
