import type { SupabaseClient } from "@supabase/supabase-js";
import { allCurricula, isLevel } from "../data/curriculum";
import { normalise, type Repository } from "../repository";
import { todayISO } from "../scheduler";
import type { Progress, SessionRecord } from "../types";

/**
 * Progress kept in Postgres, one row per learner per item. Row-level security
 * does the access control, so every query here is written as if the table held
 * only this learner's rows — because as far as the database is concerned, it does.
 */
export class SupabaseRepository implements Repository {
  readonly kind = "cloud" as const;

  constructor(
    private readonly client: SupabaseClient,
    private readonly userId: string
  ) {}

  async load(): Promise<Progress> {
    const [profile, vocab, grammar, topics, sessions] = await Promise.all([
      this.client.from("profiles").select("level").eq("id", this.userId).maybeSingle(),
      this.client.from("vocab_state").select("word_id, streak, seen, last_date"),
      this.client.from("grammar_state").select("item_id, streak, seen"),
      this.client.from("topic_state").select("topic_id, stage, due, last_date"),
      this.client
        .from("sessions")
        .select("played_on, right_count, total_count")
        .order("played_on", { ascending: true })
        .limit(400)
    ]);

    const storedLevel = (profile.data as { level?: unknown } | null)?.level;
    const progress = normalise({ level: isLevel(storedLevel) ? storedLevel : null });

    // Rows for every level are loaded, not just the current one, so a learner
    // who switches level and back finds their old streaks where they left them.
    const known = knownIds();

    for (const row of vocab.data ?? []) {
      const id = row.word_id as string;
      if (!known.vocab.has(id)) continue;
      progress.vocab[id] = {
        streak: Number(row.streak ?? 0),
        seen: Number(row.seen ?? 0),
        lastDate: (row.last_date as string | null) ?? null
      };
    }
    for (const row of grammar.data ?? []) {
      const id = row.item_id as string;
      if (!known.grammar.has(id)) continue;
      progress.grammar[id] = { streak: Number(row.streak ?? 0), seen: Number(row.seen ?? 0) };
    }
    for (const row of topics.data ?? []) {
      const id = row.topic_id as string;
      if (!known.topics.has(id)) continue;
      progress.topics[id] = {
        stage: Number(row.stage ?? 0),
        due: (row.due as string) ?? todayISO(),
        lastDate: (row.last_date as string | null) ?? null
      };
    }
    progress.sessions = (sessions.data ?? []).map((row) => ({
      date: row.played_on as string,
      right: Number(row.right_count ?? 0),
      total: Number(row.total_count ?? 0)
    }));

    progress.updatedAt = new Date().toISOString();
    return progress;
  }

  /**
   * Upsert the whole progress set. It is a few dozen small rows, so writing
   * all of them is simpler and less error-prone than tracking dirty state,
   * and it self-heals if a round was played while offline.
   */
  async save(progress: Progress): Promise<void> {
    const stamp = new Date().toISOString();

    const vocabRows = Object.entries(progress.vocab).map(([word_id, state]) => ({
      user_id: this.userId,
      word_id,
      streak: state.streak,
      seen: state.seen,
      last_date: state.lastDate,
      updated_at: stamp
    }));
    const grammarRows = Object.entries(progress.grammar).map(([item_id, state]) => ({
      user_id: this.userId,
      item_id,
      streak: state.streak,
      seen: state.seen,
      updated_at: stamp
    }));
    const topicRows = Object.entries(progress.topics).map(([topic_id, state]) => ({
      user_id: this.userId,
      topic_id,
      stage: state.stage,
      due: state.due,
      last_date: state.lastDate,
      updated_at: stamp
    }));

    const writes = [
      this.client.from("vocab_state").upsert(vocabRows, { onConflict: "user_id,word_id" }),
      this.client.from("grammar_state").upsert(grammarRows, { onConflict: "user_id,item_id" }),
      this.client.from("topic_state").upsert(topicRows, { onConflict: "user_id,topic_id" })
    ];
    if (progress.level) {
      writes.push(this.client.from("profiles").update({ level: progress.level }).eq("id", this.userId));
    }

    const results = await Promise.all(writes);
    const failure = results.find((r) => r.error);
    if (failure?.error) throw new Error(failure.error.message);
  }

  async recordSession(record: SessionRecord): Promise<void> {
    const { error } = await this.client.from("sessions").insert({
      user_id: this.userId,
      played_on: record.date,
      right_count: record.right,
      total_count: record.total
    });
    if (error) throw new Error(error.message);
  }
}

function knownIds(): { vocab: Set<string>; grammar: Set<string>; topics: Set<string> } {
  const known = { vocab: new Set<string>(), grammar: new Set<string>(), topics: new Set<string>() };
  for (const bank of allCurricula()) {
    for (const item of bank.vocab) known.vocab.add(item.id);
    for (const item of bank.grammar) known.grammar.add(item.id);
    for (const topic of bank.topics) known.topics.add(topic.id);
  }
  return known;
}
