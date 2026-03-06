# Resolver -> Style Dictionary bridge

This project uses DTCG resolver files as the source of truth, plus a small adapter layer that prepares deterministic SD inputs.

## Script index

- `tokens/scripts/pipeline/index.mjs`
  - build entrypoint used by `pnpm run tokens:build`
- `tokens/scripts/validate.mjs`
  - validation entrypoint used by `pnpm run tokens:validate`
- `tokens/scripts/verify.mjs`
  - verification entrypoint used by `pnpm run tokens:verify`
- `tokens/scripts/pipeline/prepare-sd-contexts.mjs`
  - resolver context preparation + CSS manifest generation
- `tokens/scripts/pipeline/prepare-sd-sources.mjs`
  - source merge/normalization for Style Dictionary input
- `tokens/scripts/pipeline/resolve-token-sources.mjs`
  - ordered source resolution for a concrete resolver context

## Purpose

- Keep authoring in resolver format (`tokens/resolver/*.resolver.json`).
- Keep Style Dictionary responsible for formatting/output.
- Limit custom logic to resolver adaptation only.

## Resolver build metadata used by the adapter

The adapter reads custom metadata under:

- `$defs.build.namespace`
- `$defs.build.brand`
- `$defs.build.tokenLayers`
- `$defs.build.targets.css.selectors`
- `$defs.build.targets.css.modifiers`
- `$defs.build.targets.css.layer`
- `$defs.build.targets.css.layerOrder`

### Context graph keys

- `baseContext`: context inheritance within an axis.
- `deltaFromContext`: comparison context for a variant emission delta.

### Variant scope defaults

For CSS modifier variants, the bridge applies an implicit default scope:

- variants are emitted only at default contexts for all other axes.

Per-variant `scope` may be provided for exceptions/expansion.

## Naming conventions

- Axis names in resolver `modifiers` should match semantic intent (`size`, `theme`, `forcedColors`).
- CSS selector templates should use `{namespace}` and `{brand}` placeholders.
- Public CSS vars use namespace prefix (for example `--clbr-*`).

## Artifact contract

- Public/versioned outputs:
  - `tokens/dist/css/*.css`
- Private/versioned maintainer outputs:
  - `tokens/dist/private/css/*.primitives.css`
  - non-stable/non-public contract for discovery workflows
- Disposable pipeline artifacts:
  - `tokens/build/sd/*`
  - `tokens/build/tmp/*`

## CSS layer contract

- Resolver may declare:
  - `$defs.build.targets.css.layer` (layer for this output)
  - `$defs.build.targets.css.layerOrder` (global layer order declaration)
- Formatter behavior:
  - emits `@layer <order...>;` when `layerOrder` is present
  - wraps all emitted blocks in `@layer <layer> { ... }` when `layer` is present

## CI guardrail

Run:

- `pnpm run lint`
- `pnpm run format:check`
- `pnpm run tokens:validate`
- `pnpm run tokens:verify`

- `lint` enforces script/config quality via ESLint.
- `format:check` enforces deterministic formatting via Prettier.
- `tokens:validate` checks authored token/resolver JSON validity, local `$schema` wiring, resolver sanity, and resolver context preparation.
- `tokens:verify` rebuilds tokens and fails if `tokens/dist/**` changes.
