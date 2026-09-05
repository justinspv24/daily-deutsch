import { translate } from "../ai";
import { t } from "../i18n";
import { describe } from "./chat";
import { h } from "./dom";
import { openPanel, type Overlay } from "./overlay";

/** The "tt" panel — direction detected automatically, both ways. */

const DEBOUNCE_MS = 900;
const MIN_LENGTH = 2;

let lastInput = "";

export function openTranslator(): Overlay {
  const s = t();
  const overlay = openPanel({ title: s.translateTitle, badge: "tt" });

  const source = h("textarea", {
    class: "translate__source",
    rows: "3",
    placeholder: s.translatePlaceholder,
    "aria-label": s.translateTitle
  });
  const direction = h("span", { class: "translate__direction" }, "—");
  const output = h("div", { class: "translate__output", "data-state": "idle" }, s.translateEmpty);
  const note = h("p", { class: "translate__note" });

  overlay.body.append(
    source,
    h(
      "div",
      { class: "translate__result" },
      h(
        "div",
        { class: "translate__resulthead" },
        h("span", { class: "eyebrow" }, s.translation),
        direction
      ),
      output,
      note
    )
  );
  overlay.footer.append(h("span", { class: "kbdhint" }, s.translateHint));

  source.value = lastInput;
  source.focus();

  let timer: ReturnType<typeof setTimeout> | null = null;
  let latest = 0;

  const run = async (): Promise<void> => {
    const text = source.value.trim();
    lastInput = source.value;

    if (text.length < MIN_LENGTH) {
      output.dataset["state"] = "idle";
      output.textContent = s.translateEmpty;
      direction.textContent = "—";
      note.textContent = "";
      return;
    }

    const ticket = ++latest;
    output.dataset["state"] = "busy";
    output.textContent = s.thinking;
    note.textContent = "";

    try {
      const result = await translate(text);
      if (ticket !== latest) return;
      output.dataset["state"] = "ready";
      output.textContent = result.translation;
      direction.textContent = result.direction === "en→de" ? "EN → DE" : "DE → EN";
      note.textContent = result.note;
    } catch (error) {
      if (ticket !== latest) return;
      output.dataset["state"] = "error";
      output.textContent = describe(error);
      direction.textContent = "—";
      note.textContent = "";
    }
  };

  source.addEventListener("input", () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => void run(), DEBOUNCE_MS);
  });
  source.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    if (timer) clearTimeout(timer);
    void run();
  });

  if (source.value.trim().length >= MIN_LENGTH) void run();
  return overlay;
}
