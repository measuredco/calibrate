# System constraints

## Purpose

This document defines the stable constraints for token authoring, structure, and resolution.
Planning and sequencing live in `docs/PLANNING.md`.

## Program Goals

- Define a stable public tokens API in `tokens/<brand>/semantic`.
- Support color themes (light/dark).
- Support surfaces within themes.
- Support responsive token behavior.
- Prove multi-brand support by adding a second brand (`wireframe`).
- Build a transform pipeline (Style Dictionary 4) to output usable CSS.

## API And Ownership

- Ensure `*.tokens.json` files conform to `docs/w3c-dtcg-spec`.
- `tokens/<brand>/primitive` is private; public API is `tokens/<brand>/semantic`.
- Semantic tokens are the only public API surface; consumers should not bind to primitive paths.
- Keep semantic token shape consistent across brands (same semantic paths per brand).
- Shared system-shell domains live in `tokens/core/{primitive,semantic}`.
- Brand-specific domains live in `tokens/<brand>/{primitive,semantic}`.

## Folder And File Conventions

- Semantic folder convention (axis-first where applicable):
  - base pattern: `tokens/<brand>/semantic/<domain>/<axis>/<context>...`
  - optional override pattern (only when needed): `tokens/<brand>/semantic/<domain>/override/<axis>/<context>...`
- Core folder convention mirrors brand convention where applicable:
  - base pattern: `tokens/core/semantic/<domain>/<axis>/<context>...`
  - primitive pattern: `tokens/core/primitive/<domain>.tokens.json`

- Semantic color file convention: `tokens/<brand>/semantic/color/theme/<theme>/<surface>.tokens.json`.
- Semantic color forced-colors convention (current normalized path): `tokens/<brand>/semantic/color/forced-colors/<context>.tokens.json`.
- Semantic effect file convention: `tokens/<brand>/semantic/effect/theme/<theme>/<surface>.tokens.json`.
- Semantic typography size convention: `tokens/<brand>/semantic/typography/size/<context>.tokens.json`.
- Semantic layout size convention: `tokens/<brand>/semantic/layout/size/<context>.tokens.json`.
- Semantic layout root convention: `tokens/<brand>/semantic/layout/tokens.json`.
- Semantic spacing root convention: `tokens/<brand>/semantic/spacing.tokens.json`.

## Canonical Semantic File Map (Alpha, `msrd`)

- `tokens/msrd/semantic/color/theme/light/{default,brand}.tokens.json`
- `tokens/msrd/semantic/color/theme/dark/{default,brand}.tokens.json`
- `tokens/msrd/semantic/color/forced-colors/on.tokens.json`
- `tokens/msrd/semantic/effect/theme/light/{default,brand}.tokens.json`
- `tokens/msrd/semantic/effect/theme/dark/{default,brand}.tokens.json`
- `tokens/core/semantic/spacing.tokens.json`
- `tokens/core/semantic/layout/tokens.json`
- `tokens/core/semantic/layout/size/{baseline,tablet,notebook,laptop}.tokens.json`
- `tokens/core/semantic/breakpoint.tokens.json`
- `tokens/msrd/semantic/typography/tokens.json`
- `tokens/msrd/semantic/typography/size/{baseline,tablet}.tokens.json`
- `tokens/msrd/semantic/motion/tokens.json`
- `tokens/msrd/semantic/radius/tokens.json`
- `tokens/msrd/semantic/shape/tokens.json`

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

## Resolution And Build Rules

- Light/dark and responsive behavior should be implemented at semantic/resolution layer, not by mutating primitive intent.
- Surface variants must be supported as a first-class semantic concern alongside brand and theme.
- Resolver/build order must satisfy semantic dependencies:
  - `core.primitive` -> `core.semantic` -> `<brand>.primitive` -> `<brand>.semantic`
  - `semantic.<brand>.spacing` resolves before `semantic.<brand>.layout` when layout aliases spacing
  - size-context layering order must be deterministic (e.g. `baseline|tablet|notebook` base, then `laptop` overrides where files are partial)

## Theme Parity Rules

- For each brand + surface combination, semantic color `light` and `dark` files must be path-identical and type-identical; only `$value` may differ.
- Theme parity also applies to effect tokens where surface files exist in both themes.

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
