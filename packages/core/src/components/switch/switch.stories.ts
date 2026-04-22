import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import {
  CLBR_SWITCH_SPEC,
  type ClbrSwitchProps,
  renderClbrSwitch,
} from "./switch";

const baseArgTypes = specToArgTypes(CLBR_SWITCH_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_SWITCH_SPEC),
      },
    },
  },
  title: "Control/Switch",
};

export default meta;

export const Default = {
  args: {
    checked: false,
    description: "Description",
    descriptionId: "description-id",
    disabled: false,
    label: "Label",
    name: "",
    size: "md",
    value: "",
  } satisfies ClbrSwitchProps,
  render: (args: ClbrSwitchProps) => {
    return renderClbrSwitch({
      ...args,
      descriptionId: args.description?.trim()
        ? args.descriptionId?.trim() || "storybook-fallback-description-id"
        : undefined,
    });
  },
};
