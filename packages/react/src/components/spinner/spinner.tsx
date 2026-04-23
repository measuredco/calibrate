import {
  buildClbrSpinner,
  type ClbrSpinnerProps,
} from "@measured/calibrate-core";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

export type SpinnerProps = ClbrSpinnerProps & NativeAttrsFor<HTMLSpanElement>;

export function Spinner(props: SpinnerProps): ReturnType<typeof reactify> {
  return reactify(
    buildClbrSpinner(props),
    pickNativeExtras(props as unknown as Record<string, unknown>),
  );
}
