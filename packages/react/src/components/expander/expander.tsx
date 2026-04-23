import {
  buildClbrExpander,
  type ClbrExpanderProps,
} from "@measured/calibrate-core";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

export type ExpanderProps = ClbrExpanderProps &
  NativeAttrsFor<HTMLButtonElement>;

export function Expander(props: ExpanderProps): ReturnType<typeof reactify> {
  return reactify(
    buildClbrExpander(props),
    pickNativeExtras(props as unknown as Record<string, unknown>),
  );
}
