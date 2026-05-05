---
"@measured/calibrate-config": minor
---

Add an editor IntelliSense lookup for Calibrate's `--clbr-*` custom properties. The new file ships at `@measured/calibrate-config/editor/clbr.intellisense.css` listing every published semantic token (base + msrd at default context) with its resolved value and `$description`. Consumers drop the file into their project's `.vscode/` directory and VS Code's CSS workspace scan surfaces typeahead and value hover for every var when authoring CSS.

```sh
cp node_modules/@measured/calibrate-config/editor/clbr.intellisense.css .vscode/
```
