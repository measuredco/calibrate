import {
  buildClbrRadios,
  type ClbrRadiosProps,
} from "@measured/calibrate-core";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

export type RadiosProps = ClbrRadiosProps & NativeAttrsFor<HTMLElement>;

export function Radios(props: RadiosProps): ReturnType<typeof reactify> {
  return reactify(
    buildClbrRadios(props),
    pickNativeExtras(props as unknown as Record<string, unknown>),
  );
}
