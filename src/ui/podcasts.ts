import { LEVELS } from "../data/curriculum";
import { episodesFor, showsFor } from "../data/media";
import { syllabusFor } from "../data/syllabus";
import { pick, t } from "../i18n";
import { formatClock, player } from "../player";
import type { Level, PodcastEpisode } from "../types";
import type { AppContext } from "./context";
import { clear, h, ICON_ARROW, svgIcon } from "./dom";

/**
 * The podcast screen: the shows that suit a level, and their episodes laid
 * out by syllabus section, so listening follows the same map as the drill.
 * Tapping an episode plays it in the app — through the one player that
 * outlives this screen — rather than sending the learner off to another app.
 */
export function renderPodcasts(ctx: AppContext): HTMLElement {
  const s = t();
  const own = ctx.progress.level;
  let shown: Level = own ?? "A1";

  const tabs = h("div", { class: "segmented segmented--wide syllabus__tabs", role: "tablist" });
  const buttons = LEVELS.map((level) => {
    const button = h("button", { type: "button", role: "tab", "aria-selected": String(level === shown), "data-level": level }, level);
    if (level === own) button.append(h("span", { class: "syllabus__own", "aria-label": s.syllabusYourLevel }, "●"));
    button.addEventListener("click", () => {
      shown = level;
      buttons.forEach((b, i) => b.setAttribute("aria-selected", String(LEVELS[i] === shown)));
      paintLevel();
    });
    tabs.append(button);
    return button;
  });

  const head = h(
    "section",
    { class: "card" },
    h("p", { class: "eyebrow" }, s.podcastsEyebrow),
    h("h2", { class: "display" }, s.podcastsTitle),
    h("p", { class: "lede" }, s.podcastsLede),
    h("p", { class: "kbdhint hero__speakhint" }, s.podcastsBackground),
    tabs
  );

  const body = h("div", { class: "syllabus__body" });

  const paintLevel = (): void => {
    clear(body);
    const shows = showsFor(shown);
    const episodes = episodesFor(shown);

    const showList = h("div", { class: "shows" });
    for (const show of shows) {
      showList.append(
        h(
          "a",
          { class: "show", href: show.homepage, target: "_blank", rel: "noopener noreferrer" },
          h("span", { class: "show__name" }, show.name),
          h("span", { class: "show__fit" }, show.fit),
          h("span", { class: "show__evidence" }, `${s.mediaEvidence}: ${show.evidence}`)
        )
      );
    }

    body.append(
      h(
        "section",
        { class: "card syllabus__level", "data-level": shown },
        h("span", { class: "levelcard__code" }, shown),
        h("h3", { class: "syllabus__leveltitle" }, s.podcastsShows(shown)),
        shows.length ? showList : h("p", { class: "hint" }, s.podcastsNone)
      )
    );

    // Episodes follow the syllabus order, one group per section that has any.
    const list = h("div", { class: "units" });
    for (const section of syllabusFor(shown).sections) {
      const here = episodes.filter((e) => e.section === section.id);
      if (!here.length) continue;
      const group = h(
        "section",
        { class: "unit unit--open" },
        h(
          "div",
          { class: "unit__summary unit__summary--static" },
          h("span", { class: "unit__head" }, h("span", { class: "unit__title" }, pick(section.title)))
        ),
        h("div", { class: "unit__body" }, episodeList(here))
      );
      list.append(group);
    }
    if (!list.childElementCount) list.append(h("p", { class: "hint" }, s.podcastsNoEpisodes));
    body.append(list);
  };

  paintLevel();

  const back = h("button", { class: "btn btn--ghost", type: "button" }, s.back);
  back.addEventListener("click", () => ctx.go(own ? "home" : "level"));

  return h("div", { class: "home syllabus" }, head, body, h("div", { class: "actions actions--center" }, back));
}

/** Rows of episodes with a play button each; shared with the syllabus page. */
export function episodeList(episodes: readonly PodcastEpisode[]): HTMLElement {
  const s = t();
  const list = h("div", { class: "episodes" });
  for (const episode of episodes) {
    const play = h("button", { class: "episode__play", type: "button", "aria-label": s.podcastPlay }, "▶");
    const row = h(
      "div",
      { class: "episode" },
      play,
      h(
        "div",
        { class: "episode__body" },
        h("p", { class: "episode__title" }, pick(episode.label)),
        h(
          "p",
          { class: "episode__meta" },
          `${episode.show} · ${episode.title}${episode.durationSeconds ? ` · ${formatClock(episode.durationSeconds)}` : ""}`
        ),
        h("p", { class: "episode__why" }, episode.why),
        h(
          "a",
          { class: "episode__link", href: episode.pageUrl, target: "_blank", rel: "noopener noreferrer" },
          s.podcastOpen,
          svgIcon(ICON_ARROW, "open")
        )
      )
    );
    play.addEventListener("click", () => {
      if (player.isCurrent(episode)) player.toggle();
      else player.play(episode);
    });
    // The row shows which episode is playing; the bar at the bottom does the rest.
    const unsubscribe = player.subscribe((state) => {
      const current = state.episode?.audioUrl === episode.audioUrl;
      row.dataset["playing"] = String(current && state.playing);
      play.textContent = current && state.playing ? "❚❚" : "▶";
      play.setAttribute("aria-label", current && state.playing ? s.podcastPause : s.podcastPlay);
      if (!row.isConnected) unsubscribe();
    });
    list.append(row);
  }
  return list;
}
