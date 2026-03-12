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
