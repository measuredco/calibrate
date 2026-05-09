---
"@measured/calibrate-core": minor
"@measured/calibrate-react": minor
---

Page header now spans full width with the persistent / collapsible Sidebar opening below it. Previously the entire page (header included) shifted inline when a Sidebar was composed in; now only `main` and `footer` shift, leaving header and banner edge-to-edge.

New on Page:

- `headerSize` prop — `"sm" | "md" | "lg"`, default `"md"`. Reserves a minimum block size on the header and exposes `--clbr-page-header-block-size` to descendants. The Sidebar reads this variable for its panel's `inset-block-start`, so persistent panels open beneath the header band rather than overlapping it.
- `sm` = 3rem (48px); `md` = 3.75rem (60px); `lg` = 4.5rem (72px) at base and 5.25rem (84px) above the tablet breakpoint (48em).

This is a visual change for any consumer composing a Sidebar inside Page's header slot — the new layout is the default. Pages without a Sidebar are unaffected aside from the new minimum header height.
