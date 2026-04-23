import {
  buildClbrCheckbox,
  type ClbrCheckboxProps,
} from "@measured/calibrate-core";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

export type CheckboxProps = ClbrCheckboxProps & NativeAttrsFor<HTMLDivElement>;

export function Checkbox(props: CheckboxProps): ReturnType<typeof reactify> {
  return reactify(
    buildClbrCheckbox(props),
    pickNativeExtras(props as unknown as Record<string, unknown>),
  );
}
