# @measured/calibrate-tokens

The Calibrate design system as a JSON artifact, with its accompanying JSON Schema. Token-centric, DTCG-faithful, language-agnostic — suitable for documentation sites, MCP servers, agents, and downstream tooling.

## Usage

```js
import msrd from "@measured/calibrate-tokens/msrd";
import wrfr from "@measured/calibrate-tokens/wrfr";
import base from "@measured/calibrate-tokens/base";
import schema from "@measured/calibrate-tokens/schemas/v1";
```

## Output shape

Each artifact is token-centric with overlay-only context variation:

- **Constant tokens**: `$value` only.
- **Single-axis variation**: `$value` + `varyingModifiers: [axis]` + `by<Axis>: { <axisValue>: { $value, ... } }`.
- **Multi-axis variation**: `$value` + `varyingModifiers: [a, b]` + `byContext: { "a=v1,b=v2": { $value } }` — keys list only the varying axes.

DTCG-defined fields keep the `$` prefix (`$value`, `$type`, `$description`, `$extensions`); Calibrate-defined fields are bare-named (`layer`, `varyingModifiers`, `byTheme`, `byContext`, …).

## Schema

The JSON Schema (draft-2020-12) describes the envelope, per-token shape, and overlay maps. Validate consumer JSON with any draft-2020-12-aware validator (e.g. ajv).
