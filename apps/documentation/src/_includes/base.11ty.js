import {
  renderClbrBox,
  renderClbrContainer,
  renderClbrDivider,
  renderClbrHeading,
  renderClbrInline,
  renderClbrLink,
  renderClbrPage,
  renderClbrRoot,
  renderClbrSidebar,
  renderClbrStack,
  renderClbrSurface,
  renderClbrText,
} from "@measured/calibrate-core";

const sidebarItems = [
  { href: "/next/", label: "Home" },
  { href: "/next/getting-started/", label: "Getting started" },
  { href: "/next/foundations/", label: "Foundations" },
  { href: "/next/skills/", label: "Skills" },
  { href: "/next/components/", label: "Components" },
];

const sidebarStack = renderClbrBox({
  background: "panel",
  paddingBlock: "sm",
  paddingInline: "md",
  children: renderClbrStack({
    align: "start",
    gap: "xs",
    children: sidebarItems
      .map(({ href, label }) =>
        renderClbrLink({ href, label, tone: "neutral" }),
      )
      .join(""),
  }),
});

const sidebar = renderClbrSidebar({
  aboveNotebook: "persistent",
  buttonSize: "sm",
  children: sidebarStack,
  header: renderClbrBox({
    paddingBlock: "none",
    paddingInline: "sm",
    children: renderClbrHeading({ text: "Calibrate.", size: "md" }),
  }),
  id: "docs-sidebar",
  surface: "default",
});

const logo = `<a href="/next/" style="display: block; margin-block: var(--clbr-spacing-vertical-250)">${renderClbrHeading({ text: "Calibrate.", size: "md" })}</a>`;

const header = renderClbrSurface({
  contentTheme: "dark",
  variant: "default",
  children: renderClbrBox({
    paddingBlock: "none",
    paddingInline: "none",
    background: "panel",
    children: renderClbrContainer({
      gutter: "narrow",
      maxInlineSize: "none",
      children: renderClbrBox({
        paddingBlock: "2xs",
        paddingInline: "none",
        background: "transparent",
        children: renderClbrInline({
          gap: "lg",
          children: [sidebar, logo].join(""),
        }),
      }),
    }),
  }),
});

const footer = [
  renderClbrDivider({ tone: "subtle" }),
  renderClbrContainer({
    children: [
      renderClbrBox({
        paddingBlock: "xs",
        paddingInline: "none",
        children: renderClbrText({
          as: "p",
          size: "xs",
          tone: "muted",
          children: "© 2026 Measured",
        }),
      }),
    ].join(""),
  }),
].join("");

export default class Base {
  render(data) {
    const page = renderClbrPage({
      stickyHeader: "always",
      header,
      headerSize: "sm",
      footer,
      children: data.content ?? "",
    });

    const root = renderClbrRoot({
      brand: "msrd",
      appOverscrollBehavior: "none",
      appRoot: true,
      children: page,
    });

    const title = data.title ? `${data.title} — Calibrate` : "Calibrate";

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>${title}</title>
<link href="/assets/favicons/apple-touch-icon.png" rel="apple-touch-icon">
<link href="/assets/favicons/favicon.ico" rel="icon" sizes="32x32">
<link href="/assets/favicons/favicon.svg" rel="icon" type="image/svg+xml">
<link rel="stylesheet" href="/assets/fonts.css">
<link rel="stylesheet" href="/assets/calibrate-core.css">
</head>
<body>${root}<script type="module">
import { defineClbrComponents } from "/assets/calibrate-core.js";
defineClbrComponents();
</script></body>
</html>`;
  }
}
