import {
  renderClbrBox,
  renderClbrContainer,
  renderClbrDivider,
  renderClbrHeading,
  renderClbrIcon,
  renderClbrInline,
  renderClbrLink,
  renderClbrPage,
  renderClbrRoot,
  renderClbrSidebar,
  renderClbrStack,
  renderClbrSurface,
  renderClbrText,
} from "@measured/calibrate-core";

import type { NavData, NavItem } from "../_data/nav";
import type { SiteData } from "../_data/site";

interface PageData {
  content?: string;
  title?: string;
  centerMain?: boolean;
  site: SiteData;
  nav: NavData;
}

const renderSidebarItems = (items: NavItem[]): string =>
  items
    .map(({ href, label, external }) =>
      renderClbrLink({
        href,
        label,
        tone: "neutral",
        ...(external
          ? {
              target: "_blank",
              icon: renderClbrIcon({ name: "ExternalLink", size: "2xs" }),
              iconPlacement: "end",
            }
          : {}),
      }),
    )
    .join("");

const buildSidebar = (nav: NavData, site: SiteData): string =>
  renderClbrSidebar({
    aboveNotebook: "persistent",
    buttonSize: "sm",
    children: renderClbrBox({
      background: "panel",
      paddingBlock: "sm",
      paddingInline: "md",
      children: renderClbrStack({
        align: "start",
        gap: "xs",
        children: renderSidebarItems(nav.sidebar),
      }),
    }),
    header: renderClbrBox({
      paddingBlock: "none",
      paddingInline: "sm",
      children: `<a href="/">${renderClbrHeading({ text: `${site.title}.`, size: "md" })}</a>`,
    }),
    id: "docs-sidebar",
    surface: "default",
  });

const buildHeader = (nav: NavData, site: SiteData): string => {
  const sidebar = buildSidebar(nav, site);
  const logo = `<a href="/" style="display: block; margin-block: var(--clbr-spacing-vertical-250)">${renderClbrHeading({ text: `${site.title}.`, size: "md" })}</a>`;

  return renderClbrSurface({
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
};

const buildFooter = (site: SiteData): string =>
  [
    renderClbrDivider({ tone: "subtle" }),
    renderClbrContainer({
      maxInlineSize: "none",
      children: renderClbrBox({
        paddingBlock: "xs",
        paddingInline: "none",
        children: renderClbrText({
          as: "p",
          size: "xs",
          tone: "muted",
          children: site.copyright,
        }),
      }),
    }),
  ].join("");

export default class Base {
  render(data: PageData): string {
    const { site, nav } = data;

    const page = renderClbrPage({
      centerMain: data.centerMain,
      children: data.content ?? "",
      footer: buildFooter(site),
      header: buildHeader(nav, site),
      headerBorder: "always",
      headerSize: "sm",
      stickyHeader: "always",
    });

    const root = renderClbrRoot({
      appOverscrollBehavior: "none",
      appRoot: true,
      brand: "msrd",
      children: page,
    });

    const title = data.title ? `${data.title} | ${site.title}` : site.title;

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>${title}</title>
<meta name="description" content="${site.description}">
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
