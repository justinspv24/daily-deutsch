import { curriculumFor } from "./data/curriculum";
import { todayISO } from "./scheduler";
import type {
  BlankTask,
  GrammarItem,
  Progress,
  SessionState,
  StepState,
  Task,
  TopicItem,
  UpcomingTopic,
  VocabItem
} from "./types";

export const GRAMMAR_PER_SESSION = 8;
export const TOPICS_PER_SESSION = 3;

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

/** Every word in play for this learner: the level's bank plus their own additions. */
export function allVocab(progress: Progress): VocabItem[] {
  return [...curriculumFor(progress.level).vocab, ...progress.custom];
}

/** Words still short of two consecutive correct answers. */
export function activeVocab(progress: Progress): VocabItem[] {
  return allVocab(progress).filter((item) => (progress.vocab[item.id]?.streak ?? 0) < 2);
}

export function dueTopics(progress: Progress): TopicItem[] {
  const today = todayISO();
  return curriculumFor(progress.level).topics.filter((topic) => {
    const state = progress.topics[topic.id];
    if (!state) return false;
    return state.stage < 5 && state.due <= today;
  });
}

/**
 * Weight the table sentences: the one logged as a real mistake always makes
 * the cut, then the least-secure and least-seen, with a little jitter so two
 * mornings in a row never feel identical.
 */
export function pickGrammar(progress: Progress): GrammarItem[] {
  return [...curriculumFor(progress.level).grammar]
    .map((item) => {
      const state = progress.grammar[item.id];
      const secure = (state?.streak ?? 0) >= 2 ? 0 : 10;
      const freshness = 10 - Math.min(state?.seen ?? 0, 10);
      return { item, score: (item.priority ? 100 : 0) + secure + freshness + Math.random() * 4 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, GRAMMAR_PER_SESSION)
    .map((entry) => entry.item);
}

/**
 * Rotates daily so step 4 suggests something different each morning — and is
 * offset per learner, so two people at the same level get different topics on
 * the same day.
 */
export function suggestedTopic(progress: Progress, seed = ""): UpcomingTopic {
  const list = curriculumFor(progress.level).upcoming;
  const dayNumber = Math.floor(Date.parse(`${todayISO()}T00:00:00Z`) / 86_400_000);
  return list[Math.abs(dayNumber + hashSeed(seed)) % list.length]!;
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % 1000;
}

export function buildSession(progress: Progress): SessionState {
  const tasks: Task[] = [];

  for (const item of shuffle(activeVocab(progress))) {
    tasks.push({ step: 0, kind: "vocab", item });
  }
  for (const item of shuffle(pickGrammar(progress))) {
    tasks.push({
      step: 1,
      kind: "blank",
      sourceId: item.id,
      bank: "grammar",
      label: item.group,
      question: item
    } satisfies BlankTask);
  }

  const topics = dueTopics(progress).slice(0, TOPICS_PER_SESSION);
  const topicHits: SessionState["topicHits"] = {};
  for (const topic of topics) {
    topicHits[topic.id] = { right: 0, wrong: 0 };
    for (const question of topic.questions) {
      tasks.push({
        step: 2,
        kind: "blank",
        sourceId: topic.id,
        bank: "topic",
        label: topic.name,
        question
      } satisfies BlankTask);
    }
  }

  return { tasks, index: 0, answered: [], results: [], topicHits };
}

/** First task of a step the learner has not answered yet, or -1 if there is none. */
export function firstUnanswered(session: SessionState, step: number): number {
  return session.tasks.findIndex((task, index) => task.step === step && !session.answered.includes(index));
}

/**
 * Next unanswered task after `from`, wrapping to the beginning so skipping a
 * step never strands the questions that were skipped. -1 once none are left.
 */
export function nextUnanswered(session: SessionState, from: number): number {
  const total = session.tasks.length;
  for (let step = 1; step <= total; step += 1) {
    const index = (from + step) % total;
    if (!session.answered.includes(index)) return index;
  }
  return -1;
}

/** How each of the four steps is drawn while a round is in progress. */
export function stepStates(session: SessionState): readonly StepState[] {
  const current = session.tasks[session.index]?.step ?? null;
  return [0, 1, 2, 3].map((step) => {
    if (step === current) return "active";
    const indices = session.tasks.reduce<number[]>((found, task, index) => {
      if (task.step === step) found.push(index);
      return found;
    }, []);
    if (indices.length > 0 && indices.every((index) => session.answered.includes(index))) return "done";
    return "idle";
  });
}
