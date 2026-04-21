import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import {
  CLBR_SPINNER_SPEC,
  type ClbrSpinnerProps,
  renderClbrSpinner,
} from "./spinner";

const meta = {
  argTypes: specToArgTypes(CLBR_SPINNER_SPEC),
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_SPINNER_SPEC),
      },
    },
  },
  title: "Status/Spinner",
};

export default meta;

export const Default = {
  args: {
    label: "",
    size: "md",
    tone: "default",
  } satisfies ClbrSpinnerProps,
  render: (args: ClbrSpinnerProps) => renderClbrSpinner({ ...args }),
};
