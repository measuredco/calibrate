/**
 * Serializes an attribute record into an HTML attribute string.
 *
 * - `false`, `null`, and `undefined` are omitted
 * - `true` emits a valueless boolean attribute
 * - string values are HTML-escaped
 */
export function attrs(
  record: Record<string, string | boolean | undefined>,
): string {
  return Object.entries(record)
    .flatMap(([key, value]) => {
      if (value === false || value == null) return [];
      if (value === true) return [key];
      return [`${key}="${escapeHtml(String(value))}"`];
    })
    .join(" ");
}

/**
 * Escapes text for safe HTML text/attribute interpolation.
 */
export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
