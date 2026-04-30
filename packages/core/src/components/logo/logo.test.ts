import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import { CLBR_LOGO_SPEC, type ClbrLogoProps, renderClbrLogo } from "./logo";

function mountLogo(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrLogo", () => {
  it("renders div.logo with default variant/tone/size and required label", () => {
    const root = mountLogo(renderClbrLogo({ label: "Measured" }));
    const logo = root.querySelector(".clbr-logo") as HTMLElement;

    expect(logo).toBeTruthy();
    expect(logo.tagName).toBe("DIV");
    expect(logo.getAttribute("data-size")).toBe("md");
    expect(logo.hasAttribute("data-variant")).toBe(false);
    expect(logo.hasAttribute("data-tone")).toBe(false);
    expect(logo.querySelector(".visually-hidden")?.textContent).toBe(
      "Measured",
    );
  });

  it("emits non-default variant and tone attributes", () => {
    const root = mountLogo(
      renderClbrLogo({
        label: "Measured",
        tone: "neutral",
        variant: "graphic",
      }),
    );
    const logo = root.querySelector(".clbr-logo") as HTMLElement;

    expect(logo.getAttribute("data-variant")).toBe("graphic");
    expect(logo.getAttribute("data-tone")).toBe("neutral");
  });

  it("always emits data-size and supports fill", () => {
    const root = mountLogo(renderClbrLogo({ label: "Measured", size: "fill" }));
    const logo = root.querySelector(".clbr-logo") as HTMLElement;

    expect(logo.getAttribute("data-size")).toBe("fill");
  });

  it("escapes label content", () => {
    const root = mountLogo(renderClbrLogo({ label: "Measured <Logo>" }));
    const label = root.querySelector(
      ".clbr-logo .visually-hidden",
    ) as HTMLElement;

    expect(label.textContent).toBe("Measured <Logo>");
    expect(label.querySelector("logo")).toBeNull();
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountLogo(renderClbrLogo({ id: "my-logo", label: "Brand" }));
    const logo = root.querySelector(".clbr-logo") as HTMLElement;

    expect(logo.id).toBe("my-logo");
  });

  it("omits id when not provided", () => {
    const root = mountLogo(renderClbrLogo({ label: "Brand" }));
    const logo = root.querySelector(".clbr-logo") as HTMLElement;

    expect(logo.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() => renderClbrLogo({ id: "not valid", label: "Brand" })).toThrow();
  });
});

describeSpecConsistency<ClbrLogoProps>({
  baseProps: { label: "Brand" },
  renderer: renderClbrLogo,
  spec: CLBR_LOGO_SPEC,
});
