import { specToArgTypes, specToComponentDescription } from "../../spec";
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
    checked: true,
    description: "Description",
    disabled: false,
    id: "switch-id",
    label: "Label",
    name: "",
    size: "md",
    value: "",
  } satisfies ClbrSwitchProps,
  render: (args: ClbrSwitchProps) =>
    renderClbrSwitch({
      ...args,
      id: args.description?.trim()
        ? args.id?.trim() || "storybook-fallback-switch-id"
        : args.id?.trim() || undefined,
    }),
};
