import { formatToday, getLang, pick, t } from "../i18n";
import { todayISO } from "../scheduler";
import {
  GRAMMAR_PER_SESSION,
  TOPICS_PER_SESSION,
  activeVocab,
  dueTables,
  dueTopics,
  suggestedTopic
} from "../session";
import { canInstall, isIOS, isStandalone, promptInstall } from "../pwa";
import { DrillTutor } from "../tutor";
import { openAddWord } from "./addword";
import { h, ICON_ARROW, ICON_MIC, svgIcon } from "./dom";
import type { AppContext } from "./context";
import { statsRow } from "./widgets";

interface Row {
  title: string;
  detail: string;
  count: string;
  empty: boolean;
}

export function renderHome(ctx: AppContext): HTMLElement {
  const s = t();
  const words = activeVocab(ctx.progress);
  const due = dueTopics(ctx.progress);
  const grids = dueTables(ctx.progress);
  const overdue = due.filter((topic) => (ctx.progress.topics[topic.id]?.due ?? "") < todayISO()).length;
  const upcoming = suggestedTopic(ctx.progress, ctx.learner?.id ?? "");
  const level = ctx.progress.level;

  const rows: Row[] = [
    {
      title: s.steps[0],
      detail: words.length ? words.map((w) => w.word).join(" · ") : s.stepVocabDetailEmpty,
      count: String(words.length),
      empty: words.length === 0
    },
    {
      title: s.steps[1],
      detail: grids.length ? grids.map((table) => table.name.de).join(" · ") : s.stepGridDetailEmpty,
      count: String(grids.length),
      empty: grids.length === 0
    },
    {
      title: s.steps[2],
      detail: s.stepTablesDetail,
      count: String(GRAMMAR_PER_SESSION),
      empty: false
    },
    {
      title: s.steps[3],
      detail: due.length
        ? due
            .slice(0, TOPICS_PER_SESSION)
            .map((topic) => pick(topic.name))
            .join(" · ") + (overdue ? s.overdueSuffix(overdue) : "")
        : s.stepReviewDetailEmpty,
      count: String(Math.min(due.length, TOPICS_PER_SESSION)),
      empty: due.length === 0
    },
    {
      title: s.steps[4],
      detail: `${pick(upcoming.title)} — ${pick(upcoming.blurb)}`,
      count: s.upNext,
      empty: true
    }
  ];

  const agenda = h("ul", { class: "agenda" });
  rows.forEach((row, index) => {
    agenda.append(
      h(
        "li",
        { class: "agenda__row", "data-empty": String(row.empty) },
        h("span", { class: "agenda__n" }, `0${index + 1}`),
        h(
          "span",
          { class: "agenda__body" },
          h("span", { class: "agenda__title" }, row.title),
          h("span", { class: "agenda__detail" }, row.detail)
        ),
        h("span", { class: "agenda__count" }, row.count)
      )
    );
  });

  const lede = h("p", { class: "lede" }, s.lede);
  if (getLang() === "de") {
    // Immersion rule: German first, the English rendering on its own line below.
    lede.append(h("span", { class: "gloss" }, ENGLISH_LEDE));
  }

  const start = h("button", { class: "btn btn--lg", type: "button" }, s.start, svgIcon(ICON_ARROW, "start"));
  start.addEventListener("click", () => ctx.startSession());

  // The same round, read out loud. Offered as its own door rather than a
  // setting, because it is a different way to spend the next half hour —
  // headphones and a quiet room, or a keyboard on the train — and that is a
  // choice made fresh each morning, not once in a preferences panel.
  const speak = DrillTutor.offerable()
    ? h("button", { class: "btn btn--lg btn--speak", type: "button" }, svgIcon(ICON_MIC, "voice"), s.tutorStart)
    : null;
  speak?.addEventListener("click", () => ctx.startSession(true));

  const progressButton = h("button", { class: "btn btn--ghost", type: "button" }, s.viewProgress);
  progressButton.addEventListener("click", () => ctx.go("progress"));

  const addButton = h("button", { class: "btn btn--ghost", type: "button" }, s.addWordButton);
  addButton.addEventListener("click", () => openAddWord((item) => ctx.addWord(item)));

  // Offered only where it can be acted on: never once installed, and on iOS
  // as a written hint, because Safari has no install prompt to replay.
  const install = buildInstallOffer();

  const hero = h(
    "section",
    { class: "card hero" },
    h("p", { class: "eyebrow" }, level ? `${level} · ${formatToday()}` : formatToday()),
    h("h2", { class: "display" }, s.greeting(ctx.learner?.displayName ?? null)),
    lede,
    h("div", { class: "actions" }, start, speak, progressButton, addButton)
  );
  if (speak) hero.append(h("p", { class: "kbdhint hero__speakhint" }, s.tutorStartHint));
  if (install) hero.append(install);

  const plan = h("section", { class: "plan" }, h("h3", { class: "sectiontitle" }, s.todayPlan), agenda);

  return h("div", { class: "home" }, hero, statsRow(ctx.progress), plan);
}

/** The install row, or null when there is nothing useful to offer. */
function buildInstallOffer(): HTMLElement | null {
  if (isStandalone()) return null;
  const s = t();

  if (canInstall()) {
    const button = h("button", { class: "btn btn--ghost btn--install", type: "button" }, s.installButton);
    button.addEventListener("click", () => void promptInstall());
    return h("div", { class: "install" }, h("span", { class: "install__blurb" }, s.installBlurb), button);
  }

  if (isIOS()) {
    return h("div", { class: "install" }, h("span", { class: "install__blurb" }, s.installIOSHint));
  }

  return null;
}

/** Kept verbatim so the German view can gloss it without a second lookup. */
const ENGLISH_LEDE =
  "A round takes about 25 minutes. Anything you get wrong comes back tomorrow; anything you get right twice disappears.";
