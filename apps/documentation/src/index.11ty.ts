import {
  renderClbrBox,
  renderClbrContainer,
  renderClbrHeading,
  renderClbrStack,
  renderClbrText,
} from "@measured/calibrate-core";

import type { SiteData } from "./_data/site";

interface PageData {
  site: SiteData;
}

export default class Index {
  data() {
    return {
      title: "",
      layout: "base.11ty.ts",
      permalink: "/",
    };
  }

  render(data: PageData): string {
    const { site } = data;
    return renderClbrContainer({
      maxInlineSize: "none",
      children: renderClbrBox({
        paddingBlock: "2xs",
        paddingInline: "none",
        responsive: true,
        children: renderClbrStack({
          gap: "none",
          children: [
            renderClbrHeading({
              level: 1,
              responsive: true,
              size: "2xl",
              opticalAlign: true,
              text: `${site.title}.`,
            }),
            renderClbrText({
              as: "p",
              children: site.tagline,
              size: "xs",
            }),
          ].join(""),
        }),
      }),
    });
  }
}
