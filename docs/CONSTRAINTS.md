# System constraints

## Purpose

This document defines the stable constraints for token authoring, structure, and resolution.
Planning and sequencing live in `docs/PLANNING.md`.
Resolver adapter details live in `packages/tokens/scripts/README.md`.

## Program Goals

- Maintain a stable public design-system API, starting with semantic tokens and extending to component consumption contracts.
- Keep monorepo architecture as the default repo model for system evolution.
- Establish `tokens` and `components` as first-class package boundaries in the repo.
- Use lockstep versioning across design-system packages by default to reduce token/component drift.
- Preserve core token-model capabilities: multi-brand, theme/surface contexts, responsive behavior, and accessibility contexts.
- Keep current bridge/build pipeline robust while resolver/SD support gaps are being closed upstream.
- Treat probe artifacts (for example Card component tokens and wireframe brand) as architecture-validation assets until explicitly promoted to long-term API commitments.

## API And Ownership

- Ensure `*.tokens.json` files conform to `packages/tokens/schemas/2025.10/spec`.
- `packages/tokens/src/<brand>/primitive` is private; public API is `packages/tokens/src/<brand>/semantic`.
- For the tokens package, semantic tokens are the only public API surface; consumers should not bind to primitive paths.
- Semantic-first authoring is the default for UI implementation; component tokens are additive and should be introduced only when they encode component-specific semantics or cross-context behavior not cleanly represented in semantic/component CSS alone.
- Keep semantic token shape consistent across brands (same semantic paths per brand).
- Shared system-shell domains live in `packages/tokens/src/core/{primitive,semantic}`.
- Brand-specific domains live in `packages/tokens/src/<brand>/{primitive,semantic}`.

## Folder And File Conventions

- Semantic folder convention (axis-first where applicable):
  - base pattern: `packages/tokens/src/<brand>/semantic/<domain>/<axis>/<context>...`
  - optional override pattern (only when needed): `packages/tokens/src/<brand>/semantic/<domain>/override/<axis>/<context>...`
- Core folder convention mirrors brand convention where applicable:
  - base pattern: `packages/tokens/src/core/semantic/<domain>/<axis>/<context>...`
  - primitive pattern: `packages/tokens/src/core/primitive/<domain>.tokens.json`

- Semantic color file convention: `packages/tokens/src/<brand>/semantic/color/theme/<theme>/<surface>.tokens.json`.
- Semantic color forced-colors convention (current normalized path): `packages/tokens/src/<brand>/semantic/color/forced-colors/<context>.tokens.json`.
- Semantic effect file convention: `packages/tokens/src/<brand>/semantic/effect/theme/<theme>/<surface>.tokens.json`.
- Semantic typography size convention: `packages/tokens/src/<brand>/semantic/typography/size/<context>.tokens.json`.
- Semantic layout size convention: `packages/tokens/src/<brand>/semantic/layout/size/<context>.tokens.json`.
- Semantic layout root convention: `packages/tokens/src/<brand>/semantic/layout/tokens.json`.
- Semantic spacing root convention: `packages/tokens/src/<brand>/semantic/spacing.tokens.json`.
- Resolver documents should follow DTCG resolver spec file naming:
  - use `.resolver.json`
  - keep resolver/build config colocated under `packages/tokens/` (not repo root) as this repo evolves.
- Vendored schema convention:
  - store official DTCG schemas under `packages/tokens/schemas/<version>/...`
  - token/resolver files should carry local `$schema` paths into `packages/tokens/schemas/...`

## Repository Packaging Direction

- Monorepo direction is normative.
- Package boundaries:
  - `packages/tokens/` is a first-class package boundary.
  - `packages/components/` is a first-class package boundary and should consume published token outputs/contracts.
  - `packages/browserslist/` is a first-class support package boundary for shared browser target policy.
  - additional boundaries (for example `assets`, docs site, bootstrap CLI) are expected but remain exploratory until concrete constraints are defined.
- Versioning/distribution policy:
  - lockstep versioning is the default across design-system packages.
  - support both full-system consumption and selective package consumption where practical.
- `tokens` package structure remains:
  - source tokens live under `packages/tokens/src/...` (including `core` and brand folders).
  - generated public artifacts output to `packages/tokens/dist/...`.
  - disposable pipeline artifacts output to `packages/tokens/build/...`.
- Resolver documents and build/transforms should live inside the `packages/tokens/` package tree.

## Components Package Constraints (Alpha)

- `packages/components/` is the canonical package boundary for component contracts built on token outputs.
- Component implementation model:
  - components that do not require runtime JS behavior should be authored as pure SSR renderers that emit native HTML.
  - components that do require runtime JS behavior may be authored as web-components.
  - runtime web-components (when used) should use light DOM and preserve SSR-safe meaningful initial HTML.
- TypeScript is required for component contract authoring.
- Public component contracts (renderer props and/or component attributes/properties/events) must include JSDoc.
- Public renderers should include a co-located declarative spec mirror for tooling/docs/adapter use.
- Every component must include tests with contract/behavior coverage.
  - use Testing Library where semantic DOM behavior is under test.
- Every component must include Storybook stories.
- Component package quality gates use repo-level ESLint and Prettier.
- Component package browser support baseline is centralized in `@measured/calibrate-browserslist` (`baseline widely available` query + Vite/esbuild target) with PostCSS+Autoprefixer enabled.
- Shims/polyfills should only be introduced when a concrete support requirement emerges.
- Accessibility baseline target is WCAG 2.2 AA.
- Storybook is package-local and treated as a development tool; docs-site integration remains optional/future.
- Components package token CSS loading model:
  - components package auto-imports token CSS by default.
  - direct tokens package consumption remains supported for non-component consumers.
  - initial strategy includes both brands by default (brand/tree-shaking optimization can follow later).
- Components package should ship a light root/reset CSS entrypoint that composes token CSS imports.
- Components package public API remains alpha (no stability guarantees until publish/version policy is formalized).

## Canonical Semantic File Map (Alpha, `msrd`)

- `packages/tokens/src/msrd/semantic/color/theme/light/{default,brand}.tokens.json`
- `packages/tokens/src/msrd/semantic/color/theme/dark/{default,brand}.tokens.json`
- `packages/tokens/src/msrd/semantic/color/forced-colors/on.tokens.json`
- `packages/tokens/src/msrd/semantic/effect/theme/light/{default,brand}.tokens.json`
- `packages/tokens/src/msrd/semantic/effect/theme/dark/{default,brand}.tokens.json`
- `packages/tokens/src/core/semantic/spacing.tokens.json`
- `packages/tokens/src/core/semantic/layout/tokens.json`
- `packages/tokens/src/core/semantic/layout/size/{baseline,tablet,notebook,laptop}.tokens.json`
- `packages/tokens/src/core/semantic/breakpoint.tokens.json`
- `packages/tokens/src/msrd/semantic/typography/tokens.json`
- `packages/tokens/src/msrd/semantic/typography/size/{baseline,tablet}.tokens.json`
- `packages/tokens/src/msrd/semantic/motion/tokens.json`
- `packages/tokens/src/msrd/semantic/radius/tokens.json`
- `packages/tokens/src/msrd/semantic/shape/tokens.json`

## Authoring Rules

- Use strict spec forms:
  - token objects use `$value` (or token-level `$ref` where intentionally used)
  - curly aliases for token-to-token references
  - JSON Pointer `$ref` only for property-level references where needed
- External `$ref` path rule:
  - relative `$ref` file paths must resolve from the authoring file location
  - update paths when folders move
- Group ordering rule:
  - when a group includes a `default` token, place `default` at the top of that group (after any `$*` metadata keys)
- Cross-layer alias rule:
  - brand primitive tokens may alias core primitive tokens when values are intentionally shared
  - keep explicit literals where design intent intentionally diverges
- Build outputs must be generated from tokens (no hand-maintained CSS token files as source of truth).
- Prefer vendored schema URLs for `$schema` where possible after vendoring (`packages/tokens/schemas/...`) to reduce drift/network dependency.

## Resolution And Build Rules

- Light/dark and responsive behavior should be implemented at semantic/resolution layer, not by mutating primitive intent.
- Surface variants must be supported as a first-class semantic concern alongside brand and theme.
- Resolver source-of-truth is DTCG resolver manifests in `packages/tokens/resolver/*.resolver.json`.
- Build tooling (e.g. Style Dictionary) should consume resolver-selected sources via adapter/config; do not duplicate context contracts ad hoc.
- Prefer standard Style Dictionary configuration/build flow over custom build scripts.
- Custom logic is limited to resolver adaptation only:
  - mapping resolver + context inputs -> ordered SD source/include entries
  - generating SD config inputs from resolver decisions where required
- Do not reimplement Style Dictionary core behavior (token transforms, formatting, output writing) in custom scripts unless a documented SD gap requires it.
- Temporary documented SD-gap shim:
  - bridge currently normalizes nested DTCG `{ value, unit }` objects to scalar strings before SD shorthand transforms
  - scope: compatibility for current composite CSS transform behavior (not a change to authoring model)
  - removal target: when upstream SD DTCG support is complete (tracked: https://github.com/style-dictionary/style-dictionary/issues/1590)
- Resolver build metadata conventions used by current adapter:
  - context inheritance uses `baseContext`
  - variant diff target uses `deltaFromContext`
  - variant scope defaults are implicit (variants emit at default contexts for other axes)
  - declare per-variant `scope` only when overriding that default behavior
  - context files may be authored sparse/override-only when axis composition is cumulative (`baseContext`)
  - keep duplicate declarations only when required to preserve local alias anchors or explicit readability intent
- Resolver/build order must satisfy semantic dependencies:
  - `core.primitive` -> `core.semantic` -> `<brand>.primitive` -> `<brand>.semantic`
  - `semantic.<brand>.spacing` resolves before `semantic.<brand>.layout` when layout aliases spacing
  - size-context layering order must be deterministic (e.g. `baseline|tablet|notebook` base, then `laptop` overrides where files are partial)

## Theme Parity Rules

- For each brand + surface combination, semantic color `light` and `dark` files must be path-identical and type-identical; only `$value` may differ.
- Theme parity also applies to effect tokens where surface files exist in both themes.

## Build Artifact Policy

- Commit and version outputs under `packages/tokens/dist/**`.
- Public/stable artifact contract:
  - `packages/tokens/dist/css/*.tokens.css`
- Private/non-stable maintainer artifact contract:
  - `packages/tokens/dist/private/css/*.primitives.css`
- Treat `packages/tokens/build/**` as disposable/intermediate pipeline output.
- Keep the repository-level `build` ignore convention to avoid committing transient build folders.
- CSS outputs should declare deterministic layer ordering when multiple bundles compose together:
  - layer order: `clbr`, then `clbr.brand`
  - core bundle emits in `@layer clbr`
  - brand bundles emit in `@layer clbr.brand`

## Consumer Integration Contract

- Include order for CSS bundles:
  - load `@measured/calibrate-tokens/css/core` first
  - then load one or more brand bundles (for example `@measured/calibrate-tokens/css/msrd`, `@measured/calibrate-tokens/css/wrfr`)
- CSS layering contract (`@layer clbr, clbr.brand;`) is normative and must be preserved in distributed bundles.
- Root scoping contract:
  - all token usage must live under a `.clbr` scope root
  - select a brand via `.clbr-brand-<brand>` on the same scope root
- Theme forcing contract:
  - `.clbr-theme-dark` and `.clbr-theme-light` force mode on the scoped brand root
  - without force classes, theme follows authored media query behavior
- Surface contract:
  - `.clbr-surface-brand` is a descendant surface scope inside a brand root
- Multi-brand on one page is supported:
  - use isolated wrapper roots per brand (`.clbr.clbr-brand-msrd`, `.clbr.clbr-brand-wrfr`, etc.)
  - do not mix multiple brand classes on the same scope root

## Domain Conventions

- Contextual ramp key parity:
  - where practical, contextual ramps should reuse root ramp keys for equivalent values
  - example:
    - `spacing.vertical.700 = 24`
    - `spacing.horizontal.700 = 24`
    - `layout.<context>.spacing.vertical.700 = 24` (or context-specific override)
  - objective: preserve stable step-number mental model while allowing context-based value shifts

## Semantic Review Checklist

- Every semantic token has clear design intent (no primitive leakage by name).
- Semantic paths are stable and consistent across brands.
- All semantic aliases resolve within intended graph shape (authored + resolved).
- For token-level aliases, use strict token form: `{ "$value": "{...}" }`.
- Use JSON Pointer `$ref` only for property-level access within composite values.
- For color semantics, provide both light and dark values (even if temporarily identical).
- For color semantics, design for `brand × theme × surface` resolution, even if some combinations share values initially.
- Keep typography semantics theme-agnostic unless a concrete requirement proves otherwise.
- Typography semantic tokens should reference primitive `typeStep` for default size/line-height coupling where possible.
- Font feature settings are currently handled at output/CSS layer:
  - default sans semantic family emits Inter feature settings (`"calt" 1, "ccmp" 1, "ss03" 1`)
  - mono semantic family emits `font-feature-settings: normal` reset
- Avoid platform-specific formatting in semantic intent (platform formatting belongs in transforms).
- Authoring and API evolution should optimize for human/agent token selection clarity; see `docs/PLANNING.md` for planned metadata and framework-agnostic component recipe/spec work.
