import { sendMagicLink, signOut } from "../auth";
import { t } from "../i18n";
import type { Learner } from "../types";
import { h } from "./dom";
import { openPanel, type Overlay } from "./overlay";

/**
 * Sign-in is a link in an e-mail: no password field exists anywhere in this
 * app, so there is nothing here to leak, forget or reset.
 */
export function openAccount(learner: Learner | null, onSignedOut: () => void): Overlay {
  const s = t();
  const overlay = openPanel({ title: learner ? s.account : s.signInTitle, badge: "@" });

  if (learner) {
    const out = h("button", { class: "btn", type: "button" }, s.signOut);
    out.addEventListener("click", () => {
      void signOut().then(() => {
        overlay.close();
        onSignedOut();
      });
    });
    overlay.body.append(
      h(
        "div",
        { class: "notice" },
        h("p", { class: "notice__title" }, learner.displayName ?? learner.email ?? s.account),
        h("p", { class: "notice__body" }, s.syncedAs(learner.email ?? learner.id.slice(0, 8)))
      )
    );
    overlay.footer.append(out);
    return overlay;
  }

  const field = h("input", {
    class: "field__input",
    type: "email",
    autocomplete: "email",
    inputmode: "email",
    placeholder: s.emailPlaceholder,
    "aria-label": s.emailLabel
  });
  const submit = h("button", { class: "btn", type: "button" }, s.sendLink);
  const status = h("p", { class: "notice__body", role: "status" });

  overlay.body.append(
    h("p", { class: "lede" }, s.signInBlurb),
    h("label", { class: "field" }, h("span", { class: "field__label" }, s.emailLabel), field),
    status
  );
  overlay.footer.append(submit);

  const send = async (): Promise<void> => {
    const email = field.value.trim();
    submit.setAttribute("disabled", "true");
    status.textContent = "…";

    const result = await sendMagicLink(email);
    submit.removeAttribute("disabled");

    if (result.ok) {
      status.textContent = s.linkSent(email);
      field.setAttribute("disabled", "true");
      return;
    }
    status.textContent = result.message === "invalid-email" ? s.badEmail : s.signInFailed;
  };

  submit.addEventListener("click", () => void send());
  field.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    void send();
  });
  queueMicrotask(() => field.focus());

  return overlay;
}
