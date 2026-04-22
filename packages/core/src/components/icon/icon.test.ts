import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../testing/spec";
import { CLBR_ICON_SPEC, type ClbrIconProps, renderClbrIcon } from "./icon";

function mountIcon(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrIcon", () => {
  describe("decorative mode (ariaHidden true)", () => {
    it("renders decorative attributes and omits named-icon attributes", () => {
      const root = mountIcon(
        renderClbrIcon({ ariaHidden: true, name: "check" }),
      );
      const icon = root.querySelector("svg") as SVGElement;

      expect(icon.classList.contains("icon")).toBe(true);
      expect(icon.getAttribute("data-size")).toBe("md");
      expect(icon.getAttribute("aria-hidden")).toBe("true");
      expect(icon.hasAttribute("aria-labelledby")).toBe(false);
      expect(icon.getAttribute("role")).toBeNull();
      expect(icon.querySelector("title")).toBeNull();
    });

    it("still renders when title props are omitted", () => {
      const root = mountIcon(
        renderClbrIcon({ ariaHidden: true, name: "menu" }),
      );
      expect(root.querySelector("svg")).toBeTruthy();
    });
  });

  describe("named mode (ariaHidden false / omitted)", () => {
    it("requires title and titleId by default", () => {
      expect(() => renderClbrIcon({ name: "check" })).toThrow(
        "title must be non-empty when ariaHidden is false.",
      );
    });

    it("renders role/img labelling and title", () => {
      const root = mountIcon(
        renderClbrIcon({
          ariaHidden: false,
          name: "search",
          size: "lg",
          title: "Search",
          titleId: "search-icon-title",
        }),
      );
      const icon = root.querySelector("svg") as SVGElement;
      const title = icon.querySelector("title");

      expect(icon.getAttribute("role")).toBe("img");
      expect(icon.getAttribute("aria-labelledby")).toBe("search-icon-title");
      expect(icon.getAttribute("aria-hidden")).toBeNull();
      expect(icon.getAttribute("data-size")).toBe("lg");
      expect(title?.getAttribute("id")).toBe("search-icon-title");
      expect(title?.textContent).toBe("Search");
    });

    it("trims title and titleId input", () => {
      const root = mountIcon(
        renderClbrIcon({
          ariaHidden: false,
          name: "x",
          title: "  Close  ",
          titleId: "  close-icon-title  ",
        }),
      );
      const icon = root.querySelector("svg") as SVGElement;
      const title = icon.querySelector("title");

      expect(icon.getAttribute("aria-labelledby")).toBe("close-icon-title");
      expect(title?.getAttribute("id")).toBe("close-icon-title");
      expect(title?.textContent).toBe("Close");
    });

    it("escapes title text", () => {
      const root = mountIcon(
        renderClbrIcon({
          ariaHidden: false,
          name: "x",
          title: '"quoted" <unsafe>',
          titleId: "close-icon-title",
        }),
      );
      const title = root.querySelector("svg title");

      expect(title?.textContent).toBe('"quoted" <unsafe>');
      expect(title?.querySelector("unsafe")).toBeNull();
    });
  });

  describe("validation", () => {
    it("throws when title is empty in named mode", () => {
      expect(() =>
        renderClbrIcon({
          ariaHidden: false,
          name: "check",
          title: "",
          titleId: "check-icon-title",
        }),
      ).toThrow("title must be non-empty when ariaHidden is false.");
    });

    it("throws when titleId is missing in named mode", () => {
      expect(() =>
        renderClbrIcon({
          ariaHidden: false,
          name: "check",
          title: "Check",
        }),
      ).toThrow("titleId must be non-empty when ariaHidden is false.");
    });

    it("throws when titleId is invalid", () => {
      expect(() =>
        renderClbrIcon({
          ariaHidden: false,
          name: "check",
          title: "Check",
          titleId: "not valid",
        }),
      ).toThrow(
        "titleId must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
      );
    });

    it("throws when icon name is unknown", () => {
      expect(() => renderClbrIcon({ name: "definitely-not-an-icon" })).toThrow(
        "Unknown Lucide icon name: definitely-not-an-icon",
      );
    });
  });

  describe("icon name normalization", () => {
    it("accepts kebab-case names", () => {
      const root = mountIcon(
        renderClbrIcon({ ariaHidden: true, name: "arrow-right" }),
      );
      expect(root.querySelector("svg path")).toBeTruthy();
    });

    it("accepts camelCase names", () => {
      const root = mountIcon(
        renderClbrIcon({ ariaHidden: true, name: "arrowRight" }),
      );
      expect(root.querySelector("svg path")).toBeTruthy();
    });

    it("accepts PascalCase names", () => {
      const root = mountIcon(
        renderClbrIcon({ ariaHidden: true, name: "ArrowRight" }),
      );
      expect(root.querySelector("svg path")).toBeTruthy();
    });
  });

  describe("rendered attribute contract", () => {
    it("emits mirrored modes and omits when absent", () => {
      const alwaysRoot = mountIcon(
        renderClbrIcon({
          ariaHidden: true,
          mirrored: "always",
          name: "arrow-right",
        }),
      );
      const rtlRoot = mountIcon(
        renderClbrIcon({
          ariaHidden: true,
          mirrored: "rtl",
          name: "arrow-right",
        }),
      );
      const noneRoot = mountIcon(
        renderClbrIcon({
          ariaHidden: true,
          name: "arrow-right",
        }),
      );

      expect(
        alwaysRoot.querySelector("svg")?.getAttribute("data-mirrored"),
      ).toBe("always");
      expect(rtlRoot.querySelector("svg")?.getAttribute("data-mirrored")).toBe(
        "rtl",
      );
      expect(noneRoot.querySelector("svg")?.hasAttribute("data-mirrored")).toBe(
        false,
      );
    });

    it("always emits the base SVG attributes", () => {
      const root = mountIcon(
        renderClbrIcon({
          ariaHidden: true,
          name: "menu",
          size: "fill",
        }),
      );
      const icon = root.querySelector("svg") as SVGElement;

      expect(icon.getAttribute("xmlns")).toBe("http://www.w3.org/2000/svg");
      expect(icon.getAttribute("viewBox")).toBe("0 0 24 24");
      expect(icon.getAttribute("height")).toBe("24");
      expect(icon.getAttribute("stroke")).toBe("currentColor");
      expect(icon.getAttribute("fill")).toBe("none");
      expect(icon.getAttribute("data-size")).toBe("fill");
    });
  });
});

describeSpecConsistency<ClbrIconProps>({
  baseProps: { name: "check", title: "Check", titleId: "check-title" },
  renderer: renderClbrIcon,
  spec: CLBR_ICON_SPEC,
});
