import { formatToday, getLang, pick, t } from "../i18n";
import { todayISO } from "../scheduler";
import {
  GRAMMAR_PER_SESSION,
  TOPICS_PER_SESSION,
  activeVocab,
  dueTopics,
  suggestedTopic
} from "../session";
import { h } from "./dom";
import type { AppContext } from "./context";

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
  const overdue = due.filter((topic) => (ctx.progress.topics[topic.id]?.due ?? "") < todayISO()).length;
  const upcoming = suggestedTopic();

  const rows: Row[] = [
    {
      title: s.steps[0],
      detail: words.length ? words.map((w) => w.word).join(" · ") : s.stepVocabDetailEmpty,
      count: String(words.length),
      empty: words.length === 0
    },
    {
      title: s.steps[1],
      detail: s.stepTablesDetail,
      count: String(GRAMMAR_PER_SESSION),
      empty: false
    },
    {
      title: s.steps[2],
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
      title: s.steps[3],
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
          {},
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

  const start = h("button", { class: "btn", type: "button" }, s.start);
  start.addEventListener("click", () => ctx.startSession());

  const progressButton = h("button", { class: "btn btn--ghost", type: "button" }, s.viewProgress);
  progressButton.addEventListener("click", () => ctx.go("progress"));

  return h(
    "section",
    { class: "card" },
    h("p", { class: "eyebrow" }, formatToday()),
    h("h2", { class: "display" }, s.greeting(ctx.learner?.displayName ?? null)),
    lede,
    agenda,
    h("div", { class: "actions" }, start, progressButton)
  );
}

/** Kept verbatim so the German view can gloss it without a second lookup. */
const ENGLISH_LEDE =
  "A round takes about 25 minutes. Anything you get wrong comes back tomorrow; anything you get right twice disappears.";
