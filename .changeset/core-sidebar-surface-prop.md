---
"@measured/calibrate-core": minor
"@measured/calibrate-react": minor
---

Sidebar: add `surface` prop. Mirrors Card / etc. — accepts `"default" | "brand" | "inverse" | "brand-inverse"` and emits `data-clbr-surface` on the inner `.sidebar` panel (not the host) so the surface context applies to the panel chrome, not the trigger or backdrop.
