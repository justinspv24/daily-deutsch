import { judgeEnglish, judgeGerman } from "../grading";
import { getLang, pick, t } from "../i18n";
import { todayISO } from "../scheduler";
import type { BlankTask, Task, Verdict, VocabTask } from "../types";
import type { AppContext } from "./context";
import { esc, h } from "./dom";

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
  const body = h("div", { class: "qbody" });
  const action = h("button", { class: "btn", type: "button" }, s.check);
  const card = h(
    "section",
    { class: "card" },
    h(
      "div",
      { class: "qhead" },
      h("p", { class: "eyebrow" }, task.kind === "vocab" ? s.vocabCheck : pick(task.label)),
      h("span", { class: "qcount" }, `${session.index + 1} / ${session.tasks.length}`)
    ),
    h(
      "div",
      { class: "rail" },
      h("i", {
        class: "rail__fill",
        style: `width:${Math.round((session.index / session.tasks.length) * 100)}%`
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

  const inputs =
    task.kind === "vocab" ? buildVocabFields(body, task) : buildBlankField(body, task);

  let graded = false;
  const advance = (): void => {
    session.index += 1;
    ctx.refresh();
  };

  action.addEventListener("click", () => {
    if (graded) {
      if (session.index + 1 >= session.tasks.length) ctx.go("summary");
      else advance();
      return;
    }
    graded = true;
    grade(ctx, task, inputs, body);
    ctx.commit();
    action.textContent = session.index + 1 >= session.tasks.length ? s.finish : s.next;
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

  const addField = (label: string, placeholder: string): void => {
    const input = h("input", {
      class: "field__input",
      type: "text",
      autocomplete: "off",
      autocapitalize: "off",
      spellcheck: "false",
      placeholder,
      "aria-label": label
    });
    fields.append(h("label", { class: "field" }, h("span", { class: "field__label" }, label), input));
    collected.push(input);
  };

  addField(isVerb ? s.auxiliary : s.article, isVerb ? "sein / haben" : "der / die / das");
  addField(s.meaning, isVerb ? "to …" : "");
  addField(isVerb ? s.participle : s.plural, isVerb ? "ge…" : "die …");

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
    spellcheck: "false",
    "aria-label": "Antwort"
  });

  parts.forEach((part, index) => {
    prompt.append(document.createTextNode(part));
    if (index < parts.length - 1) prompt.append(input);
  });
  body.append(prompt);
  body.append(h("p", { class: "hint", html: pick(task.question.hint) }));
  return [input];
}

/* ---------------------------------------------------------------- grading */

function grade(ctx: AppContext, task: Task, inputs: HTMLInputElement[], body: HTMLElement): void {
  if (task.kind === "vocab") gradeVocab(ctx, task, inputs, body);
  else gradeBlank(ctx, task, inputs, body);
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
  const box = h("div", { class: "verdict", "data-verdict": verdict, role: "status" });
  box.append(h("p", { class: "verdict__title" }, title));
  for (const line of lines) {
    if (!line) continue;
    box.append(h("p", { class: "verdict__line", html: line }));
  }
  return box;
}
