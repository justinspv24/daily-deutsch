import { t } from "../i18n";
import { formatClock, player } from "../player";
import { h } from "./dom";

/**
 * The strip at the bottom of the screen while an episode is loaded. It is
 * built once by the shell and repainted by the player, so it survives every
 * change of view — the learner can start an episode from the syllabus, go
 * and do a round, and still have the controls under their thumb.
 */
export function buildPlayerBar(): HTMLElement {
  const s = t();

  const toggle = h("button", { class: "playerbar__btn playerbar__btn--main", type: "button", "aria-label": s.podcastPlay }, "▶");
  const back = h("button", { class: "playerbar__btn", type: "button", "aria-label": s.playerBack }, "−15");
  const forward = h("button", { class: "playerbar__btn", type: "button", "aria-label": s.playerForward }, "+15");
  const close = h("button", { class: "playerbar__btn playerbar__btn--close", type: "button", "aria-label": s.playerClose }, "✕");
  const title = h("p", { class: "playerbar__title" });
  const meta = h("p", { class: "playerbar__meta" });
  const range = h("input", { class: "playerbar__range", type: "range", min: "0", max: "0", value: "0", step: "1", "aria-label": s.playerSeek });
  const time = h("span", { class: "playerbar__time" });

  toggle.addEventListener("click", () => player.toggle());
  back.addEventListener("click", () => player.skip(-15));
  forward.addEventListener("click", () => player.skip(15));
  close.addEventListener("click", () => player.stop());
  // Seeking from the bar: the range is the learner's, not the clock's, while
  // their finger is on it.
  let scrubbing = false;
  range.addEventListener("input", () => {
    scrubbing = true;
    time.textContent = formatClock(Number(range.value));
  });
  range.addEventListener("change", () => {
    scrubbing = false;
    player.seek(Number(range.value));
  });

  const bar = h(
    "div",
    { class: "playerbar", hidden: true, role: "region", "aria-label": s.podcastsTitle },
    toggle,
    h("div", { class: "playerbar__body" }, title, meta, h("div", { class: "playerbar__row" }, range, time)),
    h("div", { class: "playerbar__tools" }, back, forward, close)
  );

  player.subscribe((state) => {
    const on = state.episode !== null;
    bar.hidden = !on;
    document.body.classList.toggle("has-player", on);
    if (!state.episode) return;
    title.textContent = state.episode.label.de;
    meta.textContent = state.error
      ? s.playerError
      : state.loading
        ? s.playerLoading
        : `${state.episode.show} · ${state.episode.title}`;
    toggle.textContent = state.playing ? "❚❚" : "▶";
    toggle.setAttribute("aria-label", state.playing ? s.podcastPause : s.podcastPlay);
    if (!scrubbing) {
      range.max = String(state.duration || 0);
      range.value = String(state.position);
      time.textContent = state.duration
        ? `${formatClock(state.position)} / ${formatClock(state.duration)}`
        : formatClock(state.position);
    }
  });

  return bar;
}
