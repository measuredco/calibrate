import { buildClbrImage, type ClbrImageProps } from "@measured/calibrate-core";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

export type ImageProps = ClbrImageProps & NativeAttrsFor<HTMLDivElement>;

export function Image(props: ImageProps): ReturnType<typeof reactify> {
  return reactify(
    buildClbrImage(props),
    pickNativeExtras(props as unknown as Record<string, unknown>),
  );
}
