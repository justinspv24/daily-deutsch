import { t } from "../i18n";
import { computeStats } from "../stats";
import type { Progress } from "../types";
import { h, ICON_FLAME, ICON_STAR, ICON_TARGET, svgIcon } from "./dom";

export type StatTone = "accent" | "ok" | "info";

/** One tile of the streak / mastered / accuracy row. */
export function statTile(icon: string, value: string, label: string, tone: StatTone): HTMLElement {
  return h(
    "div",
    { class: "stat", "data-tone": tone },
    h("span", { class: "stat__icon" }, svgIcon(icon, label)),
    h("span", { class: "stat__value" }, value),
    h("span", { class: "stat__label" }, label)
  );
}

/** The row of three tiles shared by the home and progress screens. */
export function statsRow(progress: Progress): HTMLElement {
  const s = t();
  const stats = computeStats(progress);
  return h(
    "div",
    { class: "stats" },
    statTile(ICON_FLAME, String(stats.streak), s.statStreak, "accent"),
    statTile(ICON_STAR, `${stats.mastered}/${stats.masteredTotal}`, s.statMastered, "ok"),
    statTile(ICON_TARGET, stats.accuracy === null ? "—" : `${stats.accuracy}%`, s.statAccuracy, "info")
  );
}
