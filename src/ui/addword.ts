import { t } from "../i18n";
import type { VocabItem, VocabKind } from "../types";
import { h } from "./dom";
import { openPanel, type Overlay } from "./overlay";

/**
 * The "add a word" panel.
 *
 * A word added here is drilled exactly like one from the bundled bank: it
 * appears in the vocabulary step until it has been answered fully correctly
 * on two consecutive days. Several answers can be accepted for the meaning
 * and the plural or participle, separated by commas, because there is rarely
 * only one right way to say it.
 */
export function openAddWord(onAdd: (item: VocabItem) => void): Overlay {
  const s = t();
  const overlay = openPanel({ title: s.addWordTitle, badge: "+" });

  let kind: VocabKind = "noun";

  const field = (label: string, placeholder: string, hint?: string): {
    input: HTMLInputElement;
    row: HTMLElement;
    caption: HTMLElement;
  } => {
    const input = h("input", {
      class: "field__input",
      type: "text",
      autocomplete: "off",
      autocapitalize: "off",
      spellcheck: "false",
      placeholder,
      "aria-label": label
    });
    const caption = h("span", { class: "field__label" }, label);
    const row = h("label", { class: "addword__row" }, caption, input);
    if (hint) row.append(h("span", { class: "addword__hint" }, hint));
    return { input, row, caption };
  };

  const word = field(s.addWordWord, s.addWordWordPlaceholder);
  const key = field(s.article, "der / die / das");
  const meaning = field(s.meaning, "doctor, physician", s.addWordCommaHint);
  const form = field(s.plural, "die Ärztinnen", s.addWordCommaHint);
  const note = field(s.addWordNote, s.addWordNotePlaceholder);

  /* noun or verb decides what two of the fields even mean ---------------- */
  const nounButton = h("button", { type: "button", "aria-pressed": "true" }, s.noun);
  const verbButton = h("button", { type: "button", "aria-pressed": "false" }, s.verb);
  const kindGroup = h("div", { class: "segmented", role: "group", "aria-label": s.addWordKind }, nounButton, verbButton);

  const setKind = (next: VocabKind): void => {
    kind = next;
    nounButton.setAttribute("aria-pressed", String(next === "noun"));
    verbButton.setAttribute("aria-pressed", String(next === "verb"));

    const isVerb = next === "verb";
    key.caption.textContent = isVerb ? s.auxiliary : s.article;
    key.input.placeholder = isVerb ? "sein / haben" : "der / die / das";
    key.input.setAttribute("aria-label", isVerb ? s.auxiliary : s.article);
    form.caption.textContent = isVerb ? s.participle : s.plural;
    form.input.placeholder = isVerb ? "aufgewacht" : "die Ärztinnen";
    form.input.setAttribute("aria-label", isVerb ? s.participle : s.plural);
    word.input.placeholder = isVerb ? "aufwachen" : s.addWordWordPlaceholder;
  };
  nounButton.addEventListener("click", () => setKind("noun"));
  verbButton.addEventListener("click", () => setKind("verb"));

  const status = h("p", { class: "login__status", role: "status" });
  const submit = h("button", { class: "btn", type: "submit" }, s.addWordAction);

  const form_ = h(
    "form",
    { class: "addword", novalidate: "true" },
    h("div", { class: "addword__row" }, h("span", { class: "field__label" }, s.addWordKind), kindGroup),
    word.row,
    key.row,
    meaning.row,
    form.row,
    note.row,
    status
  );

  overlay.body.append(form_);
  overlay.footer.append(submit);

  const list = (value: string): string[] =>
    value
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

  form_.addEventListener("submit", (event) => {
    event.preventDefault();

    const wordValue = word.input.value.trim();
    const keyValue = key.input.value.trim().toLowerCase();
    const meanings = list(meaning.input.value);
    const forms = list(form.input.value);

    const allowed = kind === "verb" ? ["sein", "haben"] : ["der", "die", "das"];
    if (!wordValue) return fail(s.addWordNeedWord, word.input);
    if (!allowed.includes(keyValue)) {
      return fail(kind === "verb" ? s.addWordNeedAuxiliary : s.addWordNeedArticle, key.input);
    }
    if (!meanings.length) return fail(s.addWordNeedMeaning, meaning.input);
    if (!forms.length) {
      return fail(kind === "verb" ? s.addWordNeedParticiple : s.addWordNeedPlural, form.input);
    }

    const noteText = note.input.value.trim();
    onAdd({
      id: `cv_${uuid()}`,
      kind,
      word: wordValue,
      key: keyValue,
      en: meanings,
      form: forms,
      note: { de: noteText, en: noteText }
    });
    overlay.close();
  });

  function fail(message: string, focus: HTMLInputElement): void {
    status.dataset["tone"] = "no";
    status.textContent = message;
    focus.focus();
  }

  setKind("noun");
  queueMicrotask(() => word.input.focus());
  return overlay;
}

function uuid(): string {
  const random = globalThis.crypto;
  if (random && "randomUUID" in random) return random.randomUUID();
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}
