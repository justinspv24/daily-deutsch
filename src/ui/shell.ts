import { CLOUD_ENABLED, SITE_NAME } from "../config";
import { getLang, setLang, t } from "../i18n";
import { getTheme, toggleTheme } from "../theme";
import type { Lang, Learner } from "../types";
import type { Route } from "./context";
import { buildPlayerBar } from "./playerbar";
import {
  clear,
  h,
  ICON_CHAT,
  ICON_HOME,
  ICON_MIC,
  ICON_MOON,
  ICON_SUN,
  ICON_TRANSLATE,
  svgIcon
} from "./dom";

export interface Shell {
  readonly view: HTMLElement;
  setLearner(learner: Learner | null): void;
  /** Hide the chrome that makes no sense before sign-in, or inside the class. */
  setRoute(route: Route): void;
  refreshChrome(): void;
}

export interface ShellHandlers {
  onLangChange(lang: Lang): void;
  onThemeChange(): void;
  /** The home icon, which is on screen everywhere the chrome is. */
  onHome(): void;
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
  // The wordmark is the other half of the home button: on the web the logo
  // goes home, and a learner who has learnt that everywhere else will try it
  // here too.
  const wordmark = h(
    "button",
    { class: "wordmark", type: "button", title: t().homeTitle },
    mark,
    h("div", { class: "wordmark__text" }, name, tag)
  );
  wordmark.addEventListener("click", () => handlers.onHome());

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

  /* home ---------------------------------------------------------------- */
  // Always in the same place, on every screen that has chrome at all, so
  // "how do I get back" never has to be worked out twice. The classroom hides
  // the whole bar and carries its own, because leaving a class is a different
  // promise: it keeps the class open rather than throwing it away.
  const homeButton = h(
    "button",
    {
      class: "iconbtn iconbtn--home",
      type: "button",
      title: t().homeTitle,
      "aria-label": t().homeTitle
    },
    svgIcon(ICON_HOME, "home")
  );
  homeButton.addEventListener("click", () => handlers.onHome());

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

  const controls = h("div", { class: "controls" }, homeButton, assist, langGroup, themeButton);
  if (CLOUD_ENABLED) controls.append(accountButton);

  const topbar = h("header", { class: "topbar" }, wordmark, controls);
  const view = h("div", { class: "view" });
  const main = h("main", { class: "main" }, view);
  const foot = h("footer", { class: "pagefoot" }, t().footer);

  // The podcast bar belongs to the shell, not to any screen: an episode
  // started on the syllabus page keeps its controls through a whole round.
  root.append(h("div", { class: "app" }, topbar, main, foot, fab, buildPlayerBar()));

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
      // The classroom owns the whole viewport: every piece of ordinary chrome
      // would either float over it or leave a strip of page showing behind.
      const immersive = route === "classroom";

      topbar.hidden = immersive;
      foot.hidden = immersive;
      accountButton.hidden = bare || immersive;
      assist.hidden = bare || immersive;
      fab.hidden = bare || immersive;
      homeButton.hidden = bare || immersive;
      // Kills the background scroll behind a fixed, full-height screen. Set
      // here rather than by the classroom itself because `setRoute` runs on
      // every paint, which is what guarantees it is cleared on every way out.
      document.body.classList.toggle("in-class", immersive);
    },
    refreshChrome() {
      tag.textContent = t().tagline;
      paintTitles();
      themeButton.title = t().themeLabel;
      themeButton.setAttribute("aria-label", t().themeLabel);
      homeButton.title = t().homeTitle;
      homeButton.setAttribute("aria-label", t().homeTitle);
      wordmark.title = t().homeTitle;
      langGroup.setAttribute("aria-label", t().langLabel);
      (Object.keys(langButtons) as Lang[]).forEach((lang) => {
        langButtons[lang].setAttribute("aria-pressed", String(getLang() === lang));
      });
      foot.textContent = t().footer;
      if (accountButton.dataset["state"] !== "in") accountLabel.textContent = t().signIn;
    }
  };
}
