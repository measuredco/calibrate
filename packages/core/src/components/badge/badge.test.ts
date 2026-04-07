import { describe, expect, it } from "vitest";
import { renderClbrBadge } from "./badge";

function mountBadge(html: string): HTMLElement {
  document.body.innerHTML = `<div class="clbr">${html}</div>`;
  return document.body.querySelector(".clbr") as HTMLElement;
}

describe("renderClbrBadge", () => {
  it("renders a span badge with escaped text by default", () => {
    const root = mountBadge(
      renderClbrBadge({ label: `<strong>Badge</strong>` }),
    );
    const badge = root.querySelector(".badge") as HTMLElement;

    expect(badge).toBeTruthy();
    expect(badge.tagName).toBe("SPAN");
    expect(badge.innerHTML).toBe("&lt;strong&gt;Badge&lt;/strong&gt;");
    expect(badge.hasAttribute("data-floating")).toBe(false);
    expect(badge.getAttribute("data-size")).toBe("md");
    expect(badge.hasAttribute("data-tone")).toBe(false);
  });

  it("emits data-tone for non-default tones", () => {
    const root = mountBadge(renderClbrBadge({ label: "Info", tone: "info" }));
    const badge = root.querySelector(".badge") as HTMLElement;

    expect(badge.getAttribute("data-tone")).toBe("info");
  });

  it("emits data-floating only when true", () => {
    const floatingRoot = mountBadge(
      renderClbrBadge({ floating: true, label: "1" }),
    );
    const floatingBadge = floatingRoot.querySelector(".badge") as HTMLElement;
    expect(floatingBadge.hasAttribute("data-floating")).toBe(true);

    const defaultRoot = mountBadge(renderClbrBadge({ label: "1" }));
    const defaultBadge = defaultRoot.querySelector(".badge") as HTMLElement;
    expect(defaultBadge.hasAttribute("data-floating")).toBe(false);
  });

  it("always emits data-size", () => {
    const smallRoot = mountBadge(
      renderClbrBadge({ label: "Badge", size: "sm" }),
    );
    const smallBadge = smallRoot.querySelector(".badge") as HTMLElement;
    expect(smallBadge.getAttribute("data-size")).toBe("sm");

    const defaultRoot = mountBadge(renderClbrBadge({ label: "Badge" }));
    const defaultBadge = defaultRoot.querySelector(".badge") as HTMLElement;
    expect(defaultBadge.getAttribute("data-size")).toBe("md");
  });
});
