import { curriculumFor } from "../data/curriculum";
import { TABLES, parseCellKey, tableById } from "../data/tables";
import { formatDate, pick, t } from "../i18n";
import { isCustomId } from "../repository";
import { REVIEW_INTERVALS, TABLE_MASTERY_DAYS, daysBetween, tableMastered, todayISO } from "../scheduler";
import { allVocab } from "../session";
import { openAddWord } from "./addword";
import { h } from "./dom";
import type { AppContext } from "./context";
import { statsRow } from "./widgets";

const HISTORY_LENGTH = 14;

export function renderProgress(ctx: AppContext): HTMLElement {
  const s = t();
  const bank = curriculumFor(ctx.progress.level);
  const sessions = ctx.progress.sessions.slice(-HISTORY_LENGTH);

  const bars = h("div", { class: "bars", role: "img", "aria-label": s.lastRounds });
  const padding = HISTORY_LENGTH - sessions.length;
  for (let i = 0; i < HISTORY_LENGTH; i += 1) {
    const record = i >= padding ? sessions[i - padding] : undefined;
    const share = record ? Math.max(8, Math.round((record.right / Math.max(record.total, 1)) * 100)) : 4;
    bars.append(
      h("div", {
        class: "bars__bar",
        "data-empty": String(!record),
        style: `height:${share}%`,
        title: record ? `${formatDate(record.date)} · ${record.right}/${record.total}` : "—"
      })
    );
  }

  /* ------------------------------------------------------ vocabulary table */
  const vocabBody = h("tbody");
  for (const item of allVocab(ctx.progress)) {
    const state = ctx.progress.vocab[item.id];
    const streak = state?.streak ?? 0;
    const own = isCustomId(item.id);
    const dots = h(
      "span",
      { class: "dots" },
      h("i", { "data-on": String(streak >= 1) }),
      h("i", { "data-on": String(streak >= 2) })
    );

    const word = h("td", { class: "is-word" }, item.word);
    if (own) word.append(h("span", { class: "chip chip--own" }, s.ownWord));

    const last = h(
      "td",
      { class: "is-actions" },
      h(
        "span",
        { class: "pill", "data-tone": streak >= 2 ? "mastered" : "due" },
        streak >= 2 ? s.mastered : s.inDrill
      )
    );
    if (own) {
      const remove = h(
        "button",
        { class: "linkbtn", type: "button", title: s.removeWord, "aria-label": `${s.removeWord}: ${item.word}` },
        s.removeWord
      );
      remove.addEventListener("click", () => {
        if (confirm(s.removeWordConfirm(item.word))) ctx.removeWord(item.id);
      });
      last.append(remove);
    }

    vocabBody.append(
      h(
        "tr",
        {},
        word,
        h("td", {}, item.en[0] ?? ""),
        h("td", {}, dots),
        h("td", { class: "is-meta" }, state?.lastDate ? formatDate(state.lastDate) : "—"),
        last
      )
    );
  }

  /* ---------------------------------------------------------- topic table */
  const topicBody = h("tbody");
  for (const topic of bank.topics) {
    const state = ctx.progress.topics[topic.id];
    if (!state) continue;
    const finished = state.stage >= REVIEW_INTERVALS.length;
    const delta = daysBetween(todayISO(), state.due);

    const tone = finished ? "done" : delta <= 0 ? "due" : "rest";
    const label = finished
      ? s.finished
      : delta < 0
        ? s.overdueBy(-delta)
        : delta === 0
          ? s.dueToday
          : s.inDays(delta);

    topicBody.append(
      h(
        "tr",
        {},
        h("td", { class: "is-word" }, pick(topic.name)),
        h("td", { class: "is-meta" }, `${state.stage} / ${REVIEW_INTERVALS.length}`),
        h("td", { class: "is-meta" }, formatDate(state.due)),
        h("td", {}, h("span", { class: "pill", "data-tone": tone }, label))
      )
    );
  }

  /* --------------------------------------------------- paradigm tables */
  const gridBody = h("tbody");
  for (const table of TABLES) {
    const state = ctx.progress.tables[table.id];
    if (!state) continue;
    const done = tableMastered(state);
    const label = done
      ? s.gridStatusMastered
      : state.studied
        ? s.gridStatusDay(state.dayStreak)
        : s.gridStatusNew;

    const dots = h("span", { class: "dots" });
    for (let day = 1; day <= TABLE_MASTERY_DAYS; day += 1) {
      dots.append(h("i", { "data-on": String(state.dayStreak >= day) }));
    }

    gridBody.append(
      h(
        "tr",
        {},
        h("td", { class: "is-word" }, table.name.de),
        h("td", {}, table.name.ml),
        h("td", {}, dots),
        h("td", { class: "is-meta" }, String(state.missed.length || "—")),
        h("td", {}, h("span", { class: "pill", "data-tone": done ? "mastered" : "due" }, label))
      )
    );
  }

  const gridsSecure = TABLES.filter((table) => tableMastered(ctx.progress.tables[table.id])).length;

  /* The personal dictionary: every cell still outstanding, across all tables. */
  const missedList = h("ul", { class: "misslist" });
  let missedCount = 0;
  for (const [tableId, state] of Object.entries(ctx.progress.tables)) {
    const table = tableById(tableId);
    if (!table) continue;
    for (const key of state.missed) {
      const ref = parseCellKey(key);
      const row = ref ? table.rows[ref.row] : undefined;
      const column = ref ? table.columns[ref.col] : undefined;
      if (!ref || !row || !column) continue;
      const answer = row.cells[ref.col]?.[0] ?? "";
      missedCount += 1;
      missedList.append(
        h(
          "li",
          { class: "misslist__item" },
          h("span", { class: "misslist__cell" }, `${row.label.de} · ${column.de}`),
          h("span", { class: "misslist__answer" }, answer),
          h("span", { class: "misslist__table" }, table.name.de)
        )
      );
    }
  }
  if (missedCount === 0) {
    missedList.append(h("li", { class: "misslist__item" }, s.gridMissedEmpty));
  }

  const secure = bank.grammar.filter((item) => (ctx.progress.grammar[item.id]?.streak ?? 0) >= 2).length;

  const back = h("button", { class: "btn", type: "button" }, s.backToDrill);
  back.addEventListener("click", () => ctx.go("home"));

  const addWord = h("button", { class: "btn btn--ghost", type: "button" }, s.addWordButton);
  addWord.addEventListener("click", () => openAddWord((item) => ctx.addWord(item)));

  const card = h(
    "section",
    { class: "card" },
    h("p", { class: "eyebrow" }, s.viewProgress),
    h("h2", { class: "display" }, s.progressTitle),
    h("p", { class: "lede" }, sessions.length ? s.lastRounds : s.noSessionsYet),
    bars,
    h("h3", { class: "sectiontitle" }, s.vocabInDrill),
    h(
      "div",
      { class: "tablewrap" },
      h(
        "table",
        {},
        h(
          "thead",
          {},
          h(
            "tr",
            {},
            h("th", {}, s.colWord),
            h("th", {}, s.colMeaning),
            h("th", {}, s.colTwice),
            h("th", {}, s.colLast),
            h("th", {}, "")
          )
        ),
        vocabBody
      )
    ),
    h("h3", { class: "sectiontitle" }, s.gridSectionTitle),
    h(
      "div",
      { class: "tablewrap" },
      h(
        "table",
        {},
        h(
          "thead",
          {},
          h(
            "tr",
            {},
            h("th", {}, s.colTopic),
            h("th", {}, s.gridMalayalam),
            h("th", {}, s.colTwice),
            h("th", {}, s.gridMissedTitle),
            h("th", {}, "")
          )
        ),
        gridBody
      )
    ),
    h("p", { class: "note" }, s.gridSecure(gridsSecure, TABLES.length)),
    h("h3", { class: "sectiontitle" }, s.gridMissedTitle),
    missedList,
    h("h3", { class: "sectiontitle" }, s.reviewPlan),
    h(
      "div",
      { class: "tablewrap" },
      h(
        "table",
        {},
        h(
          "thead",
          {},
          h(
            "tr",
            {},
            h("th", {}, s.colTopic),
            h("th", {}, s.colStage),
            h("th", {}, s.colNextReview),
            h("th", {}, "")
          )
        ),
        topicBody
      )
    ),
    h(
      "p",
      { class: "note" },
      `${s.tablesSecure(secure, bank.grammar.length)} `,
      h("span", {}, s.intervals)
    ),
    h("div", { class: "actions" }, back, addWord)
  );

  return h("div", { class: "home" }, statsRow(ctx.progress), card);
}
