import {
  buildClbrSwitch,
  type ClbrSwitchProps,
} from "@measured/calibrate-core";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

export type SwitchProps = ClbrSwitchProps & NativeAttrsFor<HTMLDivElement>;

export function Switch(props: SwitchProps): ReturnType<typeof reactify> {
  return reactify(
    buildClbrSwitch(props),
    pickNativeExtras(props as unknown as Record<string, unknown>),
  );
}
