import {
  renderClbrBox,
  renderClbrContainer,
  renderClbrHeading,
  renderClbrLink,
  renderClbrStack,
  renderClbrText,
} from "@measured/calibrate-core";

export default class NotFound {
  data() {
    return {
      title: "Not found",
      layout: "base.11ty.ts",
      permalink: "/404.html",
      eleventyExcludeFromCollections: true,
    };
  }

  render(): string {
    return renderClbrContainer({
      children: renderClbrBox({
        paddingBlock: "md",
        paddingInline: "none",
        responsive: true,
        children: renderClbrStack({
          gap: "sm",
          children: [
            renderClbrHeading({
              level: 1,
              responsive: true,
              size: "5xl",
              opticalAlign: true,
              text: "Not found",
            }),
            renderClbrText({
              as: "p",
              children: `That page doesn't exist. ${renderClbrLink({
                href: "/",
                label: "Go home",
              })}`,
            }),
          ].join(""),
        }),
      }),
    });
  }
}
