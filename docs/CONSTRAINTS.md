# System constraints

## Purpose

This document defines the stable constraints for token authoring, structure, and resolution.
Planning and sequencing live in `docs/PLANNING.md`.
Resolver adapter details live in `tokens/scripts/README.md`.

## Program Goals

- Define a stable public tokens API in `tokens/src/<brand>/semantic`.
- Support color themes (light/dark).
- Support surfaces within themes.
- Support responsive token behavior.
- Prove multi-brand support by adding a second brand (`wireframe`).
- Build a transform pipeline (Style Dictionary 4) to output usable CSS.
- Card component tokens and wireframe brand are currently used as capability probes; treat them as architecture-validation artifacts until explicitly promoted to long-term public API commitments.

## API And Ownership

- Ensure `*.tokens.json` files conform to `tokens/schemas/2025.10/spec`.
- `tokens/src/<brand>/primitive` is private; public API is `tokens/src/<brand>/semantic`.
- Semantic tokens are the only public API surface; consumers should not bind to primitive paths.
- Semantic-first authoring is the default for UI implementation; component tokens are additive and should be introduced only when they encode component-specific semantics or cross-context behavior not cleanly represented in semantic/component CSS alone.
- Keep semantic token shape consistent across brands (same semantic paths per brand).
- Shared system-shell domains live in `tokens/src/core/{primitive,semantic}`.
- Brand-specific domains live in `tokens/src/<brand>/{primitive,semantic}`.

## Folder And File Conventions

- Semantic folder convention (axis-first where applicable):
  - base pattern: `tokens/src/<brand>/semantic/<domain>/<axis>/<context>...`
  - optional override pattern (only when needed): `tokens/src/<brand>/semantic/<domain>/override/<axis>/<context>...`
- Core folder convention mirrors brand convention where applicable:
  - base pattern: `tokens/src/core/semantic/<domain>/<axis>/<context>...`
  - primitive pattern: `tokens/src/core/primitive/<domain>.tokens.json`

- Semantic color file convention: `tokens/src/<brand>/semantic/color/theme/<theme>/<surface>.tokens.json`.
- Semantic color forced-colors convention (current normalized path): `tokens/src/<brand>/semantic/color/forced-colors/<context>.tokens.json`.
- Semantic effect file convention: `tokens/src/<brand>/semantic/effect/theme/<theme>/<surface>.tokens.json`.
- Semantic typography size convention: `tokens/src/<brand>/semantic/typography/size/<context>.tokens.json`.
- Semantic layout size convention: `tokens/src/<brand>/semantic/layout/size/<context>.tokens.json`.
- Semantic layout root convention: `tokens/src/<brand>/semantic/layout/tokens.json`.
- Semantic spacing root convention: `tokens/src/<brand>/semantic/spacing.tokens.json`.
- Resolver documents should follow DTCG resolver spec file naming:
  - use `.resolver.json`
  - keep resolver/build config colocated under `tokens/` (not repo root) as this repo evolves.
- Vendored schema convention:
  - store official DTCG schemas under `tokens/schemas/<version>/...`
  - token/resolver files should carry local `$schema` paths into `tokens/schemas/...`

## Repository Packaging Direction

- Anticipated monorepo direction:
  - `tokens/` becomes a standalone package boundary.
  - source tokens live under `tokens/src/...` (including `core` and brand folders).
  - generated public artifacts output to `tokens/dist/...`.
  - disposable pipeline artifacts output to `tokens/build/...`.
- Resolver documents and build/transforms should live inside the `tokens/` package tree.

## Canonical Semantic File Map (Alpha, `msrd`)

- `tokens/src/msrd/semantic/color/theme/light/{default,brand}.tokens.json`
- `tokens/src/msrd/semantic/color/theme/dark/{default,brand}.tokens.json`
- `tokens/src/msrd/semantic/color/forced-colors/on.tokens.json`
- `tokens/src/msrd/semantic/effect/theme/light/{default,brand}.tokens.json`
- `tokens/src/msrd/semantic/effect/theme/dark/{default,brand}.tokens.json`
- `tokens/src/core/semantic/spacing.tokens.json`
- `tokens/src/core/semantic/layout/tokens.json`
- `tokens/src/core/semantic/layout/size/{baseline,tablet,notebook,laptop}.tokens.json`
- `tokens/src/core/semantic/breakpoint.tokens.json`
- `tokens/src/msrd/semantic/typography/tokens.json`
- `tokens/src/msrd/semantic/typography/size/{baseline,tablet}.tokens.json`
- `tokens/src/msrd/semantic/motion/tokens.json`
- `tokens/src/msrd/semantic/radius/tokens.json`
- `tokens/src/msrd/semantic/shape/tokens.json`

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
- Prefer vendored schema URLs for `$schema` where possible after vendoring (`tokens/schemas/...`) to reduce drift/network dependency.

## Resolution And Build Rules

- Light/dark and responsive behavior should be implemented at semantic/resolution layer, not by mutating primitive intent.
- Surface variants must be supported as a first-class semantic concern alongside brand and theme.
- Resolver source-of-truth is DTCG resolver manifests in `tokens/resolver/*.resolver.json`.
- Build tooling (e.g. Style Dictionary) should consume resolver-selected sources via adapter/config; do not duplicate context contracts ad hoc.
- Prefer standard Style Dictionary configuration/build flow over custom build scripts.
- Custom logic is limited to resolver adaptation only:
  - mapping resolver + context inputs -> ordered SD source/include entries
  - generating SD config inputs from resolver decisions where required
- Do not reimplement Style Dictionary core behavior (token transforms, formatting, output writing) in custom scripts unless a documented SD gap requires it.
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

- Commit and version outputs under `tokens/dist/**`.
- Public/stable artifact contract:
  - `tokens/dist/css/*.tokens.css`
- Private/non-stable maintainer artifact contract:
  - `tokens/dist/private/css/*.primitives.css`
- Treat `tokens/build/**` as disposable/intermediate pipeline output.
- Keep the repository-level `build` ignore convention to avoid committing transient build folders.
- CSS outputs should declare deterministic layer ordering when multiple bundles compose together:
  - layer order: `clbr`, then `clbr.brand`
  - core bundle emits in `@layer clbr`
  - brand bundles emit in `@layer clbr.brand`

## Consumer Integration Contract

- Include order for CSS bundles:
  - load `tokens/dist/css/clbr.core.tokens.css` first
  - then load one or more brand bundles (for example `clbr.msrd.tokens.css`, `clbr.wrfr.tokens.css`)
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
