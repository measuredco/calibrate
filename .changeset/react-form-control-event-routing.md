---
"@measured/calibrate-core": patch
"@measured/calibrate-react": patch
---

Form controls now play cleanly with React's controlled-input checks:

- The React adapter routes form-control event handlers (and `autoFocus`) to the inner `<input>` / `<textarea>` / `<select>` instead of the host wrapper. Eliminates React's "value prop without onChange" warnings. `ref` continues to land on the host wrapper.
- `Input` preserves the empty string distinctly from `undefined`, so clearing a controlled field no longer flips the input from controlled to uncontrolled.
