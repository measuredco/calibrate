import {
  buildClbrFieldset,
  type ClbrFieldsetProps,
} from "@measured/calibrate-core";
import type { ReactNode } from "react";
import {
  type NativeAttrsFor,
  pickNativeExtras,
  reactify,
} from "../../reactify";

const SLOT_FIELDSET_CHILDREN = "__CLBR_SLOT_FIELDSET_CHILDREN__";

export type FieldsetProps = Omit<ClbrFieldsetProps, "children"> & {
  children?: ReactNode;
} & NativeAttrsFor<HTMLElement>;

export function Fieldset(props: FieldsetProps): ReturnType<typeof reactify> {
  const {
    children,
    description,
    disabled,
    id,
    invalid,
    legend,
    inlineSize,
    ...rest
  } = props;
  const hasChildren = children != null && children !== false;
  const node = buildClbrFieldset({
    children: hasChildren ? SLOT_FIELDSET_CHILDREN : undefined,
    description,
    disabled,
    id,
    invalid,
    legend,
    inlineSize,
  });
  return reactify(
    node,
    pickNativeExtras(rest as unknown as Record<string, unknown>),
    {
      ...(hasChildren ? { [SLOT_FIELDSET_CHILDREN]: children } : {}),
    },
  );
}
