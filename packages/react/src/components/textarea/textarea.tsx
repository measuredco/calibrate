import {
  buildClbrTextarea,
  type ClbrTextareaProps,
} from "@measured/calibrate-core";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

export type TextareaProps = ClbrTextareaProps & NativeAttrsFor<HTMLDivElement>;

export function Textarea(props: TextareaProps): ReturnType<typeof reactify> {
  return reactify(
    buildClbrTextarea(props),
    pickNativeExtras(props as unknown as Record<string, unknown>),
  );
}
