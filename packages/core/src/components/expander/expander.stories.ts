import { type ClbrExpanderProps, renderClbrExpander } from "./expander";

const meta = {
  argTypes: {
    controlsId: { control: { type: "text" } },
    expanded: { control: { type: "boolean" } },
    label: { control: { type: "text" } },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
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
      const button = document.querySelector(".sb-show-main .expander");

      if (!(button instanceof HTMLButtonElement)) return;

      button.onclick = () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", expanded ? "false" : "true");
      };
    });

    return html;
  },
};
