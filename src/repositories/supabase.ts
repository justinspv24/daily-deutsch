import type { SupabaseClient } from "@supabase/supabase-js";
import { allCurricula, isLevel } from "../data/curriculum";
import { TABLES } from "../data/tables";
import { isVocabItem, normalise, type Repository } from "../repository";
import { todayISO } from "../scheduler";
import type {
  ClassRecord,
  Expects,
  LiveClass,
  Mistake,
  MistakeKind,
  MistakeNote,
  ClassPlanItem,
  Progress,
  SessionRecord,
  VocabItem
} from "../types";

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
    const [profile, custom, vocab, grammar, topics, tables, sessions, mistakes, classes, live] =
      await Promise.all([
      this.client.from("profiles").select("level").eq("id", this.userId).maybeSingle(),
      this.client
        .from("custom_vocab")
        .select("id, kind, word, key, en, form, note_de, note_en")
        .order("created_at", { ascending: true }),
      this.client.from("vocab_state").select("word_id, streak, seen, last_date"),
      this.client.from("grammar_state").select("item_id, streak, seen"),
      this.client.from("topic_state").select("topic_id, stage, due, last_date"),
      this.client.from("table_state").select("table_id, day_streak, due, last_date, missed, studied"),
      this.client
        .from("sessions")
        .select("played_on, right_count, total_count, seconds")
        .order("played_on", { ascending: true })
        .limit(400),
      this.client
        .from("mistakes")
        .select(
          "mistake_id, kind, ref, subject, gloss, prompt, expected, accepted, expects, given, first_missed, last_asked, stage, due, misses"
        ),
      this.client
        .from("classes")
        .select(
          "id, held_on, started_at, ended_at, seconds, level, section_ids, table_ids, word_ids, right_count, wrong_count, mistakes, ending"
        )
        .order("held_on", { ascending: true })
        .limit(600),
      this.client.from("live_class").select("*").eq("user_id", this.userId).maybeSingle()
      ]);

    const storedLevel = (profile.data as { level?: unknown } | null)?.level;
    const added = (custom.data ?? []).map(toVocabItem).filter(isVocabItem);
    const progress = normalise({ level: isLevel(storedLevel) ? storedLevel : null, custom: added });

    // Rows for every level are loaded, not just the current one, so a learner
    // who switches level and back finds their old streaks where they left them.
    const known = knownIds();
    for (const item of added) known.vocab.add(item.id);

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
    const knownTables = new Set(TABLES.map((table) => table.id));
    for (const row of tables.data ?? []) {
      const id = row.table_id as string;
      if (!knownTables.has(id)) continue;
      progress.tables[id] = {
        dayStreak: Number(row.day_streak ?? 0),
        due: (row.due as string) ?? todayISO(),
        lastDate: (row.last_date as string | null) ?? null,
        missed: Array.isArray(row.missed) ? (row.missed as string[]) : [],
        studied: row.studied === true
      };
    }
    progress.sessions = (sessions.data ?? []).map((row) => ({
      date: row.played_on as string,
      right: Number(row.right_count ?? 0),
      total: Number(row.total_count ?? 0),
      seconds: Number(row.seconds ?? 0)
    }));

    progress.mistakes = (mistakes.data ?? []).map(toMistake);
    progress.classes = (classes.data ?? []).map(toClassRecord);
    progress.live = live.data ? toLiveClass(live.data as Record<string, unknown>) : null;

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

    const tableRows = Object.entries(progress.tables).map(([table_id, state]) => ({
      user_id: this.userId,
      table_id,
      day_streak: state.dayStreak,
      due: state.due,
      last_date: state.lastDate,
      missed: state.missed,
      studied: state.studied,
      updated_at: stamp
    }));

    const mistakeRows = progress.mistakes.map((entry) => ({
      user_id: this.userId,
      mistake_id: entry.id,
      kind: entry.kind,
      ref: entry.ref || entry.id,
      subject: entry.subject,
      gloss: entry.gloss,
      prompt: entry.prompt,
      expected: entry.expected,
      accepted: [...entry.accepted],
      expects: entry.expects,
      given: entry.given,
      first_missed: entry.firstMissed,
      last_asked: entry.lastAsked,
      stage: entry.stage,
      due: entry.due,
      misses: entry.misses,
      updated_at: stamp
    }));

    const results = await Promise.all([
      this.client.from("vocab_state").upsert(vocabRows, { onConflict: "user_id,word_id" }),
      this.client.from("grammar_state").upsert(grammarRows, { onConflict: "user_id,item_id" }),
      this.client.from("topic_state").upsert(topicRows, { onConflict: "user_id,topic_id" }),
      this.client.from("table_state").upsert(tableRows, { onConflict: "user_id,table_id" }),
      mistakeRows.length
        ? this.client.from("mistakes").upsert(mistakeRows, { onConflict: "user_id,mistake_id" })
        : Promise.resolve({ error: null })
    ]);
    const failure = results.find((r) => r.error);
    if (failure?.error) throw new Error(failure.error.message);

    // The level lives on the profile row, which the sign-up trigger created.
    if (progress.level) {
      const { error } = await this.client
        .from("profiles")
        .update({ level: progress.level })
        .eq("id", this.userId);
      if (error) throw new Error(error.message);
    }
  }

  async recordSession(record: SessionRecord): Promise<void> {
    const { error } = await this.client.from("sessions").insert({
      user_id: this.userId,
      played_on: record.date,
      right_count: record.right,
      total_count: record.total,
      seconds: record.seconds ?? 0
    });
    if (error) throw new Error(error.message);
  }

  /**
   * A finished class, written once. `upsert` rather than `insert` because the
   * same class may be closed by the device that held it and then again by the
   * midnight sweep on another — the id is the same either way, and the second
   * write must not produce a second square on the calendar.
   */
  async recordClass(record: ClassRecord): Promise<void> {
    const { error } = await this.client.from("classes").upsert(
      {
        id: record.id,
        user_id: this.userId,
        held_on: record.date,
        started_at: record.startedAt,
        ended_at: record.endedAt,
        seconds: record.seconds,
        level: record.level,
        section_ids: [...record.sections],
        table_ids: [...record.tables],
        word_ids: [...record.words],
        right_count: record.right,
        wrong_count: record.wrong,
        mistakes: record.mistakes,
        ending: record.ending
      },
      { onConflict: "id" }
    );
    if (error) throw new Error(error.message);
  }

  async forgetMistake(id: string): Promise<void> {
    const { error } = await this.client
      .from("mistakes")
      .delete()
      .eq("user_id", this.userId)
      .eq("mistake_id", id);
    if (error) throw new Error(error.message);
  }

  /**
   * The class still open, or the absence of one. At most one row per learner,
   * so this is an upsert on the primary key and a delete when the class ends.
   */
  async saveLive(live: LiveClass | null): Promise<void> {
    if (!live) {
      const { error } = await this.client.from("live_class").delete().eq("user_id", this.userId);
      if (error) throw new Error(error.message);
      return;
    }

    const { error } = await this.client.from("live_class").upsert(
      {
        user_id: this.userId,
        class_id: live.id,
        held_on: live.date,
        started_at: live.startedAt,
        level: live.level,
        plan: live.plan,
        cursor_at: live.cursor,
        seconds: live.seconds,
        resumed_at: live.resumedAt,
        right_count: live.right,
        wrong_count: live.wrong,
        answers: live.answers,
        mistakes: live.mistakes,
        section_ids: [...live.sections],
        table_ids: [...live.tables],
        word_ids: [...live.words],
        updated_at: new Date().toISOString()
      },
      { onConflict: "user_id" }
    );
    if (error) throw new Error(error.message);
  }

  async addWord(item: VocabItem): Promise<void> {
    const { error } = await this.client.from("custom_vocab").insert({
      id: item.id,
      user_id: this.userId,
      kind: item.kind,
      word: item.word,
      key: item.key,
      en: [...item.en],
      form: [...item.form],
      note_de: item.note.de || null,
      note_en: item.note.en || null
    });
    if (error) throw new Error(error.message);
  }

  async removeWord(id: string): Promise<void> {
    const { error } = await this.client.from("custom_vocab").delete().eq("id", id);
    if (error) throw new Error(error.message);
    // The progress row would otherwise linger and be loaded back as a ghost.
    await this.client.from("vocab_state").delete().eq("word_id", id);
  }
}

function toVocabItem(row: Record<string, unknown>): VocabItem {
  return {
    id: String(row["id"] ?? ""),
    kind: row["kind"] === "verb" ? "verb" : "noun",
    word: String(row["word"] ?? ""),
    key: String(row["key"] ?? ""),
    en: Array.isArray(row["en"]) ? (row["en"] as string[]) : [],
    form: Array.isArray(row["form"]) ? (row["form"] as string[]) : [],
    note: {
      de: typeof row["note_de"] === "string" ? row["note_de"] : "",
      en: typeof row["note_en"] === "string" ? row["note_en"] : ""
    }
  };
}

/* ---------------------------------------------------- rows into the domain */

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
}

function toMistake(row: Record<string, unknown>): Mistake {
  const expected = String(row["expected"] ?? "");
  const accepted = strings(row["accepted"]);
  return {
    id: String(row["mistake_id"] ?? ""),
    kind: (row["kind"] as MistakeKind) ?? "vocab",
    ref: String(row["ref"] ?? ""),
    subject: String(row["subject"] ?? ""),
    gloss: String(row["gloss"] ?? ""),
    prompt: String(row["prompt"] ?? ""),
    expected,
    accepted: accepted.length ? accepted : [expected],
    expects: ((row["expects"] as Expects) ?? "german"),
    given: String(row["given"] ?? ""),
    firstMissed: String(row["first_missed"] ?? todayISO()),
    lastAsked: (row["last_asked"] as string | null) ?? null,
    stage: Number(row["stage"] ?? 0),
    due: String(row["due"] ?? todayISO()),
    misses: Number(row["misses"] ?? 1)
  };
}

/** Notes are stored as jsonb, so they arrive as whatever was written. */
function toNotes(value: unknown): MistakeNote[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === "object")
    .map((entry) => ({
      kind: (entry["kind"] as MistakeKind) ?? "vocab",
      subject: String(entry["subject"] ?? ""),
      prompt: String(entry["prompt"] ?? ""),
      expected: String(entry["expected"] ?? ""),
      given: String(entry["given"] ?? "")
    }));
}

function toClassRecord(row: Record<string, unknown>): ClassRecord {
  return {
    id: String(row["id"] ?? ""),
    date: String(row["held_on"] ?? ""),
    startedAt: String(row["started_at"] ?? ""),
    endedAt: String(row["ended_at"] ?? ""),
    seconds: Number(row["seconds"] ?? 0),
    level: isLevel(row["level"]) ? row["level"] : "A2",
    sections: strings(row["section_ids"]),
    tables: strings(row["table_ids"]),
    words: strings(row["word_ids"]),
    right: Number(row["right_count"] ?? 0),
    wrong: Number(row["wrong_count"] ?? 0),
    mistakes: toNotes(row["mistakes"]),
    ending:
      row["ending"] === "midnight" || row["ending"] === "dropped"
        ? row["ending"]
        : "ended"
  };
}

function toLiveClass(row: Record<string, unknown>): LiveClass {
  const plan = Array.isArray(row["plan"]) ? (row["plan"] as ClassPlanItem[]) : [];
  return {
    id: String(row["class_id"] ?? ""),
    date: String(row["held_on"] ?? todayISO()),
    startedAt: String(row["started_at"] ?? new Date().toISOString()),
    level: isLevel(row["level"]) ? row["level"] : "A2",
    plan,
    cursor: Number(row["cursor_at"] ?? 0),
    seconds: Number(row["seconds"] ?? 0),
    // Never resumed from a stored timestamp: the tab that was counting is gone.
    resumedAt: null,
    right: Number(row["right_count"] ?? 0),
    wrong: Number(row["wrong_count"] ?? 0),
    answers: Array.isArray(row["answers"]) ? (row["answers"] as LiveClass["answers"]) : [],
    mistakes: toNotes(row["mistakes"]),
    sections: strings(row["section_ids"]),
    tables: strings(row["table_ids"]),
    words: strings(row["word_ids"])
  };
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
