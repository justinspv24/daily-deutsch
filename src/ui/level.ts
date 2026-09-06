import { LEVELS, LEVEL_INFO } from "../data/curriculum";
import { pick, t } from "../i18n";
import type { AppContext } from "./context";
import { h, ICON_ARROW, ICON_CHECK, svgIcon } from "./dom";

/**
 * The level picker: shown once after the first sign-in, and again from the
 * account panel whenever the learner wants to move up or down.
 */
export function renderLevel(ctx: AppContext): HTMLElement {
  const s = t();
  const current = ctx.progress.level;

  const grid = h("div", { class: "levels" });
  for (const level of LEVELS) {
    const info = LEVEL_INFO[level];
    const isCurrent = level === current;
    const focus = h("span", { class: "levelcard__focus" });
    for (const item of info.focus) focus.append(h("span", { class: "chip" }, pick(item)));

    const card = h(
      "button",
      { class: "levelcard", type: "button", "data-level": level, "data-current": String(isCurrent) },
      h("span", { class: "levelcard__code" }, level),
      h("span", { class: "levelcard__name" }, pick(info.name)),
      h("span", { class: "levelcard__blurb" }, pick(info.blurb)),
      focus,
      h(
        "span",
        { class: "levelcard__cta" },
        isCurrent ? s.levelCurrent : s.levelPick(level),
        svgIcon(isCurrent ? ICON_CHECK : ICON_ARROW, level)
      )
    );
    card.addEventListener("click", () => ctx.setLevel(level));
    grid.append(card);
  }

  const head = h(
    "section",
    { class: "card" },
    h("p", { class: "eyebrow" }, s.levelEyebrow),
    h("h2", { class: "display" }, s.levelTitle),
    h("p", { class: "lede" }, s.levelLede)
  );

  const wrap = h("div", { class: "home" }, head, grid);
  if (current) {
    const back = h("button", { class: "btn btn--ghost", type: "button" }, s.back);
    back.addEventListener("click", () => ctx.go("home"));
    wrap.append(h("div", { class: "actions actions--center" }, back));
  }
  return wrap;
}
