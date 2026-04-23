import { buildClbrBadge, type ClbrBadgeProps } from "@measured/calibrate-core";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

export type BadgeProps = ClbrBadgeProps & NativeAttrsFor<HTMLSpanElement>;

export function Badge(props: BadgeProps): ReturnType<typeof reactify> {
  return reactify(
    buildClbrBadge(props),
    pickNativeExtras(props as unknown as Record<string, unknown>),
  );
}
