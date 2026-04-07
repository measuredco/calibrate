import { type ClbrSpinnerProps, renderClbrSpinner } from "./spinner";

const meta = {
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "fill"],
    },
    tone: {
      control: { type: "select" },
      options: ["default", "brand"],
    },
  },
  title: "Status/Spinner",
};

export default meta;

export const Default = {
  args: {
    label: "",
    size: "md",
    tone: "default",
  } satisfies ClbrSpinnerProps,
  render: (args: ClbrSpinnerProps) => renderClbrSpinner({ ...args }),
};
