import {
  renderClbrBox,
  renderClbrContainer,
  renderClbrHeading,
  renderClbrStack,
  renderClbrText,
} from "@measured/calibrate-core";

export default class Index {
  data() {
    return {
      title: "Home",
      layout: "base.11ty.ts",
      permalink: "/next/",
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
              text: "Calibrate",
            }),
            renderClbrText({
              as: "p",
              children: "Measured Design Languauge System",
            }),
          ].join(""),
        }),
      }),
    });
  }
}
