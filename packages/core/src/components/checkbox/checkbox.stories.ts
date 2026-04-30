import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  CLBR_CHECKBOX_SPEC,
  type ClbrCheckboxProps,
  renderClbrCheckbox,
} from "./checkbox";

const baseArgTypes = specToArgTypes(CLBR_CHECKBOX_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_CHECKBOX_SPEC),
      },
    },
  },
  title: "Control/Checkbox",
};

export default meta;

export const Default = {
  args: {
    checked: false,
    description: "Description",
    disabled: false,
    id: "storybook-checkbox",
    invalid: false,
    label: "Label",
    name: "",
    required: false,
    size: "md",
    value: "",
  } satisfies ClbrCheckboxProps,
  render: (args: ClbrCheckboxProps) => renderClbrCheckbox(args),
};

export const Indeterminate = {
  args: {
    ...Default.args,
    label: "Partially selected",
  } satisfies ClbrCheckboxProps,
  parameters: {
    docs: { disable: true },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const input = canvasElement.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement | null;

    if (input) input.indeterminate = true;
  },
  render: Default.render,
};
