import { getByRole } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { type ClbrButtonProps, renderClbrButton } from "./button";

function mount(html: string): void {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
}

describe("renderClbrButton", () => {
  describe("button mode", () => {
    it("defaults to button mode with the standard attrs", () => {
      mount(renderClbrButton({ label: "Save" }));
      const button = getByRole(document.body, "button", { name: "Save" });

      expect(button.getAttribute("data-mode")).toBe("button");
      expect(button.getAttribute("data-appearance")).toBe("outline");
      expect(button.getAttribute("data-size")).toBe("md");
      expect(button.getAttribute("data-tone")).toBe("brand");
      expect(button.getAttribute("type")).toBe("button");
      expect(button.getAttribute("data-label-visibility")).toBeNull();
    });

    it("supports explicit button mode with submit type", () => {
      mount(
        renderClbrButton({
          label: "Save",
          mode: "button",
          type: "submit",
        }),
      );
      const button = getByRole(document.body, "button", { name: "Save" });

      expect(button.getAttribute("data-mode")).toBe("button");
      expect(button.getAttribute("type")).toBe("submit");
    });

    it("emits non-empty form attrs and omits empty values", () => {
      mount(
        renderClbrButton({
          form: "profile-form",
          label: "Save",
          mode: "button",
          name: "",
          value: "save",
        }),
      );
      const button = getByRole(document.body, "button", { name: "Save" });

      expect(button.getAttribute("form")).toBe("profile-form");
      expect(button.getAttribute("name")).toBeNull();
      expect(button.getAttribute("value")).toBe("save");
    });

    it("renders icon at start by default when icon is provided", () => {
      mount(
        renderClbrButton({
          icon: "arrow-right",
          label: "Continue",
        }),
      );
      const button = getByRole(document.body, "button", { name: "Continue" });

      expect(button.firstElementChild?.className).toBe("icon-wrapper");
      expect(button.querySelector(".icon-wrapper .icon")).toBeTruthy();
    });

    it("renders icon at end when iconPlacement is end", () => {
      mount(
        renderClbrButton({
          icon: "arrow-right",
          iconPlacement: "end",
          label: "Continue",
        }),
      );
      const button = getByRole(document.body, "button", { name: "Continue" });

      expect(button.lastElementChild?.className).toBe("icon-wrapper");
    });

    it("emits label visibility and mirrored attrs when provided", () => {
      mount(
        renderClbrButton({
          icon: "arrow-right",
          iconMirrored: "rtl",
          label: "Continue",
          labelVisibility: "hiddenBelowTablet",
        }),
      );
      const button = getByRole(document.body, "button", { name: "Continue" });
      const icon = button.querySelector("svg.icon");

      expect(button.getAttribute("data-label-visibility")).toBe(
        "hiddenBelowTablet",
      );
      expect(icon?.getAttribute("data-mirrored")).toBe("rtl");
    });

    it("supports always-hidden labels when icon is present", () => {
      mount(
        renderClbrButton({
          icon: "arrow-right",
          label: "Continue",
          labelVisibility: "hidden",
        }),
      );
      const button = getByRole(document.body, "button", { name: "Continue" });

      expect(button.getAttribute("data-label-visibility")).toBe("hidden");
      expect(button.querySelector(".label")?.textContent).toBe("Continue");
    });

    it("treats empty icon string as omitted", () => {
      mount(
        renderClbrButton({
          icon: "",
          label: "Continue",
        }),
      );
      const button = getByRole(document.body, "button", { name: "Continue" });

      expect(button.getAttribute("data-label-visibility")).toBeNull();
      expect(button.querySelector(".icon-wrapper")).toBeNull();
    });

    it("throws when label is hidden but no icon is present", () => {
      expect(() =>
        renderClbrButton({
          label: "Continue",
          labelVisibility: "hidden",
        }),
      ).toThrow("labelVisibility requires icon when label is not visible.");
    });

    it("renders button icon as decorative", () => {
      mount(
        renderClbrButton({
          icon: "arrow-right",
          label: "Continue",
        }),
      );
      const button = getByRole(document.body, "button", { name: "Continue" });
      const icon = button.querySelector("svg.icon");

      expect(icon?.getAttribute("aria-hidden")).toBe("true");
      expect(icon?.getAttribute("role")).toBeNull();
      expect(icon?.querySelector("title")).toBeNull();
    });
  });

  describe("link mode", () => {
    it("renders link semantics when mode is link", () => {
      mount(
        renderClbrButton({
          href: "/docs",
          label: "Docs",
          mode: "link",
        }),
      );
      const link = getByRole(document.body, "link", { name: "Docs" });

      expect(link.getAttribute("data-mode")).toBe("link");
      expect(link.getAttribute("href")).toBe("/docs");
    });

    it("supports icon rendering in link mode", () => {
      mount(
        renderClbrButton({
          href: "/docs",
          icon: "arrow-right",
          label: "Docs",
          mode: "link",
        }),
      );
      const link = getByRole(document.body, "link", { name: "Docs" });

      expect(link.querySelector(".icon-wrapper .icon")).toBeTruthy();
    });

    it("supports end placement for link icon", () => {
      mount(
        renderClbrButton({
          href: "/docs",
          icon: "arrow-right",
          iconPlacement: "end",
          label: "Docs",
          mode: "link",
        }),
      );
      const link = getByRole(document.body, "link", { name: "Docs" });

      expect(link.lastElementChild?.className).toBe("icon-wrapper");
    });

    it("emits label visibility and mirrored behavior for link icon", () => {
      mount(
        renderClbrButton({
          href: "/docs",
          icon: "arrow-right",
          iconMirrored: "rtl",
          label: "Docs",
          labelVisibility: "hiddenBelowTablet",
          mode: "link",
        }),
      );
      const link = getByRole(document.body, "link", { name: "Docs" });
      const icon = link.querySelector("svg.icon");

      expect(link.getAttribute("data-label-visibility")).toBe(
        "hiddenBelowTablet",
      );
      expect(icon?.getAttribute("data-mirrored")).toBe("rtl");
    });

    it("renders an anchor when href is empty string", () => {
      mount(
        renderClbrButton({
          href: "",
          label: "Docs",
          mode: "link",
        }),
      );
      const anchor = document.body.querySelector("a");

      expect(anchor).toBeTruthy();
      expect(anchor?.getAttribute("data-mode")).toBe("link");
      expect(anchor?.getAttribute("href")).toBe("");
    });

    it("emits rel/target when download is omitted and values are non-empty", () => {
      mount(
        renderClbrButton({
          href: "/docs",
          label: "Docs",
          mode: "link",
          rel: "noreferrer",
          target: "_blank",
        }),
      );
      const link = getByRole(document.body, "link", { name: "Docs" });

      expect(link.getAttribute("rel")).toBe("noreferrer");
      expect(link.getAttribute("target")).toBe("_blank");
    });

    it("omits empty rel/target values", () => {
      mount(
        renderClbrButton({
          href: "/docs",
          label: "Docs",
          mode: "link",
          rel: "",
          target: "",
        } as unknown as ClbrButtonProps),
      );
      const link = getByRole(document.body, "link", { name: "Docs" });

      expect(link.getAttribute("rel")).toBeNull();
      expect(link.getAttribute("target")).toBeNull();
    });

    it("supports valueless and named download attrs", () => {
      mount(
        renderClbrButton({
          download: true,
          href: "/docs",
          label: "Download",
          mode: "link",
        }),
      );
      const valueless = getByRole(document.body, "link", { name: "Download" });
      expect(valueless.hasAttribute("download")).toBe(true);
      expect(valueless.getAttribute("download")).toBe("");

      mount(
        renderClbrButton({
          download: "guide.pdf",
          href: "/docs",
          label: "Download named",
          mode: "link",
        }),
      );
      const named = getByRole(document.body, "link", {
        name: "Download named",
      });
      expect(named.getAttribute("download")).toBe("guide.pdf");
    });

    it("omits download when value is false", () => {
      mount(
        renderClbrButton({
          download: false,
          href: "/docs",
          label: "Docs",
          mode: "link",
        }),
      );
      const link = getByRole(document.body, "link", { name: "Docs" });

      expect(link.getAttribute("download")).toBeNull();
    });

    it("ignores rel/target when download is set", () => {
      mount(
        renderClbrButton({
          download: "guide.pdf",
          href: "/docs",
          label: "Docs",
          mode: "link",
          rel: "noreferrer",
          target: "_blank",
        }),
      );
      const link = getByRole(document.body, "link", { name: "Docs" });

      expect(link.getAttribute("download")).toBe("guide.pdf");
      expect(link.getAttribute("rel")).toBeNull();
      expect(link.getAttribute("target")).toBeNull();
    });
  });

  describe("runtime robustness for invalid mixed props", () => {
    it("ignores button-only attrs in link mode", () => {
      const invalidLinkProps = {
        disabled: true,
        form: "profile-form",
        href: "/docs",
        label: "Docs",
        mode: "link",
        name: "intent",
        value: "open-docs",
      } as unknown as ClbrButtonProps;
      mount(renderClbrButton(invalidLinkProps));
      const link = getByRole(document.body, "link", { name: "Docs" });

      expect(link.getAttribute("aria-disabled")).toBeNull();
      expect(link.getAttribute("form")).toBeNull();
      expect(link.getAttribute("name")).toBeNull();
      expect(link.getAttribute("value")).toBeNull();
    });
  });

  describe("escaping", () => {
    it("escapes label content", () => {
      const html = renderClbrButton({
        label: `<script>alert("xss")</script>`,
      });

      expect(html).toContain(
        "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;",
      );
      expect(html).not.toContain("<script>");
    });
  });
});
