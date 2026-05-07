---
"@measured/calibrate-config": patch
---

Relax the Stylelint preset's `declaration-property-unit-disallowed-list` for `max-width`, `min-width`, `max-inline-size`, and `min-inline-size` — `rem` is no longer banned on these properties. Block and inline sizing (set or constraint) is now uniformly handled: tokens preferred where they fit, `rem` accepted as a raw value for set dimensions, `%` / viewport units for genuinely contextual cases. The earlier ban created friction for legitimate one-off `max-inline-size: 30rem`-style usage where no token applied. The physical `max-width` / `min-width` entries were also redundant with `stylelint-plugin-logical-css/require-logical-properties`, which already flags them.
