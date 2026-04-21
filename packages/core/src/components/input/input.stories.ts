import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import {
  CLBR_INPUT_SPEC,
  type ClbrInputProps,
  renderClbrInput,
} from "./input";

const baseArgTypes = specToArgTypes(CLBR_INPUT_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    autocomplete: {
      ...baseArgTypes.autocomplete,
      control: { type: "text" },
    },
  },
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_INPUT_SPEC),
      },
    },
  },
  title: "Control/Input",
};

export default meta;

export const Default = {
  args: {
    autocomplete: "off",
    description: "Description",
    disabled: false,
    id: "inputId",
    inlineSize: "fit",
    invalid: false,
    label: "Label",
    name: "",
    pattern: "",
    readOnly: false,
    required: false,
    size: "md",
    spellcheck: false,
    type: "text",
    value: "Value",
  } satisfies ClbrInputProps,
  render: (args: ClbrInputProps) =>
    renderClbrInput({
      ...args,
      id: args.id?.trim() || "storybook-fallback-input-id",
    }),
};
