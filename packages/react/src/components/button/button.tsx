import {
  buildClbrButton,
  type ClbrButtonElementProps,
  type ClbrButtonLinkProps,
} from "@measured/calibrate-core";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

export type ButtonProps =
  | (ClbrButtonElementProps & NativeAttrsFor<HTMLButtonElement>)
  | (ClbrButtonLinkProps & NativeAttrsFor<HTMLAnchorElement>);

export function Button(props: ButtonProps) {
  return reactify(
    buildClbrButton(props),
    pickNativeExtras(props as unknown as Record<string, unknown>),
  );
}
