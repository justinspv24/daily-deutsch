import {
  PASSWORD_MIN_LENGTH,
  requestPasswordReset,
  signIn,
  signUp,
  updatePassword,
  validEmail,
  type AuthErrorCode
} from "../auth";
import { SITE_NAME } from "../config";
import { t } from "../i18n";
import type { AppContext } from "./context";
import { h, ICON_ARROW, ICON_CHECK, ICON_EYE, ICON_EYE_OFF, svgIcon } from "./dom";

type Mode = "signin" | "signup" | "reset";

/** Shown while the stored session is being checked, so the sign-in form never flashes. */
export function renderLoading(): HTMLElement {
  return h(
    "section",
    { class: "card loading", "aria-busy": "true" },
    h("span", { class: "spinner", "aria-hidden": "true" }),
    h("p", { class: "lede" }, t().loading)
  );
}

export function describeAuthError(code: AuthErrorCode | null): string {
  const s = t();
  switch (code) {
    case "invalid-email":
      return s.badEmail;
    case "weak-password":
      return s.authWeakPassword;
    case "wrong-credentials":
      return s.authWrongCredentials;
    case "not-confirmed":
      return s.authNotConfirmed;
    case "already-registered":
      return s.authAlreadyRegistered;
    case "rate-limit":
      return s.authRateLimit;
    case "offline":
      return s.aiOffline;
    default:
      return s.signInFailed;
  }
}

/** A password input with a show/hide toggle. */
function passwordField(id: string, autocomplete: string): { input: HTMLInputElement; wrap: HTMLElement } {
  const s = t();
  const input = h("input", {
    id,
    class: "field__input login__input",
    type: "password",
    autocomplete,
    placeholder: s.passwordPlaceholder,
    "aria-label": s.password
  });
  const reveal = h(
    "button",
    { class: "login__reveal", type: "button", "aria-label": s.showPassword, title: s.showPassword },
    svgIcon(ICON_EYE, "show")
  );
  reveal.addEventListener("click", () => {
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    reveal.replaceChildren(svgIcon(show ? ICON_EYE_OFF : ICON_EYE, "toggle"));
    reveal.setAttribute("aria-label", show ? s.hidePassword : s.showPassword);
    reveal.title = show ? s.hidePassword : s.showPassword;
    input.focus();
  });
  return { input, wrap: h("div", { class: "login__password" }, input, reveal) };
}

/**
 * The front door: sign in, create an account, or ask for a password-reset
 * link. Nothing behind it is reachable without an account, so this screen
 * carries the pitch as well as the form.
 */
export function renderLogin(): HTMLElement {
  const s = t();
  let mode: Mode = "signin";

  /* tabs ---------------------------------------------------------------- */
  const tabIn = h("button", { type: "button", role: "tab", "aria-selected": "true" }, s.signInTab);
  const tabUp = h("button", { type: "button", role: "tab", "aria-selected": "false" }, s.signUpTab);
  const tabs = h("div", { class: "segmented segmented--wide", role: "tablist" }, tabIn, tabUp);
  const hint = h("p", { class: "login__hint" });

  /* form ---------------------------------------------------------------- */
  const email = h("input", {
    id: "login-email",
    class: "field__input login__input",
    type: "email",
    autocomplete: "email",
    inputmode: "email",
    placeholder: s.emailPlaceholder
  });
  const { input: password, wrap: passwordWrap } = passwordField("login-password", "current-password");
  const passwordLabel = h("label", { class: "field__label login__label", for: "login-password" }, s.password);

  const submit = h("button", { class: "btn btn--lg", type: "submit" }, s.signInAction, svgIcon(ICON_ARROW, "go"));
  const forgot = h("button", { class: "login__link", type: "button" }, s.forgotPassword);
  const status = h("p", { class: "login__status", role: "status" });

  const form = h(
    "form",
    { class: "login__form login__form--stacked", novalidate: "true" },
    h("label", { class: "field__label login__label", for: "login-email" }, s.emailLabel),
    email,
    passwordLabel,
    passwordWrap,
    h("div", { class: "login__actions" }, submit, forgot),
    status
  );

  const report = (tone: "ok" | "no" | "", text: string): void => {
    status.dataset["tone"] = tone;
    status.textContent = text;
  };

  const setMode = (next: Mode): void => {
    mode = next;
    report("", "");
    tabIn.setAttribute("aria-selected", String(next !== "signup"));
    tabUp.setAttribute("aria-selected", String(next === "signup"));

    const wantsPassword = next !== "reset";
    passwordLabel.hidden = !wantsPassword;
    passwordWrap.hidden = !wantsPassword;
    password.autocomplete = next === "signup" ? "new-password" : "current-password";
    forgot.hidden = next !== "signin";

    const label = next === "signin" ? s.signInAction : next === "signup" ? s.signUpAction : s.resetAction;
    submit.replaceChildren(label, svgIcon(ICON_ARROW, "go"));
    hint.textContent = next === "signup" ? s.passwordRule : next === "reset" ? s.resetBlurb : "";
  };

  tabIn.addEventListener("click", () => setMode("signin"));
  tabUp.addEventListener("click", () => setMode("signup"));
  forgot.addEventListener("click", () => {
    setMode("reset");
    email.focus();
  });

  /* the "check your inbox" state ---------------------------------------- */
  const showSent = (title: string, body: string): void => {
    form.hidden = true;
    tabs.hidden = true;
    hint.hidden = true;
    const back = h("button", { class: "btn btn--ghost", type: "button" }, s.backToSignIn);
    const done = h(
      "div",
      { class: "login__done" },
      h("span", { class: "login__tick login__tick--big", "aria-hidden": "true" }, svgIcon(ICON_CHECK, "sent")),
      h("p", { class: "login__done-title" }, title),
      h("p", { class: "lede" }, body),
      h("div", { class: "actions" }, back)
    );
    back.addEventListener("click", () => {
      done.remove();
      form.hidden = false;
      tabs.hidden = false;
      hint.hidden = false;
      password.value = "";
      setMode("signin");
      email.focus();
    });
    card.append(done);
  };

  const submitForm = async (): Promise<void> => {
    const address = email.value.trim();
    const pass = password.value;
    if (!validEmail(address)) {
      report("no", s.badEmail);
      email.focus();
      return;
    }
    if (mode !== "reset" && pass.length < PASSWORD_MIN_LENGTH) {
      report("no", s.authWeakPassword);
      password.focus();
      return;
    }

    submit.setAttribute("disabled", "true");
    report("", "…");
    const result =
      mode === "signin"
        ? await signIn(address, pass)
        : mode === "signup"
          ? await signUp(address, pass)
          : await requestPasswordReset(address);
    submit.removeAttribute("disabled");

    if (!result.ok) {
      report("no", describeAuthError(result.code));
      return;
    }
    report("", "");
    if (mode === "signup") showSent(s.confirmTitle, s.confirmSent(address));
    else if (mode === "reset") showSent(s.resetSentTitle, s.resetSent(address));
    // A successful sign-in is picked up by the auth listener, which routes on.
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void submitForm();
  });

  const points = h("ul", { class: "login__points" });
  for (const point of s.loginPoints) {
    points.append(
      h("li", {}, h("span", { class: "login__tick", "aria-hidden": "true" }, svgIcon(ICON_CHECK, "point")), point)
    );
  }

  const card = h(
    "section",
    { class: "card hero login" },
    h("div", { class: "login__mark", "aria-hidden": "true" }, "D"),
    h("p", { class: "eyebrow" }, SITE_NAME),
    h("h2", { class: "display" }, s.loginTitle),
    h("p", { class: "lede" }, s.loginBlurb),
    points,
    tabs,
    hint,
    form
  );

  setMode("signin");
  queueMicrotask(() => email.focus());
  return card;
}

/**
 * Set a new password — reached from a reset link (the learner is signed in
 * by the time it lands) or from the account panel.
 */
export function renderRecovery(ctx: AppContext): HTMLElement {
  const s = t();
  const { input: password, wrap: passwordWrap } = passwordField("new-password", "new-password");
  const submit = h("button", { class: "btn btn--lg", type: "submit" }, s.newPasswordAction, svgIcon(ICON_CHECK, "save"));
  const status = h("p", { class: "login__status", role: "status" });

  const form = h(
    "form",
    { class: "login__form login__form--stacked", novalidate: "true" },
    h("label", { class: "field__label login__label", for: "new-password" }, s.password),
    passwordWrap,
    h("div", { class: "login__actions" }, submit),
    status
  );

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void (async () => {
      if (password.value.length < PASSWORD_MIN_LENGTH) {
        status.dataset["tone"] = "no";
        status.textContent = s.authWeakPassword;
        password.focus();
        return;
      }
      submit.setAttribute("disabled", "true");
      status.dataset["tone"] = "";
      status.textContent = "…";
      const result = await updatePassword(password.value);
      submit.removeAttribute("disabled");
      if (!result.ok) {
        status.dataset["tone"] = "no";
        status.textContent = describeAuthError(result.code);
        return;
      }
      status.dataset["tone"] = "ok";
      status.textContent = s.passwordUpdated;
      ctx.finishRecovery();
    })();
  });

  queueMicrotask(() => password.focus());

  return h(
    "section",
    { class: "card login" },
    h("p", { class: "eyebrow" }, SITE_NAME),
    h("h2", { class: "display" }, s.newPasswordTitle),
    h("p", { class: "lede" }, s.newPasswordBlurb),
    form
  );
}
