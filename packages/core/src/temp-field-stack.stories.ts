import { renderClbrButton } from "./components/button/button";
import { renderClbrCheckbox } from "./components/checkbox/checkbox";
import { renderClbrInput } from "./components/input/input";
import { renderClbrRadios } from "./components/radios/radios";

// Temporary sandbox story for quick cross-component visual checks.
const meta = {
  parameters: {
    docs: {
      disable: true,
    },
  },
  title: "Sandbox/Field Stack",
};

export default meta;

export const Default = {
  render: () => {
    return `<div style="display:flex;flex-direction:column;align-radios:flex-start;gap:var(--clbr-spacing-vertical-600);max-inline-size:28rem;">${renderClbrInput(
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
    })}${renderClbrRadios({
      description: "Choose one contact method.",
      id: "temp-contact-method",
      radios: [
        { label: "Email", value: "email" },
        { label: "SMS", value: "sms" },
      ],
      legend: "Contact Method",
      name: "contactMethod",
      value: "email",
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
    })}${renderClbrRadios({
      description: "Choose one contact method.",
      id: "temp-contact-method-sm",
      radios: [
        { label: "Email", value: "email" },
        { label: "SMS", value: "sms" },
      ],
      legend: "Contact Method",
      name: "contactMethodSm",
      value: "email",
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
