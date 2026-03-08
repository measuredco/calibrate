import { renderClbrRoot } from "./root";

const meta = {
  parameters: {
    withRoot: false,
  },
  title: "Components/Root",
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  args: {
    brand: "msrd",
    children: "Root scope content",
    dir: "",
    lang: "",
  },
  render: (args: Parameters<typeof renderClbrRoot>[0]) => renderClbrRoot(args),
};
