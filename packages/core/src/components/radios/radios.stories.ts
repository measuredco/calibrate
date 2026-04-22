import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import {
  CLBR_RADIOS_SPEC,
  type ClbrRadiosProps,
  renderClbrRadios,
} from "./radios";

const baseArgTypes = specToArgTypes(CLBR_RADIOS_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_RADIOS_SPEC),
      },
    },
  },
  title: "Control/Radios",
};

export default meta;

export const Default = {
  args: {
    description: "Description",
    disabled: false,
    id: "radios-id",
    invalid: false,
    radios: [
      { label: "Radio one", value: "radio-one" },
      {
        description: "Description",
        label: "Radio two",
        value: "radio-two",
      },
      { label: "Radio three", value: "radio-three" },
      { disabled: true, label: "Radio four", value: "radio-four" },
    ],
    legend: "Legend",
    name: "radio-group",
    orientation: "vertical",
    required: false,
    size: "md",
    value: "radio-one",
  } satisfies ClbrRadiosProps,
  render: (args: ClbrRadiosProps) =>
    renderClbrRadios({
      ...args,
      id: args.id?.trim() || "storybook-fallback-radios-id",
      name: args.name?.trim() || "storybook-fallback-radios-name",
    }),
};
