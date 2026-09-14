import { signOut } from "../auth";
import { VOICE_ENABLED } from "../config";
import { LEVEL_INFO } from "../data/curriculum";
import { pick, t } from "../i18n";
import type { Learner, Level } from "../types";
import { removeVoiceKey, saveVoiceKey, VoiceKeyError, voiceKeyStatus } from "../voicekey";
import { h, ICON_USER, svgIcon } from "./dom";
import { openPanel, type Overlay } from "./overlay";

export interface AccountHandlers {
  onSignedOut(): void;
  onChangeLevel(): void;
  onChangePassword(): void;
}

/**
 * The learner's Google AI key, which voice mode runs on. Saved once, checked
 * with Google before it is accepted, stored encrypted, and never shown again
 * beyond its last four characters. Everything here talks to /api/voice-key;
 * the key itself passes through this function on its way up and nowhere else.
 */
function keySection(): HTMLElement {
  const s = t();
  const status = h("p", { class: "notice__body" }, s.voiceKeyChecking);
  const input = h("input", {
    class: "field__input account__keyinput",
    type: "password",
    autocomplete: "off",
    spellcheck: "false",
    placeholder: s.voiceKeyPlaceholder,
    "aria-label": s.voiceKeyTitle
  });
  const save = h("button", { class: "btn", type: "button" }, s.voiceKeySave);
  const remove = h("button", { class: "btn btn--ghost", type: "button" }, s.voiceKeyRemove);
  const where = h(
    "a",
    { class: "login__link", href: "https://aistudio.google.com/apikey", target: "_blank", rel: "noopener" },
    s.voiceKeyWhere
  );
  const feedback = h("p", { class: "login__status", role: "status" });

  const show = (hasKey: boolean, last4: string | null): void => {
    status.textContent = hasKey ? s.voiceKeySet(last4 ?? "????") : s.voiceKeyNotSet;
    status.dataset["tone"] = hasKey ? "ok" : "";
    remove.hidden = !hasKey;
    input.placeholder = hasKey ? s.voiceKeyReplacePlaceholder : s.voiceKeyPlaceholder;
  };
  const report = (tone: "ok" | "no" | "", text: string): void => {
    feedback.dataset["tone"] = tone;
    feedback.textContent = text;
  };
  const describe = (error: unknown): string => {
    if (!(error instanceof VoiceKeyError)) return s.aiFailed;
    switch (error.code) {
      case "invalid_key":
        return error.message || s.voiceKeyInvalid;
      case "sign_in_required":
        return s.aiSignInRequired;
      case "misconfigured":
        return s.voiceMisconfigured;
      case "offline":
        return s.aiOffline;
      default:
        return s.aiFailed;
    }
  };
  const busy = (on: boolean): void => {
    for (const el of [input, save, remove]) {
      if (on) el.setAttribute("disabled", "true");
      else el.removeAttribute("disabled");
    }
  };

  void voiceKeyStatus()
    .then((state) => show(state.hasKey, state.last4))
    .catch((error: unknown) => {
      status.textContent = describe(error);
      status.dataset["tone"] = "no";
    });

  save.addEventListener("click", () => {
    const key = input.value.trim();
    if (!key) {
      report("no", s.voiceKeyEmpty);
      input.focus();
      return;
    }
    busy(true);
    report("", s.voiceKeyChecking);
    void saveVoiceKey(key)
      .then((state) => {
        input.value = "";
        show(state.hasKey, state.last4);
        report("ok", s.voiceKeySaved);
      })
      .catch((error: unknown) => report("no", describe(error)))
      .finally(() => busy(false));
  });

  remove.addEventListener("click", () => {
    busy(true);
    void removeVoiceKey()
      .then((state) => {
        show(state.hasKey, state.last4);
        report("ok", s.voiceKeyRemoved);
      })
      .catch((error: unknown) => report("no", describe(error)))
      .finally(() => busy(false));
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      save.click();
    }
  });

  return h(
    "div",
    { class: "notice account__key" },
    h("p", { class: "notice__title" }, s.voiceKeyTitle),
    h("p", { class: "notice__body" }, s.voiceKeyBlurb, " ", where),
    status,
    h("div", { class: "account__keyrow" }, input, save, remove),
    feedback
  );
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
  if (VOICE_ENABLED) overlay.body.append(keySection());
  overlay.footer.append(h("div", { class: "actions actions--flush" }, changeLevel, changePassword, out));
  return overlay;
}
