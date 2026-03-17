import { getByRole } from "@testing-library/dom";
import { describe, expect, it } from "vitest";
import { type ClbrButtonProps, renderClbrButton } from "./button";

describe("renderClbrButton", () => {
  describe("button mode", () => {
    it("defaults to button mode when mode is omitted", () => {
      document.body.innerHTML = `<div class="clbr">${renderClbrButton({ label: "Save" })}</div>`;
      const button = getByRole(document.body, "button", { name: "Save" });

      expect(button.getAttribute("data-mode")).toBe("button");
      expect(button.getAttribute("data-appearance")).toBe("outline");
      expect(button.getAttribute("data-size")).toBe("md");
      expect(button.getAttribute("data-tone")).toBe("brand");
      expect(button.getAttribute("type")).toBe("button");
    });

    it("supports explicit button mode with submit type", () => {
      document.body.innerHTML = `<div class="clbr">${renderClbrButton({
        label: "Save",
        mode: "button",
        type: "submit",
      })}</div>`;
      const button = getByRole(document.body, "button", { name: "Save" });

      expect(button.getAttribute("data-mode")).toBe("button");
      expect(button.getAttribute("type")).toBe("submit");
    });

    it("emits non-empty form attrs and omits empty values", () => {
      document.body.innerHTML = `<div class="clbr">${renderClbrButton({
        form: "profile-form",
        label: "Save",
        mode: "button",
        name: "",
        value: "save",
      })}</div>`;
      const button = getByRole(document.body, "button", { name: "Save" });

      expect(button.getAttribute("form")).toBe("profile-form");
      expect(button.getAttribute("name")).toBeNull();
      expect(button.getAttribute("value")).toBe("save");
    });

    it("renders icon at start by default when icon is provided", () => {
      document.body.innerHTML = `<div class="clbr">${renderClbrButton({
        icon: "arrow-right",
        label: "Continue",
      })}</div>`;
      const button = getByRole(document.body, "button", { name: "Continue" });
      const firstChild = button.firstElementChild;

      expect(firstChild?.className).toBe("icon-wrapper");
      expect(button.querySelector(".icon-wrapper .icon")).toBeTruthy();
    });

    it("renders icon at end when iconPlacement is end", () => {
      document.body.innerHTML = `<div class="clbr">${renderClbrButton({
        icon: "arrow-right",
        iconPlacement: "end",
        label: "Continue",
      })}</div>`;
      const button = getByRole(document.body, "button", { name: "Continue" });
      const lastChild = button.lastElementChild;

      expect(lastChild?.className).toBe("icon-wrapper");
    });

    it("emits collapse and mirrored attrs when provided", () => {
      document.body.innerHTML = `<div class="clbr">${renderClbrButton({
        iconOnlyBelow: "tablet",
        iconMirrored: "rtl",
        icon: "arrow-right",
        label: "Continue",
      })}</div>`;
      const button = getByRole(document.body, "button", { name: "Continue" });
      const icon = button.querySelector("svg.icon");

      expect(button.getAttribute("data-icon-only-below")).toBe("tablet");
      expect(icon?.getAttribute("data-mirrored")).toBe("rtl");
    });

    it("ignores icon props when icon is omitted", () => {
      document.body.innerHTML = `<div class="clbr">${renderClbrButton({
        iconOnlyBelow: "tablet",
        iconMirrored: "always",
        iconPlacement: "end",
        label: "Continue",
      })}</div>`;
      const button = getByRole(document.body, "button", { name: "Continue" });

      expect(button.getAttribute("data-icon-only-below")).toBeNull();
      expect(button.querySelector(".icon-wrapper")).toBeNull();
    });

    it("treats empty icon string as omitted", () => {
      document.body.innerHTML = `<div class="clbr">${renderClbrButton({
        icon: "",
        iconOnlyBelow: "tablet",
        label: "Continue",
      })}</div>`;
      const button = getByRole(document.body, "button", { name: "Continue" });

      expect(button.getAttribute("data-icon-only-below")).toBeNull();
      expect(button.querySelector(".icon-wrapper")).toBeNull();
    });

    it("renders button icon as decorative (aria-hidden)", () => {
      document.body.innerHTML = `<div class="clbr">${renderClbrButton({
        icon: "arrow-right",
        label: "Continue",
      })}</div>`;
      const button = getByRole(document.body, "button", { name: "Continue" });
      const icon = button.querySelector("svg.icon");

      expect(icon?.getAttribute("aria-hidden")).toBe("true");
      expect(icon?.getAttribute("role")).toBeNull();
      expect(icon?.querySelector("title")).toBeNull();
    });
  });

  describe("link mode", () => {
    it("renders link semantics when mode is link", () => {
      document.body.innerHTML = `<div class="clbr">${renderClbrButton({
        href: "/docs",
        label: "Docs",
        mode: "link",
      })}</div>`;
      const link = getByRole(document.body, "link", { name: "Docs" });

      expect(link.getAttribute("data-mode")).toBe("link");
      expect(link.getAttribute("href")).toBe("/docs");
    });

    it("supports icon rendering in link mode", () => {
      document.body.innerHTML = `<div class="clbr">${renderClbrButton({
        href: "/docs",
        icon: "arrow-right",
        label: "Docs",
        mode: "link",
      })}</div>`;
      const link = getByRole(document.body, "link", { name: "Docs" });

      expect(link.querySelector(".icon-wrapper .icon")).toBeTruthy();
    });

    it("supports end placement for link icon", () => {
      document.body.innerHTML = `<div class="clbr">${renderClbrButton({
        href: "/docs",
        icon: "arrow-right",
        iconPlacement: "end",
        label: "Docs",
        mode: "link",
      })}</div>`;
      const link = getByRole(document.body, "link", { name: "Docs" });
      const lastChild = link.lastElementChild;

      expect(lastChild?.className).toBe("icon-wrapper");
    });

    it("emits collapse and mirrored behavior for link icon", () => {
      document.body.innerHTML = `<div class="clbr">${renderClbrButton({
        href: "/docs",
        icon: "arrow-right",
        iconOnlyBelow: "tablet",
        iconMirrored: "rtl",
        label: "Docs",
        mode: "link",
      })}</div>`;
      const link = getByRole(document.body, "link", { name: "Docs" });
      const icon = link.querySelector("svg.icon");

      expect(link.getAttribute("data-icon-only-below")).toBe("tablet");
      expect(icon?.getAttribute("data-mirrored")).toBe("rtl");
    });

    it("renders an anchor when href is empty string", () => {
      document.body.innerHTML = `<div class="clbr">${renderClbrButton({
        href: "",
        label: "Docs",
        mode: "link",
      })}</div>`;
      const anchor = document.body.querySelector("a");

      expect(anchor).toBeTruthy();
      expect(anchor?.getAttribute("data-mode")).toBe("link");
      expect(anchor?.getAttribute("href")).toBe("");
    });

    it("emits rel/target when download is omitted and values are non-empty", () => {
      document.body.innerHTML = `<div class="clbr">${renderClbrButton({
        href: "/docs",
        label: "Docs",
        mode: "link",
        rel: "noreferrer",
        target: "_blank",
      })}</div>`;
      const link = getByRole(document.body, "link", { name: "Docs" });

      expect(link.getAttribute("rel")).toBe("noreferrer");
      expect(link.getAttribute("target")).toBe("_blank");
    });

    it("omits empty rel/target values", () => {
      document.body.innerHTML = `<div class="clbr">${renderClbrButton({
        href: "/docs",
        label: "Docs",
        mode: "link",
        rel: "",
        target: "",
      } as unknown as ClbrButtonProps)}</div>`;
      const link = getByRole(document.body, "link", { name: "Docs" });

      expect(link.getAttribute("rel")).toBeNull();
      expect(link.getAttribute("target")).toBeNull();
    });

    it("supports valueless and named download attrs", () => {
      document.body.innerHTML = `<div class="clbr">${renderClbrButton({
        download: true,
        href: "/docs",
        label: "Download",
        mode: "link",
      })}</div>`;
      const valueless = getByRole(document.body, "link", { name: "Download" });
      expect(valueless.hasAttribute("download")).toBe(true);
      expect(valueless.getAttribute("download")).toBe("");

      document.body.innerHTML = `<div class="clbr">${renderClbrButton({
        download: "guide.pdf",
        href: "/docs",
        label: "Download named",
        mode: "link",
      })}</div>`;
      const named = getByRole(document.body, "link", {
        name: "Download named",
      });
      expect(named.getAttribute("download")).toBe("guide.pdf");
    });

    it("omits download when value is false", () => {
      document.body.innerHTML = `<div class="clbr">${renderClbrButton({
        download: false,
        href: "/docs",
        label: "Docs",
        mode: "link",
      })}</div>`;
      const link = getByRole(document.body, "link", { name: "Docs" });

      expect(link.getAttribute("download")).toBeNull();
    });

    it("ignores rel/target when download is set", () => {
      document.body.innerHTML = `<div class="clbr">${renderClbrButton({
        download: "guide.pdf",
        href: "/docs",
        label: "Docs",
        mode: "link",
        rel: "noreferrer",
        target: "_blank",
      })}</div>`;
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
      document.body.innerHTML = `<div class="clbr">${renderClbrButton(invalidLinkProps)}</div>`;
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
