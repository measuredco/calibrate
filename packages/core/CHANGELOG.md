# @measured/calibrate-core

## 0.2.0

### Minor Changes

- 9a25190: Rename two `Heading` props for clarity:
  - `children` → `text`
  - `opticalInline` → `opticalAlign`

  Update consumers to use the new names. The corresponding host attribute also renames from `data-optical-inline` to `data-optical-align`. Per the alpha versioning posture, this is a minor bump rather than a major.

- 6198a8f: Poster: rename `image` → `media` and constrain it to a branded type produced by `renderClbrPosterImage`. The helper locks `cover` and `priority` to the values Poster's layout depends on and exposes only the props that can vary (`gravity`, `sizes`, `src`, `srcSet`). The image is decorative — Poster is a content-over-background layout — so `alt` is always empty.

  Migration:

  ```ts
  // before
  renderClbrPoster({
    image: renderClbrImage({
      cover: true,
      priority: true,
      src,
      srcSet,
      sizes,
      gravity,
    }),
  });

  // after
  renderClbrPoster({
    media: renderClbrPosterImage({ src, srcSet, sizes, gravity }),
  });
  ```

  The React adapter follows the rename: `<Poster media={...}>` (was `image`).

- 59c906d: Every component now accepts an `id` prop, placed on the appropriate host: outermost wrapper for structural components, the interactive element for Link, the inner input for form controls. Consumers own id generation — nothing is auto-generated.

  **Breaking changes** (alpha — bumped as minor per the existing posture):
  - Checkbox and Switch drop `descriptionId`. When `description` is set, `id` is required; the description element's id is derived as `${id}-description`.
  - Icon drops `titleId`. When `ariaHidden` is false, `id` is required; the title element's id is derived as `${id}-title`.
  - Sidebar's `id` now goes on the host. The inner panel is `${id}-panel` (and the trigger's `aria-controls` references it).
  - Menu's `id` now also goes on the host (it was previously a seed only for the trigger and popup ids).

  Migration: rename `descriptionId` / `titleId` to `id` on the affected components. Update any external selectors targeting Sidebar's panel from `#my-sidebar` to `#my-sidebar-panel`.

### Patch Changes

- ef1672a: Make fenced code blocks keyboard-accessible.

  `@measured/calibrate-markdown`: a small inline rehype transform sets `tabIndex="0"` on the `<code>` element of every fenced code block. The `<code>` is the horizontally-scrollable region in prose styling, so keyboard users can now focus it and scroll. Inline `<code>` is unaffected. Resolves axe-core's `scrollable-region-focusable` rule.

  `@measured/calibrate-core`: prose component now applies the `interactive-focus` token to the wrapper's decorative border on `:has(> code:focus-visible)`, giving keyboard users a visible focus state on the code block.

- 2e46597: Fix install failure for downstream consumers. `@measured/calibrate-system` was incorrectly declared as a runtime dependency, but it's a private workspace package not published to npm — so consumer installs failed with `ERR_PNPM_FETCH_404`. The dependency is build-time only (the system CSS is inlined into core's published artifact); moved to `devDependencies`.
- 93ce56b: Initial alpha release of Calibrate. Process validation and tire-kicking only — APIs are not stable. Please don't depend on these versions for anything real yet.
- 134b977: Add the `motion.duration.3000` token (3s on `msrd`, 0ms on `wrfr`) for ambient / reduced-motion loops. Renames `motion.duration.600` from `Longest duration step.` to `Long duration step.` so the scale stays accurate now that `3000` is the longest.

  `@measured/calibrate-core`: the spinner's `prefers-reduced-motion` pulse animation now references `var(--clbr-motion-duration-3000)` instead of a hard-coded duration.

- 96c75ce: Page: where supported (Chrome/Edge 133+), the sticky-header border now fades in only when the header is actually pinned to the viewport edge, rather than showing whenever the header is configured as sticky. Older engines keep the always-on fallback. Implemented via `@container scroll-state(stuck: block-start)` and gated behind `@supports (container-type: scroll-state)`, so no JavaScript is added.
- 7cd1b40: Form controls now play cleanly with React's controlled-input checks:
  - Event handlers and `autoFocus` route to the inner `<input>` / `<textarea>` / `<select>` instead of the host wrapper, so React sees them on the element it checks. `ref` continues to land on the host wrapper.
  - HTML boolean props (`checked`, `disabled`, `required`, `readonly`, etc.) preserve their `false` value through the React adapter, so toggling a checkbox / switch keeps the input controlled. `false` on `data-*` and `aria-*` is still omitted (matches SSR).
  - `Input` preserves the empty string distinctly from `undefined`, so clearing a controlled field doesn't flip it from controlled to uncontrolled.

- b00bb58: Add concise `description` to each public package's `package.json` and align the README's first paragraph to match. The descriptions are what npm shows in list views; they were previously empty across the repo, leaving npm to fall back to whatever appeared in the README first line.
- ec27a3a: Add logical-CSS enforcement to the Stylelint preset (`@measured/calibrate-config/stylelint`) via `stylelint-plugin-logical-css`. Component CSS must use logical properties (`inline-size`, `block-size`, `margin-block-start`, etc.) and logical keywords (`text-align: start`) over physical equivalents, so consumer code retains LTR/RTL portability for free. `resize` is exempted from the keyword check — the logical `block` / `inline` values are still experimental per MDN and don't have full browser support yet.
- 53caec4: Add token-discipline rules to the Stylelint preset (`@measured/calibrate-config/stylelint`):
  - Raw color values are disallowed. Use a `var(--clbr-color-*)` token, a CSS keyword (`transparent`, `currentcolor`, `inherit`, etc.), or a CSS Color Module Level 4 system color in forced-colors blocks. `color-mix` is disallowed too — compose colors at the token layer rather than ad-hoc in CSS.
  - Absolute lengths (`px`, `pt`, `pc`, `in`, `cm`, `mm`, `Q`) and raw time units (`s`, `ms`) are disallowed. Use design tokens. `rem` and `rlh` remain available as a documented escape hatch and as the right unit for `@container` breakpoints.
  - `!important` is disallowed.

  Two new tokens land alongside the rule additions:
  - `--clbr-color-background-scrim` — the translucent occluding layer used behind modals, drawers, and other overlay UI. Resolves to a new `primitive.color.alpha.black.56` (added to both brands) across all four `{light,dark} × {default,brand}` surfaces.
  - `--clbr-motion-duration-0` — for explicit zero-duration legs in `transition` shorthands without falling back to a raw `0s` literal.

- 31ecaa2: Smoke-test Trusted Publishing — no code changes. Incrementing alpha to confirm the OIDC publish path works end-to-end after the bootstrap NPM_TOKEN was removed.

## 0.2.0-alpha.6

### Patch Changes

- ef1672a: Make fenced code blocks keyboard-accessible.

  `@measured/calibrate-markdown`: a small inline rehype transform sets `tabIndex="0"` on the `<code>` element of every fenced code block. The `<code>` is the horizontally-scrollable region in prose styling, so keyboard users can now focus it and scroll. Inline `<code>` is unaffected. Resolves axe-core's `scrollable-region-focusable` rule.

  `@measured/calibrate-core`: prose component now applies the `interactive-focus` token to the wrapper's decorative border on `:has(> code:focus-visible)`, giving keyboard users a visible focus state on the code block.

## 0.2.0-alpha.5

### Patch Changes

- 2e46597: Fix install failure for downstream consumers. `@measured/calibrate-system` was incorrectly declared as a runtime dependency, but it's a private workspace package not published to npm — so consumer installs failed with `ERR_PNPM_FETCH_404`. The dependency is build-time only (the system CSS is inlined into core's published artifact); moved to `devDependencies`.

## 0.2.0-alpha.4

### Patch Changes

- @measured/calibrate-system@0.2.0-alpha.4

## 0.2.0-alpha.3

### Minor Changes

- 9a25190: Rename two `Heading` props for clarity:
  - `children` → `text`
  - `opticalInline` → `opticalAlign`

  Update consumers to use the new names. The corresponding host attribute also renames from `data-optical-inline` to `data-optical-align`. Per the alpha versioning posture, this is a minor bump rather than a major.

### Patch Changes

- ec27a3a: Add logical-CSS enforcement to the Stylelint preset (`@measured/calibrate-config/stylelint`) via `stylelint-plugin-logical-css`. Component CSS must use logical properties (`inline-size`, `block-size`, `margin-block-start`, etc.) and logical keywords (`text-align: start`) over physical equivalents, so consumer code retains LTR/RTL portability for free. `resize` is exempted from the keyword check — the logical `block` / `inline` values are still experimental per MDN and don't have full browser support yet.
- 53caec4: Add token-discipline rules to the Stylelint preset (`@measured/calibrate-config/stylelint`):
  - Raw color values are disallowed. Use a `var(--clbr-color-*)` token, a CSS keyword (`transparent`, `currentcolor`, `inherit`, etc.), or a CSS Color Module Level 4 system color in forced-colors blocks. `color-mix` is disallowed too — compose colors at the token layer rather than ad-hoc in CSS.
  - Absolute lengths (`px`, `pt`, `pc`, `in`, `cm`, `mm`, `Q`) and raw time units (`s`, `ms`) are disallowed. Use design tokens. `rem` and `rlh` remain available as a documented escape hatch and as the right unit for `@container` breakpoints.
  - `!important` is disallowed.

  Two new tokens land alongside the rule additions:
  - `--clbr-color-background-scrim` — the translucent occluding layer used behind modals, drawers, and other overlay UI. Resolves to a new `primitive.color.alpha.black.56` (added to both brands) across all four `{light,dark} × {default,brand}` surfaces.
  - `--clbr-motion-duration-0` — for explicit zero-duration legs in `transition` shorthands without falling back to a raw `0s` literal.
  - @measured/calibrate-system@0.2.0-alpha.3

## 0.2.0-alpha.2

### Patch Changes

- @measured/calibrate-system@0.2.0-alpha.2

## 0.1.1-alpha.1

### Patch Changes

- 31ecaa2: Smoke-test Trusted Publishing — no code changes. Incrementing alpha to confirm the OIDC publish path works end-to-end after the bootstrap NPM_TOKEN was removed.
  - @measured/calibrate-system@0.1.1-alpha.1

## 0.1.1-alpha.0

### Patch Changes

- 93ce56b: Initial alpha release of Calibrate. Process validation and tire-kicking only — APIs are not stable. Please don't depend on these versions for anything real yet.
  - @measured/calibrate-system@0.1.1-alpha.0
