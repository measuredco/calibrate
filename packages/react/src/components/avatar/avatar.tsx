import {
  buildClbrAvatar,
  type ClbrAvatarProps,
} from "@measured/calibrate-core";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

export type AvatarProps = ClbrAvatarProps & NativeAttrsFor<HTMLSpanElement>;

export function Avatar(props: AvatarProps): ReturnType<typeof reactify> {
  return reactify(
    buildClbrAvatar(props),
    pickNativeExtras(props as unknown as Record<string, unknown>),
  );
}
