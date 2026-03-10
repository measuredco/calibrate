import { type ClbrRootProps, renderClbrRoot } from "./root";

type RootStoryArgs = Omit<ClbrRootProps, "dir" | "theme"> & {
  dir?: "" | "ltr" | "rtl";
  theme?: "" | "light" | "dark";
};

const meta = {
  argTypes: {
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
          "": "inherit",
          ltr: "ltr",
          rtl: "rtl",
        },
        type: "select",
      },
      options: ["", "ltr", "rtl"],
    },
    lang: {
      control: { type: "text" },
    },
    theme: {
      control: {
        labels: {
          "": "auto",
          dark: "dark",
          light: "light",
        },
        type: "select",
      },
      options: ["", "light", "dark"],
    },
  },
  parameters: {
    docs: {
      description: {
        component: "Toolbar globals are ignored here; use Controls for root props.",
      },
    },
    withRoot: false,
  },
  title: "Components/Root",
};

export default meta;

export const Default = {
  args: {
    brand: "msrd",
    children: `<div style="padding: 1.75rem 1.25rem">Example content</div>`,
    dir: "",
    lang: undefined,
    theme: "",
  },
  render: (args: RootStoryArgs) =>
    renderClbrRoot({
      ...args,
      dir: args.dir === "" ? undefined : args.dir,
      theme: args.theme === "" ? undefined : args.theme,
    }),
};
