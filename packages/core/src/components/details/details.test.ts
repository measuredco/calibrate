import { describe, expect, it } from "vitest";
import { describeSpecConsistency } from "../../testing/spec";
import {
  CLBR_DETAILS_SPEC,
  type ClbrDetailsProps,
  renderClbrDetails,
} from "./details";

function mountDetails(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrDetails", () => {
  it("renders the default details contract", () => {
    const root = mountDetails(
      renderClbrDetails({
        summary: "More information",
      }),
    );
    const details = root.querySelector(".details") as HTMLElement;
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
    const root = mountDetails(
      renderClbrDetails({
        open: true,
        summary: "More information",
      }),
    );

    expect(root.querySelector(".details")?.hasAttribute("open")).toBe(true);
  });

  it('emits data-inline-size only when inlineSize is "fit"', () => {
    const fitRoot = mountDetails(
      renderClbrDetails({
        inlineSize: "fit",
        summary: "More information",
      }),
    );
    expect(
      fitRoot.querySelector(".details")?.getAttribute("data-inline-size"),
    ).toBe("fit");

    const fullRoot = mountDetails(
      renderClbrDetails({
        inlineSize: "full",
        summary: "More information",
      }),
    );
    expect(
      fullRoot.querySelector(".details")?.hasAttribute("data-inline-size"),
    ).toBe(false);
  });

  it("escapes summary text and preserves trusted children", () => {
    const root = mountDetails(
      renderClbrDetails({
        children: "<p><strong>Trusted</strong> content.</p>",
        summary: `<More information>`,
      }),
    );
    const summary = root.querySelector(".details .summary") as HTMLElement;
    const content = root.querySelector(".details .content") as HTMLElement;

    expect(summary.textContent).toBe("<More information>");
    expect(content.innerHTML).toBe("<p><strong>Trusted</strong> content.</p>");
  });
});

describeSpecConsistency<ClbrDetailsProps>({
  baseProps: { summary: "Summary" },
  renderer: renderClbrDetails,
  spec: CLBR_DETAILS_SPEC,
});
