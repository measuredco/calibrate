import { buildClbrLogo, type ClbrLogoProps } from "@measured/calibrate-core";
import type { ReactNode } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

const SLOT_LABEL = "__CLBR_SLOT_LOGO_LABEL__";

export type LogoProps = Omit<ClbrLogoProps, "label"> & {
  label: ReactNode;
} & NativeAttrsFor<HTMLDivElement>;

export function Logo(props: LogoProps): ReturnType<typeof reactify> {
  const { label, size, tone, variant, ...rest } = props;
  const node = buildClbrLogo({
    label: SLOT_LABEL,
    size,
    tone,
    variant,
  });
  return reactify(
    node,
    pickNativeExtras(rest as unknown as Record<string, unknown>),
    { [SLOT_LABEL]: label },
  );
}
