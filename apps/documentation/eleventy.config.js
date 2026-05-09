import { processMarkdown } from "@measured/calibrate-markdown";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "node_modules/@measured/calibrate-core/dist/core.css":
      "assets/calibrate-core.css",
    "node_modules/@measured/calibrate-core/dist/index.js":
      "assets/calibrate-core.js",
    "node_modules/@measured/calibrate-assets/src/fonts.css": "assets/fonts.css",
    "node_modules/@measured/calibrate-assets/src/fonts": "assets/fonts",
    "node_modules/@measured/calibrate-assets/src/favicons": "assets/favicons",
    "src/_redirects": "_redirects",
  });

  eleventyConfig.setLibrary("md", {
    render: (markdown) => processMarkdown(markdown),
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
    },
    markdownTemplateEngine: "md",
    htmlTemplateEngine: false,
  };
}
