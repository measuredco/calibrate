---
"@measured/calibrate-react": patch
---

Route form-control event handlers (and `autoFocus`) to the inner `<input>` / `<textarea>` / `<select>` instead of the wrapper. Eliminates React's "value prop without onChange" and "uncontrolled ↔ controlled" warnings on `<Input>`, `<Textarea>`, `<Range>`, `<Checkbox>`, and `<Switch>`. `ref` continues to land on the host wrapper.
