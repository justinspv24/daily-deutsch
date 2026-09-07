import { signOut } from "../auth";
import { LEVEL_INFO } from "../data/curriculum";
import { pick, t } from "../i18n";
import type { Learner, Level } from "../types";
import { h, ICON_USER, svgIcon } from "./dom";
import { openPanel, type Overlay } from "./overlay";

export interface AccountHandlers {
  onSignedOut(): void;
  onChangeLevel(): void;
  onChangePassword(): void;
}

/** The signed-in learner's panel: who they are, their level, and the way out. */
export function openAccount(learner: Learner, level: Level | null, handlers: AccountHandlers): Overlay {
  const s = t();
  const overlay = openPanel({ title: s.account, badge: "@" });

  const out = h("button", { class: "btn btn--ghost", type: "button" }, s.signOut);
  out.addEventListener("click", () => {
    void signOut().then(() => {
      overlay.close();
      handlers.onSignedOut();
    });
  });

  const changeLevel = h("button", { class: "btn", type: "button" }, s.changeLevel);
  changeLevel.addEventListener("click", () => {
    overlay.close();
    handlers.onChangeLevel();
  });

  const changePassword = h("button", { class: "btn btn--ghost", type: "button" }, s.changePassword);
  changePassword.addEventListener("click", () => {
    overlay.close();
    handlers.onChangePassword();
  });

  overlay.body.append(
    h(
      "div",
      { class: "account__hero" },
      h("span", { class: "account__avatar", "aria-hidden": "true" }, svgIcon(ICON_USER, "account")),
      h(
        "div",
        {},
        h("p", { class: "notice__title" }, learner.displayName ?? learner.email ?? s.account),
        h("p", { class: "notice__body" }, s.syncedAs(learner.email ?? learner.id.slice(0, 8)))
      )
    ),
    h(
      "div",
      { class: "notice account__level" },
      h("span", { class: "levelcard__code" }, level ?? "—"),
      h(
        "div",
        {},
        h("p", { class: "notice__title" }, s.yourLevel),
        h("p", { class: "notice__body" }, level ? pick(LEVEL_INFO[level].name) : s.levelEyebrow)
      )
    )
  );
  overlay.footer.append(h("div", { class: "actions actions--flush" }, changeLevel, changePassword, out));
  return overlay;
}
