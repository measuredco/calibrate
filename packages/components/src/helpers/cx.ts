/**
 * Joins class-like string parts while dropping falsey entries.
 */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
