import { describe, expect, it } from "vitest";
import { renderClbrIcon } from "./icon";

function mountIcon(html: string): SVGElement {
  document.body.innerHTML = html;
  return document.body.querySelector("svg") as SVGElement;
}

describe("renderClbrIcon", () => {
  describe("decorative mode (ariaHidden true)", () => {
    it("renders decorative attributes and omits named-icon attributes", () => {
      const icon = mountIcon(
        renderClbrIcon({ ariaHidden: true, name: "check" }),
      );

      expect(icon.classList.contains("icon")).toBe(true);
      expect(icon.getAttribute("data-size")).toBe("md");
      expect(icon.getAttribute("aria-hidden")).toBe("true");
      expect(icon.hasAttribute("aria-labelledby")).toBe(false);
      expect(icon.getAttribute("role")).toBeNull();
      expect(icon.querySelector("title")).toBeNull();
    });

    it("still renders when title props are omitted", () => {
      const icon = mountIcon(
        renderClbrIcon({ ariaHidden: true, name: "menu" }),
      );
      expect(icon).toBeTruthy();
    });
  });

  describe("named mode (ariaHidden false / omitted)", () => {
    it("requires title and titleId by default", () => {
      expect(() => renderClbrIcon({ name: "check" })).toThrow(
        "title must be non-empty when ariaHidden is false.",
      );
    });

    it("renders role/img labelling and title", () => {
      const icon = mountIcon(
        renderClbrIcon({
          ariaHidden: false,
          name: "search",
          size: "lg",
          title: "Search",
          titleId: "search-icon-title",
        }),
      );
      const title = icon.querySelector("title");

      expect(icon.getAttribute("role")).toBe("img");
      expect(icon.getAttribute("aria-labelledby")).toBe("search-icon-title");
      expect(icon.getAttribute("aria-hidden")).toBeNull();
      expect(icon.getAttribute("data-size")).toBe("lg");
      expect(title?.getAttribute("id")).toBe("search-icon-title");
      expect(title?.textContent).toBe("Search");
    });

    it("trims title and titleId input", () => {
      const icon = mountIcon(
        renderClbrIcon({
          ariaHidden: false,
          name: "x",
          title: "  Close  ",
          titleId: "  close-icon-title  ",
        }),
      );
      const title = icon.querySelector("title");

      expect(icon.getAttribute("aria-labelledby")).toBe("close-icon-title");
      expect(title?.getAttribute("id")).toBe("close-icon-title");
      expect(title?.textContent).toBe("Close");
    });

    it("escapes title text", () => {
      const icon = mountIcon(
        renderClbrIcon({
          ariaHidden: false,
          name: "x",
          title: '"quoted" <unsafe>',
          titleId: "close-icon-title",
        }),
      );
      const title = icon.querySelector("title");

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
      const icon = mountIcon(
        renderClbrIcon({ ariaHidden: true, name: "arrow-right" }),
      );
      expect(icon.querySelector("path")).toBeTruthy();
    });

    it("accepts camelCase names", () => {
      const icon = mountIcon(
        renderClbrIcon({ ariaHidden: true, name: "arrowRight" }),
      );
      expect(icon.querySelector("path")).toBeTruthy();
    });

    it("accepts PascalCase names", () => {
      const icon = mountIcon(
        renderClbrIcon({ ariaHidden: true, name: "ArrowRight" }),
      );
      expect(icon.querySelector("path")).toBeTruthy();
    });
  });

  describe("rendered attribute contract", () => {
    it("emits mirrored modes and omits when absent", () => {
      const always = mountIcon(
        renderClbrIcon({
          ariaHidden: true,
          mirrored: "always",
          name: "arrow-right",
        }),
      );
      const rtl = mountIcon(
        renderClbrIcon({
          ariaHidden: true,
          mirrored: "rtl",
          name: "arrow-right",
        }),
      );
      const none = mountIcon(
        renderClbrIcon({
          ariaHidden: true,
          name: "arrow-right",
        }),
      );

      expect(always.getAttribute("data-mirrored")).toBe("always");
      expect(rtl.getAttribute("data-mirrored")).toBe("rtl");
      expect(none.hasAttribute("data-mirrored")).toBe(false);
    });

    it("always emits the base SVG attributes", () => {
      const icon = mountIcon(
        renderClbrIcon({
          ariaHidden: true,
          name: "menu",
          size: "fill",
        }),
      );

      expect(icon.getAttribute("xmlns")).toBe("http://www.w3.org/2000/svg");
      expect(icon.getAttribute("viewBox")).toBe("0 0 24 24");
      expect(icon.getAttribute("height")).toBe("24");
      expect(icon.getAttribute("stroke")).toBe("currentColor");
      expect(icon.getAttribute("fill")).toBe("none");
      expect(icon.getAttribute("data-size")).toBe("fill");
    });
  });
});
