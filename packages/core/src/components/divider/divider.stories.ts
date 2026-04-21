import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import {
  CLBR_DIVIDER_SPEC,
  type ClbrDividerProps,
  renderClbrDivider,
} from "./divider";

const meta = {
  argTypes: specToArgTypes(CLBR_DIVIDER_SPEC),
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_DIVIDER_SPEC),
      },
    },
  },
  title: "Layout/Divider",
};

export default meta;

export const Default = {
  args: {
    orientation: "horizontal",
    tone: "default",
  } satisfies ClbrDividerProps,
  render: (args: ClbrDividerProps) => renderClbrDivider(args),
};
