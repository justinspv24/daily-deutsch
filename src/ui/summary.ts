import { getLang, pick, t } from "../i18n";
import { consecutiveDays } from "../scheduler";
import { h } from "./dom";
import type { AppContext } from "./context";

export function renderSummary(ctx: AppContext): HTMLElement {
  const s = t();
  const results = ctx.session?.results ?? [];
  const right = results.filter((r) => r.ok).length;
  const total = results.length;
  const share = total === 0 ? 0 : Math.round((right / total) * 100);
  const wrong = results.filter((r) => !r.ok);

  const headline = right === total ? s.flawless : share >= 70 ? s.solid : s.workToDo;

  const card = h(
    "section",
    { class: "card" },
    h("p", { class: "eyebrow" }, s.evaluation),
    h("h2", { class: "display" }, headline),
    h(
      "div",
      { class: "score" },
      h(
        "div",
        { class: "score__figure" },
        String(right),
        h("span", {}, `/${total}`)
      ),
      h(
        "div",
        { class: "score__meta" },
        s.percentRight(share),
        h("br"),
        wrong.length ? s.staysInDrill(wrong.length) : s.nothingNew,
        h("br"),
        s.streakDays(consecutiveDays(ctx.progress.sessions))
      )
    )
  );

  if (wrong.length) {
    card.append(h("h3", { class: "sectiontitle" }, s.reviewAgain));
    const list = h("ul", { class: "review" });
    for (const row of wrong) {
      const answer = h("p", { class: "review__a" });
      if (row.given.trim()) {
        answer.append(h("s", {}, row.given), document.createTextNode(" → "));
      }
      answer.append(h("b", {}, row.expected));

      const entry = h("li", { class: "review__row" }, h("p", { class: "review__q" }, row.prompt), answer);
      if (row.why) {
        entry.append(h("p", { class: "review__why" }, pick(row.why)));
        if (getLang() === "de") {
          entry.append(h("p", { class: "review__why gloss" }, row.why.en));
        }
      }
      list.append(entry);
    }
    card.append(list);
  }

  const back = h("button", { class: "btn", type: "button" }, s.back);
  back.addEventListener("click", () => ctx.go("home"));
  const again = h("button", { class: "btn btn--ghost", type: "button" }, s.again);
  again.addEventListener("click", () => ctx.startSession());
  const progress = h("button", { class: "btn btn--ghost", type: "button" }, s.viewProgress);
  progress.addEventListener("click", () => ctx.go("progress"));

  card.append(h("div", { class: "actions" }, back, again, progress));
  return card;
}
