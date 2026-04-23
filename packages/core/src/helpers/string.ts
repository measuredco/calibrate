/** Validates whether a string is a safe HTML id token. */
export function isValidHtmlId(value: string): boolean {
  return /^[A-Za-z][\w:-]*$/.test(value);
}

/** Trims and collapses internal whitespace; returns `undefined` for empty input. */
export function collapseWhitespace(
  value: string | undefined,
): string | undefined {
  if (value == null) return undefined;

  const normalized = value.trim().replace(/\s+/g, " ");

  return normalized || undefined;
}
