# Resolver -> Style Dictionary bridge

This project uses DTCG resolver files as the source of truth, plus a small adapter layer that prepares deterministic SD inputs.

## Purpose

- Keep authoring in resolver format (`tokens/resolver/*.resolver.json`).
- Keep Style Dictionary responsible for formatting/output.
- Limit custom logic to resolver adaptation only.

## Resolver build metadata used by the adapter

The adapter reads custom metadata under:

- `$defs.build.namespace`
- `$defs.build.brand`
- `$defs.build.layers`
- `$defs.build.targets.css.selectors`
- `$defs.build.targets.css.modifiers`
- `$defs.build.targets.css.layer`
- `$defs.build.targets.css.layerOrder`

### Context graph keys

- `baseContext`: context inheritance within an axis.
- `deltaFromContext`: comparison context for a variant emission delta.

### Variant defaults

Shared variant filters should be declared at axis level:

- `$defs.build.targets.css.modifiers.<axis>.variantDefaults.scope`

Per-variant `scope` may still be used for exceptions.

## Naming conventions

- Axis names in resolver `modifiers` should match semantic intent (`size`, `theme`, `forcedColors`).
- CSS selector templates should use `{namespace}` and `{brand}` placeholders.
- Public CSS vars use namespace prefix (for example `--clbr-*`).

## Artifact contract

- Public/versioned outputs:
  - `tokens/dist/css/*.css`
  - `tokens/dist/json/*.json`
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

- `pnpm run tokens:verify`

This command rebuilds tokens and fails if `tokens/dist/**` changes.
