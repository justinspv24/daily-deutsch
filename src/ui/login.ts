import { sendMagicLink } from "../auth";
import { SITE_NAME } from "../config";
import { t } from "../i18n";
import { h, ICON_ARROW, ICON_CHECK, svgIcon } from "./dom";

/** Shown while the stored session is being checked, so the sign-in form never flashes. */
export function renderLoading(): HTMLElement {
  return h(
    "section",
    { class: "card loading", "aria-busy": "true" },
    h("span", { class: "spinner", "aria-hidden": "true" }),
    h("p", { class: "lede" }, t().loading)
  );
}

/**
 * The front door. Nothing behind it is reachable without an account, so this
 * screen carries the pitch as well as the form. Sign-in is a link by e-mail —
 * there is no password to type, forget or leak.
 */
export function renderLogin(): HTMLElement {
  const s = t();

  const field = h("input", {
    id: "login-email",
    class: "field__input login__input",
    type: "email",
    autocomplete: "email",
    inputmode: "email",
    placeholder: s.emailPlaceholder,
    "aria-label": s.emailLabel
  });
  const submit = h("button", { class: "btn btn--lg", type: "submit" }, s.sendLink, svgIcon(ICON_ARROW, "send"));
  const status = h("p", { class: "login__status", role: "status" });

  const points = h("ul", { class: "login__points" });
  for (const point of s.loginPoints) {
    points.append(
      h("li", {}, h("span", { class: "login__tick", "aria-hidden": "true" }, svgIcon(ICON_CHECK, "point")), point)
    );
  }

  const form = h("form", { class: "login__form", novalidate: "true" }, field, submit);

  const send = async (): Promise<void> => {
    const email = field.value.trim();
    submit.setAttribute("disabled", "true");
    status.dataset["tone"] = "";
    status.textContent = "…";

    const result = await sendMagicLink(email);

    if (result.ok) {
      status.dataset["tone"] = "ok";
      status.textContent = s.linkSent(email);
      field.setAttribute("disabled", "true");
      submit.replaceChildren(s.sent, svgIcon(ICON_CHECK, "sent"));
      return;
    }
    submit.removeAttribute("disabled");
    status.dataset["tone"] = "no";
    status.textContent = result.message === "invalid-email" ? s.badEmail : s.signInFailed;
    field.focus();
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void send();
  });
  queueMicrotask(() => field.focus());

  return h(
    "section",
    { class: "card hero login" },
    h("div", { class: "login__mark", "aria-hidden": "true" }, "D"),
    h("p", { class: "eyebrow" }, SITE_NAME),
    h("h2", { class: "display" }, s.loginTitle),
    h("p", { class: "lede" }, s.loginBlurb),
    points,
    h("label", { class: "field__label login__label", for: "login-email" }, s.emailLabel),
    form,
    status
  );
}
