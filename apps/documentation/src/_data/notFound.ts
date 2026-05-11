/**
 * Not-found (404) page content, available as `data.notFound.*`.
 */
export default {
  headline: "404",
  message: "This page could not be found.",
} as const;

export type NotFoundData = typeof import("./notFound").default;
