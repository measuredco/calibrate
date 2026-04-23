import { buildClbrInput, type ClbrInputProps } from "@measured/calibrate-core";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

export type InputProps = ClbrInputProps & NativeAttrsFor<HTMLDivElement>;

export function Input(props: InputProps): ReturnType<typeof reactify> {
  return reactify(
    buildClbrInput(props),
    pickNativeExtras(props as unknown as Record<string, unknown>),
  );
}
