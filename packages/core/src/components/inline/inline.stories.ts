import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import {
  CLBR_INLINE_SPEC,
  type ClbrInlineProps,
  renderClbrInline,
} from "./inline";

const baseArgTypes = specToArgTypes(CLBR_INLINE_SPEC);

const meta = {
  argTypes: baseArgTypes,
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
    children: "",
    gap: "md",
    justify: "start",
    nowrap: false,
  } satisfies ClbrInlineProps,
  render: (args: ClbrInlineProps) => {
    const itemTag = args.as === "ul" ? "li" : "div";
    return renderClbrInline({
      ...args,
      children: `<${itemTag} class="example-content-item"></${itemTag}><${itemTag} class="example-content"></${itemTag}><${itemTag} class="example-content"></${itemTag}>`,
    });
  },
};
