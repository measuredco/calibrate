import { renderClbrButton } from "./components/button/button";
import { renderClbrCheckbox } from "./components/checkbox/checkbox";
import { renderClbrInput } from "./components/input/input";

// Temporary sandbox story for quick cross-component visual checks.
const meta = {
  parameters: {
    docs: {
      disable: true,
    },
  },
  title: "Sandbox/Field Stack (Temporary)",
};

export default meta;

export const Default = {
  render: () => {
    return `<div style="display:flex;flex-direction:column;align-items:flex-start;gap:var(--clbr-spacing-vertical-600);max-inline-size:28rem;">${renderClbrInput(
      {
        description: "We'll only use this for account updates.",
        id: "temp-email",
        label: "Email",
        name: "email",
        type: "email",
        value: "person@example.com",
      },
    )}${renderClbrCheckbox({
      description: "You can unsubscribe at any time.",
      descriptionId: "temp-updates-description",
      label: "Send me product updates",
      name: "updates",
      value: "yes",
    })}<div style="display:flex;gap:var(--clbr-spacing-horizontal-400);">${renderClbrButton(
      {
        appearance: "solid",
        label: "Continue",
        mode: "button",
        size: "md",
        tone: "brand",
        type: "button",
      },
    )}${renderClbrButton({
      appearance: "outline",
      label: "Back",
      mode: "button",
      size: "md",
      tone: "neutral",
      type: "button",
    })}</div>${renderClbrInput({
      description: "We'll only use this for account updates.",
      id: "temp-email",
      label: "Email",
      name: "email",
      type: "email",
      value: "person@example.com",
      size: "sm",
    })}${renderClbrCheckbox({
      description: "You can unsubscribe at any time.",
      descriptionId: "temp-updates-description",
      label: "Send me product updates",
      name: "updates",
      value: "yes",
    })}<div style="display:flex;gap:var(--clbr-spacing-horizontal-400);">${renderClbrButton(
      {
        appearance: "solid",
        label: "Continue",
        mode: "button",
        size: "sm",
        tone: "brand",
        type: "button",
      },
    )}${renderClbrButton({
      appearance: "outline",
      label: "Back",
      mode: "button",
      size: "sm",
      tone: "neutral",
      type: "button",
    })}</div></div>`;
  },
};
