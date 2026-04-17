import { renderClbrButton } from "./components/button/button";
import { renderClbrCheckbox } from "./components/checkbox/checkbox";
import { renderClbrInput } from "./components/input/input";
import { renderClbrRange } from "./components/range/range";
import { renderClbrRadios } from "./components/radios/radios";
import { renderClbrSwitch } from "./components/switch/switch";
import { renderClbrTextarea } from "./components/textarea/textarea";

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
    )}${renderClbrRange({
      description: "Adjust the default playback volume.",
      id: "temp-volume",
      label: "Volume",
      max: 100,
      min: 0,
      name: "volume",
      value: 60,
    })}${renderClbrCheckbox({
      description: "You can unsubscribe at any time.",
      descriptionId: "temp-updates-description",
      label: "Send me product updates",
      name: "updates",
      value: "yes",
    })}${renderClbrSwitch({
      description: "Enable this to receive urgent notifications.",
      descriptionId: "temp-notifications-description",
      label: "Urgent notifications",
      name: "urgentNotifications",
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
    })}${renderClbrTextarea({
      description: "Add any context that will help our support team.",
      id: "temp-message",
      label: "Message",
      name: "message",
      rows: 3,
      value: "Hi team, I need help with my account settings.",
    })}<div style="display:flex;gap:var(--clbr-spacing-horizontal-400);">${renderClbrButton(
      {
        appearance: "solid",
        label: "Continue",
        mode: "button",
        size: "md",
        tone: "default",
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
      size: "sm",
      value: "yes",
    })}${renderClbrSwitch({
      description: "Enable this to receive urgent notifications.",
      descriptionId: "temp-notifications-description-sm",
      label: "Urgent notifications",
      name: "urgentNotificationsSm",
      size: "sm",
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
      size: "sm",
      value: "email",
    })}${renderClbrRange({
      description: "Adjust the default playback volume.",
      id: "temp-volume-sm",
      label: "Volume",
      max: 100,
      min: 0,
      name: "volumeSm",
      size: "sm",
      value: 60,
    })}${renderClbrTextarea({
      description: "Add any context that will help our support team.",
      id: "temp-message-sm",
      label: "Message",
      name: "messageSm",
      rows: 2,
      size: "sm",
      value: "Hi team, I need help with my account settings.",
    })}<div style="display:flex;gap:var(--clbr-spacing-horizontal-400);">${renderClbrButton(
      {
        appearance: "solid",
        label: "Continue",
        mode: "button",
        size: "sm",
        tone: "default",
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
