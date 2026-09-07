import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/overlay.css";

import { aiAvailable } from "./ai";
import { currentLearner, onAuthChange, supabase } from "./auth";
import { CLOUD_ENABLED } from "./config";
import { getLang, setLang, t } from "./i18n";
import { LocalRepository, clearLocalProgress, readLocalProgress } from "./repositories/local";
import { SupabaseRepository } from "./repositories/supabase";
import { emptyProgress, mergeProgress, seedLevel, type Repository } from "./repository";
import { advanceTopic, todayISO } from "./scheduler";
import {
  GRAMMAR_PER_SESSION,
  TOPICS_PER_SESSION,
  activeVocab,
  buildSession,
  dueTopics
} from "./session";
import { registerDoubleTap } from "./shortcuts";
import { initTheme } from "./theme";
import type { Learner, Progress, SessionState } from "./types";
import { openAccount } from "./ui/account";
import { openChat } from "./ui/chat";
import type { AppContext, Route } from "./ui/context";
import { clear } from "./ui/dom";
import { renderDrill } from "./ui/drill";
import { renderHome } from "./ui/home";
import { renderLevel } from "./ui/level";
import { renderLoading, renderLogin, renderRecovery } from "./ui/login";
import { renderProgress } from "./ui/progress";
import { buildShell, paintStepper, type Shell } from "./ui/shell";
import { renderSummary } from "./ui/summary";
import { openTranslator } from "./ui/translate";

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
  private repository: Repository = new LocalRepository();
  private shell: Shell;
  private summaryScored = false;
  /** Coalesces the writes that a fast round would otherwise fire off. */
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(root: HTMLElement) {
    setLang(getLang());
    initTheme();

    // With an account system behind the app the front door is the sign-in
    // screen; without one (tests, a bare checkout) the drill is open as before.
    this.route = CLOUD_ENABLED ? "loading" : "home";
    this.progress = readLocalProgress();

    this.shell = buildShell(root, {
      onLangChange: () => {
        this.shell.refreshChrome();
        this.shell.setLearner(this.learner);
        this.paint();
      },
      onThemeChange: () => {
        /* the tokens do the work */
      },
      onChat: () => openChat(),
      onTranslate: () => openTranslator(),
      onAccount: () => {
        if (!this.learner) return;
        openAccount(this.learner, this.progress.level, {
          onSignedOut: () => void this.adoptLearner(null, { wipeLocal: true }),
          onChangeLevel: () => this.context().go("level"),
          onChangePassword: () => this.context().go("recovery")
        });
      }
    });
    this.shell.setLearner(null);
    this.paint();

    if (aiAvailable()) {
      registerDoubleTap({ c: () => openChat(), t: () => openTranslator() });
    }

    void this.restoreSession();
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
   * Switch storage layers. Signing in merges whatever this device already
   * holds into the account; signing out drops back to an empty local copy so
   * the next person at this browser starts from nothing.
   */
  private async adoptLearner(learner: Learner | null, options: { wipeLocal: boolean }): Promise<void> {
    this.learner = learner;
    this.shell.setLearner(learner);
    this.session = null;

    const client = supabase();
    if (!learner || !client) {
      this.repository = new LocalRepository();
      if (options.wipeLocal) {
        clearLocalProgress();
        this.progress = emptyProgress();
      } else {
        this.progress = readLocalProgress();
      }
      this.route = this.landing();
      this.paint();
      return;
    }

    const cloud = new SupabaseRepository(client, learner.id);
    try {
      const remote = await Promise.race([
        cloud.load(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("progress load timed out")), AUTH_TIMEOUT_MS)
        )
      ]);
      const merged = mergeProgress(this.progress, remote);
      this.repository = cloud;
      this.progress = merged;
      await cloud.save(merged);
      // Keep the local mirror warm so a dropped connection is invisible.
      await new LocalRepository().save(merged);
    } catch {
      // The account is real but unreachable; carry on locally rather than
      // blocking the drill on the network.
      this.repository = new LocalRepository();
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
    void new LocalRepository().save(this.progress);
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
      refresh: () => this.paint(),
      go: (route) => {
        this.route = route;
        if (route !== "summary") this.summaryScored = false;
        this.paint();
      },
      startSession: () => {
        this.session = buildSession(this.progress);
        this.summaryScored = false;
        this.route = this.session.tasks.length > 0 ? "drill" : "home";
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
  }

  /* --------------------------------------------------------------- view */

  private stepperCounts(): readonly [string, string, string, string] {
    const s = t();
    const words = activeVocab(this.progress).length;
    const due = dueTopics(this.progress).length;
    return [
      words ? s.wordsUnit(words) : s.allClear,
      s.sentencesUnit(GRAMMAR_PER_SESSION),
      due ? s.dueUnit(Math.min(due, TOPICS_PER_SESSION)) : s.nothingDue,
      s.upNext
    ];
  }

  private activeStep(): number | null {
    if (this.route === "drill" && this.session) {
      return this.session.tasks[this.session.index]?.step ?? null;
    }
    if (this.route === "summary") return 3;
    return null;
  }

  private paint(): void {
    if (this.route === "summary") this.scoreSession();

    this.shell.setRoute(this.route);
    if (!BARE_ROUTES.has(this.route)) {
      paintStepper(this.shell.stepper, this.stepperCounts(), this.activeStep());
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
      case "home":
      default:
        view.append(renderHome(ctx));
        break;
    }
  }
}

const mount = document.getElementById("app");
if (mount) new App(mount);
