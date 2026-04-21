import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import {
  CLBR_HEADING_SPEC,
  type ClbrHeadingProps,
  renderClbrHeading,
} from "./heading";

const baseArgTypes = specToArgTypes(CLBR_HEADING_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_HEADING_SPEC),
      },
    },
  },
  title: "Typographic/Heading",
};

export default meta;

export const Default = {
  args: {
    align: "start",
    children: "Heading",
    level: undefined,
    opticalInline: false,
    responsive: false,
    size: "md",
  } satisfies ClbrHeadingProps,
  render: (args: ClbrHeadingProps) => renderClbrHeading({ ...args }),
};
