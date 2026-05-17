import {
  renderClbrBox,
  renderClbrContainer,
  renderClbrDivider,
  renderClbrGrid,
  renderClbrGridItem,
  renderClbrHeading,
  renderClbrInline,
  renderClbrLink,
  renderClbrLogo,
  renderClbrPage,
  renderClbrProse,
  renderClbrRoot,
  renderClbrSidebar,
  renderClbrStack,
  renderClbrText,
} from "@measured/calibrate-core";

import type { FooterData, FooterLink } from "../_data/footer";
import type { NavData, NavEntry, NavItem } from "../_data/nav";
import type { SiteData } from "../_data/site";

export interface PageData {
  centerMain?: boolean;
  content?: string;
  footer: FooterData;
  nav: NavData;
  prose?: boolean;
  site: SiteData;
  title?: string;
}

const renderNavLink = ({ href, label }: NavItem): string =>
  renderClbrLink({ href, label, tone: "neutral" });

// A group is introduced by a muted, non-link label above its links.
const renderSidebarItems = (entries: NavEntry[]): string =>
  entries
    .map((entry) =>
      "items" in entry
        ? [
            renderClbrText({
              as: "p",
              children: entry.label,
              size: "sm",
              tone: "muted",
            }),
            ...entry.items.map(renderNavLink),
          ].join("")
        : renderNavLink(entry),
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
        gap: "xs",
        children: renderSidebarItems(nav.sidebar),
      }),
    }),
    header: renderClbrBox({
      paddingBlock: "none",
      paddingInline: "sm",
      children: `<a href="/">
        ${renderClbrHeading({ text: site.title, size: "md" })}
      </a>`,
    }),
    id: "docs-sidebar",
  });

const buildHeader = (nav: NavData, site: SiteData): string => {
  const logo = `<a
    href="/"
    style="display: block; margin-block: var(--clbr-spacing-vertical-250)"
  >${renderClbrHeading({ text: site.title, size: "md" })}</a>`;
  const sidebar = buildSidebar(nav, site);

  return renderClbrBox({
    background: "panel",
    paddingBlock: "none",
    paddingInline: "none",
    children: renderClbrContainer({
      gutter: "narrow",
      maxInlineSize: "none",
      children: renderClbrBox({
        paddingBlock: "2xs",
        paddingInline: "none",
        background: "transparent",
        children: renderClbrInline({
          gap: "sm",
          children: [sidebar, logo].join(""),
        }),
      }),
    }),
  });
};

const renderFooterLinks = (items: FooterLink[]): string =>
  items
    .map(
      ({ href, label }) =>
        `<li>${renderClbrLink({
          href,
          label,
          tone: "neutral",
        })}</li>`,
    )
    .join("");

const buildFooter = (footer: FooterData, site: SiteData): string =>
  [
    renderClbrDivider({ tone: "subtle" }),
    renderClbrContainer({
      gutter: "narrow",
      maxInlineSize: "none",
      children: renderClbrBox({
        paddingBlock: "xs",
        paddingInline: "none",
        children: renderClbrInline({
          align: "end",
          gap: "xs",
          justify: "between",
          children: [
            `<a
              href="#"
              style="margin-block-end: var(--clbr-spacing-vertical-400)"
            >${renderClbrLogo({
              label: site.organization,
              size: "sm",
              tone: "neutral",
              variant: "graphic",
            })}</a>`,
            renderClbrInline({
              align: "end",
              as: "ul",
              gap: "sm",
              children: renderFooterLinks(footer.links),
            }),
          ].join(""),
        }),
      }),
    }),
  ].join("");

const renderBasePage = (data: PageData): string => {
  const { footer, site, nav } = data;
  const mainContent = data.prose
    ? renderClbrContainer({
        maxInlineSize: "none",
        children: renderClbrBox({
          paddingBlock: "lg",
          paddingInline: "none",
          responsive: true,
          children: renderClbrGrid({
            children: renderClbrGridItem({
              colStart: 2,
              colSpan: 11,
              children: renderClbrProse({
                children: data.content ?? "",
                hangingPunctuation: "notebook",
                responsive: true,
              }),
            }),
          }),
        }),
      })
    : (data.content ?? "");

  const page = renderClbrPage({
    centerMain: data.centerMain,
    children: mainContent,
    footer: buildFooter(footer, site),
    header: buildHeader(nav, site),
    headerBorder: "always",
    headerSize: "sm",
    stickyHeader: "always",
  });

  const root = renderClbrRoot({
    appOverscrollBehavior: "none",
    appRoot: true,
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
<link rel="stylesheet" href="/assets/styles/docs.css">
</head>
<body class="docs">${root}<script type="module">
import { defineClbrComponents } from "/assets/calibrate-core.js";
defineClbrComponents();
</script></body>
</html>`;
};

export default class Base {
  render(data: PageData): string {
    return renderBasePage(data);
  }
}
