/**
 * Double-tap shortcuts: press the same letter twice inside the window and an
 * overlay opens. They deliberately do not fire while the caret sits in a text
 * field — "accept" and "Kaffee" would otherwise trip them mid-answer — so the
 * top bar carries clickable buttons for the same two actions.
 */

const WINDOW_MS = 450;

export interface ShortcutMap {
  [letter: string]: () => void;
}

export function registerDoubleTap(map: ShortcutMap): () => void {
  let lastKey = "";
  let lastAt = 0;

  const isTyping = (target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) return false;
    if (target.isContentEditable) return true;
    const tag = target.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
  };

  const handler = (event: KeyboardEvent): void => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key.length !== 1) return;
    if (isTyping(event.target)) return;

    const key = event.key.toLowerCase();
    const now = Date.now();
    const action = map[key];

    if (action && key === lastKey && now - lastAt < WINDOW_MS) {
      event.preventDefault();
      lastKey = "";
      lastAt = 0;
      action();
      return;
    }
    lastKey = key;
    lastAt = now;
  };

  document.addEventListener("keydown", handler);
  return () => document.removeEventListener("keydown", handler);
}
