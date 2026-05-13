import { readFileSync } from "node:fs";

import {
  renderClbrBox,
  renderClbrContainer,
  renderClbrDivider,
  renderClbrGrid,
  renderClbrGridItem,
  renderClbrHeading,
  renderClbrProse,
  renderClbrStack,
  renderClbrText,
} from "@measured/calibrate-core";
import { processMarkdown } from "@measured/calibrate-markdown";

import type { GettingStartedData } from "./_data/getting-started";
import gettingStartedData from "./_data/getting-started";

const bodyMarkdown = readFileSync(
  new URL("./content/getting-started.md", import.meta.url),
  "utf8",
);

interface PageData {
  "getting-started": GettingStartedData;
}

export default class GettingStarted {
  data() {
    return {
      layout: "base.11ty.ts",
      permalink: "/getting-started/",
      title: gettingStartedData.title,
    };
  }

  render(data: PageData): string {
    const gettingStarted = data["getting-started"];

    return renderClbrContainer({
      maxInlineSize: "none",
      children: renderClbrBox({
        paddingBlock: "lg",
        paddingInline: "none",
        responsive: true,
        children: renderClbrGrid({
          children: [
            renderClbrGridItem({
              colStart: 2,
              colSpan: 11,
              children: renderClbrStack({
                gap: "md",
                children: [
                  renderClbrHeading({
                    level: 1,
                    opticalAlign: true,
                    responsive: true,
                    size: "2xl",
                    text: gettingStarted.title,
                  }),
                  renderClbrText({
                    as: "p",
                    children: gettingStarted.strapline,
                    size: "lg",
                    responsive: true,
                  }),
                  renderClbrDivider({ tone: "brand" }),
                ].join(""),
              }),
            }),
            renderClbrGridItem({
              colStart: 2,
              colSpan: 11,
              children: renderClbrProse({
                children: processMarkdown(bodyMarkdown),
                hangingPunctuation: "notebook",
                responsive: true,
              }),
            }),
          ].join(""),
        }),
      }),
    });
  }
}
