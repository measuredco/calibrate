import fs from "node:fs";
import path from "node:path";
import StyleDictionary from "style-dictionary";

const contextsFile = process.env.TOKENS_CONTEXTS_FILE;
const manifestFile = process.env.TOKENS_MANIFEST_FILE;
const outFile = process.env.TOKENS_CSS_OUT;

if (!contextsFile) {
  throw new Error("Missing TOKENS_CONTEXTS_FILE env var.");
}
if (!manifestFile) {
  throw new Error("Missing TOKENS_MANIFEST_FILE env var.");
}
if (!outFile) {
  throw new Error("Missing TOKENS_CSS_OUT env var.");
}
if (!fs.existsSync(contextsFile)) {
  throw new Error(`Missing contexts token input file: ${contextsFile}`);
}
if (!fs.existsSync(manifestFile)) {
  throw new Error(`Missing manifest input file: ${manifestFile}`);
}

const outDir = path.dirname(outFile).replaceAll(path.sep, "/");
const outName = path.basename(outFile);
const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
const privateLayers = new Set(
  Array.isArray(manifest?.tokenLayers?.private)
    ? manifest.tokenLayers.private
    : [],
);
const cssIncludeLayerRole =
  manifest?.targets?.css?.includeLayerRole ?? "public";
const cssLayer = manifest?.targets?.css?.layer;
const cssLayerOrder = Array.isArray(manifest?.targets?.css?.layerOrder)
  ? manifest.targets.css.layerOrder
  : [];
const TOKEN_PATH = {
  ROOT: 0,
  CONTEXT_ID: 1,
  DOMAIN: 2,
};
const MIN_CONTEXT_TOKEN_PATH = 3;

const toKebab = (segment) =>
  String(segment)
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, "$1-$2")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const namespace =
  typeof manifest?.namespace === "string" &&
  manifest.namespace.trim().length > 0
    ? toKebab(manifest.namespace)
    : "";

const varNameForPath = (pathSegments) => {
  const core = pathSegments.map(toKebab).join("-");
  return namespace ? `--${namespace}-${core}` : `--${core}`;
};

const indent = (text, spaces = 2) => {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => (line.length ? `${pad}${line}` : line))
    .join("\n");
};

const normalizeNumber = (value) => {
  const rounded = Math.round(value * 1000000) / 1000000;

  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded).replace(/\.?0+$/, "");
};

const pxToUnit = (raw, unit) =>
  raw.replace(
    /(-?\d*\.?\d+)px\b/g,
    (_, n) => `${normalizeNumber(Number(n) / 16)}${unit}`,
  );

const formatTokenValueForCss = (token) => {
  const value = token.$value;

  if (value === undefined || value === null) return value;

  const forcedUnit =
    token.original?.$extensions?.["dev.msrd.calibrate.css"]?.unit;

  if (
    typeof value === "number" &&
    typeof forcedUnit === "string" &&
    forcedUnit.length > 0
  ) {
    return `${normalizeNumber(value)}${forcedUnit}`;
  }
  if (typeof value === "string") {
    return pxToUnit(value, "rem");
  }

  return value;
};

const formatMediaConditionForCss = (condition) => {
  if (typeof condition !== "string") return condition;

  return pxToUnit(condition, "em");
};

const wrapMedia = (block, mediaConditions = []) => {
  let out = block;

  for (let i = mediaConditions.length - 1; i >= 0; i -= 1) {
    const cond = formatMediaConditionForCss(mediaConditions[i]);

    out = `@media ${cond} {\n${indent(out, 2)}\n}`;
  }

  return out;
};

const isContextTokenPath = (tokenPath) =>
  Array.isArray(tokenPath) &&
  tokenPath.length >= MIN_CONTEXT_TOKEN_PATH &&
  tokenPath[TOKEN_PATH.ROOT] === "contexts";

const shouldEmitContextToken = (tokenPath) => {
  const layerOrDomain = tokenPath[TOKEN_PATH.DOMAIN];

  if (cssIncludeLayerRole === "public")
    return !privateLayers.has(layerOrDomain);
  if (cssIncludeLayerRole === "private")
    return privateLayers.has(layerOrDomain);

  return true;
};

StyleDictionary.registerFormat({
  name: "css/clbr-contexts",
  format: ({ dictionary }) => {
    const byContext = new Map();

    for (const token of dictionary.allTokens) {
      if (!isContextTokenPath(token.path)) continue;
      if (!shouldEmitContextToken(token.path)) continue;

      const ctxId = token.path[TOKEN_PATH.CONTEXT_ID];
      const varPath = token.path
        .slice(TOKEN_PATH.DOMAIN)
        .map(toKebab)
        .join("-");
      const description = token.original?.$description;
      const value = formatTokenValueForCss(token);

      if (value === undefined) continue;

      const comment =
        typeof description === "string" && description.length > 0
          ? ` /** ${description} */`
          : "";
      const declaration = `${varNameForPath(token.path.slice(TOKEN_PATH.DOMAIN))}: ${value};${comment}`;

      if (!byContext.has(ctxId)) byContext.set(ctxId, []);

      byContext.get(ctxId).push({ key: varPath, declaration });
    }

    const blocks = [];

    for (const block of manifest.blocks || []) {
      const items = byContext.get(block.id) || [];

      if (items.length === 0) continue;

      items.sort((a, b) => a.key.localeCompare(b.key));

      const declarations = items.map((item) => item.declaration).join("\n");
      const wrapped = `${block.selector} {\n${indent(declarations, 2)}\n}`;
      const withMedia = wrapMedia(
        wrapped,
        Array.isArray(block.media) ? block.media : [],
      );

      blocks.push(`/* ${block.comment} */\n${withMedia}`);
    }

    const sourceLine = manifest.source
      ? ` * Source: ${manifest.source} + context manifest.\n`
      : "";

    const content = blocks.join("\n\n");
    const layerOrderDecl =
      cssLayerOrder.length > 0 ? `@layer ${cssLayerOrder.join(", ")};\n\n` : "";
    const layeredContent =
      typeof cssLayer === "string" && cssLayer.length > 0
        ? `@layer ${cssLayer} {\n${indent(content, 2)}\n}\n`
        : `${content}\n`;

    return `/**\n * Do not edit directly, this file was auto-generated.\n${sourceLine} */\n\n${layerOrderDecl}${layeredContent}`;
  },
});

export default {
  source: [contextsFile],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: `${outDir}/`,
      files: [
        {
          destination: outName,
          format: "css/clbr-contexts",
        },
      ],
    },
  },
};
