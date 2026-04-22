import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import {
  CLBR_EXPANDER_SPEC,
  type ClbrExpanderProps,
  renderClbrExpander,
} from "./expander";

const meta = {
  argTypes: specToArgTypes(CLBR_EXPANDER_SPEC),
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_EXPANDER_SPEC),
      },
    },
  },
  title: "Control/Expander",
};

export default meta;

export const Default = {
  args: {
    controlsId: "",
    expanded: false,
    label: "Menu",
    size: "md",
  } satisfies ClbrExpanderProps,
  render: (args: ClbrExpanderProps) => {
    const html = renderClbrExpander(args);

    queueMicrotask(() => {
      const button = document.querySelector(".sb-show-main .clbr-expander");

      if (!(button instanceof HTMLButtonElement)) return;

      button.onclick = () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", expanded ? "false" : "true");
      };
    });

    return html;
  },
};
