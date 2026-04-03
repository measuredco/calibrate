import { type ClbrImageProps, renderClbrImage } from "./image";

const meta = {
  argTypes: {
    aspectRatio: {
      control: { type: "select" },
      options: ["1:1", "4:5", "3:2", "16:9", "21:9"],
    },
    objectPosition: {
      control: { type: "select" },
      options: ["center", "top", "bottom", "left", "right"],
    },
    radius: {
      control: { type: "select" },
      options: ["xs", "ratio"],
    },
    sources: { control: false },
  },
  title: "Graphic/Image",
};

export default meta;

export const Default = {
  args: {
    cover: false,
    objectPosition: "center",
    aspectRatio: undefined,
    width: 0,
    height: 0,
    radius: undefined,
    shadow: false,
    alt: "",
    lazy: false,
    priority: false,
    src: "https://res.cloudinary.com/measuredco/image/upload/f_auto,q_auto,w_640,h_360,c_fill/v1771287162/facet/facet-965825281_gatqoa.png",
    srcSet: [
      "https://res.cloudinary.com/measuredco/image/upload/f_auto,q_auto,w_344,h_194,c_fill/v1771287162/facet/facet-965825281_gatqoa.png 344w",
      "https://res.cloudinary.com/measuredco/image/upload/f_auto,q_auto,w_640,h_360,c_fill/v1771287162/facet/facet-965825281_gatqoa.png 640w",
      "https://res.cloudinary.com/measuredco/image/upload/f_auto,q_auto,w_688,h_387,c_fill/v1771287162/facet/facet-965825281_gatqoa.png 688w",
      "https://res.cloudinary.com/measuredco/image/upload/f_auto,q_auto,w_1032,h_581,c_fill/v1771287162/facet/facet-965825281_gatqoa.png 1032w",
      "https://res.cloudinary.com/measuredco/image/upload/f_auto,q_auto,w_1280,h_720,c_fill/v1771287162/facet/facet-965825281_gatqoa.png 1280w",
      "https://res.cloudinary.com/measuredco/image/upload/f_auto,q_auto,w_1920,h_1080,c_fill/v1771287162/facet/facet-965825281_gatqoa.png 1920w",
    ].join(", "),
    sizes:
      "(max-width: 24em) 21.5rem, (max-width: 42.5em) calc(100vw - 2.5rem), 40rem",
    sources: undefined,
  } satisfies ClbrImageProps,
  render: (args: ClbrImageProps) => renderClbrImage(args),
};
