import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import { CLBR_STACK_SPEC, type ClbrStackProps, renderClbrStack } from "./stack";

const baseArgTypes = specToArgTypes(CLBR_STACK_SPEC);

const meta = {
  argTypes: baseArgTypes,
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
    children: "",
    gap: "md",
    responsive: false,
  } satisfies ClbrStackProps,
  render: (args: ClbrStackProps) => {
    const itemTag = args.as === "ul" ? "li" : "div";
    const children = Array.from({ length: 3 })
      .map(() => `<${itemTag} class="example-content"></${itemTag}>`)
      .join("");
    return renderClbrStack({ ...args, children });
  },
};
