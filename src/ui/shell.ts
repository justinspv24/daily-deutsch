import { aiAvailable } from "../ai";
import { CLOUD_ENABLED, SITE_NAME } from "../config";
import { getLang, setLang, t } from "../i18n";
import { getTheme, toggleTheme } from "../theme";
import type { Lang, Learner } from "../types";
import { clear, h, ICON_CHECK, ICON_MOON, ICON_SUN, svgIcon } from "./dom";

export interface Shell {
  readonly stepper: HTMLElement;
  readonly view: HTMLElement;
  setLearner(learner: Learner | null): void;
  refreshChrome(): void;
}

export interface ShellHandlers {
  onLangChange(lang: Lang): void;
  onThemeChange(): void;
  onChat(): void;
  onTranslate(): void;
  onAccount(): void;
}

export function buildShell(root: HTMLElement, handlers: ShellHandlers): Shell {
  clear(root);

  const mark = h("div", { class: "wordmark__mark", "aria-hidden": "true" }, "D");
  const name = h("div", { class: "wordmark__name" }, SITE_NAME);
  const tag = h("div", { class: "wordmark__tag" }, t().tagline);
  const wordmark = h("div", { class: "wordmark" }, mark, h("div", { class: "wordmark__text" }, name, tag));

  /* language ------------------------------------------------------------ */
  const langGroup = h("div", { class: "segmented", role: "group", "aria-label": t().langLabel });
  const langButtons: Record<Lang, HTMLButtonElement> = {
    de: h("button", { type: "button", "aria-pressed": String(getLang() === "de") }, "DE"),
    en: h("button", { type: "button", "aria-pressed": String(getLang() === "en") }, "EN")
  };
  (Object.keys(langButtons) as Lang[]).forEach((lang) => {
    langButtons[lang].addEventListener("click", () => {
      if (getLang() === lang) return;
      setLang(lang);
      handlers.onLangChange(lang);
    });
    langGroup.append(langButtons[lang]);
  });

  /* theme --------------------------------------------------------------- */
  const themeButton = h("button", {
    class: "iconbtn",
    type: "button",
    title: t().themeLabel,
    "aria-label": t().themeLabel
  });
  const paintThemeIcon = (): void => {
    clear(themeButton);
    themeButton.append(svgIcon(getTheme() === "dark" ? ICON_SUN : ICON_MOON, "theme"));
  };
  paintThemeIcon();
  themeButton.addEventListener("click", () => {
    toggleTheme();
    paintThemeIcon();
    handlers.onThemeChange();
  });

  /* assistant ----------------------------------------------------------- */
  // Only offered when the deployment actually has a model behind it.
  const chatKey = h("button", { class: "keycap", type: "button", title: t().chatButtonTitle }, "cc");
  chatKey.addEventListener("click", () => handlers.onChat());
  const translateKey = h(
    "button",
    { class: "keycap", type: "button", title: t().translateButtonTitle },
    "tt"
  );
  translateKey.addEventListener("click", () => handlers.onTranslate());

  /* account ------------------------------------------------------------- */
  const accountLabel = h("span", { class: "account__label" }, t().signIn);
  const accountButton = h("button", { class: "account", type: "button" }, accountLabel);
  accountButton.addEventListener("click", () => handlers.onAccount());

  const controls = h("div", { class: "controls" });
  if (aiAvailable()) controls.append(chatKey, translateKey);
  controls.append(langGroup, themeButton);
  if (CLOUD_ENABLED) controls.append(accountButton);

  const topbar = h("header", { class: "topbar" }, wordmark, controls);
  const stepper = h("nav", { class: "stepper", "aria-label": "Steps" });
  const view = h("div", { class: "view" });
  const main = h("main", { class: "main" }, stepper, view);
  const foot = h("footer", { class: "pagefoot" }, t().footer);

  root.append(h("div", { class: "app" }, topbar, main, foot));

  return {
    stepper,
    view,
    setLearner(learner) {
      accountLabel.textContent = learner
        ? (learner.displayName ?? learner.email?.split("@")[0] ?? t().account)
        : t().signIn;
      accountButton.dataset["state"] = learner ? "in" : "out";
      accountButton.title = learner ? t().account : t().signInTitle;
    },
    refreshChrome() {
      tag.textContent = t().tagline;
      chatKey.title = t().chatButtonTitle;
      translateKey.title = t().translateButtonTitle;
      themeButton.title = t().themeLabel;
      themeButton.setAttribute("aria-label", t().themeLabel);
      langGroup.setAttribute("aria-label", t().langLabel);
      (Object.keys(langButtons) as Lang[]).forEach((lang) => {
        langButtons[lang].setAttribute("aria-pressed", String(getLang() === lang));
      });
      foot.textContent = t().footer;
      if (accountButton.dataset["state"] !== "in") accountLabel.textContent = t().signIn;
    }
  };
}

/** The four-step session plan, rendered as the progress rail. */
export function paintStepper(
  stepper: HTMLElement,
  counts: readonly [string, string, string, string],
  activeStep: number | null
): void {
  clear(stepper);
  t().steps.forEach((label, index) => {
    const state =
      activeStep === null
        ? "idle"
        : index < activeStep
          ? "done"
          : index === activeStep
            ? "active"
            : "idle";
    const badge = h("div", { class: "stepper__n" });
    if (state === "done") badge.append(svgIcon(ICON_CHECK, "done"));
    else badge.append(`0${index + 1}`);
    stepper.append(
      h(
        "div",
        { class: "stepper__item", "data-state": state },
        badge,
        h("div", { class: "stepper__label" }, label),
        h("div", { class: "stepper__meta" }, counts[index] ?? "")
      )
    );
  });
}
