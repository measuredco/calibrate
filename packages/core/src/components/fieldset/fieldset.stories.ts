import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import {
  CLBR_FIELDSET_SPEC,
  type ClbrFieldsetProps,
  renderClbrFieldset,
} from "./fieldset";

const baseArgTypes = specToArgTypes(CLBR_FIELDSET_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    children: { ...baseArgTypes.children, control: false },
  },
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_FIELDSET_SPEC),
      },
    },
  },
  title: "Control/Fieldset",
};

export default meta;

export const Default = {
  args: {
    children: '<div class="example-content"></div>',
    description: "Description",
    disabled: false,
    id: "fieldsetId",
    inlineSize: "fit",
    invalid: false,
    legend: "Legend",
  } satisfies ClbrFieldsetProps,
  render: (args: ClbrFieldsetProps) =>
    renderClbrFieldset({
      ...args,
      id: args.id?.trim() || "storybook-fallback-fieldset-id",
    }),
};
