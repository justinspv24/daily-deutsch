import { cellKey } from "../data/tables";
import { judgeEnglish, judgeGerman } from "../grading";
import { getLang, pick, t } from "../i18n";
import { todayISO } from "../scheduler";
import { nextUnanswered } from "../session";
import type {
  BlankTask,
  TableCellTask,
  TableStudyTask,
  Task,
  Verdict,
  VocabTask
} from "../types";
import type { AppContext } from "./context";
import { esc, h, ICON_CHECK, ICON_TILDE, ICON_X, svgIcon } from "./dom";

/**
 * One question per screen. Enter checks; Enter again moves on — so a whole
 * round can be done from the keyboard without touching the mouse.
 */
export function renderDrill(ctx: AppContext): HTMLElement {
  const session = ctx.session;
  if (!session) return h("div");
  const task = session.tasks[session.index];
  if (!task) return h("div");

  const s = t();
  const isStudy = task.kind === "table-study";
  const body = h("div", { class: "qbody" });
  const action = h("button", { class: "btn", type: "button" }, isStudy ? s.next : s.check);
  const card = h(
    "section",
    { class: "card" },
    h(
      "div",
      { class: "qhead" },
      h("p", { class: "eyebrow" }, eyebrowFor(task)),
      h("span", { class: "qcount" }, `${session.index + 1} / ${session.tasks.length}`)
    ),
    h(
      "div",
      { class: "rail" },
      h("i", {
        class: "rail__fill",
        style: `width:${Math.round((session.answered.length / session.tasks.length) * 100)}%`
      })
    ),
    body,
    h(
      "div",
      { class: "actions" },
      action,
      h("span", { class: "kbdhint" }, task.kind === "vocab" ? s.navHint : s.enterHint)
    )
  );

  const inputs = buildFields(body, task);
  // Umlauts need a long-press on a phone keyboard, so the answer fields get
  // their own key strip. CSS keeps it to touch devices.
  if (inputs.length > 0) body.append(umlautBar(inputs));

  let graded = false;

  const advance = (): void => {
    const next = nextUnanswered(session, session.index);
    if (next === -1) ctx.go("summary");
    else {
      session.index = next;
      ctx.refresh();
    }
  };

  action.addEventListener("click", () => {
    if (graded) {
      advance();
      return;
    }
    // A study card has nothing to grade: mark the grid as read and move on.
    if (task.kind === "table-study") {
      graded = true;
      session.answered.push(session.index);
      const state = ctx.progress.tables[task.table.id];
      if (state) state.studied = true;
      ctx.commit();
      advance();
      return;
    }
    graded = true;
    session.answered.push(session.index);
    grade(ctx, task, inputs, body);
    ctx.commit();
    action.textContent = nextUnanswered(session, session.index) === -1 ? s.finish : s.next;
    action.focus();
  });

  /**
   * Keyboard model, so a whole round can be typed without reaching for the
   * mouse: ↓ and ↑ step between the fields of a vocabulary card, Enter moves
   * on to the next field, and Enter in the last field checks the answer.
   * Once an answer is graded the inputs are locked, so Enter simply advances.
   */
  const focusField = (target: number): boolean => {
    const field = inputs[target];
    if (!field || field.readOnly) return false;
    field.focus();
    field.select();
    return true;
  };

  card.addEventListener("keydown", (event) => {
    const key = event.key;
    if (key !== "Enter" && key !== "ArrowDown" && key !== "ArrowUp") return;

    const position = inputs.indexOf(event.target as HTMLInputElement);
    if (!graded && position !== -1) {
      const step = key === "ArrowUp" ? -1 : 1;
      const isMove = key !== "Enter" || position < inputs.length - 1;
      if (isMove && focusField(position + step)) {
        event.preventDefault();
        return;
      }
      // ↑ in the first field or ↓ in the last: leave the caret alone.
      if (key !== "Enter") return;
    }

    if (key !== "Enter") return;
    event.preventDefault();
    action.click();
  });

  queueMicrotask(() => inputs[0]?.focus());
  return card;
}

/* --------------------------------------------------------------- builders */

function eyebrowFor(task: Task): string {
  const s = t();
  if (task.kind === "vocab") return s.vocabCheck;
  if (task.kind === "table-study") return s.gridStudyEyebrow;
  if (task.kind === "table-cell") return pick(task.tableName);
  return pick(task.label);
}

function buildFields(body: HTMLElement, task: Task): HTMLInputElement[] {
  switch (task.kind) {
    case "vocab":
      return buildVocabFields(body, task);
    case "table-study":
      return buildTableStudy(body, task);
    case "table-cell":
      return buildTableCellField(body, task);
    default:
      return buildBlankField(body, task);
  }
}

/**
 * The whole grid, read once before any of it is asked. German on top, the
 * learner's own language underneath, and a worked sentence per row so the
 * table is never just sixteen unexplained words.
 */
function buildTableStudy(body: HTMLElement, task: TableStudyTask): HTMLInputElement[] {
  const s = t();
  const table = task.table;

  body.append(
    h("div", { class: "headword" }, h("span", { class: "headword__word" }, pick(table.name))),
    h("p", { class: "hint" }, pick(table.blurb)),
    h("p", { class: "gloss gloss--ml" }, table.blurb.ml)
  );

  const header = h("tr", {}, h("th", { class: "paradigm__corner" }, ""));
  for (const column of table.columns) {
    header.append(
      h(
        "th",
        {},
        h("span", { class: "paradigm__head" }, column.de),
        h("span", { class: "paradigm__gloss" }, column.ml)
      )
    );
  }

  const rows = h("tbody");
  for (const row of table.rows) {
    const tr = h(
      "tr",
      {},
      h(
        "th",
        { class: "paradigm__rowhead", scope: "row" },
        h("span", { class: "paradigm__head" }, row.label.de),
        h("span", { class: "paradigm__gloss" }, row.label.ml)
      )
    );
    for (const cell of row.cells) tr.append(h("td", {}, cell[0] ?? ""));
    rows.append(tr);
  }

  body.append(
    h(
      "div",
      { class: "paradigm__wrap" },
      h("table", { class: "paradigm" }, h("thead", {}, header), rows)
    )
  );

  body.append(
    h("p", { class: "verdict__line" }, `${s.gridExample}: ${table.example.de}`),
    h("p", { class: "gloss" }, table.example.en),
    h("p", { class: "gloss gloss--ml" }, table.example.ml),
    h("p", { class: "kbdhint" }, s.gridStudyHint)
  );
  return [];
}

function buildTableCellField(body: HTMLElement, task: TableCellTask): HTMLInputElement[] {
  const s = t();
  const input = h("input", {
    class: "blank",
    type: "text",
    autocomplete: "off",
    autocapitalize: "off",
    autocorrect: "off",
    spellcheck: "false",
    enterkeyhint: "done",
    "aria-label": "Antwort"
  });

  body.append(
    h(
      "div",
      { class: "headword" },
      h("span", { class: "headword__word" }, s.gridCellPrompt(task.rowLabel.de, task.colLabel.de)),
      h("span", { class: "headword__kind" }, pick(task.tableName))
    ),
    h("p", { class: "prompt" }, input),
    h("p", { class: "gloss gloss--ml" }, `${task.rowLabel.ml} · ${task.colLabel.ml}`)
  );
  return [input];
}

/** ä ö ü ß, inserted at the caret of whichever field was last focused. */
const UMLAUTS = ["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"] as const;

function umlautBar(inputs: HTMLInputElement[]): HTMLElement {
  const bar = h("div", { class: "umlauts", "aria-label": "Umlaute" });
  let target: HTMLInputElement = inputs[0]!;
  for (const input of inputs) {
    input.addEventListener("focus", () => {
      target = input;
    });
  }

  for (const char of UMLAUTS) {
    const key = h("button", { class: "umlauts__key", type: "button", tabindex: "-1" }, char);
    // Without this the field blurs before the click lands and the caret is lost.
    key.addEventListener("mousedown", (event) => event.preventDefault());
    key.addEventListener("click", () => {
      if (target.readOnly) return;
      const start = target.selectionStart ?? target.value.length;
      const end = target.selectionEnd ?? start;
      target.value = target.value.slice(0, start) + char + target.value.slice(end);
      const caret = start + char.length;
      target.setSelectionRange(caret, caret);
      target.focus();
    });
    bar.append(key);
  }
  return bar;
}

function buildVocabFields(body: HTMLElement, task: VocabTask): HTMLInputElement[] {
  const s = t();
  const item = task.item;
  const isVerb = item.kind === "verb";

  body.append(
    h(
      "div",
      { class: "headword" },
      h("span", { class: "headword__word" }, item.word),
      h("span", { class: "headword__kind" }, isVerb ? s.verb : s.noun)
    )
  );

  const fields = h("div", { class: "fields" });
  const collected: HTMLInputElement[] = [];

  const addField = (label: string, placeholder: string, last = false): void => {
    const input = h("input", {
      class: "field__input",
      type: "text",
      autocomplete: "off",
      autocapitalize: "off",
      autocorrect: "off",
      spellcheck: "false",
      // The soft keyboard's action key: "next" walks the three fields, "done"
      // on the last one submits the card.
      enterkeyhint: last ? "done" : "next",
      placeholder,
      "aria-label": label
    });
    fields.append(h("label", { class: "field" }, h("span", { class: "field__label" }, label), input));
    collected.push(input);
  };

  addField(isVerb ? s.auxiliary : s.article, isVerb ? "sein / haben" : "der / die / das");
  addField(s.meaning, isVerb ? "to …" : "");
  addField(isVerb ? s.participle : s.plural, isVerb ? "ge…" : "die …", true);

  body.append(fields);
  return collected;
}

function buildBlankField(body: HTMLElement, task: BlankTask): HTMLInputElement[] {
  const parts = task.question.sentence.split("___");
  const prompt = h("p", { class: "prompt" });
  const input = h("input", {
    class: "blank",
    type: "text",
    autocomplete: "off",
    autocapitalize: "off",
    autocorrect: "off",
    spellcheck: "false",
    enterkeyhint: "done",
    "aria-label": "Antwort"
  });

  parts.forEach((part, index) => {
    prompt.append(document.createTextNode(part));
    if (index < parts.length - 1) prompt.append(input);
  });
  // "Schreib richtig: schule" has no gap in the sentence — the answer goes after it.
  if (parts.length === 1) prompt.append(document.createTextNode(" "), input);
  body.append(prompt);
  body.append(h("p", { class: "hint", html: pick(task.question.hint) }));
  return [input];
}

/* ---------------------------------------------------------------- grading */

function grade(ctx: AppContext, task: Task, inputs: HTMLInputElement[], body: HTMLElement): void {
  if (task.kind === "vocab") gradeVocab(ctx, task, inputs, body);
  else if (task.kind === "table-cell") gradeTableCell(ctx, task, inputs, body);
  else if (task.kind === "table-study") {
    /* nothing to grade — handled before grading is reached */
  } else gradeBlank(ctx, task, inputs, body);
}

/**
 * A missed cell is recorded against the table so it lands in that table's
 * personal dictionary and is asked first the next day. The three-day chain
 * itself is settled once, at the summary.
 */
function gradeTableCell(
  ctx: AppContext,
  task: TableCellTask,
  inputs: HTMLInputElement[],
  body: HTMLElement
): void {
  const s = t();
  const input = inputs[0]!;
  const verdict = judgeGerman(input.value, task.answers);
  const correct = verdict === "ok";

  input.dataset["mark"] = correct ? "ok" : "no";
  input.readOnly = true;

  const hit = ctx.session?.tableHits[task.tableId];
  if (hit) {
    if (correct) {
      hit.right += 1;
    } else {
      hit.wrong += 1;
      hit.missed.push(cellKey(task.tableId, task.row, task.col));
    }
  }

  const lines: string[] = [];
  if (!correct) lines.push(`${s.correctAnswer}: <strong>${esc(task.answers[0] ?? "")}</strong>`);
  if (task.example) {
    lines.push(`${s.gridExample}: ${esc(task.example.de)}`);
    lines.push(`<em>${esc(task.example.en)}</em>`);
    lines.push(`<em>${esc(task.example.ml)}</em>`);
  }

  ctx.session?.results.push({
    prompt: `${task.rowLabel.de} · ${task.colLabel.de}`,
    ok: correct,
    given: input.value,
    expected: task.answers[0] ?? "",
    why: task.example ? { de: task.example.de, en: task.example.en } : null
  });

  body.append(buildVerdict(verdict, correct ? s.correct : s.notQuite, lines));
}

function gradeVocab(
  ctx: AppContext,
  task: VocabTask,
  inputs: HTMLInputElement[],
  body: HTMLElement
): void {
  const s = t();
  const item = task.item;
  const isVerb = item.kind === "verb";
  const [keyInput, enInput, formInput] = inputs as [HTMLInputElement, HTMLInputElement, HTMLInputElement];

  const keyVerdict = judgeGerman(keyInput.value, [item.key]);
  const enVerdict = judgeEnglish(enInput.value, item.en);
  const formVerdict = judgeGerman(formInput.value, item.form);

  const marks: Array<[HTMLInputElement, Verdict]> = [
    [keyInput, keyVerdict],
    [enInput, enVerdict],
    [formInput, formVerdict]
  ];
  for (const [input, verdict] of marks) {
    input.dataset["mark"] = verdict === "ok" ? "ok" : "no";
    input.readOnly = true;
  }

  const allCorrect = keyVerdict === "ok" && enVerdict === "ok" && formVerdict === "ok";
  const verdict: Verdict = allCorrect
    ? "ok"
    : keyVerdict === "near" || formVerdict === "near"
      ? "near"
      : "no";

  const state = ctx.progress.vocab[item.id];
  if (state) {
    state.seen += 1;
    state.lastDate = todayISO();
    state.streak = allCorrect ? state.streak + 1 : 0;
  }

  const lines: string[] = [];
  if (keyVerdict !== "ok") lines.push(`${isVerb ? s.auxiliary : s.article}: <strong>${esc(item.key)}</strong>`);
  if (enVerdict !== "ok") lines.push(`${s.meaning}: <strong>${esc(item.en[0] ?? "")}</strong>`);
  if (formVerdict !== "ok") {
    lines.push(`${isVerb ? s.participle : s.plural}: <strong>${esc(item.form[0] ?? "")}</strong>`);
  }
  if (!allCorrect) lines.push(`<em>${esc(pick(item.note))}</em>`);

  const streak = state?.streak ?? 0;
  const title = allCorrect
    ? streak >= 2
      ? s.masteredNow
      : s.oneMoreDay(streak)
    : s.counterReset;

  ctx.session?.results.push({
    prompt: item.word,
    ok: allCorrect,
    given: [keyInput.value, enInput.value, formInput.value].filter(Boolean).join(" · "),
    expected: `${item.key} · ${item.en[0] ?? ""} · ${item.form[0] ?? ""}`,
    why: item.note
  });

  body.append(buildVerdict(verdict, title, lines));
}

function gradeBlank(
  ctx: AppContext,
  task: BlankTask,
  inputs: HTMLInputElement[],
  body: HTMLElement
): void {
  const s = t();
  const input = inputs[0]!;
  const question = task.question;
  const verdict = judgeGerman(input.value, question.answers, question.caseSensitive === true);
  const correct = verdict === "ok";

  input.dataset["mark"] = correct ? "ok" : "no";
  input.readOnly = true;

  if (task.bank === "grammar") {
    const state = ctx.progress.grammar[task.sourceId];
    if (state) {
      state.seen += 1;
      state.streak = correct ? state.streak + 1 : 0;
    }
  } else {
    const hit = ctx.session?.topicHits[task.sourceId];
    if (hit) {
      if (correct) hit.right += 1;
      else hit.wrong += 1;
    }
  }

  const lines: string[] = [];
  if (!correct) lines.push(`${s.correctAnswer}: <strong>${esc(question.answers[0] ?? "")}</strong>`);
  lines.push(esc(pick(question.why)));
  if (getLang() === "de" && !correct) lines.push(`<em>${esc(question.why.en)}</em>`);

  ctx.session?.results.push({
    prompt: question.sentence.replace("___", "____"),
    ok: correct,
    given: input.value,
    expected: question.answers[0] ?? "",
    why: question.why
  });

  const title = verdict === "ok" ? s.correct : verdict === "near" ? s.nearly : s.notQuite;
  body.append(buildVerdict(verdict, title, lines));
}

function buildVerdict(verdict: Verdict, title: string, lines: readonly string[]): HTMLElement {
  const icon = verdict === "ok" ? ICON_CHECK : verdict === "near" ? ICON_TILDE : ICON_X;
  const text = h("div", { class: "verdict__text" }, h("p", { class: "verdict__title" }, title));
  for (const line of lines) {
    if (!line) continue;
    text.append(h("p", { class: "verdict__line", html: line }));
  }
  return h(
    "div",
    { class: "verdict", "data-verdict": verdict, role: "status" },
    h("span", { class: "verdict__icon", "aria-hidden": "true" }, svgIcon(icon, verdict)),
    text
  );
}
