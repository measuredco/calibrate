import {
  buildClbrHeading,
  type ClbrHeadingProps,
} from "@measured/calibrate-core";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

export type HeadingProps = ClbrHeadingProps & NativeAttrsFor<HTMLElement>;

export function Heading(props: HeadingProps): ReturnType<typeof reactify> {
  return reactify(
    buildClbrHeading(props),
    pickNativeExtras(props as unknown as Record<string, unknown>),
  );
}
