import { renderClbrImage } from "../image/image";
import { type ClbrExhibitProps, renderClbrExhibit } from "./exhibit";

const meta = {
  argTypes: {
    align: {
      control: { type: "select" },
      options: ["start", "center", "end"],
    },
    children: { control: false },
  },
  title: "Structure/Exhibit",
};

export default meta;

export const Default = {
  args: {
    align: "start",
    caption:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    children: renderClbrImage({
      alt: "Measured card artwork",
      radius: "xs",
      src: "https://res.cloudinary.com/measuredco/image/upload/f_auto,q_auto,w_640,h_360,c_fill/v1771287162/facet/facet-965825281_gatqoa.png",
    }),
    responsive: false,
  } satisfies ClbrExhibitProps,
  render: (args: ClbrExhibitProps) => renderClbrExhibit(args),
};
