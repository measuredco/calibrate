export function collapseWhitespace(
  value: string | undefined,
): string | undefined {
  if (value == null) return undefined;

  const normalized = value.trim().replace(/\s+/g, " ");

  return normalized || undefined;
}
