---
"@measured/calibrate-core": minor
"@measured/calibrate-react": minor
---

**Breaking:** Sidebar `size` prop renamed to `buttonSize`, accepts `"sm" | "md" | "lg"` (was `"sm" | "md"`), and now passes the value straight through to the trigger and collapse buttons. Previously the prop indirected (`sm → md`, `md → lg`); the prop only ever influenced the embedded button sizes, so the indirection has been removed and the surface made explicit.

Default is `"md"` (visual change: the previous default rendered an `lg` button via indirection). Pass `buttonSize: "lg"` explicitly to keep the old size. The `data-size` host attribute is now `data-button-size`. The exported `ClbrSidebarSize` type is removed — use `ClbrButtonSize` from the button module instead.

Migration:

```diff
- renderClbrSidebar({ size: "md", ... })
+ renderClbrSidebar({ buttonSize: "lg", ... })

- renderClbrSidebar({ size: "sm", ... })
+ renderClbrSidebar({ buttonSize: "md", ... })
```
