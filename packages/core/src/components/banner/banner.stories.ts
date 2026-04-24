import { specToArgTypes, specToComponentDescription } from "../../spec";
import { renderClbrStack } from "../stack/stack";
import {
  CLBR_BANNER_SPEC,
  type ClbrBannerProps,
  defineClbrBanner,
  renderClbrBanner,
} from "./banner";

defineClbrBanner();

const baseArgTypes = specToArgTypes(CLBR_BANNER_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_BANNER_SPEC),
      },
    },
  },
  title: "Status/Banner",
};

export default meta;

export const Default = {
  args: {
    actionHref: "#",
    actionLabel: "Action link",
    dismissible: true,
    dismissibleLabel: "Dismiss banner",
    message: `Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt.`,
    tone: undefined,
  } satisfies ClbrBannerProps,
  render: (args: ClbrBannerProps) => {
    const hasAction = Boolean(
      args.actionHref?.trim() && args.actionLabel?.trim(),
    );
    return renderClbrBanner({
      ...args,
      actionHref: hasAction ? args.actionHref : undefined,
      actionLabel: hasAction ? args.actionLabel : undefined,
    });
  },
};

export const Tone = {
  parameters: { controls: { disable: true } },
  render: () =>
    renderClbrStack({
      children: [
        renderClbrBanner({
          message: "Default",
        }),
        renderClbrBanner({
          message: "Info",
          tone: "info",
        }),
        renderClbrBanner({
          message: "Success",
          tone: "success",
        }),
        renderClbrBanner({
          message: "Warning",
          tone: "warning",
        }),
        renderClbrBanner({
          message: "Error",
          tone: "error",
        }),
      ].join(""),
    }),
};
