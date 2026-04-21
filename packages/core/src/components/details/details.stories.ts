import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import {
  CLBR_DETAILS_SPEC,
  type ClbrDetailsProps,
  renderClbrDetails,
} from "./details";

const baseArgTypes = specToArgTypes(CLBR_DETAILS_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    children: { ...baseArgTypes.children, control: false },
  },
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_DETAILS_SPEC),
      },
    },
  },
  title: "Structure/Details",
};

export default meta;

export const Default = {
  args: {
    children: '<div class="example-content"></div>',
    inlineSize: "fit",
    open: false,
    summary: "Summary",
  } satisfies ClbrDetailsProps,
  render: (args: ClbrDetailsProps) => renderClbrDetails({ ...args }),
};
