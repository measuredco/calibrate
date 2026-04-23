import { buildClbrIcon, type ClbrIconProps } from "@measured/calibrate-core";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

export type IconProps = ClbrIconProps & NativeAttrsFor<HTMLElement>;

export function Icon(props: IconProps): ReturnType<typeof reactify> {
  return reactify(
    buildClbrIcon(props),
    pickNativeExtras(props as unknown as Record<string, unknown>),
  );
}
