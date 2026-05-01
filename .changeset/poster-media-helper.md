---
"@measured/calibrate-core": minor
"@measured/calibrate-react": minor
---

Poster: rename `image` → `media` and constrain it to a branded type produced by `renderClbrPosterImage`. The helper locks `cover` and `priority` to the values Poster's layout depends on and exposes only the props that can vary (`gravity`, `sizes`, `src`, `srcSet`). The image is decorative — Poster is a content-over-background layout — so `alt` is always empty.

Migration:

```ts
// before
renderClbrPoster({
  image: renderClbrImage({
    cover: true,
    priority: true,
    src,
    srcSet,
    sizes,
    gravity,
  }),
});

// after
renderClbrPoster({
  media: renderClbrPosterImage({ src, srcSet, sizes, gravity }),
});
```

The React adapter follows the rename: `<Poster media={...}>` (was `image`).
