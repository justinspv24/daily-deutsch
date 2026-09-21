import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/overlay.css";
import "./styles/classroom.css";
import "./styles/profile.css";
import "./styles/syllabus.css";
import "./styles/media.css";

import { agendaFromPlan, buildAgenda, planOf } from "./agenda";
import { currentLearner, onAuthChange, supabase } from "./auth";
import { ClassRun } from "./classrun";
import { CLOUD_ENABLED } from "./config";
import { getLang, setLang } from "./i18n";
import {
  closeStaleClass,
  HEARTBEAT_MS,
  startLive,
  staleLive
} from "./liveclass";
import { initPwa, onInstallChange } from "./pwa";
import {
  ANON_SCOPE,
  LocalRepository,
  clearLocalProgress,
  dropLegacyLocalProgress,
  readLocalProgress
} from "./repositories/local";
import { SupabaseRepository } from "./repositories/supabase";
import { emptyProgress, mergeProgress, seedLevel, type Repository } from "./repository";
import { DEFAULT_LEVEL } from "./data/curriculum";
import { todayISO } from "./scheduler";
import { registerDoubleTap } from "./shortcuts";
import { initTheme } from "./theme";
import { ClassTutor } from "./tutor";
import type { ClassRecord, Learner, LiveClass, Progress } from "./types";
import { openAccount } from "./ui/account";
import { openChat } from "./ui/chat";
import { renderClassroom, type ClassroomView } from "./ui/classroom";
import type { AppContext, Route } from "./ui/context";
import { clear } from "./ui/dom";
import { renderHome } from "./ui/home";
import { renderLevel } from "./ui/level";
import { renderLoading, renderLogin, renderRecovery } from "./ui/login";
import { renderProfile } from "./ui/profile";
import { buildShell, type Shell } from "./ui/shell";
import { renderSummary } from "./ui/summary";
import { renderPodcasts } from "./ui/podcasts";
import { renderSyllabus } from "./ui/syllabus";
import { openTranslator } from "./ui/translate";
import { openVoice, storedVoice } from "./ui/voice";

/** How long the boot screen waits for Supabase before falling back to sign-in. */
const AUTH_TIMEOUT_MS = 8000;

class App {
  private progress: Progress;
  private route: Route;
  private learner: Learner | null = null;
  /** True between a password-reset link landing and the new password being saved. */
  private recovering = false;
  private repository: Repository = new LocalRepository(ANON_SCOPE);
  private shell: Shell;
  /** Coalesces the writes that a fast exchange would otherwise fire off. */
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * The classroom, and the lesson running inside it.
   *
   * Both live here rather than in the view because `paint()` throws its screen
   * away and rebuilds it on every redraw, and a classroom rebuilt that way
   * would tear down its own transcript, its own call and its own clock several
   * times a minute. The view is built once, held, and re-appended.
   */
  private classroom: ClassroomView | null = null;
  private run: ClassRun | null = null;

  /** The class that just ended, for the summary to read. */
  private lastClass: ClassRecord | null = null;
  /** A class the day ran out on, closed at boot. Home says so once. */
  private autoClosed: ClassRecord | null = null;

  constructor(root: HTMLElement) {
    setLang(getLang());
    initTheme();

    // With an account system behind the app the front door is the sign-in
    // screen; without one (tests, a bare checkout) the class is open as before.
    this.route = CLOUD_ENABLED ? "loading" : "home";
    dropLegacyLocalProgress();
    this.progress = readLocalProgress(ANON_SCOPE);
    this.sweepStaleClass();

    this.shell = buildShell(root, {
      onLangChange: () => {
        this.shell.refreshChrome();
        this.shell.setLearner(this.learner);
        this.paint();
      },
      onThemeChange: () => {
        /* the tokens do the work */
      },
      onHome: () => this.goHome(),
      onChat: () => openChat({ onNeedKey: () => this.openAccountPanel() }),
      onTranslate: () => openTranslator(),
      onVoice: () => openVoice(this.progress.level, { onNeedKey: () => this.openAccountPanel() }),
      onAccount: () => this.openAccountPanel()
    });
    this.shell.setLearner(null);
    // The browser decides when the install prompt becomes available; redraw
    // so the offer can appear without a navigation. Never mid-class, though:
    // repainting the classroom would be repainting a conversation.
    onInstallChange(() => {
      if (this.route !== "classroom") this.paint();
    });
    this.paint();

    // Always live, so a double-tap explains itself ("not switched on yet")
    // instead of silently doing nothing when the assistant is off.
    registerDoubleTap({
      c: () => openChat({ onNeedKey: () => this.openAccountPanel() }),
      t: () => openTranslator(),
      v: () => openVoice(this.progress.level, { onNeedKey: () => this.openAccountPanel() })
    });

    this.watchLife();
    void this.restoreSession();
  }

  /* ------------------------------------------------------------ the class */

  /**
   * Open the classroom: resume the class still going, or begin today's.
   *
   * A class open from an earlier sitting is resumed rather than replaced, and
   * its plan is rebuilt from the ids it stored rather than recomputed — the
   * learner comes back to the lesson they left, not to a fresh one that
   * happens to be about the same thing.
   */
  private startClass(): void {
    if (!ClassTutor.offerable()) return;
    this.endRun();

    const today = todayISO();
    let live: LiveClass | null = this.progress.live;
    let agenda = live && live.date === today ? agendaFromPlan(this.progress) : null;

    if (!agenda || agenda.items.length === 0) {
      agenda = buildAgenda(this.progress, today);
      live = startLive(this.progress.level ?? DEFAULT_LEVEL, planOf(agenda));
      this.progress.live = live;
    }
    if (!live) return;

    const ctx = this.context();
    const view = renderClassroom(ctx, {
      onBreak: () => this.run?.suspend(),
      onEnd: () => this.run?.end(),
      onRetry: () => this.run?.retry(),
      onNeedKey: () => this.openAccountPanel(),
      onTyped: (answer) => this.run?.typed(answer)
    });
    this.classroom = view;
    this.run = new ClassRun(this.progress, agenda, live, view, {
      commit: () => this.persist(),
      saveLive: (open) => this.storeLive(open),
      onNeedKey: () => this.openAccountPanel(),
      onEnded: (record) => this.classEnded(record),
      onBroken: () => this.classBroken()
    }, storedVoice());

    this.route = "classroom";
    this.paint();
    this.run.start();
  }

  private classEnded(record: ClassRecord | null): void {
    this.lastClass = record;
    this.endRun();
    this.route = "summary";
    this.paint();
  }

  /**
   * The class was broken off and is still open. Tear the room down and go home.
   *
   * This is where the navigation happens, and `goHome` deliberately does not
   * do it itself: a class has to be suspended *before* the screen changes, and
   * the run is the only thing that knows how to do that. `goHome` therefore
   * hands over to the run and lets it call back here — which also means every
   * way out of the classroom, the icon and the Break button alike, takes
   * exactly the same path.
   */
  private classBroken(): void {
    this.endRun();
    this.route = "home";
    this.paint();
  }

  /** Tear the classroom down. The class itself may well still be open. */
  private endRun(): void {
    this.run?.destroy();
    this.run = null;
    this.classroom?.destroy();
    this.classroom = null;
  }

  /**
   * Home, from anywhere.
   *
   * From inside a class this is a break and not an abandonment: the meter
   * stops, everything so far is written, and the pill on the home screen then
   * offers to carry on. Anything else would make the home icon a trap.
   */
  private goHome(): void {
    // Suspending calls back into `classBroken`, which is what actually
    // navigates. Returning here without painting is deliberate: painting
    // twice would rebuild the home screen on top of itself.
    if (this.run) return this.run.suspend();
    this.route = "home";
    this.paint();
  }

  /**
   * Close a class the day ran out on.
   *
   * Checked at boot, and again on every heartbeat and every return to the tab,
   * because the interesting case is a phone that was in a pocket at midnight.
   * Comparing today's date against the class's own is correct through time
   * zones and through DST, where a timer aimed at 23:59:59 is not.
   */
  private sweepStaleClass(): void {
    if (!staleLive(this.progress)) return;
    // A class still on screen when the day turns is finished properly first,
    // so its answers reach the ladders rather than being closed out from under
    // the lesson that is still running.
    if (this.run) {
      this.run.end("midnight");
      return;
    }
    const record = closeStaleClass(this.progress);
    if (record) {
      this.autoClosed = record;
      void this.repository.recordClass(record).catch(() => {
        /* it is safe locally; the next sync carries it */
      });
    }
    this.persist();
  }

  /**
   * The lifecycle events that actually fire on a phone.
   *
   * `visibilitychange` is the only one both iOS Safari and Android Chrome
   * dispatch reliably when the browser is backgrounded or killed, and
   * `pagehide` covers Safari's gap on same-tab navigations. `beforeunload` and
   * `unload` are deliberately absent: neither fires when an app is swiped away
   * on a phone, and `beforeunload` has historically disabled the back/forward
   * cache for everyone in exchange for nothing.
   *
   * The write on the way out has to be synchronous. A hidden page may be
   * frozen before a promise settles, so the local mirror is what is trusted
   * there; the cloud catches up on the next return.
   */
  private watchLife(): void {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.run?.hide();
        this.writeLocal();
        return;
      }
      this.sweepStaleClass();
      this.run?.show();
    });
    window.addEventListener("pagehide", () => {
      this.run?.hide();
      this.writeLocal();
    });

    // No handle kept: it runs for as long as the page does, and the one thing
    // it must not do is stop while a class is open.
    setInterval(() => {
      this.sweepStaleClass();
      this.run?.tick();
    }, HEARTBEAT_MS);
  }

  /** The account panel — also where a missing key sends a learner mid-class. */
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
   * `ANON_SCOPE` for work done before signing in — so one account can never
   * read or inherit another's work at the same browser. Only anonymous work
   * follows someone into their account, and only once.
   */
  private async adoptLearner(learner: Learner | null, options: { wipeLocal: boolean }): Promise<void> {
    const previous = this.learner;
    this.learner = learner;
    this.shell.setLearner(learner);
    this.endRun();

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
      this.sweepStaleClass();
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
      // mirror rather than blocking the class on the network.
      this.repository = mirror;
      this.progress = await mirror.load();
    }
    this.sweepStaleClass();
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

  /** The mirror, written straight through. Safe on a page about to be frozen. */
  private writeLocal(): void {
    void new LocalRepository(this.learner?.id ?? ANON_SCOPE).save(this.progress);
  }

  private persist(): void {
    this.writeLocal();
    if (this.repository.kind !== "cloud") return;
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      void this.repository.save(this.progress).catch(() => {
        /* the local mirror already has it */
      });
    }, 800);
  }

  /**
   * The open class, written on its own.
   *
   * It changes after every answer and every thirty seconds, far more often
   * than the rest of the progress set, and it is the one thing that has to be
   * there when the app is opened again on another device. So it goes straight
   * out rather than waiting behind the debounce.
   */
  private storeLive(live: LiveClass | null): void {
    this.progress.live = live;
    this.writeLocal();
    if (this.repository.kind !== "cloud") return;
    void this.repository.saveLive(live).catch(() => {
      /* the mirror has it; the next full save will carry it */
    });
  }

  private context(): AppContext {
    return {
      progress: this.progress,
      learner: this.learner,
      lastClass: this.lastClass,
      autoClosed: this.autoClosed,
      dismissAutoClosed: () => {
        this.autoClosed = null;
        this.paint();
      },
      refresh: () => this.paint(),
      go: (route) => {
        // Leaving the classroom by any door keeps the class open; only "End
        // class" finishes one.
        if (this.run && route !== "classroom") {
          this.run.suspend();
          if (route === "home") return;
        }
        this.route = route;
        this.paint();
      },
      startClass: () => this.startClass(),
      setLevel: (level) => {
        this.progress.level = level;
        seedLevel(this.progress, level);
        this.persist();
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
      commit: () => this.persist()
    };
  }

  /* --------------------------------------------------------------- view */

  private paint(): void {
    this.shell.setRoute(this.route);
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
      case "classroom":
        // Re-appended, never rebuilt: see the comment on `classroom`.
        if (this.classroom) view.append(this.classroom.root);
        break;
      case "summary":
        view.append(renderSummary(ctx));
        break;
      case "profile":
        view.append(renderProfile(ctx));
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
