import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  CLBR_RANGE_SPEC,
  defineClbrRange,
  type ClbrRangeProps,
  renderClbrRange,
} from "./range";

defineClbrRange();

const baseArgTypes = specToArgTypes(CLBR_RANGE_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_RANGE_SPEC),
      },
    },
  },
  title: "Control/Range",
};

export default meta;

export const Default = {
  args: {
    description: "Description",
    disabled: false,
    id: "range-id",
    inlineSize: "fit",
    label: "Label",
    max: 100,
    min: 0,
    name: "",
    size: "md",
    step: 1,
    value: 50,
  } satisfies ClbrRangeProps,
  render: (args: ClbrRangeProps) =>
    renderClbrRange({
      ...args,
      id: args.id?.trim() || "storybook-fallback-range-id",
    }),
};
