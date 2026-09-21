import { LEVELS, curriculumFor } from "../data/curriculum";
import { mediaFor } from "../data/media";
import { syllabusFor } from "../data/syllabus";
import { pick, t } from "../i18n";
import { formatClock } from "../player";
import {
  NO_PLURAL,
  type Level,
  type SyllabusLink,
  type SyllabusSection,
  type VideoClip,
  type VocabItem
} from "../types";
import { episodeList } from "./podcasts";

/** What the drill banks hold for one section. */
interface Coverage {
  words: number;
  sentences: number;
  topics: number;
}

/**
 * Count the drill's items per section. The map promises what a level covers;
 * this is what the drill can actually ask, shown on every section so the two
 * can be seen side by side — and so a gap is a visible thing, not a surprise.
 */
function coverageFor(level: Level): Map<string, Coverage> {
  const bank = curriculumFor(level);
  const map = new Map<string, Coverage>();
  const bump = (section: string | undefined, key: keyof Coverage): void => {
    if (!section) return;
    const entry = map.get(section) ?? { words: 0, sentences: 0, topics: 0 };
    entry[key] += 1;
    map.set(section, entry);
  };
  for (const item of bank.vocab) bump(item.section, "words");
  for (const item of bank.grammar) bump(item.section, "sentences");
  for (const topic of bank.topics) bump(topic.section, "topics");
  return map;
}
import type { AppContext } from "./context";
import { clear, h, ICON_ARROW, svgIcon } from "./dom";
import { renderIllustration } from "./illustrations";

/**
 * The syllabus: every level laid out section by section, so a learner can
 * see the road before walking it — and look up what a level covers before
 * choosing it.
 *
 * Each section opens on demand. The summary line carries the topic and its
 * blurb; inside are the can-do statements, the grammar with its diagrams,
 * the core vocabulary and where to hear it taught. A whole level open at once
 * would be a wall; a list of twelve closed sections is a map.
 */
export function renderSyllabus(ctx: AppContext): HTMLElement {
  const s = t();
  const own = ctx.progress.level;
  let shown: Level = own ?? "A1";

  const tabs = h("div", { class: "segmented segmented--wide syllabus__tabs", role: "tablist" });
  const buttons = LEVELS.map((level) => {
    const button = h(
      "button",
      { type: "button", role: "tab", "aria-selected": String(level === shown), "data-level": level },
      level
    );
    if (level === own) button.append(h("span", { class: "syllabus__own", "aria-label": s.syllabusYourLevel }, "●"));
    button.addEventListener("click", () => {
      shown = level;
      buttons.forEach((b, i) => b.setAttribute("aria-selected", String(LEVELS[i] === shown)));
      paintLevel();
      body.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    tabs.append(button);
    return button;
  });

  const head = h(
    "section",
    { class: "card" },
    h("p", { class: "eyebrow" }, s.syllabusEyebrow),
    h("h2", { class: "display" }, s.syllabusTitle),
    h("p", { class: "lede" }, s.syllabusLede),
    tabs
  );

  const body = h("div", { class: "syllabus__body" });

  const paintLevel = (): void => {
    clear(body);
    const syllabus = syllabusFor(shown);

    const meta = h(
      "dl",
      { class: "syllabus__meta" },
      h("div", {}, h("dt", {}, s.syllabusExam), h("dd", {}, pick(syllabus.exam))),
      h("div", {}, h("dt", {}, s.syllabusHours), h("dd", {}, pick(syllabus.hours))),
      h("div", {}, h("dt", {}, s.syllabusSectionsLabel), h("dd", {}, s.syllabusSectionsCount(syllabus.sections.length)))
    );

    const sources = h("div", { class: "syllabus__links" });
    for (const link of syllabus.sources) sources.append(renderLink(link));

    body.append(
      h(
        "section",
        { class: "card syllabus__level", "data-level": shown },
        h("span", { class: "levelcard__code" }, shown),
        h("h3", { class: "syllabus__leveltitle" }, pick(syllabus.title)),
        h("p", { class: "lede" }, pick(syllabus.intro)),
        meta,
        h("h4", { class: "sectiontitle" }, s.syllabusSources),
        sources
      )
    );

    const coverage = coverageFor(shown);
    const bank = curriculumFor(shown);
    const list = h("div", { class: "units" });
    syllabus.sections.forEach((section, index) =>
      list.append(
        renderSection(
          section,
          index,
          coverage.get(section.id) ?? null,
          bank.vocab.filter((item) => item.section === section.id)
        )
      )
    );
    body.append(list);
  };

  paintLevel();

  const back = h("button", { class: "btn btn--ghost", type: "button" }, s.back);
  back.addEventListener("click", () => ctx.go(own ? "home" : "level"));

  return h("div", { class: "home syllabus" }, head, body, h("div", { class: "actions actions--center" }, back));
}

function renderSection(
  section: SyllabusSection,
  index: number,
  coverage: Coverage | null,
  words: readonly VocabItem[]
): HTMLElement {
  const s = t();

  const drilled = coverage && coverage.words + coverage.sentences + coverage.topics > 0;
  const summary = h(
    "summary",
    { class: "unit__summary" },
    h("span", { class: "unit__n" }, String(index + 1).padStart(2, "0")),
    h(
      "span",
      { class: "unit__head" },
      h("span", { class: "unit__title" }, pick(section.title)),
      h("span", { class: "unit__blurb" }, pick(section.blurb)),
      h(
        "span",
        { class: "unit__drilled", "data-drilled": String(Boolean(drilled)) },
        drilled ? s.syllabusDrilled(coverage.words, coverage.sentences, coverage.topics) : s.syllabusNotDrilled
      )
    ),
    h("span", { class: "unit__chev", "aria-hidden": "true" }, svgIcon(ICON_ARROW, "open"))
  );

  const canDo = h("ul", { class: "unit__cando" });
  for (const item of section.canDo) canDo.append(h("li", {}, pick(item)));

  const grammar = h("div", { class: "unit__grammar" });
  for (const point of section.grammar) {
    const block = h(
      "div",
      { class: "gpoint" },
      h("p", { class: "gpoint__title" }, pick(point.title)),
      h("p", { class: "gpoint__example" }, point.example),
      h("p", { class: "gloss" }, point.gloss)
    );
    if (point.illustration) {
      const figure = renderIllustration(point.illustration);
      if (figure) block.append(figure);
    }
    grammar.append(block);
  }

  // The very words the drill asks for this section, shown the way the card
  // will ask them: article and plural for a noun, auxiliary and participle
  // for a verb. A learner reading the map is reading tomorrow's questions.
  const vocab = h("dl", { class: "unit__vocab" });
  for (const item of words) {
    vocab.append(
      h(
        "div",
        { class: "unit__word" },
        h("dt", {}, ...headword(item)),
        h("dd", {}, item.en.slice(0, 2).join(", "))
      )
    );
  }

  // The verified clips and episodes for this section. Both come from the
  // research pass, not from memory, and each carries the reason it is here.
  const media = mediaFor(section.id);

  // A section's "video" links are YouTube searches: a fallback for when
  // nothing verified exists, not content. Once the section has checked
  // clips the searches step aside, so only what was actually vetted shows.
  const shown = section.links.filter((link) => !(link.kind === "video" && media.videos.length));
  const links = h("div", { class: "syllabus__links" });
  for (const link of shown) links.append(renderLink(link));
  const clips = h("div", { class: "clips" });
  for (const clip of media.videos) clips.append(renderClip(clip));
  if (!media.videos.length) clips.append(h("p", { class: "hint" }, s.clipsNone));

  const body = h(
    "div",
    { class: "unit__body" },
    h("h4", { class: "sectiontitle" }, s.syllabusCanDo),
    canDo,
    h("h4", { class: "sectiontitle" }, s.syllabusGrammar),
    grammar,
    h("h4", { class: "sectiontitle" }, s.clipsTitle),
    clips
  );
  if (media.podcasts.length) {
    body.append(h("h4", { class: "sectiontitle" }, s.podcastsSection), episodeList(media.podcasts));
  }
  body.append(h("h4", { class: "sectiontitle" }, s.syllabusVocab), vocab);
  // With the searches gone most sections have nothing left here, and a
  // heading over an empty space reads as something failing to load.
  if (shown.length) body.append(h("h4", { class: "sectiontitle" }, s.syllabusLinks), links);

  return h("details", { class: "unit", id: section.id }, summary, body);
}

/**
 * One clip: the thumbnail until it is tapped, then the embed playing only the
 * portion between start and end. Nothing from YouTube loads until the tap —
 * a page of twelve sections must not open twelve players — and the link out
 * jumps to the same second, for anyone who would rather watch in the app.
 */
function renderClip(clip: VideoClip): HTMLElement {
  const s = t();
  const from = formatClock(clip.start);
  const to = formatClock(clip.end);

  const frame = h("div", { class: "clip__frame" });
  const poster = h(
    "button",
    { class: "clip__poster", type: "button", "aria-label": `${s.clipPlay}: ${pick(clip.label)}` },
    h("img", {
      class: "clip__thumb",
      src: `https://i.ytimg.com/vi/${clip.videoId}/hqdefault.jpg`,
      alt: "",
      loading: "lazy",
      decoding: "async"
    }),
    h("span", { class: "clip__play", "aria-hidden": "true" }, "▶"),
    h("span", { class: "clip__range" }, s.clipRange(from, to))
  );
  poster.addEventListener("click", () => {
    const params = new URLSearchParams({
      start: String(clip.start),
      end: String(clip.end),
      autoplay: "1",
      rel: "0",
      modestbranding: "1"
    });
    const iframe = h("iframe", {
      class: "clip__embed",
      src: `https://www.youtube-nocookie.com/embed/${clip.videoId}?${params.toString()}`,
      title: clip.title,
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      allowfullscreen: "true",
      referrerpolicy: "strict-origin-when-cross-origin"
    });
    clear(frame).append(iframe);
  });
  frame.append(poster);

  return h(
    "figure",
    { class: "clip" },
    frame,
    h(
      "figcaption",
      { class: "clip__caption" },
      h("p", { class: "clip__label" }, pick(clip.label)),
      h("p", { class: "clip__meta" }, `${clip.channel} · ${clip.title}`),
      h("p", { class: "clip__why" }, h("strong", {}, `${s.mediaWhy}: `), clip.why),
      h("p", { class: "clip__why" }, h("strong", {}, `${s.mediaEvidence}: `), clip.evidence),
      h(
        "a",
        {
          class: "episode__link",
          href: `https://www.youtube.com/watch?v=${clip.videoId}&t=${clip.start}s`,
          target: "_blank",
          rel: "noopener noreferrer"
        },
        s.clipWatchOn(from),
        svgIcon(ICON_ARROW, "open")
      )
    )
  );
}

/** "der Tisch, die Tische" · "die Butter (kein Plural)" · "aufstehen (ist aufgestanden)". */
function headword(item: VocabItem): (string | HTMLElement)[] {
  const s = t();
  if (item.kind === "verb") {
    const aux = item.key === "sein" ? "ist" : "hat";
    return [item.word, " ", h("span", { class: "unit__form" }, `(${aux} ${item.form[0] ?? ""})`)];
  }
  const plural = item.form[0];
  const tail = plural === NO_PLURAL || !plural ? ` (${s.syllabusNoPlural})` : `, ${plural}`;
  return [`${item.key} ${item.word}`, h("span", { class: "unit__form" }, tail)];
}

/**
 * An outbound link with its kind on it. A search is labelled as a search:
 * the learner should know they are about to pick a video, not be handed one.
 */
function renderLink(link: SyllabusLink): HTMLElement {
  const s = t();
  const isSearch = link.url.includes("results?search_query=");
  const anchor = h(
    "a",
    { class: "reslink", href: link.url, target: "_blank", rel: "noopener noreferrer", "data-kind": link.kind },
    h("span", { class: "reslink__kind" }, kindLabel(link.kind)),
    h("span", { class: "reslink__label" }, pick(link.label))
  );
  if (isSearch) anchor.append(h("span", { class: "chip" }, s.syllabusSearch));
  return anchor;
}

function kindLabel(kind: SyllabusLink["kind"]): string {
  const s = t();
  if (kind === "video") return s.syllabusVideo;
  if (kind === "course") return s.syllabusCourse;
  return s.syllabusReading;
}
