import { cellKey } from "../data/tables";
import { judgeEnglish, judgeGerman } from "../grading";
import { getLang, pick, t } from "../i18n";
import { todayISO } from "../scheduler";
import { nextUnanswered } from "../session";
import type { DrillTutor } from "../tutor";
import { asksFor, introFor } from "../tutorscript";
import {
  NO_PLURAL,
  type BlankTask,
  type TableCellTask,
  type TableStudyTask,
  type Task,
  type Verdict,
  type VocabTask
} from "../types";
import type { AppContext } from "./context";
import { describeVoiceError, formatElapsed } from "./voice";
import { esc, h, ICON_CHECK, ICON_MIC, ICON_TILDE, ICON_X, svgIcon } from "./dom";

/**
 * What grading worked out, in the form the tutor needs to talk about it.
 *
 * The screen and the voice have to agree — a learner told "richtig" while
 * looking at a red cross has been given two teachers, not one — so the tutor
 * is handed the very verdict and explanation that were just drawn, rather than
 * forming its own opinion of what it heard.
 */
interface Marked {
  readonly verdict: Verdict;
  /** Only the parts they got wrong, so a correction is about what went wrong. */
  readonly expected: string;
  readonly why: string;
}

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

  /**
   * Grade what is in the fields, however it got there. Typing and speaking end
   * up in the same place on purpose: there is one drill, and a spoken answer
   * is an answer to the same question, marked by the same grader.
   */
  const submit = (): Marked | null => {
    if (graded) return null;
    graded = true;
    session.answered.push(session.index);

    // A study card has nothing to grade: mark the grid as read.
    if (task.kind === "table-study") {
      const state = ctx.progress.tables[task.table.id];
      if (state) state.studied = true;
      ctx.commit();
      return null;
    }

    const marked = grade(ctx, task, inputs, body);
    ctx.commit();
    action.textContent = nextUnanswered(session, session.index) === -1 ? s.finish : s.next;
    return marked;
  };

  /**
   * Mark the answer and, when the round is being spoken, let the tutor say its
   * piece before moving on. Typed or spoken, an answer ends here — so a
   * learner who gives up on saying a word and types it instead still gets the
   * correction out loud.
   */
  const completeAnswer = (): void => {
    const tutor = ctx.tutor;
    const marked = submit();

    if (!tutor?.running) {
      // Unspoken rounds stay as they were: Enter checks, Enter again moves on.
      action.focus();
      return;
    }
    if (!marked) return advance();

    tutor.react(
      marked.verdict,
      {
        given: inputs.map((input) => input.value.trim()).filter(Boolean).join(", "),
        expected: marked.expected,
        why: marked.why
      },
      advance
    );
  };

  action.addEventListener("click", () => {
    if (graded) return advance();
    if (task.kind === "table-study") {
      submit();
      advance();
      return;
    }
    completeAnswer();
  });

  if (ctx.tutor?.running === true) {
    card.prepend(buildTutorStrip(ctx.tutor, inputs));
    driveTutor(ctx.tutor, task, inputs, {
      key: String(session.index),
      complete: completeAnswer,
      isGraded: () => graded
    });
  } else {
    forgetStrip();
  }

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

  // Speaking the answer means the caret is in the way rather than helping: a
  // soft keyboard sliding up over the question is the last thing a learner
  // listening to it needs.
  if (ctx.tutor?.running !== true) queueMicrotask(() => inputs[0]?.focus());
  return card;
}

/* ------------------------------------------------------------ the tutor */

/**
 * The strip above the question, and the one part of the drill that redraws on
 * its own.
 *
 * Everything else here is rebuilt question by question. The strip cannot be:
 * it changes several times a second while the tutor is speaking and the
 * learner is answering, and rebuilding the card that often would throw away
 * the very answer being given. So it is painted in place, through a reference
 * the module keeps, and `paintTutorStrip` is what the tutor calls.
 */
let stripBody: HTMLElement | null = null;
let stripPaint: (() => void) | null = null;

/** Repaint the strip. Called by the tutor on every change of state. */
export function paintTutorStrip(tutor: DrillTutor | null): void {
  if (!tutor || !stripBody) return;
  stripPaint?.();
}

/** Drop the reference when the drill is drawn without a tutor. */
function forgetStrip(): void {
  stripBody = null;
  stripPaint = null;
}

function buildTutorStrip(tutor: DrillTutor, inputs: HTMLInputElement[]): HTMLElement {
  const s = t();
  const orb = h(
    "span",
    { class: "tutor__orb", "data-state": "idle", "aria-hidden": "true" },
    h("span", { class: "tutor__ring" }),
    h("span", { class: "tutor__core" }, svgIcon(ICON_MIC, "microphone"))
  );
  const status = h("p", { class: "tutor__status", role: "status" }, s.tutorConnecting);
  const line = h("p", { class: "tutor__line" });
  const clock = h("span", { class: "tutor__clock", role: "timer" });

  const again = h(
    "button",
    { class: "tutor__tool", type: "button", title: s.tutorRepeat, "aria-label": s.tutorRepeat },
    "↻"
  );
  again.addEventListener("click", () => tutor.repeat());

  const off = h(
    "button",
    { class: "tutor__tool", type: "button", title: s.tutorStop, "aria-label": s.tutorStop },
    "✕"
  );

  const strip = h(
    "div",
    { class: "tutor", "data-phase": "connecting" },
    orb,
    h("div", { class: "tutor__body" }, status, line),
    h("div", { class: "tutor__tools" }, clock, again, off)
  );

  // The call's clock, ticking on its own: the strip repaints on the tutor's
  // events, which is the wrong rhythm for a second hand.
  const ticker = window.setInterval(() => {
    if (!strip.isConnected || !tutor.running) {
      window.clearInterval(ticker);
      return;
    }
    clock.textContent = formatElapsed(tutor.status().elapsed);
  }, 1000);

  off.addEventListener("click", () => {
    tutor.stop();
    // Taken out by hand rather than by redrawing the card: a redraw would
    // rebuild the question from scratch and take a verdict already on screen
    // down with it, which is a strange thing to do to someone who only asked
    // for quiet.
    strip.remove();
    forgetStrip();
    inputs.find((input) => !input.readOnly)?.focus();
  });

  stripBody = strip;
  // Handed back exactly once, when the voice gives out. A learner whose tutor
  // could not connect should find the caret already in the first field rather
  // than a dead card and an apology — the round still works, it is just quiet.
  let handedBack = false;

  stripPaint = (): void => {
    const now = tutor.status();
    strip.dataset["phase"] = now.phase;

    if (!handedBack && (now.phase === "error" || now.phase === "ended")) {
      handedBack = true;
      queueMicrotask(() => inputs.find((input) => !input.readOnly)?.focus());
    }
    // The orb's animations are the voice panel's; "connecting" waits the same
    // way "thinking" does, so it borrows that shape.
    orb.dataset["state"] =
      now.phase === "listening"
        ? "listening"
        : now.phase === "asking"
          ? "speaking"
          : now.phase === "connecting" || now.phase === "thinking"
            ? "thinking"
            : "idle";

    status.textContent = statusLine(now.phase, now.error);
    // What the learner is saying takes the line while they say it; otherwise
    // it shows what the tutor just said, so a question half-heard can be read.
    line.textContent = now.phase === "listening" && now.heard ? now.heard : now.said;
    // Only while the question is actually standing. Asking for it again as the
    // answer is being marked would put a second copy behind the correction.
    again.disabled = now.phase !== "listening";
  };
  stripPaint();
  return strip;
}

function statusLine(phase: ReturnType<DrillTutor["status"]>["phase"], error: unknown): string {
  const s = t();
  switch (phase) {
    case "connecting":
      return s.tutorConnecting;
    case "asking":
      return s.tutorAsking;
    case "listening":
      return s.tutorListening;
    case "thinking":
      return s.tutorThinking;
    case "ended":
      return s.tutorEnded;
    case "error":
      return describeVoiceError(error);
    default:
      return s.tutorOff;
  }
}

interface DriveHooks {
  /** Identifies the question, so a redraw does not ask it twice. */
  readonly key: string;
  /** Grade what is in the fields and let the tutor react. */
  complete(): void;
  isGraded(): boolean;
}

/**
 * Hand the current question to the tutor, one spoken ask at a time.
 *
 * A vocabulary card is three questions out loud where it is one card on
 * screen, so each answer fills its own field and only the last one submits.
 * The learner can still take over at any point — typing an answer grades the
 * card immediately, and `isGraded` is what stops a late transcript from
 * writing into fields that have already been marked.
 */
function driveTutor(
  tutor: DrillTutor,
  task: Task,
  inputs: HTMLInputElement[],
  hooks: DriveHooks
): void {
  if (task.kind === "table-study") {
    tutor.announce(introFor(task));
    return;
  }

  const asks = asksFor(task);
  if (asks.length === 0) return;

  let at = 0;
  const run = (): void => {
    const ask = asks[at];
    if (!ask || hooks.isGraded()) return;

    tutor.ask({
      key: `${hooks.key}:${at}`,
      prompt: ask.prompt,
      expects: ask.expects,
      accepted: ask.accepted,
      onAnswer: (answer) => {
        // They typed it while the tutor was still listening. Their answer is
        // already marked; what came in late is not a second attempt.
        if (hooks.isGraded()) return;

        const field = inputs[ask.field];
        if (field && !field.readOnly) field.value = answer;

        at += 1;
        if (at < asks.length) run();
        else hooks.complete();
      }
    });
  };

  run();
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

  // A mass noun or a plural-only noun has no plural to ask for; the card is
  // two fields, and says so, rather than a third field with no right answer.
  const askForm = isVerb || item.form[0] !== NO_PLURAL;

  addField(isVerb ? s.auxiliary : s.article, isVerb ? "sein / haben" : "der / die / das");
  addField(s.meaning, isVerb ? "to …" : "", !askForm);
  if (askForm) addField(isVerb ? s.participle : s.plural, isVerb ? "ge…" : "die …", true);
  else fields.append(h("p", { class: "field__note" }, `${s.plural}: ${s.noPlural}`));

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

function grade(
  ctx: AppContext,
  task: Task,
  inputs: HTMLInputElement[],
  body: HTMLElement
): Marked | null {
  if (task.kind === "vocab") return gradeVocab(ctx, task, inputs, body);
  if (task.kind === "table-cell") return gradeTableCell(ctx, task, inputs, body);
  // Nothing to grade — handled before grading is reached.
  if (task.kind === "table-study") return null;
  return gradeBlank(ctx, task, inputs, body);
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
): Marked {
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
  return {
    verdict,
    expected: task.answers[0] ?? "",
    why: task.example ? `${s.gridExample}: ${task.example.de}` : ""
  };
}

function gradeVocab(
  ctx: AppContext,
  task: VocabTask,
  inputs: HTMLInputElement[],
  body: HTMLElement
): Marked {
  const s = t();
  const item = task.item;
  const isVerb = item.kind === "verb";
  const [keyInput, enInput, formInput] = inputs as [HTMLInputElement, HTMLInputElement, HTMLInputElement?];

  const keyVerdict = judgeGerman(keyInput.value, [item.key]);
  const enVerdict = judgeEnglish(enInput.value, item.en);
  // No third field for a noun without a plural: nothing to get wrong there.
  const formVerdict: Verdict = formInput ? judgeGerman(formInput.value, item.form) : "ok";

  const marks: Array<[HTMLInputElement, Verdict]> = [
    [keyInput, keyVerdict],
    [enInput, enVerdict]
  ];
  if (formInput) marks.push([formInput, formVerdict]);
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
  // The same three, kept as plain text for the tutor: only what went wrong, so
  // a learner who missed the plural alone is not read the whole card back.
  const missed: string[] = [];
  if (keyVerdict !== "ok") {
    lines.push(`${isVerb ? s.auxiliary : s.article}: <strong>${esc(item.key)}</strong>`);
    missed.push(`${isVerb ? s.auxiliary : s.article}: ${item.key}`);
  }
  if (enVerdict !== "ok") {
    lines.push(`${s.meaning}: <strong>${esc(item.en[0] ?? "")}</strong>`);
    missed.push(`${s.meaning}: ${item.en[0] ?? ""}`);
  }
  if (formInput && formVerdict !== "ok") {
    lines.push(`${isVerb ? s.participle : s.plural}: <strong>${esc(item.form[0] ?? "")}</strong>`);
    missed.push(`${isVerb ? s.participle : s.plural}: ${item.form[0] ?? ""}`);
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
    given: [keyInput.value, enInput.value, formInput?.value ?? ""].filter(Boolean).join(" · "),
    expected: [item.key, item.en[0] ?? "", formInput ? (item.form[0] ?? "") : ""].filter(Boolean).join(" · "),
    why: item.note
  });

  body.append(buildVerdict(verdict, title, lines));
  return { verdict, expected: missed.join(" · "), why: item.note.de };
}

function gradeBlank(
  ctx: AppContext,
  task: BlankTask,
  inputs: HTMLInputElement[],
  body: HTMLElement
): Marked {
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
  return { verdict, expected: question.answers[0] ?? "", why: question.why.de };
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
