import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import {
  CLBR_INLINE_SPEC,
  type ClbrInlineProps,
  renderClbrInline,
} from "./inline";

const baseArgTypes = specToArgTypes(CLBR_INLINE_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    children: { ...baseArgTypes.children, control: false },
  },
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_INLINE_SPEC),
      },
    },
    padding: 0,
  },
  title: "Layout/Inline",
};

export default meta;

export const Default = {
  args: {
    as: "div",
    align: "center",
    children:
      '<div class="example-content"></div><div class="example-content" style="min-block-size: 3rem"></div><div class="example-content"></div>',
    gap: "md",
    justify: "start",
    nowrap: false,
  } satisfies ClbrInlineProps,
  render: (args: ClbrInlineProps) => renderClbrInline(args),
};
