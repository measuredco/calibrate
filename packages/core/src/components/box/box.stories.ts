import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import { CLBR_BOX_SPEC, type ClbrBoxProps, renderClbrBox } from "./box";

const baseArgTypes = specToArgTypes(CLBR_BOX_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    children: { ...baseArgTypes.children, control: false },
  },
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_BOX_SPEC),
      },
    },
  },
  title: "Layout/Box",
};

export default meta;

export const Default = {
  args: {
    background: "default",
    border: true,
    children: '<div class="example-content"></div>',
    paddingBlock: "md",
    paddingInline: "md",
    radius: undefined,
    responsive: false,
    surface: undefined,
  } satisfies ClbrBoxProps,
  render: (args: ClbrBoxProps) => renderClbrBox(args),
};
