import type { SupabaseClient } from "@supabase/supabase-js";
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
    const [vocab, grammar, topics, sessions] = await Promise.all([
      this.client.from("vocab_state").select("word_id, streak, seen, last_date"),
      this.client.from("grammar_state").select("item_id, streak, seen"),
      this.client.from("topic_state").select("topic_id, stage, due, last_date"),
      this.client
        .from("sessions")
        .select("played_on, right_count, total_count")
        .order("played_on", { ascending: true })
        .limit(400)
    ]);

    const progress = normalise(null);

    for (const row of vocab.data ?? []) {
      const state = progress.vocab[row.word_id as string];
      if (!state) continue;
      state.streak = Number(row.streak ?? 0);
      state.seen = Number(row.seen ?? 0);
      state.lastDate = (row.last_date as string | null) ?? null;
    }
    for (const row of grammar.data ?? []) {
      const state = progress.grammar[row.item_id as string];
      if (!state) continue;
      state.streak = Number(row.streak ?? 0);
      state.seen = Number(row.seen ?? 0);
    }
    for (const row of topics.data ?? []) {
      const state = progress.topics[row.topic_id as string];
      if (!state) continue;
      state.stage = Number(row.stage ?? 0);
      state.due = (row.due as string) ?? todayISO();
      state.lastDate = (row.last_date as string | null) ?? null;
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

    const results = await Promise.all([
      this.client.from("vocab_state").upsert(vocabRows, { onConflict: "user_id,word_id" }),
      this.client.from("grammar_state").upsert(grammarRows, { onConflict: "user_id,item_id" }),
      this.client.from("topic_state").upsert(topicRows, { onConflict: "user_id,topic_id" })
    ]);

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
