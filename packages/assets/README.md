# @measured/calibrate-assets

Runtime asset package for Calibrate.

## Scope

- Fonts package
- Public `@font-face` entrypoint: `@measured/calibrate-assets/fonts.css`

## Font files

Current bundled files in `src/fonts/`:

- `InterVariable.subset.woff2`
- `InterVariable-Italic.subset.woff2`
- `RobotoMono-VariableFont_wght.subset.woff2`
- `RobotoMono-Italic-VariableFont_wght.subset.woff2`

## Usage

Import fonts before core styles:

```css
@import "@measured/calibrate-assets/fonts.css";
@import "@measured/calibrate-core/styles.css";
```

## Family names exposed

- `InterVariable`
- `Roboto Mono`
