export interface ClbrSpecProp {
  readonly constraints?: ReadonlyArray<string>;
  readonly default?: unknown;
  readonly description?: string;
  readonly ignoredWhen?: string;
  readonly required?: boolean;
  readonly requiredWhen?: string;
  readonly type: string;
  readonly values?: ReadonlyArray<string | number>;
}

export interface ClbrComponentSpec {
  readonly name: string;
  readonly description?: string;
  readonly props: Readonly<Record<string, ClbrSpecProp>>;
}

type StoryArgType = Record<string, unknown>;

const numericConstraint = (
  constraints: ReadonlyArray<string> | undefined,
  key: "min" | "max",
): number | undefined => {
  const prefix = `${key}:`;
  const match = constraints?.find((entry) => entry.startsWith(prefix));
  if (!match) return undefined;
  const value = Number(match.slice(prefix.length));
  return Number.isFinite(value) ? value : undefined;
};

const controlFor = (prop: ClbrSpecProp): StoryArgType["control"] | undefined => {
  if (prop.values && prop.values.length > 0) return { type: "select" };
  switch (prop.type) {
    case "boolean":
      return { type: "boolean" };
    case "number": {
      const min = numericConstraint(prop.constraints, "min");
      const max = numericConstraint(prop.constraints, "max");
      return {
        type: "number",
        ...(min !== undefined ? { min } : {}),
        ...(max !== undefined ? { max } : {}),
      };
    }
    case "array":
    case "object":
      return { type: "object" };
    case "html":
      return false;
    case "iconName":
      return undefined;
    default:
      return { type: "text" };
  }
};

const summaryTypeFor = (prop: ClbrSpecProp): string =>
  prop.values && prop.values.length > 0
    ? prop.values.map((v) => (typeof v === "string" ? v : String(v))).join(" | ")
    : prop.type;

const summaryDefaultFor = (prop: ClbrSpecProp): string | undefined => {
  if (prop.default === undefined) return undefined;
  if (typeof prop.default === "string") return `"${prop.default}"`;
  return String(prop.default);
};

const composeDescription = (prop: ClbrSpecProp): string | undefined => {
  const parts: string[] = [];
  if (prop.description) parts.push(prop.description);
  if (prop.requiredWhen) parts.push(`Required when ${prop.requiredWhen}.`);
  if (prop.ignoredWhen) parts.push(`Ignored when ${prop.ignoredWhen}.`);
  return parts.length > 0 ? parts.join("\n\n") : undefined;
};

export const specToArgTypes = (
  spec: ClbrComponentSpec,
): Record<string, StoryArgType> =>
  Object.fromEntries(
    Object.entries(spec.props).map(([name, prop]) => {
      const control = controlFor(prop);
      const options = prop.values ? [...prop.values] : undefined;
      const description = composeDescription(prop);
      const summaryDefault = summaryDefaultFor(prop);
      return [
        name,
        {
          ...(control !== undefined ? { control } : {}),
          ...(options ? { options } : {}),
          ...(description ? { description } : {}),
          ...(prop.required ? { type: { required: true } } : {}),
          table: {
            type: { summary: summaryTypeFor(prop) },
            ...(summaryDefault
              ? { defaultValue: { summary: summaryDefault } }
              : {}),
          },
        },
      ];
    }),
  );

export const specToComponentDescription = (
  spec: ClbrComponentSpec,
): string | undefined => spec.description;

const escapeCell = (value: string): string =>
  value.replace(/\|/g, "\\|").replace(/\n+/g, " ");

export const specToPropsTable = (spec: ClbrComponentSpec): string => {
  const rows = Object.entries(spec.props).map(([name, prop]) => {
    const label = prop.required ? `\`${name}\`*` : `\`${name}\``;
    const defaultValue = summaryDefaultFor(prop) ?? "-";
    const description = composeDescription(prop) ?? "";
    const type = `\`${escapeCell(summaryTypeFor(prop))}\``;
    const descriptionCell = description
      ? `${escapeCell(description)}<br>${type}`
      : type;
    return `| ${label} | ${descriptionCell} | ${escapeCell(defaultValue)} |`;
  });

  return [
    "| Name | Description | Default |",
    "| --- | --- | --- |",
    ...rows,
  ].join("\n");
};
