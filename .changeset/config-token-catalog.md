---
"@measured/calibrate-config": minor
---

Expand token-enforcement linting and rename the editor lookup.

**Lint coverage**

- New custom rule `calibrate/clbr-known-tokens` validates every `var(--*)` reference against either the Calibrate catalog (for `--clbr-*` names) or a same-file definition. Cross-file custom properties — including consumers' own organisation across CSS files — are rejected by default; define within the file you use it in. Consumers who organise tokens across files can opt out of the same-file gate via `[true, { allowCrossFile: true }]` while keeping catalog enforcement for `--clbr-*`.
- `scale-unlimited/declaration-strict-value` apply-list extended to `opacity`, `transition-timing-function`, `animation-timing-function`.
- `declaration-property-unit-disallowed-list` extended to ban `rem` on `font-size`, the `border` shorthand (and logical variants), `outline-width`, `outline-offset`, and `max/min-{width,inline-size}`.
- Custom error messages on every token-discipline rule point at the catalog so the violation moment doubles as discoverability.

**Catalog rename and relocation**

- `clbr.intellisense.css` is now `clbr.catalog.css`. The IntelliSense framing was VS Code-specific; the file is also consumed by the package's stylelint plugin and is editor-agnostic. Update the install-time copy step accordingly:

  ```sh
  cp node_modules/@measured/calibrate-config/clbr.catalog.css .vscode/
  ```

- File now ships at the package root rather than `editor/` (single artifact, no folder).

**Package reorganisation**

- Files reorganised into one folder per public subpath: `eslint/`, `stylelint/`, `browserslist/`. Internal `stylelint/plugin-clbr-tokens.mjs` colocated with its preset. Consumer subpath imports (`@measured/calibrate-config/stylelint`, etc.) are unchanged.
