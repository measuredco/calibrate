import { renderClbrStack } from "../stack/stack";
import { type ClbrAlertProps, defineClbrAlert, renderClbrAlert } from "./alert";

defineClbrAlert();

const meta = {
  argTypes: {
    inlineSize: {
      control: { type: "select" },
      options: ["full", "fit"],
    },
    tone: {
      control: { type: "select" },
      options: ["info", "success", "warning", "error"],
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
