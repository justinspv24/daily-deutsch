import { t } from "../i18n";
import { h } from "./dom";

/** A single modal panel shared by the chat and the translator. */
export interface Overlay {
  readonly root: HTMLElement;
  readonly body: HTMLElement;
  readonly footer: HTMLElement;
  close(): void;
  isOpen(): boolean;
}

export interface OverlayOptions {
  title: string;
  badge: string;
  onClose?: () => void;
}

let openOverlay: Overlay | null = null;

export function currentOverlay(): Overlay | null {
  return openOverlay;
}

export function openPanel(options: OverlayOptions): Overlay {
  openOverlay?.close();

  const body = h("div", { class: "panel__body" });
  const footer = h("div", { class: "panel__footer" });

  const closeButton = h(
    "button",
    { class: "panel__close", type: "button", "aria-label": t().close, title: t().close },
    "✕"
  );

  const panel = h(
    "div",
    { class: "panel", role: "dialog", "aria-modal": "true", "aria-label": options.title },
    h(
      "header",
      { class: "panel__head" },
      h("span", { class: "panel__badge" }, options.badge),
      h("h2", { class: "panel__title" }, options.title),
      closeButton
    ),
    body,
    footer
  );

  const root = h("div", { class: "scrim" }, panel);
  const previouslyFocused = document.activeElement;

  const overlay: Overlay = {
    root,
    body,
    footer,
    isOpen: () => root.isConnected,
    close() {
      if (!root.isConnected) return;
      root.remove();
      document.removeEventListener("keydown", onKeydown, true);
      if (openOverlay === overlay) openOverlay = null;
      options.onClose?.();
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    }
  };

  function onKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      event.preventDefault();
      overlay.close();
      return;
    }
    if (event.key !== "Tab") return;
    // Keep tabbing inside the panel while it is open.
    const focusable = [
      ...panel.querySelectorAll<HTMLElement>(
        'button, textarea, input, [href], select, [tabindex]:not([tabindex="-1"])'
      )
    ].filter((el) => !el.hasAttribute("disabled"));
    if (focusable.length === 0) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    const active = document.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  closeButton.addEventListener("click", () => overlay.close());
  root.addEventListener("mousedown", (event) => {
    if (event.target === root) overlay.close();
  });
  document.addEventListener("keydown", onKeydown, true);

  document.body.append(root);
  openOverlay = overlay;
  return overlay;
}
