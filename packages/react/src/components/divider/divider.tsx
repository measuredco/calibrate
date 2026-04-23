import {
  buildClbrDivider,
  type ClbrDividerProps,
} from "@measured/calibrate-core";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

export type DividerProps = ClbrDividerProps & NativeAttrsFor<HTMLElement>;

export function Divider(props: DividerProps): ReturnType<typeof reactify> {
  return reactify(
    buildClbrDivider(props),
    pickNativeExtras(props as unknown as Record<string, unknown>),
  );
}
