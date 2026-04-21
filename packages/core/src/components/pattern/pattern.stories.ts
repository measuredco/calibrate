import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import {
  CLBR_PATTERN_SPEC,
  type ClbrPatternProps,
  renderClbrPattern,
} from "./pattern";

const baseArgTypes = specToArgTypes(CLBR_PATTERN_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    children: { ...baseArgTypes.children, control: false },
  },
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_PATTERN_SPEC),
      },
    },
    padding: 0,
  },
  title: "Graphic/Pattern",
};

export default meta;

export const Default = {
  args: {
    children: `<div style="block-size: 6rem;"></div>`,
    size: "md",
    tone: "default",
    variant: "corner",
  } satisfies ClbrPatternProps,
  render: (args: ClbrPatternProps) => renderClbrPattern(args),
};
