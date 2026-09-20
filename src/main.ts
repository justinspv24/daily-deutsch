import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/overlay.css";
import "./styles/syllabus.css";
import "./styles/media.css";

import { currentLearner, onAuthChange, supabase } from "./auth";
import { CLOUD_ENABLED } from "./config";
import { initPwa, onInstallChange } from "./pwa";
import { getLang, setLang, t } from "./i18n";
import {
  ANON_SCOPE,
  LocalRepository,
  clearLocalProgress,
  dropLegacyLocalProgress,
  readLocalProgress
} from "./repositories/local";
import { SupabaseRepository } from "./repositories/supabase";
import { emptyProgress, mergeProgress, seedLevel, type Repository } from "./repository";
import { advanceTable, advanceTopic, todayISO } from "./scheduler";
import {
  GRAMMAR_PER_SESSION,
  TOPICS_PER_SESSION,
  buildSession,
  dueTables,
  dueTopics,
  firstUnanswered,
  sessionVocab,
  stepStates as computeStepStates
} from "./session";
import { registerDoubleTap } from "./shortcuts";
import { initTheme } from "./theme";
import { DrillTutor } from "./tutor";
import { closingLine } from "./tutorscript";
import type { Learner, Progress, SessionState, StepState } from "./types";
import { openAccount } from "./ui/account";
import { openChat } from "./ui/chat";
import type { AppContext, Route } from "./ui/context";
import { clear } from "./ui/dom";
import { paintTutorStrip, renderDrill } from "./ui/drill";
import { renderHome } from "./ui/home";
import { renderLevel } from "./ui/level";
import { renderLoading, renderLogin, renderRecovery } from "./ui/login";
import { renderProgress } from "./ui/progress";
import { buildShell, paintStepper, type Shell } from "./ui/shell";
import { renderSummary } from "./ui/summary";
import { renderPodcasts } from "./ui/podcasts";
import { renderSyllabus } from "./ui/syllabus";
import { openTranslator } from "./ui/translate";
import { openVoice, storedVoice } from "./ui/voice";

/** How long the boot screen waits for Supabase before falling back to sign-in. */
const AUTH_TIMEOUT_MS = 8000;

/** Routes without the session stepper — nothing is being drilled yet. */
const BARE_ROUTES: ReadonlySet<Route> = new Set(["loading", "login", "recovery", "level"]);

class App {
  private progress: Progress;
  private session: SessionState | null = null;
  private route: Route;
  private learner: Learner | null = null;
  /** True between a password-reset link landing and the new password being saved. */
  private recovering = false;
  private repository: Repository = new LocalRepository(ANON_SCOPE);
  private shell: Shell;
  private summaryScored = false;
  /** Coalesces the writes that a fast round would otherwise fire off. */
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  /**
   * The tutor for the round in progress, or null when it is being typed.
   *
   * It lives here rather than in the view because the drill view is thrown
   * away and rebuilt on every question, and a call that were rebuilt with it
   * would reconnect twenty times a round.
   */
  private tutor: DrillTutor | null = null;

  constructor(root: HTMLElement) {
    setLang(getLang());
    initTheme();

    // With an account system behind the app the front door is the sign-in
    // screen; without one (tests, a bare checkout) the drill is open as before.
    this.route = CLOUD_ENABLED ? "loading" : "home";
    dropLegacyLocalProgress();
    this.progress = readLocalProgress(ANON_SCOPE);

    this.shell = buildShell(root, {
      onLangChange: () => {
        this.shell.refreshChrome();
        this.shell.setLearner(this.learner);
        this.paint();
      },
      onThemeChange: () => {
        /* the tokens do the work */
      },
      onChat: () => openChat({ onNeedKey: () => this.openAccountPanel() }),
      onTranslate: () => openTranslator(),
      onVoice: () => openVoice(this.progress.level, { onNeedKey: () => this.openAccountPanel() }),
      onAccount: () => this.openAccountPanel()
    });
    this.shell.setLearner(null);
    // The browser decides when the install prompt becomes available; redraw
    // so the offer can appear without a navigation. Never mid-question,
    // though: the offer lives on the home screen, and repainting the drill to
    // show it would wipe a half-typed answer and make the tutor ask again.
    onInstallChange(() => {
      if (this.route !== "drill") this.paint();
    });
    this.paint();

    // Always live, so a double-tap explains itself ("not switched on yet")
    // instead of silently doing nothing when the assistant is off.
    registerDoubleTap({
      c: () => openChat({ onNeedKey: () => this.openAccountPanel() }),
      t: () => openTranslator(),
      v: () => openVoice(this.progress.level, { onNeedKey: () => this.openAccountPanel() })
    });

    void this.restoreSession();
  }

  /* -------------------------------------------------------------- tutor */

  /** Open the call that will read this round out. */
  private beginTutor(): void {
    this.tutor = new DrillTutor({
      level: this.progress.level,
      voice: storedVoice(),
      onNeedKey: () => this.openAccountPanel()
    });
    // Only the strip redraws; rebuilding the card would wipe the answer being
    // typed into it and steal the caret back on every streamed syllable.
    this.tutor.subscribe(() => paintTutorStrip(this.tutor));
    void this.tutor.start();
  }

  /** Hang up, whether the round finished or the learner walked away from it. */
  private endTutor(): void {
    this.tutor?.stop();
    this.tutor = null;
  }

  /** The account panel — also where voice mode sends a learner who has no key yet. */
  private openAccountPanel(): void {
    if (!this.learner) return;
    openAccount(this.learner, this.progress.level, {
      onSignedOut: () => void this.adoptLearner(null, { wipeLocal: true }),
      onChangeLevel: () => this.context().go("level"),
      onChangePassword: () => this.context().go("recovery")
    });
  }

  /* --------------------------------------------------------------- auth */

  private async restoreSession(): Promise<void> {
    if (!CLOUD_ENABLED) return;

    let timedOut = false;
    const learner = await Promise.race([
      currentLearner().catch(() => null),
      new Promise<null>((resolve) =>
        setTimeout(() => {
          timedOut = true;
          resolve(null);
        }, AUTH_TIMEOUT_MS)
      )
    ]);
    // A stale mirror from an expired session must not merge into whoever signs
    // in next; a network timeout, on the other hand, proves nothing.
    await this.adoptLearner(learner, { wipeLocal: !learner && !timedOut });

    onAuthChange((next, event) => {
      // A reset link signs the learner in and announces itself; hold them on
      // the new-password screen until it has been saved.
      if (event === "PASSWORD_RECOVERY") this.recovering = true;
      if (next?.id === this.learner?.id) {
        if (this.recovering && this.route !== "recovery") {
          this.route = "recovery";
          this.paint();
        }
        return;
      }
      void this.adoptLearner(next, { wipeLocal: !next });
    });
  }

  /**
   * Switch storage layers. Every mirror is scoped — to a learner id, or to
   * `ANON_SCOPE` for drilling done before signing in — so one account can
   * never read or inherit another's work at the same browser. Only anonymous
   * work follows someone into their account, and only once.
   */
  private async adoptLearner(learner: Learner | null, options: { wipeLocal: boolean }): Promise<void> {
    const previous = this.learner;
    this.learner = learner;
    this.shell.setLearner(learner);
    this.endTutor();
    this.session = null;

    const client = supabase();
    if (!learner || !client) {
      this.repository = new LocalRepository(ANON_SCOPE);
      if (options.wipeLocal) {
        clearLocalProgress(ANON_SCOPE);
        // Signing out leaves nothing of that learner on a shared browser.
        if (previous) clearLocalProgress(previous.id);
        this.progress = emptyProgress();
      } else {
        this.progress = readLocalProgress(ANON_SCOPE);
      }
      this.route = this.landing();
      this.paint();
      return;
    }

    const mirror = new LocalRepository(learner.id);
    // Whatever the previous learner left behind stays in their own mirror;
    // the only thing that may follow anyone into an account is work done
    // while signed out.
    const carried = readLocalProgress(ANON_SCOPE);
    const cloud = new SupabaseRepository(client, learner.id);
    try {
      const remote = await Promise.race([
        cloud.load(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("progress load timed out")), AUTH_TIMEOUT_MS)
        )
      ]);
      const merged = mergeProgress(carried, remote);
      this.repository = cloud;
      this.progress = merged;
      await cloud.save(merged);
      // Spent: it has landed in this account and must not land in a second.
      clearLocalProgress(ANON_SCOPE);
      // Keep this learner's mirror warm so a dropped connection is invisible.
      await mirror.save(merged);
    } catch {
      // The account is real but unreachable; carry on from this learner's own
      // mirror rather than blocking the drill on the network.
      this.repository = mirror;
      this.progress = await mirror.load();
    }
    this.route = this.landing();
    this.paint();
  }

  /** Where a freshly (un)authenticated learner belongs. */
  private landing(): Route {
    if (!CLOUD_ENABLED) return "home";
    if (!this.learner) return "login";
    if (this.recovering) return "recovery";
    if (!this.progress.level) return "level";
    return "home";
  }

  /* -------------------------------------------------------------- state */

  private persist(): void {
    void new LocalRepository(this.learner?.id ?? ANON_SCOPE).save(this.progress);
    if (this.repository.kind !== "cloud") return;
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      void this.repository.save(this.progress).catch(() => {
        /* the local mirror already has it */
      });
    }, 800);
  }

  private context(): AppContext {
    return {
      progress: this.progress,
      session: this.session,
      learner: this.learner,
      tutor: this.tutor,
      refresh: () => this.paint(),
      go: (route) => {
        this.route = route;
        if (route !== "summary") this.summaryScored = false;
        // The summary keeps the tutor for one last line; anywhere else means
        // the round has been left, and a voice reading questions into an empty
        // screen is nobody's idea of help.
        if (route !== "drill" && route !== "summary") this.endTutor();
        this.paint();
      },
      startSession: (spoken = false) => {
        this.endTutor();
        this.session = buildSession(this.progress);
        this.summaryScored = false;
        this.route = this.session.tasks.length > 0 ? "drill" : "home";
        if (spoken && this.route === "drill") this.beginTutor();
        this.paint();
      },
      setLevel: (level) => {
        this.progress.level = level;
        seedLevel(this.progress, level);
        this.persist();
        this.session = null;
        this.route = "home";
        this.paint();
      },
      finishRecovery: () => {
        this.recovering = false;
        this.route = this.landing();
        this.paint();
      },
      addWord: (item) => {
        this.progress.custom.push(item);
        this.progress.vocab[item.id] = { streak: 0, seen: 0, lastDate: null };
        this.persist();
        void this.repository.addWord(item).catch(() => {
          /* the local mirror has it; the next sign-in merge will carry it */
        });
        this.paint();
      },
      removeWord: (id) => {
        this.progress.custom = this.progress.custom.filter((item) => item.id !== id);
        delete this.progress.vocab[id];
        this.persist();
        void this.repository.removeWord(id).catch(() => {
          /* gone locally; the row is cleaned up on the next successful call */
        });
        this.paint();
      },
      jumpToStep: (step) => this.jumpToStep(step),
      commit: () => this.persist()
    };
  }

  /** Roll the round into the schedule exactly once, when the summary opens. */
  private scoreSession(): void {
    if (this.summaryScored || !this.session) return;
    this.summaryScored = true;

    for (const [topicId, hit] of Object.entries(this.session.topicHits)) {
      advanceTopic(this.progress, topicId, hit);
    }
    for (const [tableId, hit] of Object.entries(this.session.tableHits)) {
      advanceTable(this.progress, tableId, hit);
    }
    const record = {
      date: todayISO(),
      right: this.session.results.filter((r) => r.ok).length,
      total: this.session.results.length
    };
    this.progress.sessions.push(record);
    if (this.progress.sessions.length > 400) {
      this.progress.sessions = this.progress.sessions.slice(-400);
    }

    this.persist();
    void this.repository.recordSession(record).catch(() => {
      /* the round is safe locally; the next sync will carry it */
    });

    // One closing line, then the call hangs up on its own. The reference is
    // kept so that starting another round can cut it short.
    this.tutor?.finish(closingLine(record.right, record.total));
  }

  /* --------------------------------------------------------------- view */

  private stepperCounts(): readonly string[] {
    const s = t();
    const words = sessionVocab(this.progress).length;
    const grids = dueTables(this.progress).length;
    const due = dueTopics(this.progress).length;
    return [
      words ? s.wordsUnit(words) : s.allClear,
      grids ? s.tablesUnit(grids) : s.allClear,
      s.sentencesUnit(GRAMMAR_PER_SESSION),
      due ? s.dueUnit(Math.min(due, TOPICS_PER_SESSION)) : s.nothingDue,
      s.upNext
    ];
  }

  private stepStates(): readonly StepState[] {
    if (this.route === "summary") return ["done", "done", "done", "done", "active"];
    if (this.route === "drill" && this.session) return computeStepStates(this.session);
    return ["idle", "idle", "idle", "idle"];
  }

  /** Move to the first unanswered question of a step; ignored once it is finished. */
  private jumpToStep(step: number): void {
    const session = this.session;
    if (!session) return;
    const index = firstUnanswered(session, step);
    if (index === -1) return;
    session.index = index;
    this.paint();
  }

  private paint(): void {
    if (this.route === "summary") this.scoreSession();

    this.shell.setRoute(this.route);
    if (!BARE_ROUTES.has(this.route)) {
      const drilling = this.route === "drill" && this.session !== null;
      paintStepper(
        this.shell.stepper,
        this.stepperCounts(),
        this.stepStates(),
        drilling ? (step) => this.jumpToStep(step) : null
      );
    }
    const ctx = this.context();
    const view = clear(this.shell.view);

    switch (this.route) {
      case "loading":
        view.append(renderLoading());
        break;
      case "login":
        view.append(renderLogin());
        break;
      case "recovery":
        view.append(renderRecovery(ctx));
        break;
      case "level":
        view.append(renderLevel(ctx));
        break;
      case "drill":
        view.append(renderDrill(ctx));
        break;
      case "summary":
        view.append(renderSummary(ctx));
        break;
      case "progress":
        view.append(renderProgress(ctx));
        break;
      case "syllabus":
        view.append(renderSyllabus(ctx));
        break;
      case "podcasts":
        view.append(renderPodcasts(ctx));
        break;
      case "home":
      default:
        view.append(renderHome(ctx));
        break;
    }
  }
}

initPwa();

const mount = document.getElementById("app");
if (mount) new App(mount);
