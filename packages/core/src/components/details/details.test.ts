import { describe, expect, it } from "vitest";
import { renderClbrDetails } from "./details";

function mountDetails(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".details") as HTMLElement;
}

describe("renderClbrDetails", () => {
  it("renders the default details contract", () => {
    const details = mountDetails(
      renderClbrDetails({
        summary: "More information",
      }),
    );
    const summary = details.querySelector(".summary") as HTMLElement;
    const marker = details.querySelector(
      ".summary .marker .icon",
    ) as HTMLElement;
    const content = details.querySelector(".content") as HTMLElement;

    expect(details.tagName).toBe("DETAILS");
    expect(details.className).toBe("details");
    expect(details.hasAttribute("open")).toBe(false);
    expect(details.hasAttribute("data-inline-size")).toBe(false);

    expect(summary).toBeTruthy();
    expect(summary.textContent).toBe("More information");
    expect(marker).toBeTruthy();
    expect(marker.getAttribute("aria-hidden")).toBe("true");

    expect(content).toBeTruthy();
    expect(content.innerHTML).toBe("");
  });

  it("emits native open when requested", () => {
    const details = mountDetails(
      renderClbrDetails({
        open: true,
        summary: "More information",
      }),
    );

    expect(details.hasAttribute("open")).toBe(true);
  });

  it('emits data-inline-size only when inlineSize is "fit"', () => {
    const fitDetails = mountDetails(
      renderClbrDetails({
        inlineSize: "fit",
        summary: "More information",
      }),
    );
    expect(fitDetails.getAttribute("data-inline-size")).toBe("fit");

    const fullDetails = mountDetails(
      renderClbrDetails({
        inlineSize: "full",
        summary: "More information",
      }),
    );
    expect(fullDetails.hasAttribute("data-inline-size")).toBe(false);
  });

  it("escapes summary text and preserves trusted children", () => {
    const details = mountDetails(
      renderClbrDetails({
        children: "<p><strong>Trusted</strong> content.</p>",
        summary: `<More information>`,
      }),
    );
    const summary = details.querySelector(".summary") as HTMLElement;
    const content = details.querySelector(".content") as HTMLElement;

    expect(summary.textContent).toBe("<More information>");
    expect(content.innerHTML).toBe("<p><strong>Trusted</strong> content.</p>");
  });
});
