---
"@measured/calibrate-core": patch
"@measured/calibrate-react": patch
---

Form controls now play cleanly with React's controlled-input checks:

- Event handlers and `autoFocus` route to the inner `<input>` / `<textarea>` / `<select>` instead of the host wrapper, so React sees them on the element it checks. `ref` continues to land on the host wrapper.
- HTML boolean props (`checked`, `disabled`, `required`, `readonly`, etc.) preserve their `false` value through the React adapter, so toggling a checkbox / switch keeps the input controlled. `false` on `data-*` and `aria-*` is still omitted (matches SSR).
- `Input` preserves the empty string distinctly from `undefined`, so clearing a controlled field doesn't flip it from controlled to uncontrolled.
