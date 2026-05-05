---
"@measured/calibrate-config": minor
---

Add a `--clbr-*` token catalog for editor autocomplete and tooling. The file ships at `@measured/calibrate-config/clbr.catalog.css` listing every published semantic token (base + msrd at default context) with its resolved value and `$description`. Consumers drop it into their editor's CSS-data directory (e.g. `.vscode/`) for typeahead and value hover; the package's stylelint plugin reads the same file to validate `var(--clbr-*)` references.

```sh
cp node_modules/@measured/calibrate-config/clbr.catalog.css .vscode/
```
