import { CLOUD_ENABLED, SITE_NAME } from "../config";
import { getLang, setLang, t } from "../i18n";
import { getTheme, toggleTheme } from "../theme";
import type { Lang, Learner } from "../types";
import type { Route } from "./context";
import {
  clear,
  h,
  ICON_CHAT,
  ICON_CHECK,
  ICON_MIC,
  ICON_MOON,
  ICON_SUN,
  ICON_TRANSLATE,
  svgIcon
} from "./dom";

export interface Shell {
  readonly stepper: HTMLElement;
  readonly view: HTMLElement;
  setLearner(learner: Learner | null): void;
  /** Hide the chrome that makes no sense before sign-in or level choice. */
  setRoute(route: Route): void;
  refreshChrome(): void;
}

export interface ShellHandlers {
  onLangChange(lang: Lang): void;
  onThemeChange(): void;
  onChat(): void;
  onTranslate(): void;
  onVoice(): void;
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
  // Keyboard users get the double-tap keycaps in the top bar; on a phone the
  // same three actions float bottom-right, where a thumb can reach them.
  const chatKey = h("button", { class: "keycap", type: "button", title: t().chatButtonTitle }, "cc");
  const translateKey = h("button", { class: "keycap", type: "button", title: t().translateButtonTitle }, "tt");
  const voiceKey = h("button", { class: "keycap", type: "button", title: t().voiceButtonTitle }, "vv");
  chatKey.addEventListener("click", () => handlers.onChat());
  translateKey.addEventListener("click", () => handlers.onTranslate());
  voiceKey.addEventListener("click", () => handlers.onVoice());
  const assist = h("span", { class: "assist" }, chatKey, translateKey, voiceKey);

  const fabChat = h("button", { class: "fab__btn", type: "button" }, svgIcon(ICON_CHAT, "chat"));
  const fabTranslate = h("button", { class: "fab__btn", type: "button" }, svgIcon(ICON_TRANSLATE, "translate"));
  const fabVoice = h("button", { class: "fab__btn fab__btn--primary", type: "button" }, svgIcon(ICON_MIC, "voice"));
  fabChat.addEventListener("click", () => handlers.onChat());
  fabTranslate.addEventListener("click", () => handlers.onTranslate());
  fabVoice.addEventListener("click", () => handlers.onVoice());
  const fab = h("div", { class: "fab" }, fabChat, fabTranslate, fabVoice);

  /* account ------------------------------------------------------------- */
  const accountLabel = h("span", { class: "account__label" }, t().signIn);
  const accountButton = h("button", { class: "account", type: "button" }, accountLabel);
  accountButton.addEventListener("click", () => handlers.onAccount());

  const controls = h("div", { class: "controls" }, assist, langGroup, themeButton);
  if (CLOUD_ENABLED) controls.append(accountButton);

  const topbar = h("header", { class: "topbar" }, wordmark, controls);
  const stepper = h("nav", { class: "stepper", "aria-label": "Steps" });
  const view = h("div", { class: "view" });
  const main = h("main", { class: "main" }, stepper, view);
  const foot = h("footer", { class: "pagefoot" }, t().footer);

  root.append(h("div", { class: "app" }, topbar, main, foot, fab));

  const paintTitles = (): void => {
    for (const [button, title] of [
      [chatKey, t().chatButtonTitle],
      [translateKey, t().translateButtonTitle],
      [voiceKey, t().voiceButtonTitle],
      [fabChat, t().chatTitle],
      [fabTranslate, t().translateTitle],
      [fabVoice, t().voiceTitle]
    ] as const) {
      button.title = title;
      button.setAttribute("aria-label", title);
    }
  };
  paintTitles();

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
    setRoute(route) {
      const bare = route === "loading" || route === "login";
      stepper.hidden = bare || route === "recovery" || route === "level";
      accountButton.hidden = bare;
      assist.hidden = bare;
      fab.hidden = bare;
    },
    refreshChrome() {
      tag.textContent = t().tagline;
      paintTitles();
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
