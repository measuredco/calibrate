import { renderClbrStack } from "../stack/stack";
import {
  type ClbrBannerProps,
  defineClbrBanner,
  renderClbrBanner,
} from "./banner";

defineClbrBanner();

const meta = {
  argTypes: {
    action: { control: false },
    tone: {
      control: { type: "select" },
      options: ["info", "success", "warning", "error"],
    },
  },
  title: "Status/Banner",
};

export default meta;

export const Default = {
  args: {
    action: {
      href: "/",
      label: "Action link",
    },
    dismissible: true,
    dismissibleLabel: "Dismiss banner",
    message: `Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt.`,
    tone: undefined,
  } satisfies ClbrBannerProps,
  render: (args: ClbrBannerProps) => renderClbrBanner(args),
};

export const Tone = {
  parameters: { controls: { disable: true } },
  render: () =>
    renderClbrStack({
      children: [
        renderClbrBanner({
          action: {
            href: "/",
            label: "Default",
          },
          message: "Lorem ipsum dolor sit amet.",
        }),
        renderClbrBanner({
          action: {
            href: "/",
            label: "Info",
          },
          message: "Lorem ipsum dolor sit amet.",
          tone: "info",
        }),
        renderClbrBanner({
          action: {
            href: "/",
            label: "Success",
          },
          message: "Lorem ipsum dolor sit amet.",
          tone: "success",
        }),
        renderClbrBanner({
          action: {
            href: "/",
            label: "Warning",
          },
          message: "Lorem ipsum dolor sit amet.",
          tone: "warning",
        }),
        renderClbrBanner({
          action: {
            href: "/",
            label: "Error",
          },
          message: "Lorem ipsum dolor sit amet.",
          tone: "error",
        }),
      ].join(""),
    }),
};
