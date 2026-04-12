import { attrs } from "../../helpers/html";

export type ClbrImageAspectRatio = "1:1" | "4:5" | "3:2" | "16:9" | "21:9";
export type ClbrImageGravity =
  | "N"
  | "NE"
  | "E"
  | "SE"
  | "S"
  | "SW"
  | "W"
  | "NW"
  | "C";
export type ClbrImageRadius = "xs" | "ratio";

export interface ClbrImageSource {
  /**
   * The intrinsic height of the source, in pixels.
   */
  height?: number;
  /**
   * Media condition that is evaluated for the source.
   * Same format as the HTML `source[media]` attribute.
   */
  media?: string;
  /**
   * The HTML `sizes` attribute for the source.
   */
  sizes?: string;
  /**
   * A comma-separated list of candidate image sources.
   * Same format as the HTML `source[srcset]` attribute.
   */
  srcSet: string;
  /**
   * MIME type for the `srcSet` resources.
   */
  type?: string;
  /**
   * The intrinsic width of the source, in pixels.
   */
  width?: number;
}

/** Props for the Calibrate image renderer. */
export interface ClbrImageProps {
  /**
   * Alternative text for the image. Empty string is valid and used by default.
   * @default ""
   */
  alt?: string;
  /**
   * Optional aspect ratio for the image wrapper.
   * Applies only when `cover` is true, and is omitted when both `height` and
   * `width` are also provided.
   */
  aspectRatio?: ClbrImageAspectRatio;
  /**
   * Optional `object-fit: cover` mode.
   * @default false
   */
  cover?: boolean;
  /**
   * Enables default image shadow treatment.
   * @default false
   */
  shadow?: boolean;
  /**
   * Height dimension in pixels.
   * For `cover`, this is applied to the wrapper. When `cover` is true and both
   * `height` and `width` are provided, `aspectRatio` is ignored.
   */
  height?: number;
  /**
   * When true, emit `loading="lazy"` on the image.
   * @default false
   */
  lazy?: boolean;
  /**
   * When true, emit `fetchpriority="high"` and suppress `loading="lazy"`.
   * @default false
   */
  priority?: boolean;
  /**
   * Focal gravity for cover fit.
   * @default "C"
   */
  gravity?: ClbrImageGravity;
  /**
   * Radius strategy.
   * Omitted by default.
   */
  radius?: ClbrImageRadius;
  /**
   * The HTML `sizes` attribute.
   * Ignored on `<img>` when `sources` are provided.
   */
  sizes?: string;
  /**
   * Optional responsive source set definitions for `<picture>`.
   */
  sources?: ClbrImageSource[];
  /**
   * A comma-separated list of candidate sources for the fallback `<img>`.
   * Same format as the HTML `img[srcset]` attribute.
   */
  srcSet?: string;
  /**
   * Image source URL.
   */
  src: string;
  /**
   * Width dimension in pixels.
   * For `cover`, this is applied to the wrapper. When `cover` is true and both
   * `width` and `height` are provided, `aspectRatio` is ignored.
   */
  width?: number;
}

/**
 * SSR renderer for the Calibrate image component.
 *
 * @param props - Image component props.
 * @returns HTML string for image/picture markup.
 */
export function renderClbrImage({
  alt = "",
  aspectRatio,
  cover,
  gravity = "C",
  height,
  lazy,
  priority,
  radius,
  shadow,
  sizes,
  sources,
  src,
  srcSet,
  width,
}: ClbrImageProps): string {
  const normalizedSrc = src.trim();
  const normalizedSrcSet = srcSet?.trim();
  const normalizedSizes = sizes?.trim();
  const normalizedSources =
    sources?.map((source, index) => {
      const normalizedSrcSet = source.srcSet.trim();
      const normalizedMedia = source.media?.trim();
      const normalizedType = source.type?.trim();
      const normalizedSourceSizes = source.sizes?.trim();

      if (!normalizedSrcSet) {
        throw new Error(`sources[${index}].srcSet must be non-empty.`);
      }

      return {
        height: source.height,
        media: normalizedMedia || undefined,
        sizes: normalizedSourceSizes || undefined,
        srcSet: normalizedSrcSet,
        type: normalizedType || undefined,
        width: source.width,
      };
    }) || [];

  if (!normalizedSrc) {
    throw new Error("src must be a non-empty string.");
  }

  const imgAttrs = attrs({
    alt,
    class: "img",
    fetchpriority: priority ? "high" : undefined,
    height: cover ? undefined : height ? String(height) : undefined,
    loading: lazy && !priority ? "lazy" : undefined,
    sizes:
      normalizedSources.length > 0 ? undefined : normalizedSizes || undefined,
    src: normalizedSrc,
    srcset: normalizedSrcSet || undefined,
    width: cover ? undefined : width ? String(width) : undefined,
  });

  const sourcesMarkup = normalizedSources
    .map((source) => {
      const sourceAttrs = attrs({
        height: source.height ? String(source.height) : undefined,
        media: source.media,
        sizes: source.sizes,
        srcset: source.srcSet,
        type: source.type,
        width: source.width ? String(source.width) : undefined,
      });

      return `<source ${sourceAttrs}>`;
    })
    .join("");

  const imageMarkup =
    normalizedSources.length > 0
      ? `<picture>${sourcesMarkup}<img ${imgAttrs}></picture>`
      : `<img ${imgAttrs}>`;

  const styleChunks: string[] = [];

  if (height) styleChunks.push(`--clbr-image-block-size: ${height / 16}rem`);
  if (width) styleChunks.push(`--clbr-image-inline-size: ${width / 16}rem`);

  const wrapperAttrs = attrs({
    class: "image",
    "data-aspect-ratio": cover && !(height && width) ? aspectRatio : undefined,
    "data-gravity": cover && gravity !== "C" ? gravity : undefined,
    "data-shadow": Boolean(shadow),
    "data-object-fit": cover ? "cover" : undefined,
    "data-radius": radius,
    style: styleChunks.length > 0 ? styleChunks.join("; ") : undefined,
  });

  return `<div ${wrapperAttrs}>${imageMarkup}</div>`;
}

/** Declarative image contract mirror for tooling, docs, and adapters. */
export const CLBR_IMAGE_SPEC = {
  name: "image",
  output: {
    modes: {
      image: "img",
      picture: "picture + source[] + img",
    },
    wrapper: "div.image",
  },
  props: {
    alt: {
      default: "",
      required: false,
      type: "string",
    },
    gravity: {
      default: "C",
      required: false,
      type: "enum",
      values: ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "C"],
    },
    radius: {
      required: false,
      type: "enum",
      values: ["xs", "ratio"],
    },
    aspectRatio: {
      required: false,
      type: "enum",
      values: ["1:1", "4:5", "3:2", "16:9", "21:9"],
    },
    cover: {
      default: false,
      required: false,
      type: "boolean",
    },
    shadow: {
      default: false,
      required: false,
      type: "boolean",
    },
    height: {
      required: false,
      type: "number",
    },
    lazy: {
      default: false,
      required: false,
      type: "boolean",
    },
    priority: {
      default: false,
      required: false,
      type: "boolean",
    },
    sizes: {
      required: false,
      type: "string",
    },
    sources: {
      required: false,
      type: "array",
    },
    srcSet: {
      required: false,
      type: "string",
    },
    src: {
      constraints: ["non-empty"],
      required: true,
      type: "string",
    },
    width: {
      required: false,
      type: "number",
    },
  },
  rules: {
    attributes: [
      {
        behavior: "always",
        target: "div[class]",
        value: "image",
      },
      {
        behavior: "emit",
        target: "div[data-object-fit]",
        value: "cover",
        when: "cover is true",
      },
      {
        behavior: "emit",
        target: "div[data-shadow]",
        when: "shadow is true",
      },
      {
        behavior: "emit",
        target: "div[data-gravity]",
        value: "{gravity}",
        when: "cover is true and gravity is not C",
      },
      {
        behavior: "emit",
        target: "div[data-radius]",
        value: "{radius}",
        when: "radius is xs or ratio",
      },
      {
        behavior: "emit",
        target: "div[data-aspect-ratio]",
        value: "{aspectRatio}",
        when: "cover is true and aspectRatio is provided and not both width and height are provided",
      },
      {
        behavior: "always",
        target: "img[alt]",
        value: "{alt or ''}",
      },
      {
        behavior: "always",
        target: "img[src]",
        value: "{src}",
      },
      {
        behavior: "emit",
        target: "img[srcset]",
        value: "{srcSet}",
        when: "srcSet is provided",
      },
      {
        behavior: "emit",
        target: "img[loading]",
        value: "lazy",
        when: "lazy is true and priority is false",
      },
      {
        behavior: "emit",
        target: "img[fetchpriority]",
        value: "high",
        when: "priority is true",
      },
      {
        behavior: "emit",
        target: "img[sizes]",
        value: "{sizes}",
        when: "sizes is provided and sources are omitted",
      },
      {
        behavior: "emit",
        target: "img[width], img[height]",
        value: "{width}/{height}",
        when: "cover is false and width/height are provided",
      },
      {
        behavior: "emit",
        target: "source[srcset]",
        value: "{sources[].srcSet}",
        when: "sources are provided",
      },
      {
        behavior: "emit",
        target: "source[media]",
        value: "{sources[].media}",
        when: "sources[].media is provided",
      },
      {
        behavior: "emit",
        target: "source[sizes]",
        value: "{sources[].sizes}",
        when: "sources[].sizes is provided",
      },
      {
        behavior: "emit",
        target: "source[type]",
        value: "{sources[].type}",
        when: "sources[].type is provided",
      },
      {
        behavior: "emit",
        target: "source[width], source[height]",
        value: "{sources[].width}/{sources[].height}",
        when: "sources[].width or sources[].height is provided",
      },
    ],
  },
} as const;
