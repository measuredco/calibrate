# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, `LATER`, and `DONE` as priorities and discoveries change.

## Now

What we're working on now.

## Next

What we could working on next.

### Components

#### Control

- `Textarea`
- `Switch`
- `Select`
- `Range`
- `Checkboxes`
- `Field`(maybe, abstraction and layout manager)
- `Form`(maybe, validation and composition manager)

#### Graphic

- `Image`
- `Logo`
- `Poster` (maybe, text on Image)

#### Composite

- `Card`

#### General

- Define a shared `data-*` passthrough contract for renderer components:
  - allow typed arbitrary `data-*` attributes for analytics/instrumentation and declarative customization
  - keep attribute passthrough sandboxed (no general arbitrary-attribute forwarding)
  - also consider `id` prop normalisation
- Consider namespacing of component classes (and data-surface?)
- full holistic human review across all components

#### Maybe

- `Space`(lower-level compositional device)

## Later

Everything we could attempt given sufficient time and resources.

### Tokens evolution

#### Deterministic sorting (linting)

- JS import/export ordering via ESLint autofix
- JSON key-order enforcement for selected token paths (including top-key conventions like `$schema` / `$type` / `$description` / `default`)
- Alphabetical sorting

#### Machine-readable intent

- Expand token/group `$description` coverage for intent guidance:
  - usage guidance for humans/agents
  - token selection hints and anti-pattern notes
  - context expectations where relevant
- Define structured token/group `$extensions` for machine-readable intent:
  - stable fields for tooling/agents beyond prose descriptions
  - worked examples where intent is easy to misuse

#### Design model evolution

- Light/dark inverse surfaces
- `density` context (class-based in CSS); current size context grid/spacing is broadly editorial/comfortable in nature, this may be fine, but may want to add a ui/compact mode
- Border and Transition DTCG Composites
- Give wireframe theme an actual design

#### Style Dictionary DTCG 2025.10 gaps

[Support for DTCG v2025.10](https://github.com/style-dictionary/style-dictionary/issues/1590)

- Revisit bridge-side DTCG `$dimension`/`$duration` normalization once Style Dictionary fully supports nested `{value, unit}` in composite CSS transforms:
  - remove `normalizeDtcgValueObjects` compatibility shim from `prepare-sd-sources.mjs` when safe
- Revisit resolver bridge scope once Style Dictionary lands native DTCG resolver support:
  - reduce/remove custom resolver->SD source adaptation where SD can natively consume resolver semantics

#### Explore $extensions

[Understanding $extensions in the Design Tokens Specification](www.alwaystwisted.com/articles/understanding-extensions-in-the-design-tokens-spec)

#### JSON export target

Define a stable JSON artifact contract for downstream consumers (including docs) so metadata and token data can be consumed without coupling to internal bridge/build intermediates. Likely `packages/tokens` / `@measured/calibrate-tokens`.

Note: pipeline is currently hard-coded to CSS; probably add optional `--formats` in `packages/system/scripts/pipeline/index.mjs` when implementing a second export target.

#### Export target evolution

1. Penpot
1. Figma
1. VS Code token lookup artifact
1. iOS
1. Android

### Further evolution

#### Assets package

Expand `@measured/calibrate-assets` beyond v1 fonts scope (for example favicons/images) and define stable vs implementation-detail asset APIs.

#### Shared config package evolution

Expand `@measured/calibrate-config` beyond the current browserslist/esbuild baseline to include additional consumer-installable subpath presets (for example ESLint, Stylelint, axe; token-name lint rules, raw hex/px guards), plus optional starter assets for contribution workflows (for example PR template/checklist files).

#### Minimal viable publish

Define the minimum scripts, workflow, and release notes needed to publish initial alpha packages and unblock downstream adoption tasks.

#### Documentation website (`apps/documentation`)

Stand up a docs site that consumes published token/component packages and serves as the canonical reference for usage, contracts, and examples. Deploy to `http://calibrate.msrd.dev`, `apps/storybook` can deploy to `http://calibrate.msrd.dev/storybook/`

#### CLI bootstrap tool (`@measured/calibrate`)

Scope a `calibrate` bootstrap CLI for fast project scaffolding with sensible defaults for tokens, components, and optional assets.

#### Framework adapters (e.g. `@measured/calibrate-react`)

Identify the minimum adapter surface needed to consume token/component contracts ergonomically across target frameworks.

#### Content package (`@measured/calibrate-content`)

Define a dedicated content wrangling package for shared transforms and safety utilities (for example `processMarkdown`, `sanitizeHtml`) that can be reused by docs, stories, and app-layer integrations without baking parsing/sanitization into core renderers.

#### MCP/API

Evaluate whether an MCP/API distribution path adds clear value beyond package and CLI workflows for token discovery and integration.

#### Brand tree-shaking strategy

Define a selective-brand distribution model across tokens, core CSS, and assets/fonts so consumers can opt into single-brand payloads without breaking the default multi-brand contract.

#### Optional core private discovery bundle

Revisit whether `@measured/calibrate-core` should emit a non-exported private CSS artifact that composes `packages/system/dist/private/css/*` for discovery/debug workflows.

#### Storybook docs fidelity

Improve Storybook docs/type extraction for SSR renderer stories so prop tables and component/prop JSDoc are represented consistently (for example evaluating docgen/CEM options, or generating docs metadata from `CLBR_*_SPEC`), and to align with web-components.

## Done

What we've done.

_This section is a historical completion record; some entries may describe decisions or intermediate states that were later refined._

- Divider component implemented and aligned across core/system:
  - added `divider` renderer + CSS + stories + tests
  - API settled on `orientation` (`horizontal | vertical`) and `tone` (`default | subtle | brand`)
  - horizontal renders semantic `<hr>`; vertical renders `<span role="separator" aria-orientation="vertical">`
  - tone defaults to `default` (omitted in markup); non-default tones emit `data-tone`
  - added brand layout semantic tokens for divider sizing/thickness in `msrd` and `wrfr`
  - exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Cross-library prop contract consistency audit completed:
  - reviewed optional/required props, runtime defaults, and omit/emit behavior across component renderers
  - established default emission policy in constraints for semantic/context defaults vs deterministic layout attrs
  - fixed Box SPEC wording drift for `border` emit rule (`subtle | brand`)
- Button icon props implemented and aligned across core:
  - button API expanded with `icon`, `iconPlacement`, `iconOnlyBelow`, `iconMirrored`
  - button renderer composes `renderClbrIcon` (decorative icon path, shared icon validation/render behavior)
  - responsive collapse behavior implemented for `iconOnlyBelow="tablet"` with visually-hidden label at narrow widths
  - button spec updated with icon props, omission rules, and content ordering rules
  - Storybook button stories updated for icon controls in button/link modes
  - button tests expanded for icon rendering, ordering, collapse/mirroring, omission handling, and link-mode parity
  - icon sizing moved to core layout tokens (`2xs`..`lg` + `default`) and wired into icon/button CSS
- Heading component implemented and aligned across core/system:
  - added `heading` renderer + CSS + stories + tests
  - API includes `children`, optional `level`, `size`, `align`, and `responsive`
  - emits semantic heading elements (`h1`..`h6`) when `level` is set, otherwise renders `span`
  - fixed heading typography moved to root semantic tokens (`typography.text.heading.*`)
  - responsive heading typography exposed via contextual tokens (`typography.text.heading.responsive.*`)
  - heading CSS supports fixed/default typography and opt-in responsive typography via `data-responsive`
  - exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Radios component implemented and aligned across core:
  - added `radios` renderer + CSS + stories + tests
  - API settled on `legend`, `radios[]`, `id`, `name`, optional `description`, `value`, `required`, `disabled`, `invalid`, and `orientation`
  - group description is wired on `fieldset[aria-describedby]`, per-item descriptions are wired per input and rendered outside each label
  - group invalid is emitted on `fieldset` only; group disabled uses `fieldset[disabled]` inheritance, with per-item disabled emitted on individual radios
  - required is emitted on all non-disabled radios when enabled
  - spec and exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Text component implemented and aligned across core/system:
  - added `text` renderer + CSS + stories + tests with `span` (default) and `p` modes
  - added body typography `xs` and responsive body scale tokens (`baseline`/`tablet`) and wired them into Text sizes
  - added prose link controls (`linkVisited`) and inline code styling
  - exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Input component implemented and aligned across core/system:
  - added `input` renderer + CSS + stories + tests
  - API includes `id`/`label` (required), optional `description`, `size`, `width`, `type`, `autocomplete`, `pattern`, `name`, `value`, `disabled`, `readOnly`, `required`, `spellcheck`, and `invalid`
  - `numeric` type maps to `type="text"` with `inputmode="numeric"` and default numeric `pattern` (overridable)
  - single `description` slot is reused for hint or validation guidance; invalid state remains app-controlled
  - invalid precedence aligned with input editability (`disabled`/`readOnly` suppress `aria-invalid`)
  - exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Prose component implemented and aligned across core:
  - added `prose` renderer + CSS + stories + tests
  - API includes trusted-HTML `children`, optional `align`, `measured`, `responsive`, and `hangingIndent` (`always | notebook`)
  - renders `<div class="prose">` and follows text-style data-attribute omission defaults
  - exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Container component implemented and aligned across core/system:
  - added `container` renderer + CSS + stories + tests
  - API includes trusted-HTML `children`, optional `maxWidth` (`default | wide | none`), and optional `gutter` (`default | narrow | none`)
  - default values omit `data-*`; non-default values emit explicit attributes for deterministic styling
  - semantic layout tokens updated to `container.gutter.{default|narrow}` and wired through system build output
  - exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Grid component implemented and aligned across core/system:
  - added `grid` and `grid-item` renderers + CSS + stories + tests
  - API includes trusted-HTML `children`, gap variants (`default | expanded | none`), and item placement props across `narrow` / `default` / `wide` thresholds
  - renderer outputs `.grid-container` wrapper with inner `.grid`; item props emit data attributes for column/row span/start placement
  - layout grid gap semantics refactored to root tokens (`layout.grid.gap.sm|md|lg`) and wired into CSS via container/media thresholds
  - exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Stack component implemented and aligned across core/system:
  - added `stack` renderer + CSS + stories + tests
  - API includes trusted-HTML `children`, optional `gap` (`xs | sm | md | lg`), optional `align` (`start | center | end | stretch`), and optional `responsive`
  - renderer emits `data-gap` always, emits `data-align` when provided, and emits `data-responsive` only when true
  - CSS maps static stack gap to spacing tokens and responsive mode to layout spacing tokens
  - exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Inline component implemented and aligned across core/system:
  - added `inline` renderer + CSS + stories + tests
  - API includes trusted-HTML `children`, optional `gap` (`2xs | xs | sm | md | lg`), optional `align` (`start | center | end`), optional `justify` (`start | center | end | between`), and optional `nowrap`
  - renderer emits `data-gap` always, emits non-default `data-align`/`data-justify`, and emits `data-nowrap` only when true
  - CSS maps horizontal gap scale to spacing tokens and supports cross-axis align plus main-axis justify variants
  - exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Checkbox component implemented and aligned across core/system:
  - added `checkbox` renderer + CSS + stories + tests
  - API includes `label` (required), optional `checked`, `disabled`, `invalid`, `required`, `name`, `value`, `description`, and `descriptionId`
  - description wiring enforces non-empty valid `descriptionId` when `description` is provided and maps via `aria-describedby`
  - invalid state support added with disabled precedence (`disabled` suppresses `aria-invalid`)
  - renderer/spec/tests aligned for normalization and escaping behavior
  - added Storybook-only `Indeterminate` scenario (via `play` state) for styling `:indeterminate` without changing SSR contract
  - exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Button component review/refinement completed:
  - mode-explicit API (`mode: "button" | "link"`) with clear per-mode prop contracts
  - renderer/spec/docs/story/tests aligned around omission/normalization rules
  - tests rewritten around stable contract (button mode, link mode, robustness, escaping)
- Surface component baseline completed:
  - added `surface` renderer + CSS + tests + stories
  - integrated `surface` global toolbar control in Storybook preview
  - added story-level `withSurface` parameter support for wrapper control
- Initial `packages/core` baseline completed:
  - SSR-first renderer architecture established with `root` and `button` primitives
  - package-level TypeScript/testing/Storybook/quality gates in place
  - stable component-package constraints moved to `docs/CONSTRAINTS.md`
- Phase complete: Semantic API baseline (core + brand semantic coverage, responsive semantics included).
- semantic color theme/surface files for `msrd` (`light|dark` × `default|brand`).
- semantic color theme files include `base16` groups (`00`..`0F`) with hex descriptions.
- semantic effect theme/surface files for `msrd` (`light|dark` × `default|brand`).
- semantic effect files now expose `opacity.demoted` mapped from `primitive.effect.opacity.40`.
- semantic folder structure is axis-first for color/effect, with typography and layout using `size` contexts.
- semantic spacing now exposes root non-size scales (`vertical`, `horizontal`) in `packages/system/src/base/semantic/spacing.tokens.json`.
- responsive vertical rhythm moved to `layout/size/*` as `verticalSpacing` (not duplicated in spacing size files).
- layout grid gap semantics authored by size context (`baseline`, `tablet`, `laptop`), with `laptop` currently override-only.
- layout vertical spacing escalation now begins at `notebook` (split from `tablet`).
- contextual spacing key parity adopted for layout vertical ramps (matching root spacing keys where practical).
- primitive motion includes duration ramp in `ms` (`50`, `100`, `150`, `200`, `300`) and semantic motion exposes it.
- typography prose link decoration normalized to state-first offsets:
  - `typography.prose.link.hover.decoration.offset`
  - `typography.prose.link.active.decoration.offset`
  - shared `typography.prose.link.decoration.thickness`.
- semantic typography baseline/tablet size files populated for body + heading scales.
- brand radius ratio primitives introduced (migrated from earlier shape-domain corner-ratio modeling) with semantic exposure.
- external typography size `$ref` paths corrected to current folder structure.
- source token tree moved under `packages/system/src` (core + brand).
- spec-shaped resolver manifest added at `packages/system/resolver/msrd.resolver.json` with `resolutionOrder`.
- DTCG schemas vendored under `packages/system/schemas/2025.10` and local `$schema` paths applied across authored token/resolver files.
- Style Dictionary bridge/pipeline implemented:
  - `packages/system/scripts/pipeline/resolve-token-sources.mjs` resolves resolver context source ordering
  - `packages/system/scripts/pipeline/prepare-sd-sources.mjs` merges/normalizes token sources for SD consumption
  - `packages/system/scripts/pipeline/prepare-sd-contexts.mjs` emits context token doc + CSS manifest
  - `packages/system/style-dictionary.config.mjs` formats CSS from generated context + manifest inputs
- Resolver->SD boundary refactor completed (bridge outputs SD-ready with minimal SD-config shaping):
  - formatter path-index assumptions removed in favor of bridge metadata (`dev.msrd.calibrate.bridge`)
  - public/private split now handled by SD role filters
  - single SD run per target for public+private outputs
  - docs and constraints updated to reflect current bridge contract and temporary SD `$dimension` compatibility shim
- Output contracts established:
  - committed/public outputs in `packages/system/dist/{css,json}`
  - disposable pipeline artifacts in `packages/system/build/{sd,tmp}`
- Resolver->SD bridge API and docs stabilized:
  - adapter keys documented (`baseContext`, `deltaFromContext`, selector refs, variant defaults)
  - naming and authoring conventions documented for future brands/modifiers
- Artifact policy decided and enforced:
  - `packages/system/dist/**` is versioned/public
  - `packages/system/build/**` is disposable
  - `system:verify` added to fail when `packages/system/dist/**` is out of date after build
- Multi-brand packaging/layering base implemented:
  - `base` and `msrd` outputs now build independently
  - base artifacts: `packages/system/dist/css/clbr.base.tokens.css`, `packages/system/build/sd/clbr.base.contexts.json`
  - msrd artifacts: `packages/system/dist/css/clbr.msrd.tokens.css`, `packages/system/build/sd/clbr.msrd.contexts.json`
  - deterministic CSS layering emitted via `@layer clbr, clbr.brand;`
- Wireframe brand onboarding completed:
  - resolver added: `packages/system/resolver/wrfr.resolver.json`
  - brand source added under `packages/system/src/wrfr/{primitive,semantic}`
  - build target wired in `packages/system/scripts/pipeline/index.mjs`
  - brand artifacts emit and verify:
    - `packages/system/dist/css/clbr.wrfr.tokens.css`
    - `packages/system/build/sd/clbr.wrfr.contexts.json`
- Consumer include/override strategy documented in constraints:
  - load contract for `core` + brand bundles
  - scoped multi-brand usage on one page
  - class contracts for brand/theme/surface selectors
- Baseline validation + CI checks implemented:
  - `system:validate` added for authored token/resolver JSON checks and resolver-context preparation checks
  - CI workflow added at `.github/workflows/tokens.yml`
  - CI runs:
    - `pnpm run system:validate`
    - `pnpm run system:verify`
- Optional private primitive output implemented for maintainer/discovery workflows:
  - output path: `packages/system/dist/private/css/`
  - file naming: `clbr.<brand>.primitives.css`
  - variable guard prefix: `--clbr-primitive-*`
  - documented as non-public/non-stable contract (semantic remains the public API)
- Authoring ergonomics for context declarations improved:
  - sparse/override-only context files are supported as first-class authoring for cumulative axes
  - `theme` source composition now uses cumulative `baseContext` inheritance (aligned with `size`)
  - constraints now document when duplicate declarations should be retained (alias-anchor/readability cases)
- Resolver bridge docs now co-locate with bridge code:
  - canonical bridge doc lives at `packages/system/scripts/README.md`
- Bridge scripts now use a dedicated subfolder structure:
  - pipeline scripts moved to `packages/system/scripts/pipeline/*`
  - build entrypoint is `packages/system/scripts/pipeline/index.mjs`
- Vendored DTCG spec reference docs relocated under `packages/system/schemas/2025.10/spec`.
- ESLint and Prettier baseline tooling added:
  - `eslint` configured via `eslint.config.mjs` for token pipeline scripts
  - `prettier` configured via `.prettierrc.json` and `.prettierignore`
  - scripts added in `package.json`: `lint`, `lint:fix`, `format`, `format:check`
- Component token layer architecture proved with Card pilot:
  - `packages/system/src/<brand>/component/...` path shape integrated into resolver->SD bridge
  - component tokens resolve across theme/surface/state contexts with correct diff behavior
  - forced-colors component overrides emit correctly without leaking unrelated semantic tokens
  - output naming and scoping conventions validated in generated CSS
- Card and `wrfr` are intentionally retained as architecture probes for now:
  - Card remains in-tree to validate component-theme/surface/state support and resolver->SD behavior
  - `wrfr` remains in-tree to validate multi-brand packaging and runtime scoping patterns
- Monorepo architecture baseline completed (pnpm workspace, lockstep versioning):
  - `pnpm-workspace.yaml` added with `packages/*`
  - tokens package moved to `packages/system` with package-local build/validate/verify scripts
  - root scripts now delegate via workspace filters (`@measured/calibrate-system`)
  - `packages/core` scaffold added as the next package boundary
- Monorepo package boundary realignment completed:
  - `packages/components` -> `packages/core` (`@measured/calibrate-core`)
  - `packages/tokens` -> `packages/system` (`@measured/calibrate-system`, kept private)
  - `@measured/calibrate-core` positioned as the primary runtime consumption contract
  - `@measured/calibrate-core/styles.css` established as the single CSS entrypoint (composing token + component CSS)
  - cross-package deps/scripts/CI/docs updated to new names and boundaries
  - publish intent clarified: `@measured/calibrate-core` and `@measured/calibrate-config` publishable, `@measured/calibrate-system` internal
- Storybook runtime extracted to app boundary:
  - moved Storybook config/runtime from `packages/core/.storybook` to `apps/storybook/.storybook`
  - preserved story co-location in package source (`packages/*/src/**/*.stories.ts`)
  - script ownership moved to `apps/storybook`, with root convenience aliases (`storybook`, `storybook:build`)
  - static output normalized to `apps/storybook/storybook-static`
  - CI expanded with dedicated Storybook build job
- Class/attribute grammar applied to root + surface contracts:
  - structural semantics use classes; state/variant semantics use attributes
  - `root` now emits `.clbr` + `data-brand` (+ optional `data-theme`)
  - `surface` now emits `.surface` + `data-surface` (default included)
  - token resolver selectors and generated brand CSS updated to match attribute grammar
- Surface selector contract refactor completed:
  - brand surface token scopes now target `[data-surface="brand"]` (not `.surface[data-variant="brand"]`)
  - no compatibility selectors are emitted (intentional breaking change)
  - enables reuse of surface context attributes on non-Surface wrappers (e.g. future `Box`)
- Font distribution contract implemented:
  - `@measured/calibrate-assets` package added for runtime font assets
  - vendored variable Inter + Roboto Mono font files and `@font-face` entrypoint at `@measured/calibrate-assets/fonts.css`
  - Storybook now imports package fonts entrypoint and validates packaged font loading
  - `core` docs updated to define font load order (`assets/fonts.css` before `core/styles.css`)
- Storybook accessibility CI gate implemented:
  - Storybook addon-a11y retained for local interactive checks
  - Storybook Vitest addon wired for automated accessibility testing (WCAG 2.2 AA, no exclusions)
  - Storybook CI job now executes Storybook a11y tests as a dedicated gate
  - local reproducible scripts added for a11y runs
