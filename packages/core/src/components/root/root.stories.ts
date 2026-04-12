import { ClbrRootProps, renderClbrRoot } from "./root";

const meta = {
  argTypes: {
    appOverscrollBehavior: {
      control: {
        labels: {
          none: "none",
        },
        type: "select",
      },
      options: ["none"],
    },
    brand: {
      control: { type: "select" },
      options: ["msrd", "wrfr"],
    },
    children: {
      control: false,
    },
    dir: {
      control: {
        labels: {
          ltr: "ltr",
          rtl: "rtl",
        },
        type: "select",
      },
      options: ["ltr", "rtl"],
    },
    theme: {
      control: {
        labels: {
          dark: "dark",
          light: "light",
        },
        type: "select",
      },
      options: ["light", "dark"],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Toolbar globals are ignored here; use Controls for root props.",
      },
    },
    withRoot: false,
  },
  title: "Environment/Root",
};

export default meta;

export const Default = {
  args: {
    appOverscrollBehavior: undefined,
    appRoot: false,
    brand: "msrd",
    children: `<div style="padding: 1.75rem 1.25rem">Example content</div>`,
    dir: undefined,
    lang: "",
    theme: undefined,
  },
  render: (args: ClbrRootProps) => renderClbrRoot({ ...args }),
};
