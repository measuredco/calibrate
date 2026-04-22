import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import {
  CLBR_TEXTAREA_SPEC,
  type ClbrTextareaProps,
  renderClbrTextarea,
} from "./textarea";

const baseArgTypes = specToArgTypes(CLBR_TEXTAREA_SPEC);

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
        component: specToComponentDescription(CLBR_TEXTAREA_SPEC),
      },
    },
  },
  title: "Control/Textarea",
};

export default meta;

export const Default = {
  args: {
    autocomplete: "off",
    description: "Description",
    disabled: false,
    id: "textarea-id",
    invalid: false,
    inlineSize: "fit",
    label: "Label",
    name: "",
    readOnly: false,
    required: false,
    resize: "vertical",
    rows: 2,
    size: "md",
    spellcheck: false,
    value: "Value",
  } satisfies ClbrTextareaProps,
  render: (args: ClbrTextareaProps) =>
    renderClbrTextarea({
      ...args,
      id: args.id?.trim() || "storybook-fallback-textarea-id",
    }),
};
