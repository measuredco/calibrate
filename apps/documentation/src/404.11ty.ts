import {
  renderClbrBox,
  renderClbrContainer,
  renderClbrHeading,
  renderClbrStack,
  renderClbrText,
} from "@measured/calibrate-core";

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

  render(): string {
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
              text: "404",
            }),
            renderClbrText({
              align: "center",
              as: "p",
              children: "This page could not be found.",
            }),
          ].join(""),
        }),
      }),
    });
  }
}
