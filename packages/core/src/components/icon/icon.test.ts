import { describe, expect, it } from "vitest";
import { renderClbrIcon } from "./icon";

describe("renderClbrIcon", () => {
  describe("decorative mode (ariaHidden true)", () => {
    it("renders decorative attributes and omits named-icon attributes", () => {
      const html = renderClbrIcon({ ariaHidden: true, name: "check" });

      expect(html).toContain("<svg");
      expect(html).toContain('class="icon"');
      expect(html).toContain('data-size="md"');
      expect(html).toContain('aria-hidden="true"');
      expect(html).not.toContain("aria-labelledby=");
      expect(html).not.toContain('role="img"');
      expect(html).not.toContain("<title");
    });

    it("still renders when title props are omitted", () => {
      const html = renderClbrIcon({ ariaHidden: true, name: "menu" });
      expect(html).toContain("<svg");
    });
  });

  describe("named mode (ariaHidden false / omitted)", () => {
    it("requires title and titleId by default", () => {
      expect(() => renderClbrIcon({ name: "check" })).toThrow(
        "title must be non-empty when ariaHidden is false.",
      );
    });

    it("renders role/img labelling and title", () => {
      const html = renderClbrIcon({
        ariaHidden: false,
        name: "search",
        size: "lg",
        title: "Search",
        titleId: "search-icon-title",
      });

      expect(html).toContain('role="img"');
      expect(html).toContain('aria-labelledby="search-icon-title"');
      expect(html).toContain('<title id="search-icon-title">Search</title>');
      expect(html).not.toContain('aria-hidden="true"');
      expect(html).toContain('data-size="lg"');
    });

    it("trims title and titleId input", () => {
      const html = renderClbrIcon({
        ariaHidden: false,
        name: "x",
        title: "  Close  ",
        titleId: "  close-icon-title  ",
      });

      expect(html).toContain('aria-labelledby="close-icon-title"');
      expect(html).toContain('<title id="close-icon-title">Close</title>');
    });

    it("escapes title text", () => {
      const html = renderClbrIcon({
        ariaHidden: false,
        name: "x",
        title: '"quoted" <unsafe>',
        titleId: "close-icon-title",
      });

      expect(html).toContain("&quot;quoted&quot; &lt;unsafe&gt;");
      expect(html).not.toContain('>"quoted" <unsafe></title>');
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
      const html = renderClbrIcon({ ariaHidden: true, name: "arrow-right" });
      expect(html).toContain("<path");
    });

    it("accepts camelCase names", () => {
      const html = renderClbrIcon({ ariaHidden: true, name: "arrowRight" });
      expect(html).toContain("<path");
    });

    it("accepts PascalCase names", () => {
      const html = renderClbrIcon({ ariaHidden: true, name: "ArrowRight" });
      expect(html).toContain("<path");
    });
  });

  describe("rendered attribute contract", () => {
    it("emits mirrored modes and omits when absent", () => {
      const always = renderClbrIcon({
        ariaHidden: true,
        mirrored: "always",
        name: "arrow-right",
      });
      const rtl = renderClbrIcon({
        ariaHidden: true,
        mirrored: "rtl",
        name: "arrow-right",
      });
      const none = renderClbrIcon({
        ariaHidden: true,
        name: "arrow-right",
      });

      expect(always).toContain('data-mirrored="always"');
      expect(rtl).toContain('data-mirrored="rtl"');
      expect(none).not.toContain("data-mirrored=");
    });

    it("always emits the base SVG attributes", () => {
      const html = renderClbrIcon({
        ariaHidden: true,
        name: "menu",
        size: "fill",
      });

      expect(html).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(html).toContain('viewBox="0 0 24 24"');
      expect(html).toContain('height="24"');
      expect(html).toContain('stroke="currentColor"');
      expect(html).toContain('fill="none"');
      expect(html).toContain('data-size="fill"');
    });
  });
});
