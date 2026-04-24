import {
  buildClbrButton,
  type ClbrButtonProps,
} from "@measured/calibrate-core";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

export type ButtonProps = ClbrButtonProps & NativeAttrsFor<HTMLButtonElement>;

export function Button(props: ButtonProps): ReturnType<typeof reactify> {
  return reactify(
    buildClbrButton(props),
    pickNativeExtras(props as unknown as Record<string, unknown>),
  );
}
