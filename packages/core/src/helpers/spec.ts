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

export interface ClbrSpecEvent {
  readonly bubbles?: boolean;
  readonly cancelable?: boolean;
  readonly description?: string;
  readonly detail?: string;
}

export interface ClbrComponentSpec {
  readonly name: string;
  readonly description?: string;
  readonly props: Readonly<Record<string, ClbrSpecProp>>;
  readonly events?: Readonly<Record<string, ClbrSpecEvent>>;
}

// -----------------------------------------------------------------------------
// Structured spec schema (target contract).
//
// The shape below is the destination for the framework-adapter work tracked in
// `docs/PLANNING.md`. Components migrate from `ClbrComponentSpec` to
// `ClbrStructuredSpec` incrementally; once every component is migrated, the
// legacy shape above is removed and `ClbrStructuredSpec` assumes the canonical
// `ClbrComponentSpec` name.
//
// Invariants:
// - Every structured spec declares `output`, `content`, `events` (possibly
//   empty), and `rules.attributes` (possibly empty).
// - Prop-level prose (`description`, `requiredWhen`, `ignoredWhen`) is the
//   canonical source for human-readable docs; structured `rules` target
//   machines. The two coexist.
// - Attribute rules describe what the renderer and custom element emit; they
//   never redefine behavior. The renderer/CE remain the frozen oracle.
// -----------------------------------------------------------------------------

/** Where a structured rule applies. */
export type ClbrSpecTarget =
  | { readonly on: "host" }
  | { readonly on: "descendant"; readonly selector: string };

/** Condition under which a structured rule fires. */
export type ClbrSpecCondition =
  | { readonly kind: "always" }
  | { readonly kind: "when-provided"; readonly prop: string }
  | { readonly kind: "when-non-empty"; readonly prop: string }
  | { readonly kind: "when-truthy"; readonly prop: string }
  | {
      readonly kind: "when-equals";
      readonly prop: string;
      readonly to: string | number | boolean;
    }
  | {
      readonly kind: "when-in";
      readonly prop: string;
      readonly values: ReadonlyArray<string | number | boolean>;
    }
  | {
      readonly kind: "when-not-in";
      readonly prop: string;
      readonly values: ReadonlyArray<string | number | boolean>;
    };

/** Value expression for an emitted attribute. Omit to mean presence-only. */
export type ClbrSpecValue =
  | { readonly kind: "literal"; readonly text: string }
  | { readonly kind: "prop"; readonly prop: string }
  | { readonly kind: "template"; readonly pattern: string };

/** Single attribute-emission rule on the host or a structural descendant. */
export interface ClbrSpecAttributeRule {
  readonly target: ClbrSpecTarget;
  readonly attribute: string;
  readonly condition: ClbrSpecCondition;
  readonly value?: ClbrSpecValue;
}

/**
 * Machine-readable type of a structured prop. Narrows what today's free-form
 * `type: string` + `constraints: string[]` carry, so adapters and validators
 * can reason about prop shape without prose parsing.
 */
export type ClbrSpecPropType =
  | { readonly kind: "string" }
  | { readonly kind: "text" }
  | { readonly kind: "html" }
  | { readonly kind: "boolean" }
  | {
      readonly kind: "number";
      readonly min?: number;
      readonly max?: number;
      readonly integer?: boolean;
    }
  | {
      readonly kind: "enum";
      readonly values: ReadonlyArray<string | number>;
    }
  | {
      readonly kind: "array";
      readonly itemShape: Readonly<Record<string, ClbrStructuredSpecProp>>;
    }
  | { readonly kind: "iconName" };

export interface ClbrStructuredSpecProp {
  readonly description: string;
  readonly type: ClbrSpecPropType;
  readonly required?: boolean;
  readonly requiredWhen?: string;
  readonly ignoredWhen?: string;
  readonly default?: unknown;
}

export interface ClbrStructuredSpecEvent {
  readonly description: string;
  readonly bubbles?: boolean;
  readonly cancelable?: boolean;
  readonly detail?: string;
}

/** Host element identity. `class` is the always-emit host class, if any. */
export interface ClbrSpecOutput {
  readonly element: string;
  readonly class?: string;
}

/**
 * How the component accepts content.
 *
 * - `none`: component emits no user-supplied content.
 * - `text`: single slot of escaped plain text, named by `prop`.
 * - `html`: single slot of trusted HTML string, named by `prop`.
 * - `structured`: typed record array, named by `prop`; item shape lives on
 *   that prop's `ClbrSpecPropType` (`kind: "array"`).
 * - `slots`: multiple named content props (e.g. sidebar header/children/footer,
 *   card title/description/note). Each slot names its prop and kind.
 */
export type ClbrSpecContent =
  | { readonly kind: "none" }
  | { readonly kind: "text"; readonly prop: string }
  | { readonly kind: "html"; readonly prop: string }
  | { readonly kind: "structured"; readonly prop: string }
  | {
      readonly kind: "slots";
      readonly slots: ReadonlyArray<{
        readonly prop: string;
        readonly kind: "text" | "html";
      }>;
    };

/** The target structured contract for every component. */
export interface ClbrStructuredSpec {
  readonly name: string;
  readonly description: string;
  readonly output: ClbrSpecOutput;
  readonly content: ClbrSpecContent;
  readonly props: Readonly<Record<string, ClbrStructuredSpecProp>>;
  readonly events: Readonly<Record<string, ClbrStructuredSpecEvent>>;
  readonly rules: {
    readonly attributes: ReadonlyArray<ClbrSpecAttributeRule>;
  };
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

const controlFor = (
  prop: ClbrSpecProp,
): StoryArgType["control"] | undefined => {
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
    ? prop.values
        .map((v) => (typeof v === "string" ? v : String(v)))
        .join(" | ")
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

const eventSummaryType = (event: ClbrSpecEvent): string =>
  event.detail ? `CustomEvent<${event.detail}>` : "CustomEvent";

const composeEventDescription = (event: ClbrSpecEvent): string | undefined => {
  const parts: string[] = [];
  if (event.description) parts.push(event.description);
  const traits: string[] = [];
  if (event.bubbles) traits.push("bubbles");
  if (event.cancelable) traits.push("cancelable");
  if (traits.length > 0) parts.push(`Event ${traits.join(", ")}.`);
  return parts.length > 0 ? parts.join("\n\n") : undefined;
};

export const specToArgTypes = (
  spec: ClbrComponentSpec,
): Record<string, StoryArgType> => {
  const propEntries = Object.entries(spec.props).map(([name, prop]) => {
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
    ] as const;
  });

  const eventEntries = Object.entries(spec.events ?? {}).map(
    ([name, event]) => {
      const description = composeEventDescription(event);
      return [
        name,
        {
          action: name,
          control: false,
          ...(description ? { description } : {}),
          table: {
            category: "events",
            type: { summary: eventSummaryType(event) },
          },
        },
      ] as const;
    },
  );

  return Object.fromEntries([...propEntries, ...eventEntries]);
};

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

export const specToEventsTable = (
  spec: ClbrComponentSpec,
): string | undefined => {
  const entries = Object.entries(spec.events ?? {});
  if (entries.length === 0) return undefined;

  const rows = entries.map(([name, event]) => {
    const description = composeEventDescription(event) ?? "";
    const type = `\`${escapeCell(eventSummaryType(event))}\``;
    const descriptionCell = description
      ? `${escapeCell(description)}<br>${type}`
      : type;
    return `| \`${name}\` | ${descriptionCell} |`;
  });

  return ["| Name | Description |", "| --- | --- |", ...rows].join("\n");
};
