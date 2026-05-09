export default class RedirectRoot {
  data() {
    return {
      permalink: "/index.html",
      eleventyExcludeFromCollections: true,
    };
  }

  render(): string {
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=/next/">
<link rel="canonical" href="/next/">
<title>Calibrate</title>
</head>
<body>
<p>Redirecting to <a href="/next/">/next/</a>…</p>
</body>
</html>`;
  }
}
