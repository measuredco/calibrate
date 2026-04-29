# @measured/calibrate-tokens

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
