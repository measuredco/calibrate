import { describe, expect, it } from "vitest";
import type { ClbrComponentSpec } from "../helpers/spec";

export interface SpecConsistencyConfig<Props> {
  readonly spec: ClbrComponentSpec;
  readonly renderer: (props: Props) => string;
  readonly baseProps: Props;
  /**
   * Extra props to merge when probing a specific prop, to satisfy cross-prop
   * constraints declared in the SPEC (for example a `requiredWhen` partner).
   * Keyed by the prop being probed.
   */
  readonly propOverrides?: Readonly<Record<string, Partial<Props>>>;
}

export function describeSpecConsistency<Props extends object>(
  config: SpecConsistencyConfig<Props>,
): void {
  const { spec, renderer, baseProps, propOverrides = {} } = config;

  describe(`${spec.name} SPEC consistency`, () => {
    for (const [name, prop] of Object.entries(spec.props)) {
      const overrides = propOverrides[name] ?? {};

      it(`declares a non-empty description for "${name}"`, () => {
        expect(prop.description?.trim()).toBeTruthy();
      });

      if (prop.default !== undefined) {
        it(`renderer default for "${name}" matches SPEC-declared default`, () => {
          const base = { ...baseProps, ...overrides };
          delete (base as Record<string, unknown>)[name];

          const omitted = renderer(base as Props);
          const explicit = renderer({
            ...base,
            [name]: prop.default,
          } as Props);

          expect(omitted).toBe(explicit);
        });
      }

      if (prop.values && prop.values.length > 0) {
        for (const value of prop.values) {
          it(`renders without throwing when "${name}" is ${JSON.stringify(value)}`, () => {
            expect(() =>
              renderer({ ...baseProps, ...overrides, [name]: value } as Props),
            ).not.toThrow();
          });
        }
      }
    }

    for (const [name, event] of Object.entries(spec.events ?? {})) {
      it(`declares a non-empty description for event "${name}"`, () => {
        expect(event.description?.trim()).toBeTruthy();
      });

      it(`uses the clbr- prefix for event "${name}"`, () => {
        expect(name.startsWith("clbr-")).toBe(true);
      });
    }
  });
}
