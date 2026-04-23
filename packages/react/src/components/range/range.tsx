import {
  buildClbrRange,
  type ClbrRangeProps,
  defineClbrRange,
} from "@measured/calibrate-core";
import { useEffect } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

export type RangeProps = ClbrRangeProps & NativeAttrsFor<HTMLElement>;

export function Range(props: RangeProps): ReturnType<typeof reactify> {
  useEffect(() => {
    defineClbrRange();
  }, []);
  return reactify(
    buildClbrRange(props),
    pickNativeExtras(props as unknown as Record<string, unknown>),
  );
}
