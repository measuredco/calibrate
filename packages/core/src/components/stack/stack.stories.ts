import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import { CLBR_STACK_SPEC, type ClbrStackProps, renderClbrStack } from "./stack";

const baseArgTypes = specToArgTypes(CLBR_STACK_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    children: { ...baseArgTypes.children, control: false },
  },
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_STACK_SPEC),
      },
    },
    padding: 0,
  },
  title: "Layout/Stack",
};

export default meta;

export const Default = {
  args: {
    align: "stretch",
    as: "div",
    children:
      '<div class="example-content"></div><div class="example-content"></div><div class="example-content"></div>',
    gap: "md",
    responsive: false,
  } satisfies ClbrStackProps,
  render: (args: ClbrStackProps) => renderClbrStack(args),
};
