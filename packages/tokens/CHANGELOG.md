# @measured/calibrate-tokens

## 0.2.0

### Minor Changes

- 134b977: Add the `motion.duration.3000` token (3s on `msrd`, 0ms on `wrfr`) for ambient / reduced-motion loops. Renames `motion.duration.600` from `Longest duration step.` to `Long duration step.` so the scale stays accurate now that `3000` is the longest.

  `@measured/calibrate-core`: the spinner's `prefers-reduced-motion` pulse animation now references `var(--clbr-motion-duration-3000)` instead of a hard-coded duration.

- 04aa658: Author `$description` coverage across every semantic token in `msrd` and `base`. Descriptions follow a consistent role-anchor pattern, ground examples in actual core usage, and avoid CSS-specific syntax so they read sensibly across platforms (CSS, JSON, design tools). A few small structural changes shipped alongside: `background.inverse` is removed (use surface context instead), `typeStep.100` / `typeStep.150` split into a tight/loose-leading pair, and default steps are marked on the `spacing.vertical`, `spacing.horizontal`, and `layout.spacing.vertical` ramps.
- afe32e5: Introduce `@measured/calibrate-tokens` — the design system as a JSON artifact, with its accompanying JSON Schema. For documentation sites, MCP servers, agents, and any tooling that wants tokens as data.

  ```js
  import msrd from "@measured/calibrate-tokens/msrd";
  import wrfr from "@measured/calibrate-tokens/wrfr";
  import base from "@measured/calibrate-tokens/base";
  import schema from "@measured/calibrate-tokens/schemas/v1";
  ```

### Patch Changes

- b00bb58: Add concise `description` to each public package's `package.json` and align the README's first paragraph to match. The descriptions are what npm shows in list views; they were previously empty across the repo, leaving npm to fall back to whatever appeared in the README first line.

## 0.2.0-alpha.6

## 0.2.0-alpha.5

## 0.2.0-alpha.4

### Minor Changes

- 04aa658: Author `$description` coverage across every semantic token in `msrd` and `base`. Descriptions follow a consistent role-anchor pattern, ground examples in actual core usage, and avoid CSS-specific syntax so they read sensibly across platforms (CSS, JSON, design tools). A few small structural changes shipped alongside: `background.inverse` is removed (use surface context instead), `typeStep.100` / `typeStep.150` split into a tight/loose-leading pair, and default steps are marked on the `spacing.vertical`, `spacing.horizontal`, and `layout.spacing.vertical` ramps.

## 0.2.0-alpha.3

### Minor Changes

- afe32e5: Introduce `@measured/calibrate-tokens` — the design system as a JSON artifact, with its accompanying JSON Schema. For documentation sites, MCP servers, agents, and any tooling that wants tokens as data.

  ```js
  import msrd from "@measured/calibrate-tokens/msrd";
  import wrfr from "@measured/calibrate-tokens/wrfr";
  import base from "@measured/calibrate-tokens/base";
  import schema from "@measured/calibrate-tokens/schemas/v1";
  ```
