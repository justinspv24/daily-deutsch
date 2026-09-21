import { buildAgenda } from "../agenda";
import { formatDate, formatToday, getLang, pick, t } from "../i18n";
import { canInstall, isIOS, isStandalone, promptInstall } from "../pwa";
import { liveSeconds } from "../liveclass";
import { suggestedTopic } from "../session";
import { ClassTutor } from "../tutor";
import type { ClassAgenda } from "../types";
import { openAddWord } from "./addword";
import { h, ICON_ARROW, ICON_MIC, svgIcon } from "./dom";
import type { AppContext } from "./context";
import { statsRow } from "./widgets";

/**
 * The front door, and there is only one of them now.
 *
 * The app used to offer a choice every morning — type the round, or speak it —
 * and the choice was the first thing a learner had to make before they could
 * begin. It is a class now, spoken, and the home screen's whole job is to say
 * what today holds and get out of the way.
 */
export function renderHome(ctx: AppContext): HTMLElement {
  const s = t();
  const level = ctx.progress.level;
  const live = ctx.progress.live;
  const agenda = buildAgenda(ctx.progress);

  const lede = h("p", { class: "lede" }, s.lede);
  if (getLang() === "de") {
    // Immersion rule: German first, the English rendering on its own line below.
    lede.append(h("span", { class: "gloss" }, ENGLISH_LEDE));
  }

  const hero = h(
    "section",
    { class: "card hero" },
    h("p", { class: "eyebrow" }, level ? `${level} · ${formatToday()}` : formatToday()),
    h("h2", { class: "display" }, s.greeting(ctx.learner?.displayName ?? null)),
    lede,
    startPill(ctx, agenda)
  );

  const profileButton = h("button", { class: "btn btn--ghost", type: "button" }, s.profileButton);
  profileButton.addEventListener("click", () => ctx.go("profile"));

  const syllabusButton = h("button", { class: "btn btn--ghost", type: "button" }, s.syllabusButton);
  syllabusButton.addEventListener("click", () => ctx.go("syllabus"));

  const podcastsButton = h("button", { class: "btn btn--ghost", type: "button" }, s.podcastsButton);
  podcastsButton.addEventListener("click", () => ctx.go("podcasts"));

  const addButton = h("button", { class: "btn btn--ghost", type: "button" }, s.addWordButton);
  addButton.addEventListener("click", () => openAddWord((item) => ctx.addWord(item)));

  hero.append(h("div", { class: "actions" }, profileButton, syllabusButton, podcastsButton, addButton));

  const closed = autoClosedCard(ctx);
  if (closed) hero.append(closed);

  // Offered only where it can be acted on: never once installed, and on iOS
  // as a written hint, because Safari has no install prompt to replay.
  const install = buildInstallOffer();
  if (install) hero.append(install);

  const plan = h(
    "section",
    { class: "plan" },
    h("h3", { class: "sectiontitle" }, s.classPlanTitle),
    planList(agenda, live ? liveSeconds(live) : 0)
  );

  return h("div", { class: "home" }, hero, statsRow(ctx.progress), plan);
}

/* ------------------------------------------------------------------ pill */

/**
 * The single door into the day.
 *
 * Three states and no others. A class already open resumes rather than
 * restarts — losing twenty minutes of talking because a phone rang would be
 * unforgivable. And where voice cannot run at all the pill stays on screen and
 * says why: a button that explains itself beats a button that has vanished.
 */
function startPill(ctx: AppContext, agenda: ClassAgenda): HTMLElement {
  const s = t();
  const topic = pick(suggestedTopic(ctx.progress, ctx.learner?.id ?? "").title);

  if (!ClassTutor.offerable()) {
    return h(
      "div",
      { class: "startpill startpill--blocked" },
      h("span", { class: "startpill__glyph" }, svgIcon(ICON_MIC, "voice")),
      h(
        "span",
        { class: "startpill__body" },
        h("span", { class: "startpill__label" }, s.classUnavailable),
        h("span", { class: "startpill__meta" }, s.tutorUnavailable)
      )
    );
  }

  const live = ctx.progress.live;
  const resuming = live !== null;
  const minutes = resuming ? Math.round(liveSeconds(live) / 60) : agenda.minutes;

  const pill = h(
    "button",
    { class: "startpill", type: "button", "data-state": resuming ? "resume" : "start" },
    h("span", { class: "startpill__glyph" }, svgIcon(ICON_MIC, "voice")),
    h(
      "span",
      { class: "startpill__body" },
      h("span", { class: "startpill__label" }, resuming ? s.classResume : s.classStart),
      h(
        "span",
        { class: "startpill__meta" },
        resuming ? s.classResumeMeta(minutes, topic) : s.classStartMeta(minutes, topic)
      )
    ),
    h("span", { class: "startpill__go" }, svgIcon(ICON_ARROW, "start"))
  );
  pill.addEventListener("click", () => ctx.startClass());
  return pill;
}

/* ------------------------------------------------------------------ plan */

/** What today's class actually holds, counted from the agenda it will use. */
function planList(agenda: ClassAgenda, spent: number): HTMLElement {
  const s = t();
  let reviews = 0;
  let cells = 0;
  let sentences = 0;
  let talk = 0;
  const words = new Set<string>();

  for (const item of agenda.items) {
    switch (item.kind) {
      case "review":
        reviews += 1;
        break;
      case "vocab":
        words.add(item.subject);
        break;
      case "cell":
        cells += 1;
        break;
      case "blank":
        sentences += 1;
        break;
      case "talk":
        talk += item.minutes;
        break;
    }
  }

  const rows: string[] = [s.classPlanTopic(pick(agenda.sectionTitle))];
  if (reviews) rows.push(s.classPlanReviews(reviews));
  if (words.size) rows.push(`${s.classPlanWords(words.size)} — ${[...words].join(" · ")}`);
  if (cells) rows.push(s.classPlanTables(cells));
  if (sentences) rows.push(s.classPlanSentences(sentences));
  if (talk) rows.push(s.classPlanTalk(talk));
  if (spent > 0) rows.push(s.classResumeMeta(Math.round(spent / 60), pick(agenda.sectionTitle)));

  const list = h("ul", { class: "agenda agenda--plan" });
  rows.forEach((row, index) => {
    list.append(
      h(
        "li",
        { class: "agenda__row", "data-empty": "false" },
        h("span", { class: "agenda__n" }, `0${index + 1}`),
        h("span", { class: "agenda__body" }, h("span", { class: "agenda__detail" }, row))
      )
    );
  });
  return list;
}

/* ------------------------------------------------------- the night before */

function autoClosedCard(ctx: AppContext): HTMLElement | null {
  const record = ctx.autoClosed;
  if (!record) return null;
  const s = t();

  const open = h("button", { class: "btn btn--ghost", type: "button" }, s.profileButton);
  open.addEventListener("click", () => ctx.go("profile"));
  const seen = h("button", { class: "linkbtn", type: "button" }, s.classAutoClosedSeen);
  seen.addEventListener("click", () => ctx.dismissAutoClosed());

  return h(
    "div",
    { class: "install notice--closed" },
    h(
      "span",
      { class: "install__blurb" },
      s.classAutoClosed(formatDate(record.date)),
      h("br"),
      s.classAutoClosedNote
    ),
    open,
    seen
  );
}

/** The install row, or null when there is nothing useful to offer. */
function buildInstallOffer(): HTMLElement | null {
  if (isStandalone()) return null;
  const s = t();

  if (canInstall()) {
    const button = h("button", { class: "btn btn--ghost btn--install", type: "button" }, s.installButton);
    button.addEventListener("click", () => void promptInstall());
    return h("div", { class: "install" }, h("span", { class: "install__blurb" }, s.installBlurb), button);
  }

  if (isIOS()) {
    return h("div", { class: "install" }, h("span", { class: "install__blurb" }, s.installIOSHint));
  }

  return null;
}

/** Kept verbatim so the German view can gloss it without a second lookup. */
const ENGLISH_LEDE =
  "A class lasts about half an hour and is spoken out loud. Anything you get wrong comes back on day 3, day 7 and day 21.";
