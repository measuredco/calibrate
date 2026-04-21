import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import { renderClbrStack } from "../stack/stack";
import {
  CLBR_ALERT_SPEC,
  type ClbrAlertProps,
  defineClbrAlert,
  renderClbrAlert,
} from "./alert";

defineClbrAlert();

const baseArgTypes = specToArgTypes(CLBR_ALERT_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_ALERT_SPEC),
      },
    },
  },
  title: "Status/Alert",
};

export default meta;

export const Default = {
  args: {
    dismissible: false,
    dismissibleLabel: "",
    inlineSize: "fit",
    message:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    title: "",
    tone: undefined,
  } satisfies ClbrAlertProps,
  render: (args: ClbrAlertProps) => renderClbrAlert(args),
};

export const Tone = {
  parameters: { controls: { disable: true } },
  render: () =>
    renderClbrStack({
      children: [
        renderClbrAlert({
          inlineSize: "fit",
          message: "Lorem ipsum dolor sit amet",
          title: "Default",
        }),
        renderClbrAlert({
          inlineSize: "fit",
          message: "Lorem ipsum dolor sit amet",
          title: "Info",
          tone: "info",
        }),
        renderClbrAlert({
          inlineSize: "fit",
          message: "Lorem ipsum dolor sit amet",
          title: "Success",
          tone: "success",
        }),
        renderClbrAlert({
          inlineSize: "fit",
          message: "Lorem ipsum dolor sit amet",
          title: "Warning",
          tone: "warning",
        }),
        renderClbrAlert({
          inlineSize: "fit",
          message: "Lorem ipsum dolor sit amet",
          title: "Error",
          tone: "error",
        }),
      ].join(""),
    }),
};
