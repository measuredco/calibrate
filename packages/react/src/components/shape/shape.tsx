import { buildClbrShape, type ClbrShapeProps } from "@measured/calibrate-core";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

export type ShapeProps = ClbrShapeProps & NativeAttrsFor<HTMLDivElement>;

export function Shape(props: ShapeProps): ReturnType<typeof reactify> {
  return reactify(
    buildClbrShape(props),
    pickNativeExtras(props as unknown as Record<string, unknown>),
  );
}
