---
"@measured/calibrate-core": patch
---

Fix install failure for downstream consumers. `@measured/calibrate-system` was incorrectly declared as a runtime dependency, but it's a private workspace package not published to npm — so consumer installs failed with `ERR_PNPM_FETCH_404`. The dependency is build-time only (the system CSS is inlined into core's published artifact); moved to `devDependencies`.
