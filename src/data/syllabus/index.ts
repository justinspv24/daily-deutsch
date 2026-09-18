import type { Level, LevelSyllabus } from "../../types";
import { A1_SYLLABUS } from "./a1";
import { A2_SYLLABUS } from "./a2";
import { B1_SYLLABUS } from "./b1";
import { B2_SYLLABUS } from "./b2";

/**
 * The syllabus: what each level covers, section by section.
 *
 * This is the map; the drill banks in `../a1.ts` and friends are the terrain.
 * The map is deliberately broader — it names every theme the exams draw on
 * and every grammar point they test, whether or not the drill has questions
 * for it yet — so a learner choosing a level can see the whole road ahead,
 * and so the next bank to write is never a guess.
 *
 * Built against the Goethe-Institut's Prüfungsziele and word lists, the telc
 * handbooks and, for the order things are taught in, the mainstream course
 * books. See docs/syllabus.md for exactly which documents.
 */
export const SYLLABI: Record<Level, LevelSyllabus> = {
  A1: A1_SYLLABUS,
  A2: A2_SYLLABUS,
  B1: B1_SYLLABUS,
  B2: B2_SYLLABUS
};

export function syllabusFor(level: Level): LevelSyllabus {
  return SYLLABI[level];
}
