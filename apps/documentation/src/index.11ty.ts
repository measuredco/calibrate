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
      title: "",
      layout: "base.11ty.ts",
      permalink: "/",
    };
  }

  render(): string {
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
              text: "Calibrate.",
            }),
            renderClbrText({
              as: "p",
              children: "Measured Design Language System",
              size: "xs",
            }),
          ].join(""),
        }),
      }),
    });
  }
}
