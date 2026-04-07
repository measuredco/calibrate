import { describe, expect, it } from "vitest";
import { renderClbrSpinner } from "./spinner";

function mountSpinner(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".spinner") as HTMLElement;
}

describe("renderClbrSpinner", () => {
  it("renders the default spinner contract", () => {
    const spinner = mountSpinner(renderClbrSpinner());
    const svg = spinner.querySelector("svg") as SVGElement;

    expect(spinner.tagName).toBe("SPAN");
    expect(spinner.className).toBe("spinner");
    expect(spinner.getAttribute("data-size")).toBe("md");
    expect(spinner.hasAttribute("data-tone")).toBe(false);
    expect(spinner.hasAttribute("role")).toBe(false);

    expect(svg).toBeTruthy();
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(spinner.querySelector(".circle-lg")).toBeTruthy();
    expect(spinner.querySelector(".circle-sm")).toBeTruthy();
    expect(spinner.querySelector(".visually-hidden")).toBeNull();
  });

  it("emits the requested size", () => {
    const spinner = mountSpinner(renderClbrSpinner({ size: "2xl" }));

    expect(spinner.getAttribute("data-size")).toBe("2xl");
  });

  it("omits default tone and emits non-default tone", () => {
    const defaultSpinner = mountSpinner(renderClbrSpinner({ tone: "default" }));
    expect(defaultSpinner.hasAttribute("data-tone")).toBe(false);

    const brandSpinner = mountSpinner(renderClbrSpinner({ tone: "brand" }));
    expect(brandSpinner.getAttribute("data-tone")).toBe("brand");
  });

  it("renders a status label when provided", () => {
    const spinner = mountSpinner(renderClbrSpinner({ label: "Loading" }));
    const hiddenLabel = spinner.querySelector(
      ".visually-hidden",
    ) as HTMLElement;

    expect(spinner.getAttribute("role")).toBe("status");
    expect(hiddenLabel.textContent).toBe("Loading");
  });

  it("escapes the status label", () => {
    const spinner = mountSpinner(
      renderClbrSpinner({ label: `<strong>Loading</strong>` }),
    );
    const hiddenLabel = spinner.querySelector(
      ".visually-hidden",
    ) as HTMLElement;

    expect(hiddenLabel.innerHTML).toBe("&lt;strong&gt;Loading&lt;/strong&gt;");
  });
});
