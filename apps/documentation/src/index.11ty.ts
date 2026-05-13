import {
  renderClbrBox,
  renderClbrContainer,
  renderClbrGrid,
  renderClbrGridItem,
  renderClbrHeading,
  renderClbrImage,
  renderClbrText,
} from "@measured/calibrate-core";

import type { SiteData } from "./_data/site";

interface PageData {
  site: SiteData;
}

export default class Index {
  data() {
    return {
      layout: "base.11ty.ts",
      permalink: "/",
      title: "",
    };
  }

  render(data: PageData): string {
    const { site } = data;
    return [
      renderClbrImage({
        cover: true,
        gravity: "C",
        aspectRatio: "21:9",
        height: 480,
        priority: true,
        src: "https://res.cloudinary.com/measuredco/image/upload/f_auto,q_auto,w_2240,h_1260,c_fill/v1771287162/facet/facet-965825281_gatqoa.png",
      }),
      renderClbrBox({
        paddingBlock: "lg",
        paddingInline: "none",
        children: renderClbrContainer({
          maxInlineSize: "none",
          children: renderClbrGrid({
            children: [
              renderClbrGridItem({
                colSpan: 5,
                colStart: 2,
                children: renderClbrHeading({
                  level: 1,
                  responsive: true,
                  size: "lg",
                  text: site.title,
                }),
              }),
              renderClbrGridItem({
                colSpan: 5,
                colStart: 7,
                children: renderClbrText({
                  as: "p",
                  children: site.description,
                  linkVisited: false,
                  responsive: true,
                  size: "lg",
                }),
              }),
            ].join(""),
          }),
        }),
      }),
    ].join("");
  }
}
