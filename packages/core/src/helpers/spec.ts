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
    }
  | { readonly kind: "all"; readonly of: ReadonlyArray<ClbrSpecCondition> }
  | { readonly kind: "any"; readonly of: ReadonlyArray<ClbrSpecCondition> }
  | { readonly kind: "not"; readonly of: ClbrSpecCondition };

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
  | { readonly kind: "iconName" }
  | {
      readonly kind: "union";
      readonly variants: ReadonlyArray<ClbrSpecPropType>;
    };

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

/**
 * Host element identity. A plain string names a fixed element; the object form
 * switches the element tag by the value of a discriminant prop (e.g. `button`
 * renders as `<button>` or `<a>` depending on `mode`).
 */
export type ClbrSpecElement =
  | string
  | {
      readonly kind: "switch";
      readonly prop: string;
      readonly cases: Readonly<Record<string, string>>;
    };

/** Host element identity. `class` is the always-emit host class, if any. */
export interface ClbrSpecOutput {
  readonly element: ClbrSpecElement;
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

// -----------------------------------------------------------------------------
// Structured rule evaluation.
//
// Pure evaluators for `ClbrSpecCondition` and `ClbrSpecValue` against a props
// object. Used by the testing helper to verify renderers match their declared
// structured rules, and available to adapters (React etc.) that need to
// compute attribute output from a SPEC without running the renderer.
// -----------------------------------------------------------------------------

type PropBag = Readonly<Record<string, unknown>>;

/** Effective value of a prop: user-supplied value, falling back to SPEC default. */
const effectiveProp = (
  name: string,
  props: PropBag,
  spec: ClbrStructuredSpec,
): unknown => {
  const supplied = props[name];
  if (supplied !== undefined) return supplied;
  return spec.props[name]?.default;
};

export const evaluateSpecCondition = (
  condition: ClbrSpecCondition,
  props: PropBag,
  spec: ClbrStructuredSpec,
): boolean => {
  switch (condition.kind) {
    case "always":
      return true;
    case "when-provided":
      return props[condition.prop] !== undefined;
    case "when-non-empty": {
      const value = effectiveProp(condition.prop, props, spec);
      return value !== undefined && value !== null && value !== "";
    }
    case "when-truthy":
      return Boolean(effectiveProp(condition.prop, props, spec));
    case "when-equals":
      return effectiveProp(condition.prop, props, spec) === condition.to;
    case "when-in": {
      const value = effectiveProp(condition.prop, props, spec);
      return condition.values.some((v) => v === value);
    }
    case "when-not-in": {
      const value = effectiveProp(condition.prop, props, spec);
      return !condition.values.some((v) => v === value);
    }
    case "all":
      return condition.of.every((c) => evaluateSpecCondition(c, props, spec));
    case "any":
      return condition.of.some((c) => evaluateSpecCondition(c, props, spec));
    case "not":
      return !evaluateSpecCondition(condition.of, props, spec);
  }
};

/**
 * Resolved expected attribute output.
 * - `"present"`: attribute is emitted without a value (boolean attribute)
 * - string: attribute is emitted with that exact value
 * - `"absent"`: attribute is not emitted (caller should typically skip this;
 *   callers derive absence from `evaluateSpecCondition` returning false)
 */
export type ResolvedSpecValue =
  | { readonly kind: "present" }
  | { readonly kind: "value"; readonly text: string };

export const resolveSpecValue = (
  value: ClbrSpecValue | undefined,
  props: PropBag,
  spec: ClbrStructuredSpec,
): ResolvedSpecValue => {
  if (!value) return { kind: "present" };
  switch (value.kind) {
    case "literal":
      return { kind: "value", text: value.text };
    case "prop": {
      const v = effectiveProp(value.prop, props, spec);
      if (v === true || v === undefined || v === null) return { kind: "present" };
      return { kind: "value", text: String(v) };
    }
    case "template": {
      const text = value.pattern.replace(/\{(\w+)\}/g, (_, name: string) => {
        const v = effectiveProp(name, props, spec);
        return v === undefined || v === null ? "" : String(v);
      });
      return { kind: "value", text };
    }
  }
};

/** Collect every prop name referenced by a condition subtree. */
export const collectConditionProps = (
  condition: ClbrSpecCondition,
): ReadonlyArray<string> => {
  const out = new Set<string>();
  const walk = (c: ClbrSpecCondition): void => {
    switch (c.kind) {
      case "always":
        return;
      case "all":
      case "any":
        c.of.forEach(walk);
        return;
      case "not":
        walk(c.of);
        return;
      default:
        out.add(c.prop);
    }
  };
  walk(condition);
  return [...out];
};

/** Collect every prop name referenced by a value expression. */
export const collectValueProps = (
  value: ClbrSpecValue | undefined,
): ReadonlyArray<string> => {
  if (!value) return [];
  switch (value.kind) {
    case "literal":
      return [];
    case "prop":
      return [value.prop];
    case "template": {
      const names = [...value.pattern.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
      return [...new Set(names)];
    }
  }
};

// -----------------------------------------------------------------------------
// Structured → legacy adapter.
//
// Temporary: lets the existing tooling helpers (argTypes, prop/event tables,
// docs descriptions) and the test consistency helper keep operating during the
// per-component migration. Removed once every component is on the structured
// shape and those helpers target structured directly.
// -----------------------------------------------------------------------------

const legacyPropType = (
  type: ClbrSpecPropType,
): { type: string; values?: ReadonlyArray<string | number>; constraints?: string[] } => {
  switch (type.kind) {
    case "string":
      return { type: "string" };
    case "text":
      return { type: "text" };
    case "html":
      return { type: "html" };
    case "boolean":
      return { type: "boolean" };
    case "number": {
      const constraints: string[] = [];
      if (type.min !== undefined) constraints.push(`min:${type.min}`);
      if (type.max !== undefined) constraints.push(`max:${type.max}`);
      if (type.integer) constraints.push("integer");
      return {
        type: "number",
        ...(constraints.length > 0 ? { constraints } : {}),
      };
    }
    case "enum":
      return { type: "enum", values: type.values };
    case "array":
      return { type: "array" };
    case "iconName":
      return { type: "iconName" };
    case "union":
      return {
        type: type.variants.map((variant) => legacyPropType(variant).type).join("|"),
      };
  }
};

const isStructuredSpec = (
  spec: ClbrComponentSpec | ClbrStructuredSpec,
): spec is ClbrStructuredSpec => "content" in spec;

export const structuredSpecToLegacy = (
  spec: ClbrStructuredSpec,
): ClbrComponentSpec => {
  const props: Record<string, ClbrSpecProp> = {};
  for (const [name, prop] of Object.entries(spec.props)) {
    const { type, values, constraints } = legacyPropType(prop.type);
    props[name] = {
      description: prop.description,
      type,
      ...(values ? { values } : {}),
      ...(constraints ? { constraints } : {}),
      ...(prop.required ? { required: prop.required } : {}),
      ...(prop.requiredWhen ? { requiredWhen: prop.requiredWhen } : {}),
      ...(prop.ignoredWhen ? { ignoredWhen: prop.ignoredWhen } : {}),
      ...(prop.default !== undefined ? { default: prop.default } : {}),
    };
  }

  const events: Record<string, ClbrSpecEvent> = {};
  for (const [name, event] of Object.entries(spec.events)) {
    events[name] = {
      description: event.description,
      ...(event.bubbles ? { bubbles: event.bubbles } : {}),
      ...(event.cancelable ? { cancelable: event.cancelable } : {}),
      ...(event.detail ? { detail: event.detail } : {}),
    };
  }

  return {
    name: spec.name,
    description: spec.description,
    props,
    ...(Object.keys(events).length > 0 ? { events } : {}),
  };
};

const asLegacy = (
  spec: ClbrComponentSpec | ClbrStructuredSpec,
): ClbrComponentSpec =>
  isStructuredSpec(spec) ? structuredSpecToLegacy(spec) : spec;

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
  spec: ClbrComponentSpec | ClbrStructuredSpec,
): Record<string, StoryArgType> => {
  const legacy = asLegacy(spec);
  const propEntries = Object.entries(legacy.props).map(([name, prop]) => {
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

  const eventEntries = Object.entries(legacy.events ?? {}).map(
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
  spec: ClbrComponentSpec | ClbrStructuredSpec,
): string | undefined => spec.description;

const escapeCell = (value: string): string =>
  value.replace(/\|/g, "\\|").replace(/\n+/g, " ");

export const specToPropsTable = (
  spec: ClbrComponentSpec | ClbrStructuredSpec,
): string => {
  const legacy = asLegacy(spec);
  const rows = Object.entries(legacy.props).map(([name, prop]) => {
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
  spec: ClbrComponentSpec | ClbrStructuredSpec,
): string | undefined => {
  const legacy = asLegacy(spec);
  const entries = Object.entries(legacy.events ?? {});
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
