import {
  specToArgTypes,
  specToComponentDescription,
  specToPropsTable,
} from "../../helpers/spec";
import { CLBR_ICON_RECOMMENDED } from "../icon/icon";
import { renderClbrInline } from "../inline/inline";
import {
  CLBR_BUTTON_SPEC,
  type ClbrButtonElementProps,
  type ClbrButtonLinkProps,
  renderClbrButton,
} from "./button";

const baseArgTypes = specToArgTypes(CLBR_BUTTON_SPEC);

const iconArgType = {
  ...baseArgTypes.icon,
  control: { type: "select" as const },
  options: [undefined, ...CLBR_ICON_RECOMMENDED],
};

const hideControls = (...names: string[]): Record<string, unknown> =>
  Object.fromEntries(
    names.map((name) => [
      name,
      { ...baseArgTypes[name], control: false, table: { disable: true } },
    ]),
  );

const buttonArgTypes = {
  ...baseArgTypes,
  icon: iconArgType,
  ...hideControls("download", "href", "rel", "target"),
  mode: { ...baseArgTypes.mode, control: false },
};

const linkPropsTable = specToPropsTable({
  ...CLBR_BUTTON_SPEC,
  props: {
    href: CLBR_BUTTON_SPEC.props.href,
    download: CLBR_BUTTON_SPEC.props.download,
    rel: CLBR_BUTTON_SPEC.props.rel,
    target: CLBR_BUTTON_SPEC.props.target,
  },
});

const meta = {
  argTypes: buttonArgTypes,
  parameters: {
    docs: {
      description: {
        component: [
          specToComponentDescription(CLBR_BUTTON_SPEC),
          `Docs controls drive \`mode="button"\` in the primary story. See \`Link\` story below for \`mode="link"\` variant and its additional props.`,
        ]
          .filter(Boolean)
          .join("\n\n"),
      },
    },
  },
  title: "Control/Button",
};

export default meta;

export const Button = {
  args: {
    appearance: "outline",
    controls: "",
    disabled: false,
    disclosure: false,
    form: "",
    haspopup: undefined,
    icon: undefined,
    iconMirrored: undefined,
    iconPlacement: "start",
    id: "",
    label: "Button",
    labelVisibility: "visible",
    mode: "button",
    name: "",
    size: "md",
    tone: "default",
    type: "button",
    value: "",
  } satisfies ClbrButtonElementProps,
  argTypes: buttonArgTypes,
  render: (args: ClbrButtonElementProps) =>
    renderClbrButton({
      ...args,
      form: args.form || undefined,
      labelVisibility: args.icon ? args.labelVisibility : "visible",
      name: args.name || undefined,
      value: args.value || undefined,
    }),
};

const linkExamples = [
  {
    label: "Link",
    href: "#",
  },
  {
    label: "Download",
    href: "#",
    download: "storybook.html",
  },
] satisfies Array<Partial<ClbrButtonLinkProps>>;

export const Link = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: `Link mode renders an \`<a class="clbr-button">\` with the shared visual props plus link-specific props. Examples below show a plain link and a named download.\n\n${linkPropsTable}`,
      },
    },
  },
  render: () =>
    renderClbrInline({
      align: "start",
      gap: "xs",
      children: linkExamples
        .map((example) =>
          renderClbrButton({
            appearance: "outline",
            mode: "link",
            size: "md",
            tone: "default",
            ...example,
          } as ClbrButtonLinkProps),
        )
        .join(""),
    }),
};
