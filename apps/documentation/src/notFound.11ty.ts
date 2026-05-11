import {
  renderClbrBox,
  renderClbrContainer,
  renderClbrHeading,
  renderClbrStack,
  renderClbrText,
} from "@measured/calibrate-core";

import type { NotFoundData } from "./_data/notFound";

interface PageData {
  notFound: NotFoundData;
}

export default class NotFound {
  data() {
    return {
      title: "Not found",
      centerMain: true,
      eleventyExcludeFromCollections: true,
      layout: "base.11ty.ts",
      permalink: "/404.html",
    };
  }

  render(data: PageData): string {
    const { notFound } = data;
    return renderClbrContainer({
      children: renderClbrBox({
        paddingBlock: "md",
        paddingInline: "none",
        responsive: true,
        children: renderClbrStack({
          gap: "none",
          children: [
            renderClbrHeading({
              align: "center",
              level: 1,
              responsive: true,
              size: "2xl",
              text: notFound.headline,
            }),
            renderClbrText({
              align: "center",
              as: "p",
              children: notFound.message,
            }),
          ].join(""),
        }),
      }),
    });
  }
}
