// -----------------------------------------------------------------------------
// Component spec schema.
//
// Machine-readable contract that every Calibrate component exports alongside
// its renderer. Drives framework-adapter code generation (React, Vue, Svelte),
// Storybook controls, and documentation tables. The renderer remains the
// frozen oracle — rules here describe what the renderer emits, never redefine
// behavior.
// -----------------------------------------------------------------------------

/** Where a rule applies. */
export type ClbrSpecTarget =
  | { readonly on: "host" }
  | { readonly on: "descendant"; readonly selector: string };

/** Condition under which a rule fires. */
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

/** Machine-readable type of a prop. */
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
      readonly itemShape: Readonly<Record<string, ClbrComponentSpecProp>>;
    }
  | { readonly kind: "iconName" }
  | {
      readonly kind: "union";
      readonly variants: ReadonlyArray<ClbrSpecPropType>;
    };

export interface ClbrComponentSpecProp {
  readonly description: string;
  readonly type: ClbrSpecPropType;
  readonly required?: boolean;
  readonly requiredWhen?: string;
  readonly ignoredWhen?: string;
  readonly default?: unknown;
}

export interface ClbrComponentSpecEvent {
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
 * - `slots`: multiple named content props. Each slot names its prop and kind.
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

export interface ClbrComponentSpec {
  readonly name: string;
  readonly description: string;
  readonly output: ClbrSpecOutput;
  readonly content: ClbrSpecContent;
  readonly props: Readonly<Record<string, ClbrComponentSpecProp>>;
  readonly events: Readonly<Record<string, ClbrComponentSpecEvent>>;
  readonly rules: {
    readonly attributes: ReadonlyArray<ClbrSpecAttributeRule>;
  };
}

// -----------------------------------------------------------------------------
// Rule evaluation.
//
// Pure evaluators for `ClbrSpecCondition` and `ClbrSpecValue` against a props
// object. Used by the testing helper to verify renderers match their declared
// rules, and available to adapters (React etc.) that need to compute attribute
// output from a SPEC without running the renderer.
// -----------------------------------------------------------------------------

type PropBag = Readonly<Record<string, unknown>>;

/** Effective value of a prop: user-supplied value, falling back to SPEC default. */
const effectiveProp = (
  name: string,
  props: PropBag,
  spec: ClbrComponentSpec,
): unknown => {
  const supplied = props[name];
  if (supplied !== undefined) return supplied;
  return spec.props[name]?.default;
};

export const evaluateSpecCondition = (
  condition: ClbrSpecCondition,
  props: PropBag,
  spec: ClbrComponentSpec,
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
 */
export type ResolvedSpecValue =
  | { readonly kind: "present" }
  | { readonly kind: "value"; readonly text: string };

export const resolveSpecValue = (
  value: ClbrSpecValue | undefined,
  props: PropBag,
  spec: ClbrComponentSpec,
): ResolvedSpecValue => {
  if (!value) return { kind: "present" };
  switch (value.kind) {
    case "literal":
      return { kind: "value", text: value.text };
    case "prop": {
      const v = effectiveProp(value.prop, props, spec);
      if (v === true || v === undefined || v === null)
        return { kind: "present" };
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
// Docs + Storybook helpers.
//
// Project spec props into Storybook `argTypes` and Markdown prop/event tables.
// -----------------------------------------------------------------------------

type StoryArgType = Record<string, unknown>;

const summaryTypeFor = (prop: ClbrComponentSpecProp): string => {
  const type = prop.type;
  switch (type.kind) {
    case "enum":
      return type.values
        .map((v) => (typeof v === "string" ? v : String(v)))
        .join(" | ");
    case "union":
      return type.variants
        .map((variant) => summaryTypeFor({ description: "", type: variant }))
        .join(" | ");
    case "number":
      return "number";
    case "array":
      return "array";
    default:
      return type.kind;
  }
};

const controlFor = (
  prop: ClbrComponentSpecProp,
): StoryArgType["control"] | undefined => {
  const type = prop.type;
  if (type.kind === "enum") return { type: "select" };
  switch (type.kind) {
    case "boolean":
      return { type: "boolean" };
    case "number":
      return {
        type: "number",
        ...(type.min !== undefined ? { min: type.min } : {}),
        ...(type.max !== undefined ? { max: type.max } : {}),
      };
    case "array":
      return { type: "object" };
    case "html":
      return false;
    case "iconName":
      return undefined;
    case "union":
      return { type: "text" };
    default:
      return { type: "text" };
  }
};

const optionsFor = (
  prop: ClbrComponentSpecProp,
): ReadonlyArray<string | number> | undefined =>
  prop.type.kind === "enum" ? [...prop.type.values] : undefined;

const summaryDefaultFor = (prop: ClbrComponentSpecProp): string | undefined => {
  if (prop.default === undefined) return undefined;
  if (typeof prop.default === "string") return `"${prop.default}"`;
  return String(prop.default);
};

const composeDescription = (
  prop: ClbrComponentSpecProp,
): string | undefined => {
  const parts: string[] = [];
  if (prop.description) parts.push(prop.description);
  if (prop.requiredWhen) parts.push(`Required when ${prop.requiredWhen}.`);
  if (prop.ignoredWhen) parts.push(`Ignored when ${prop.ignoredWhen}.`);
  return parts.length > 0 ? parts.join("\n\n") : undefined;
};

const eventSummaryType = (event: ClbrComponentSpecEvent): string =>
  event.detail ? `CustomEvent<${event.detail}>` : "CustomEvent";

const composeEventDescription = (
  event: ClbrComponentSpecEvent,
): string | undefined => {
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
    const options = optionsFor(prop);
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

  const eventEntries = Object.entries(spec.events).map(([name, event]) => {
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
  });

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
  const entries = Object.entries(spec.events);
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
