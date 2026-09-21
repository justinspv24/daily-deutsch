import { vocabSubject } from "../agenda";
import { curriculumFor } from "../data/curriculum";
import { SYLLABI } from "../data/syllabus";
import { TABLES, parseCellKey, tableById } from "../data/tables";
import { formatDate, getLang, pick, t } from "../i18n";
import { mistakeCells, mistakeWords } from "../mistakes";
import { calendarDays, daySummary, formatDuration, profileTotals } from "../profile";
import { isCustomId } from "../repository";
import { REVIEW_INTERVALS, TABLE_MASTERY_DAYS, daysBetween, tableMastered, todayISO } from "../scheduler";
import { allVocab } from "../session";
import { openAddWord } from "./addword";
import { ICON_BOOK, ICON_CLOCK, ICON_FLAME, ICON_STAR, clear, h } from "./dom";
import type { AppContext } from "./context";
import { statTile } from "./widgets";
import type { ClassEnding, MistakeNote } from "../types";

/**
 * The profile: everything the app remembers about the learner, in one screen.
 *
 * It absorbed the old progress view wholesale, minus its fortnight of bars.
 * The contribution calendar says the same thing over a year that fourteen bars
 * said over two weeks, and two charts of one fact is one chart too many — the
 * learner would have had to decide which of them to believe.
 *
 * Everything here is read-only and computed from `Progress`, so it is a plain
 * render function with no live state of its own. The one exception is the day
 * panel, which is re-rendered in place when a square is clicked; rebuilding
 * the whole screen for that would throw away the calendar's scroll position
 * and the learner's place in the grid, which is the very thing they are using.
 */

export function renderProfile(ctx: AppContext): HTMLElement {
  const s = t();
  const totals = profileTotals(ctx.progress);

  const header = h(
    "section",
    { class: "card" },
    h("p", { class: "eyebrow" }, s.profileEyebrow),
    h("h2", { class: "display" }, s.profileTitle)
  );

  // Four tiles, not the three of `statsRow`: hours are the number the learner
  // actually asked for, and a streak that has just broken should not be the
  // only thing a year of work is summed up by — hence `longest` beside it.
  const tiles = h(
    "div",
    { class: "stats stats--four" },
    statTile(ICON_CLOCK, decimal(totals.hours), s.profileHours, "accent"),
    statTile(ICON_BOOK, String(totals.days), s.profileDays, "info"),
    statTile(ICON_STAR, String(totals.classes), s.profileClasses, "ok"),
    statTile(ICON_FLAME, String(totals.longest), s.profileLongest, "accent")
  );

  return h(
    "div",
    { class: "profile" },
    header,
    tiles,
    buildCalendar(ctx),
    buildBookOfErrors(ctx),
    buildProgressTables(ctx)
  );
}

/* ------------------------------------------------------------- the calendar */

/**
 * A year of squares, greener the longer the day was.
 *
 * `calendarDays()` hands back whole weeks, seven days at a time, Monday first
 * — so the returned order drops straight into a grid that flows down its
 * columns and no index arithmetic is needed here at all. That also makes the
 * keyboard trivial: a week is seven steps, so left and right are ±7 and up and
 * down are ±1 in one flat list.
 */
function buildCalendar(ctx: AppContext): HTMLElement {
  const s = t();
  const today = todayISO();
  const days = calendarDays(ctx.progress);

  /* The panel is kept as a handle and replaced on its own. See the note above. */
  const panel = h("div", { class: "day" });
  /* Which square the open panel belongs to, so closing it can give focus back. */
  let opened = -1;

  const weekdays = h("div", { class: "cal__weekdays", "aria-hidden": "true" }, h("span", { class: "cal__head" }));
  for (const initial of s.calendarWeekdays) weekdays.append(h("span", { class: "cal__weekday" }, initial));

  /*
   * One label per month, on the column whose Monday is the first of that
   * month's weeks. Placed explicitly by column so it lines up with the grid
   * below without the two ever having to agree on a count of weeks.
   */
  const months = h("div", { class: "cal__months", "aria-hidden": "true" });
  const weeks = Math.ceil(days.length / 7);
  let previousMonth = "";
  for (let week = 0; week < weeks; week += 1) {
    const monday = days[week * 7];
    if (!monday) continue;
    const month = monday.date.slice(0, 7);
    if (week > 0 && month !== previousMonth) {
      months.append(h("span", { class: "cal__month", style: `grid-column:${week + 1}` }, monthLabel(monday.date)));
    }
    previousMonth = month;
  }

  const grid = h("div", { class: "cal__grid", role: "group", "aria-label": s.calendarTitle });
  const squares: HTMLButtonElement[] = [];

  /*
   * Real buttons, not decorated divs: a square is a thing you press, and a
   * button says so to a screen reader, gets Enter and Space for nothing and
   * cannot be left without an accessible name. The name is the whole point —
   * "14 Sep 2026, 42 minutes" is the only way the grid is readable at all
   * without sight, since the colour is the entire content.
   */
  days.forEach((day, index) => {
    const when = formatDate(day.date);
    const name = day.classes > 0 ? s.calendarDay(when, day.minutes) : s.calendarEmptyDay(when);
    const square = h("button", {
      class: "cal__day",
      type: "button",
      // Roving tabindex: 371 tab stops would make the rest of the page
      // unreachable, so exactly one square is tabbable and the arrows do the
      // rest. The last one — today — is the one worth landing on.
      tabindex: -1,
      title: name,
      "aria-label": name,
      "data-shade": String(day.shade),
      "data-today": day.date === today ? "true" : undefined
    });
    square.addEventListener("click", () => selectDay(index));
    squares.push(square);
    grid.append(square);
  });

  let focused = Math.max(0, squares.length - 1);
  const first = squares[focused];
  if (first) first.tabIndex = 0;

  function moveFocus(to: number): void {
    const target = Math.min(squares.length - 1, Math.max(0, to));
    const next = squares[target];
    const current = squares[focused];
    if (!next || next === current) return;
    if (current) current.tabIndex = -1;
    focused = target;
    next.tabIndex = 0;
    next.focus();
  }

  /*
   * Focus alone never opens a day. Arrowing across a year while a panel
   * re-renders underneath is unreadable, and it would also mean a screen
   * reader announcing a day's whole summary on every keypress.
   *
   * Left and right are a week; up and down are a day, and therefore run on
   * from the bottom of one column into the top of the next. That is the point
   * of walking a flat list rather than a row and a column: every square is
   * reachable, the last week included, however few days it has in it yet.
   */
  grid.addEventListener("keydown", (event) => {
    let next = focused;
    switch (event.key) {
      case "ArrowRight":
        next += 7;
        break;
      case "ArrowLeft":
        next -= 7;
        break;
      case "ArrowDown":
        next += 1;
        break;
      case "ArrowUp":
        next -= 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = squares.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    moveFocus(next);
  });

  function selectDay(index: number): void {
    const day = days[index];
    if (!day) return;
    for (const square of squares) square.removeAttribute("data-selected");
    squares[index]?.setAttribute("data-selected", "true");
    opened = index;
    if (index !== focused) moveFocus(index);

    /* Only the panel is rebuilt; the grid, its scroll and its tab stop stand. */
    clear(panel).append(...dayContent(ctx, day.date, closeDay));

    /*
     * Focus moves into the panel rather than an aria-live announcement being
     * relied on. The panel is display:none while it is empty, so until this
     * moment it was not in the accessibility tree at all, and a live region
     * that has just appeared is not read out dependably by anything. Landing
     * on the heading also puts a keyboard user at the top of what they asked
     * for; the grid keeps its single tab stop on the square behind them.
     */
    panel.querySelector<HTMLElement>(".day__title")?.focus();
  }

  function closeDay(): void {
    for (const square of squares) square.removeAttribute("data-selected");
    clear(panel);
    // Focus is inside the panel that is being emptied, so it has to be put
    // back by hand; otherwise the next Tab starts again at the top of the page.
    squares[opened]?.focus();
    opened = -1;
  }

  const scroll = h("div", { class: "cal__scroll" }, months, grid);

  const legend = h(
    "div",
    { class: "cal__legend" },
    h("span", {}, s.calendarLess),
    h(
      "span",
      { class: "cal__key", "aria-hidden": "true" },
      ...[0, 1, 2, 3, 4].map((shade) => h("span", { class: "cal__swatch", "data-shade": String(shade) }))
    ),
    h("span", {}, s.calendarMore)
  );

  /*
   * A year is wider than a phone, and the interesting end is the right-hand
   * one. The tree is still detached while this function runs — `scrollWidth`
   * would be zero — so the scroll is set on the next frame, by which time the
   * shell has appended it.
   */
  requestAnimationFrame(() => {
    scroll.scrollLeft = scroll.scrollWidth;
  });

  return h(
    "section",
    { class: "card" },
    h("h3", { class: "sectiontitle" }, s.calendarTitle),
    lede(s.calendarBlurb, ENGLISH_CALENDAR_BLURB),
    h("div", { class: "cal" }, weekdays, scroll, legend),
    panel
  );
}

/** One day of the calendar, opened underneath it. Empty means nothing chosen. */
function dayContent(ctx: AppContext, date: string, onClose: () => void): Node[] {
  const s = t();
  const close = h("button", { class: "linkbtn day__close", type: "button" }, s.dayClose);
  close.addEventListener("click", onClose);

  const head = h(
    "div",
    { class: "day__head" },
    // Focused when the panel opens — see `selectDay`. Programmatic only, so it
    // is tabindex -1 and never a tab stop of its own.
    h("h3", { class: "day__title", tabindex: -1 }, s.dayTitle(formatDate(date))),
    close
  );

  const summary = daySummary(ctx.progress, date);
  // A square with no class is not a dead square: it says so, which is the
  // difference between an answer and a button that appears to be broken.
  if (!summary) return [head, h("p", { class: "day__empty" }, s.dayNothing)];

  const facts = h(
    "div",
    { class: "day__facts" },
    h(
      "span",
      { class: "pill", "data-tone": "mastered" },
      formatDuration(summary.seconds, { min: s.unitMinutes, hour: s.unitHours })
    ),
    h("span", { class: "pill" }, s.dayClasses(summary.classes.length)),
    h(
      "span",
      { class: "pill", "data-tone": summary.wrong === 0 ? "done" : "due" },
      s.classSummaryScore(summary.right, summary.right + summary.wrong)
    )
  );
  // How each class stopped, in the order they were held. A day that ended at
  // midnight because nobody pressed the button reads very differently from a
  // day that was finished properly, and the calendar square cannot say which.
  for (const ending of summary.endings) {
    facts.append(h("span", { class: "pill", "data-tone": "rest" }, endingLabel(ending)));
  }

  const out: Node[] = [head, facts];

  const covered = h("ul", { class: "day__covered" });
  for (const id of summary.sections) covered.append(h("li", {}, sectionName(id)));
  for (const id of summary.tables) covered.append(h("li", { "data-kind": "table" }, tableName(id)));
  for (const word of summary.words) covered.append(h("li", { "data-kind": "word" }, word));
  if (covered.childElementCount > 0) {
    out.push(h("p", { class: "day__sub" }, s.classSummaryCovered), covered);
  }

  out.push(h("p", { class: "day__sub" }, s.classSummaryMistakes));
  if (summary.mistakes.length === 0) {
    out.push(h("p", { class: "day__empty" }, s.classSummaryNoMistakes));
    return out;
  }

  // Grouped by kind rather than listed in the order they happened: a word, a
  // table cell and a sentence the tutor put straight are three different jobs
  // to do about them, and the learner reading this is deciding what to revise.
  const groups: readonly { readonly kind: MistakeNote["kind"]; readonly title: string }[] = [
    { kind: "vocab", title: s.classSummaryWords },
    { kind: "table", title: s.classSummaryTables },
    { kind: "grammar", title: s.classSummaryGrammar },
    { kind: "correction", title: s.classSummaryCorrections }
  ];

  for (const group of groups) {
    const notes = summary.mistakes.filter((note) => note.kind === group.kind);
    if (notes.length === 0) continue;
    const list = h("ul", { class: "misslist" });
    for (const note of notes) {
      list.append(
        h(
          "li",
          { class: "misslist__item" },
          h("span", { class: "misslist__cell" }, note.subject),
          h("span", { class: "misslist__answer" }, note.expected),
          note.given ? h("span", { class: "misslist__said" }, note.given) : null
        )
      );
    }
    out.push(h("p", { class: "day__group" }, group.title), list);
  }

  return out;
}

/* -------------------------------------------------------- the book of errors */

/**
 * The two lists the learner asked for by name: the words got wrong, numbered
 * and always with their article, and the grammar-table cells got wrong.
 */
function buildBookOfErrors(ctx: AppContext): HTMLElement {
  const s = t();
  const words = mistakeWords(ctx.progress, allVocab(ctx.progress));
  const cells = mistakeCells(ctx.progress);

  const card = h(
    "section",
    { class: "card" },
    h("h3", { class: "sectiontitle" }, s.mistakeWordsTitle),
    lede(s.mistakeBlurb, ENGLISH_MISTAKE_BLURB)
  );

  if (words.length === 0) {
    card.append(h("p", { class: "note" }, s.mistakeNone));
  } else {
    const body = h("tbody");
    for (const entry of words) {
      body.append(
        h(
          "tr",
          {},
          h("td", { class: "is-n" }, String(entry.n)),
          // `mistakeWords` composes the article (or the auxiliary) into the
          // word itself, so there is no bare noun to print here by accident.
          h("td", { class: "is-word" }, entry.word),
          h("td", {}, entry.meaning),
          h("td", { class: "is-said" }, entry.given || "—"),
          h("td", { class: "is-meta" }, String(entry.misses)),
          h(
            "td",
            { class: "is-meta" },
            formatDate(entry.due),
            h("span", { class: "rung" }, s.mistakeStage(entry.stage))
          )
        )
      );
    }
    card.append(
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
              h("th", {}, s.colNo),
              h("th", {}, s.colWord),
              h("th", {}, s.colMeaning),
              h("th", {}, s.colYourAnswer),
              h("th", {}, s.colTimesWrong),
              h("th", {}, s.colDue)
            )
          ),
          body
        )
      )
    );
  }

  card.append(h("h3", { class: "sectiontitle" }, s.mistakeCellsTitle));
  if (cells.length === 0) {
    card.append(h("p", { class: "note" }, s.mistakeNone));
    return card;
  }

  // A list rather than a table: a cell is four short labels and a sixth column
  // of table names would push the answer off the edge of a phone.
  const list = h("ul", { class: "misslist misslist--numbered" });
  for (const cell of cells) {
    list.append(
      h(
        "li",
        { class: "misslist__item" },
        h("span", { class: "misslist__n" }, String(cell.n)),
        h("span", { class: "misslist__cell" }, `${pick(cell.row)} · ${pick(cell.col)}`),
        h("span", { class: "misslist__answer" }, cell.expected),
        cell.given ? h("span", { class: "misslist__said" }, cell.given) : null,
        h("span", { class: "misslist__table" }, pick(cell.table))
      )
    );
  }
  card.append(list);
  return card;
}

/* ------------------------------------------------- the absorbed progress view */

/**
 * The old progress screen, carried over as it was: the vocabulary streaks, the
 * paradigm grids with their three day-dots, the personal dictionary of cells
 * still outstanding, and the review plan. Only the fourteen-bar history is
 * gone, replaced by the calendar above.
 */
function buildProgressTables(ctx: AppContext): HTMLElement {
  const s = t();
  const bank = curriculumFor(ctx.progress.level);

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

    // Never the bare noun. A German noun learnt without its article has been
    // half learnt, and this is the list the learner reads to revise from.
    const word = h("td", { class: "is-word" }, vocabSubject(item));
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

  const back = h("button", { class: "btn", type: "button" }, s.backHome);
  back.addEventListener("click", () => ctx.go("home"));

  const addWord = h("button", { class: "btn btn--ghost", type: "button" }, s.addWordButton);
  addWord.addEventListener("click", () => openAddWord((item) => ctx.addWord(item)));

  return h(
    "section",
    { class: "card" },
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
    h("p", { class: "note" }, `${s.tablesSecure(secure, bank.grammar.length)} `, h("span", {}, s.intervals)),
    h("div", { class: "actions" }, back, addWord)
  );
}

/* -------------------------------------------------------------- small parts */

/**
 * The immersion rule of the lesson plan: German first, the English rendering
 * on its own line beneath it. The English is written here rather than looked
 * up, exactly as `home.ts` keeps its own lede — in English mode the chrome is
 * already English and there is nothing to gloss, so the catalogue never has to
 * carry a key whose only reader is the German view.
 */
function lede(text: string, english: string): HTMLElement {
  const node = h("p", { class: "lede" }, text);
  if (getLang() === "de") node.append(h("span", { class: "gloss" }, english));
  return node;
}

/* Both copied verbatim from the `en` catalogue, so the two never drift apart. */
const ENGLISH_CALENDAR_BLURB =
  "One square for every day. The longer the class, the greener the square — tap one to see what that day held.";

const ENGLISH_MISTAKE_BLURB =
  "Everything here comes back in class: on day 3, on day 7 and on day 21. Right three times and it is gone.";

/** The locale `formatDate` uses, for the two places that need a piece of a date. */
function locale(): string {
  return getLang() === "de" ? "de-DE" : "en-GB";
}

/** Hours to one decimal, with the separator the learner's language uses. */
function decimal(value: number): string {
  return value.toLocaleString(locale(), { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/** "Sep" / "Sept." — the month alone, which no i18n key can carry sensibly. */
function monthLabel(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(locale(), { month: "short" });
}

/**
 * Section ids are what a class writes down, never names: a day recorded last
 * spring must still read correctly after the syllabus copy has been reworded.
 * Every level is searched rather than only the current one, because a learner
 * who has moved from A2 to B1 still has A2 days in the calendar behind them.
 */
function sectionName(id: string): string {
  for (const syllabus of Object.values(SYLLABI)) {
    const section = syllabus.sections.find((entry) => entry.id === id);
    if (section) return pick(section.title);
  }
  return id;
}

/** The same for a paradigm grid, falling back to the bare id if it has gone. */
function tableName(id: string): string {
  const table = tableById(id);
  return table ? pick(table.name) : id;
}

function endingLabel(ending: ClassEnding): string {
  const s = t();
  if (ending === "ended") return s.endingEnded;
  if (ending === "midnight") return s.endingMidnight;
  return s.endingDropped;
}
