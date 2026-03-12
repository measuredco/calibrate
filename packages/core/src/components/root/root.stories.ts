import { type ClbrRootProps, renderClbrRoot } from "./root";

type RootStoryArgs = Omit<
  ClbrRootProps,
  "appOverscrollBehavior" | "dir" | "theme"
> & {
  appOverscrollBehavior?: "" | "none";
  dir?: "" | "ltr" | "rtl";
  theme?: "" | "light" | "dark";
};

const meta = {
  argTypes: {
    appOverscrollBehavior: {
      control: {
        labels: {
          none: "none",
        },
        type: "select",
      },
      options: ["", "none"],
    },
    appRoot: {
      control: { type: "boolean" },
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
      options: ["", "ltr", "rtl"],
    },
    lang: {
      control: { type: "text" },
    },
    theme: {
      control: {
        labels: {
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
        component:
          "Toolbar globals are ignored here; use Controls for root props.",
      },
    },
    withRoot: false,
  },
  title: "Components/Root",
};

export default meta;

export const Default = {
  args: {
    appOverscrollBehavior: "",
    appRoot: false,
    brand: "msrd",
    children: `<div style="padding: 1.75rem 1.25rem">Example content</div>`,
    dir: "",
    lang: undefined,
    theme: "",
  },
  render: (args: RootStoryArgs) =>
    renderClbrRoot({
      ...args,
      appOverscrollBehavior:
        args.appOverscrollBehavior === ""
          ? undefined
          : args.appOverscrollBehavior,
      dir: args.dir === "" ? undefined : args.dir,
      theme: args.theme === "" ? undefined : args.theme,
    }),
};
