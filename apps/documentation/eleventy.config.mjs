import { processMarkdown } from "@measured/calibrate-markdown";

export default function (eleventyConfig) {
  eleventyConfig.addExtension("11ty.ts", { key: "11ty.js" });

  eleventyConfig.addPassthroughCopy({
    "node_modules/@measured/calibrate-core/dist/core.css":
      "assets/calibrate-core.css",
    "node_modules/@measured/calibrate-core/dist/index.js":
      "assets/calibrate-core.js",
    "node_modules/@measured/calibrate-assets/src/favicons": "assets/favicons",
    "node_modules/@measured/calibrate-assets/src/fonts": "assets/fonts",
    "node_modules/@measured/calibrate-assets/src/fonts.css": "assets/fonts.css",
    "../storybook/storybook-static": "storybook",
  });

  eleventyConfig.setLibrary("md", {
    render: (markdown) => processMarkdown(markdown),
  });

  return {
    dir: {
      includes: "_includes",
      input: "src",
      output: "dist",
    },
    htmlTemplateEngine: false,
    markdownTemplateEngine: "md",
    templateFormats: ["md", "11ty.ts"],
  };
}
