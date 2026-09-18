import type { Expects } from "./speech";
import type { Task, TableStudyTask, VocabTask } from "./types";

/**
 * How each question sounds when it is asked rather than read.
 *
 * A question on screen and the same question out loud are not the same
 * question. The vocabulary card shows three boxes — article, meaning, plural —
 * and a learner fills them in whatever order they like. Nobody asks all three
 * at once out loud, so here it becomes three questions, which is how a teacher
 * has always done it: der, die or das? … and what does it mean? … and the
 * plural? Each answer lands in its own box as it is given.
 *
 * Everything is phrased to be *heard*. "Partizip II" is written here as
 * "Partizip zwei", because a model reading the first version aloud says
 * "Partizip zwei Strich Strich" often enough to matter, and a learner who has
 * to decode the question has stopped practising German and started decoding.
 */

/** One spoken question, and the field on the card it fills. */
export interface SpokenAsk {
  /** Index of the input this answer belongs in. */
  readonly field: number;
  /** The question, in German, for the tutor to ask in its own words. */
  readonly prompt: string;
  /** How a spoken answer to it should be read. */
  readonly expects: Expects;
  /** Accepted answers, for hearing one inside a spoken sentence. */
  readonly accepted: readonly string[];
}

/**
 * Hints carry a little markup (`<code>der Mann</code>`) because they are
 * written for the screen. Spoken, the tags are noise.
 */
function spoken(text: string): string {
  return text
    .replace(/<[^>]*>/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

/** Quote a word so the tutor reads it as the thing being asked about. */
function q(word: string): string {
  return `"${word}"`;
}

export function asksFor(task: Task): readonly SpokenAsk[] {
  switch (task.kind) {
    case "vocab":
      return vocabAsks(task);

    case "table-cell":
      return [
        {
          field: 0,
          prompt: `Tabelle ${q(task.tableName.de)}. Frage nach der Form für ${q(task.rowLabel.de)} und ${q(task.colLabel.de)}.`,
          expects: "german",
          accepted: task.answers
        }
      ];

    case "blank": {
      const hint = spoken(task.question.hint.de);
      return [
        {
          field: 0,
          prompt: [
            `Lies den Satz vor und frage, welches Wort in die Lücke gehört: ${q(task.question.sentence)}.`,
            hint ? `Hinweis für den Lernenden: ${hint}.` : "",
            "Er soll nur das fehlende Wort sagen."
          ]
            .filter(Boolean)
            .join(" "),
          expects: "german",
          accepted: task.question.answers
        }
      ];
    }

    // A grid is read, not answered.
    case "table-study":
    default:
      return [];
  }
}

function vocabAsks(task: VocabTask): readonly SpokenAsk[] {
  const item = task.item;
  const word = q(item.word);

  if (item.kind === "verb") {
    return [
      {
        field: 0,
        prompt: `Frage, welches Hilfsverb ${word} im Perfekt nimmt: sein oder haben?`,
        expects: "aux",
        accepted: [item.key]
      },
      {
        field: 1,
        prompt: `Frage, was ${word} auf Englisch heißt.`,
        expects: "english",
        accepted: item.en
      },
      {
        field: 2,
        prompt: `Frage nach dem Partizip zwei von ${word}.`,
        expects: "german",
        accepted: item.form
      }
    ];
  }

  return [
    {
      field: 0,
      prompt: `Frage nach dem Artikel von ${word}: der, die oder das?`,
      expects: "article",
      accepted: [item.key]
    },
    {
      field: 1,
      prompt: `Frage, was ${word} auf Englisch heißt.`,
      expects: "english",
      accepted: item.en
    },
    {
      field: 2,
      prompt: `Frage nach dem Plural von ${word}.`,
      expects: "german",
      accepted: item.form
    }
  ];
}

/** What the tutor says when a grid goes up to be read rather than answered. */
export function introFor(task: TableStudyTask): string {
  const table = task.table;
  return [
    `[TAFEL] Die Tabelle ${q(table.name.de)} steht jetzt auf dem Bildschirm.`,
    `Worum es geht: ${spoken(table.blurb.de)}`,
    "Sag in zwei Sätzen, wofür die Tabelle gut ist und worauf er achten soll."
  ].join(" ");
}

/** The line that closes a round. */
export function closingLine(right: number, total: number): string {
  return `Die Runde ist zu Ende. ${right} von ${total} richtig. Sag einen kurzen, freundlichen Schlusssatz.`;
}

/** Whether a task has anything for the tutor to ask at all. */
export function isSpoken(task: Task): boolean {
  return task.kind !== "table-study";
}
