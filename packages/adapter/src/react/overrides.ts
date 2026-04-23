/**
 * Per-component escape hatches for things the SPEC cannot yet express.
 *
 * Keep this file as small as possible. Each entry is tech debt.
 *
 * TODO(adapter): revisit Button's discriminated prop types. Two paths to
 * consider and pick between:
 *   - Promote `discriminatedProps` into a formal SPEC field on
 *     `ClbrSpecElement.switch` cases (e.g. `cases: { button: { to:
 *     "button", typeSuffix: "Element" } }`).
 *   - Split Button into two distinct components (e.g. Button + ButtonLink)
 *     so each has a single coherent prop type and this override disappears
 *     entirely.
 */

export interface ReactDiscriminatedProps {
  /**
   * For each SPEC switch-case key, the suffix of the per-arm core props
   * type (e.g. `Element` for `ClbrButtonElementProps`) and the DOM
   * interface to use for that arm's native attrs.
   */
  readonly cases: Readonly<
    Record<string, { readonly coreSuffix: string; readonly element: string }>
  >;
}

export interface ReactOverride {
  readonly discriminatedProps?: ReactDiscriminatedProps;
}

export const REACT_OVERRIDES: Readonly<Record<string, ReactOverride>> = {
  button: {
    discriminatedProps: {
      cases: {
        button: { coreSuffix: "Element", element: "HTMLButtonElement" },
        link: { coreSuffix: "Link", element: "HTMLAnchorElement" },
      },
    },
  },
};
