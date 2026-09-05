import { GRAMMAR } from "./data/grammar";
import { TOPICS } from "./data/topics";
import { UPCOMING } from "./data/topics";
import { VOCAB } from "./data/vocab";
import { todayISO } from "./scheduler";
import type {
  BlankTask,
  GrammarItem,
  Progress,
  SessionState,
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

/** Words still short of two consecutive correct answers. */
export function activeVocab(progress: Progress): VocabItem[] {
  return VOCAB.filter((item) => (progress.vocab[item.id]?.streak ?? 0) < 2);
}

export function dueTopics(progress: Progress): TopicItem[] {
  const today = todayISO();
  return TOPICS.filter((topic) => {
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
  return [...GRAMMAR]
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

/** Rotates daily so step 4 suggests something different each morning. */
export function suggestedTopic(): UpcomingTopic {
  const dayNumber = Math.floor(Date.parse(`${todayISO()}T00:00:00Z`) / 86_400_000);
  return UPCOMING[Math.abs(dayNumber) % UPCOMING.length]!;
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

  return { tasks, index: 0, results: [], topicHits };
}
