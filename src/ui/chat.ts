import { AiError, aiAvailable, askTeacher, type Turn } from "../ai";
import { t } from "../i18n";
import { h } from "./dom";
import { openPanel, type Overlay } from "./overlay";

/** The "cc" panel — a conversation with the teacher persona. */

const history: Turn[] = [];

export function openChat(): Overlay {
  const s = t();
  const overlay = openPanel({ title: s.chatTitle, badge: "cc" });

  const stream = h("div", { class: "chat__stream" });
  const composer = h("textarea", {
    class: "composer__input",
    rows: "1",
    placeholder: s.chatPlaceholder,
    "aria-label": s.chatTitle
  });
  const send = h("button", { class: "btn composer__send", type: "button" }, s.send);

  overlay.body.append(stream);
  overlay.footer.append(
    h("div", { class: "composer" }, composer, send),
    h("div", { class: "composer__meta" }, h("span", { class: "kbdhint" }, s.chatHint))
  );

  for (const turn of history) bubble(stream, turn.role, turn.content);
  if (history.length === 0) {
    const opener = bubble(stream, "assistant", aiAvailable() ? s.chatWelcome : s.aiDisabled);
    if (!aiAvailable()) opener.dataset["error"] = "true";
  }
  scrollToEnd(stream);
  composer.focus();

  let busy = false;

  const submit = async (): Promise<void> => {
    const text = composer.value.trim();
    if (!text || busy) return;

    busy = true;
    send.setAttribute("disabled", "true");
    composer.value = "";
    grow(composer);

    history.push({ role: "user", content: text });
    bubble(stream, "user", text);

    const answer = bubble(stream, "assistant", s.thinking);
    answer.dataset["pending"] = "true";
    scrollToEnd(stream);

    try {
      const reply = await askTeacher(history);
      answer.dataset["pending"] = "false";
      answer.textContent = reply;
      history.push({ role: "assistant", content: reply });
    } catch (error) {
      answer.dataset["pending"] = "false";
      answer.dataset["error"] = "true";
      answer.textContent = describe(error);
      history.pop();
    } finally {
      busy = false;
      send.removeAttribute("disabled");
      scrollToEnd(stream);
      composer.focus();
    }
  };

  send.addEventListener("click", () => void submit());
  composer.addEventListener("input", () => grow(composer));
  composer.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    void submit();
  });

  return overlay;
}

export function describe(error: unknown): string {
  const s = t();
  if (!(error instanceof AiError)) return s.aiFailed;
  switch (error.code) {
    case "ai_disabled":
      return s.aiDisabled;
    case "sign_in_required":
      return s.aiSignInRequired;
    case "daily_limit":
      return s.aiDailyLimit;
    case "offline":
      return s.aiOffline;
    default:
      return s.aiFailed;
  }
}

function bubble(stream: HTMLElement, role: Turn["role"], text: string): HTMLElement {
  const node = h("div", { class: "bubble", "data-role": role }, text);
  stream.append(node);
  return node;
}

function scrollToEnd(stream: HTMLElement): void {
  stream.scrollTop = stream.scrollHeight;
}

function grow(field: HTMLTextAreaElement): void {
  field.style.height = "auto";
  field.style.height = `${Math.min(field.scrollHeight, 160)}px`;
}
