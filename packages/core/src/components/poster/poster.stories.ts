import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import { renderClbrBox } from "../box/box";
import { renderClbrButton } from "../button/button";
import { renderClbrContainer } from "../container/container";
import { renderClbrGrid, renderClbrGridItem } from "../grid/grid";
import { renderClbrHeading } from "../heading/heading";
import { renderClbrImage } from "../image/image";
import { renderClbrStack } from "../stack/stack";
import { renderClbrText } from "../text/text";
import {
  CLBR_POSTER_SPEC,
  type ClbrPosterProps,
  renderClbrPoster,
} from "./poster";

const baseArgTypes = specToArgTypes(CLBR_POSTER_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    children: { ...baseArgTypes.children, control: false },
    contentTheme: { ...baseArgTypes.contentTheme, control: false },
    image: { ...baseArgTypes.image, control: false },
  },
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_POSTER_SPEC),
      },
    },
    padding: 0,
  },
  title: "Structure/Poster",
};

export default meta;

export const Default = {
  args: {
    surface: "brand",
    contentTheme: "dark",
    children: renderClbrContainer({
      children: renderClbrBox({
        background: "transparent",
        paddingBlock: "xl",
        paddingInline: "none",
        responsive: true,
        children: renderClbrGrid({
          children: renderClbrGridItem({
            align: "center",
            colSpan: 5,
            colSpanNarrow: 7,
            children: renderClbrStack({
              align: "start",
              children: `${renderClbrHeading({
                level: 1,
                opticalInline: true,
                responsive: true,
                size: "5xl",
                children: "Heading",
              })}${renderClbrText({
                as: "p",
                children:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              })}${renderClbrButton({
                size: "lg",
                label: "Call to action",
              })}`,
            }),
          }),
        }),
      }),
    }),
    image: renderClbrImage({
      cover: true,
      gravity: "SE",
      priority: true,
      sizes:
        "(max-width: 24em) 21.5rem, (max-width: 42.5em) calc(100vw - 2.5rem), 40rem",
      src: "https://res.cloudinary.com/measuredco/image/upload/f_auto,q_auto,w_640,h_360,c_fill/v1771287162/facet/facet-965825281_gatqoa.png",
      srcSet:
        "https://res.cloudinary.com/measuredco/image/upload/f_auto,q_auto,w_344,h_194,c_fill/v1771287162/facet/facet-965825281_gatqoa.png 344w, https://res.cloudinary.com/measuredco/image/upload/f_auto,q_auto,w_640,h_360,c_fill/v1771287162/facet/facet-965825281_gatqoa.png 640w, https://res.cloudinary.com/measuredco/image/upload/f_auto,q_auto,w_688,h_387,c_fill/v1771287162/facet/facet-965825281_gatqoa.png 688w, https://res.cloudinary.com/measuredco/image/upload/f_auto,q_auto,w_1032,h_581,c_fill/v1771287162/facet/facet-965825281_gatqoa.png 1032w, https://res.cloudinary.com/measuredco/image/upload/f_auto,q_auto,w_1280,h_720,c_fill/v1771287162/facet/facet-965825281_gatqoa.png 1280w, https://res.cloudinary.com/measuredco/image/upload/f_auto,q_auto,w_1920,h_1080,c_fill/v1771287162/facet/facet-965825281_gatqoa.png 1920w",
    }),
  } satisfies ClbrPosterProps,
  render: (args: ClbrPosterProps) => renderClbrPoster(args),
};
