import { syllabusFor } from "../data/syllabus";
import { tableById } from "../data/tables";
import { pick, t } from "../i18n";
import { formatDuration } from "../profile";
import { consecutiveDays } from "../scheduler";
import type { ClassRecord, MistakeKind, MistakeNote } from "../types";
import { h } from "./dom";
import type { AppContext } from "./context";

/**
 * What the class was.
 *
 * Shown once, straight after "End class", and readable again for ever from the
 * profile's calendar — which is why it is drawn from the `ClassRecord` and not
 * from anything still running. The three things it has to answer are the three
 * a learner actually asks at the end of half an hour: how long was that, what
 * did we do, and what did I get wrong.
 */
export function renderSummary(ctx: AppContext): HTMLElement {
  const s = t();
  const record = ctx.lastClass;

  if (!record) {
    // A class too short to keep, or a summary reached by a stray navigation.
    const card = h(
      "section",
      { class: "card" },
      h("p", { class: "eyebrow" }, s.classSummaryEyebrow),
      h("h2", { class: "display" }, s.classSummaryNothing)
    );
    card.append(h("div", { class: "actions" }, homeButton(ctx)));
    return card;
  }

  const total = record.right + record.wrong;
  const share = total === 0 ? 0 : Math.round((record.right / total) * 100);
  const headline = record.wrong === 0 && total > 0 ? s.classSummaryClean : s.classSummaryTitle;

  const card = h(
    "section",
    { class: "card" },
    h("p", { class: "eyebrow" }, s.classSummaryEyebrow),
    h("h2", { class: "display" }, headline),
    h(
      "div",
      { class: "classdone" },
      figure(formatDuration(record.seconds, { min: s.unitMinutes, hour: s.unitHours }), s.classSummaryDurationLabel),
      figure(total ? `${record.right}/${total}` : "—", s.classSummaryScoreLabel),
      figure(total ? `${share}%` : "—", s.classSummaryShareLabel),
      figure(String(consecutiveDays(ctx.progress.classes)), s.statStreak)
    )
  );

  if (record.ending === "midnight") {
    card.append(h("p", { class: "note" }, s.classSummaryMidnight));
  }

  /* ------------------------------------------------------------- covered */

  const covered = coveredLines(record);
  if (covered.length) {
    card.append(h("h3", { class: "sectiontitle" }, s.classSummaryCovered));
    const list = h("ul", { class: "covered" });
    for (const line of covered) list.append(h("li", { class: "covered__row" }, line));
    card.append(list);
  }

  /* ------------------------------------------------------------ mistakes */

  card.append(h("h3", { class: "sectiontitle" }, s.classSummaryMistakes));
  if (record.mistakes.length === 0) {
    card.append(h("p", { class: "lede" }, s.classSummaryNoMistakes));
  } else {
    const groups: readonly [MistakeKind, string][] = [
      ["vocab", s.classSummaryWords],
      ["table", s.classSummaryTables],
      ["grammar", s.classSummaryGrammar],
      ["correction", s.classSummaryCorrections]
    ];
    for (const [kind, title] of groups) {
      const rows = record.mistakes.filter((note) => note.kind === kind);
      if (rows.length === 0) continue;
      card.append(h("h4", { class: "subtitle" }, title));
      card.append(mistakeList(rows));
    }
    // The promise the book of errors makes, said plainly rather than implied.
    card.append(h("p", { class: "note" }, s.classSummaryReturn(record.mistakes.length)));
  }

  const profile = h("button", { class: "btn btn--ghost", type: "button" }, s.profileButton);
  profile.addEventListener("click", () => ctx.go("profile"));

  card.append(h("div", { class: "actions" }, homeButton(ctx), profile));
  return card;
}

function figure(value: string, label: string): HTMLElement {
  return h(
    "div",
    { class: "classdone__cell" },
    h("span", { class: "classdone__value" }, value),
    h("span", { class: "classdone__label" }, label)
  );
}

function homeButton(ctx: AppContext): HTMLElement {
  const back = h("button", { class: "btn", type: "button" }, t().backHome);
  back.addEventListener("click", () => ctx.go("home"));
  return back;
}

/**
 * What the class covered, in the learner's own terms: the theme by its name,
 * the grids by theirs, the words as they were asked — with their articles,
 * because a noun without one has not really been learnt.
 */
function coveredLines(record: ClassRecord): string[] {
  const s = t();
  const lines: string[] = [];

  const sections = syllabusFor(record.level).sections;
  for (const id of record.sections) {
    const section = sections.find((entry) => entry.id === id);
    if (section) lines.push(s.classSummarySection(pick(section.title)));
  }

  const tables = record.tables
    .map((id) => tableById(id)?.name.de)
    .filter((name): name is string => Boolean(name));
  if (tables.length) lines.push(`${s.classSummaryTables}: ${tables.join(" · ")}`);

  if (record.words.length) lines.push(`${s.classSummaryWords}: ${record.words.join(" · ")}`);

  return lines;
}

function mistakeList(rows: readonly MistakeNote[]): HTMLElement {
  const list = h("ul", { class: "review" });
  for (const note of rows) {
    const answer = h("p", { class: "review__a" });
    if (note.given.trim()) {
      answer.append(h("s", {}, note.given), document.createTextNode(" → "));
    }
    answer.append(h("b", {}, note.expected));

    const entry = h(
      "li",
      { class: "review__row" },
      h("p", { class: "review__q" }, note.subject),
      answer
    );
    if (note.prompt && note.prompt !== note.subject) {
      entry.append(h("p", { class: "review__why" }, note.prompt));
    }
    list.append(entry);
  }
  return list;
}
