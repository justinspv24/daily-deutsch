import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/overlay.css";

import { aiAvailable } from "./ai";
import { currentLearner, onAuthChange, supabase } from "./auth";
import { CLOUD_ENABLED } from "./config";
import { getLang, setLang, t } from "./i18n";
import { LocalRepository, readLocalProgress } from "./repositories/local";
import { SupabaseRepository } from "./repositories/supabase";
import { mergeProgress, type Repository } from "./repository";
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
import { renderProgress } from "./ui/progress";
import { buildShell, paintStepper, type Shell } from "./ui/shell";
import { renderSummary } from "./ui/summary";
import { openTranslator } from "./ui/translate";

class App {
  private progress: Progress;
  private session: SessionState | null = null;
  private route: Route = "home";
  private learner: Learner | null = null;
  private repository: Repository = new LocalRepository();
  private shell: Shell;
  private summaryScored = false;
  /** Coalesces the writes that a fast round would otherwise fire off. */
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(root: HTMLElement) {
    setLang(getLang());
    initTheme();

    // Start from whatever this browser already knows, so the first paint is
    // immediate and a signed-out visitor can drill without an account at all.
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
      onAccount: () => openAccount(this.learner, () => void this.adoptLearner(null))
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
    const learner = await currentLearner();
    await this.adoptLearner(learner);
    onAuthChange((next) => {
      if (next?.id === this.learner?.id) return;
      void this.adoptLearner(next);
    });
  }

  /**
   * Switch storage layers. Signing in merges whatever was played anonymously
   * into the account rather than discarding it; signing out drops back to the
   * local copy that is already on this device.
   */
  private async adoptLearner(learner: Learner | null): Promise<void> {
    this.learner = learner;
    this.shell.setLearner(learner);

    const client = supabase();
    if (!learner || !client) {
      this.repository = new LocalRepository();
      this.progress = readLocalProgress();
      this.paint();
      return;
    }

    const cloud = new SupabaseRepository(client, learner.id);
    try {
      const remote = await cloud.load();
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
    this.paint();
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

    paintStepper(this.shell.stepper, this.stepperCounts(), this.activeStep());
    const ctx = this.context();
    const view = clear(this.shell.view);

    switch (this.route) {
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
