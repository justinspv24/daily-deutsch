import type { Bilingual, SyllabusGrammar, SyllabusLink, SyllabusSection } from "../../types";

/**
 * The little vocabulary the four syllabus files are written in, so each
 * section reads as content rather than as object literals. The words of a
 * section are not written here at all: they are the drill bank's items
 * tagged with the section id, so the two can never drift apart.
 */

export const bi = (de: string, en: string): Bilingual => ({ de, en });

export const g = (
  de: string,
  en: string,
  example: string,
  gloss: string,
  illustration?: string
): SyllabusGrammar =>
  illustration ? { title: bi(de, en), example, gloss, illustration } : { title: bi(de, en), example, gloss };

export const section = (
  id: string,
  title: Bilingual,
  blurb: Bilingual,
  body: Omit<SyllabusSection, "id" | "title" | "blurb">
): SyllabusSection => ({ id, title, blurb, ...body });

/* ----------------------------------------------------------------- links */

/**
 * A YouTube search rather than a video. The channels below are real and
 * stable; individual video ids are not something to write from memory, and a
 * dead link under a grammar point is worse than a search that always works.
 */
export const yt = (query: string, de: string, en: string): SyllabusLink => ({
  kind: "video",
  label: bi(de, en),
  url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
});

export const course = (url: string, de: string, en: string): SyllabusLink => ({
  kind: "course",
  label: bi(de, en),
  url
});

export const reading = (url: string, de: string, en: string): SyllabusLink => ({
  kind: "reading",
  label: bi(de, en),
  url
});

/** DW's free course, A1 to B1, one story running through every lesson. */
export const NICOS_WEG_PLAYLIST = "https://www.youtube.com/playlist?list=PLs7zUO7VPyJ5DV1iBRgSw2uDl832n0bLg";
export const DW_LEARN_GERMAN = "https://learngerman.dw.com/";
export const DW_YOUTUBE = "https://www.youtube.com/channel/UCxUWIEL-USsiPak0Qy6_vVg";
export const EASY_GERMAN = "https://www.youtube.com/channel/UCbxb2fqe9oNgglAoYqsYOtQ";

/** The Goethe-Institut's own exam objectives and word lists. */
export const GOETHE_A1_GOALS = "https://www.goethe.de/pro/relaunch/prf/el/Pruefungsziele_Testbeschreibung_A1_SD1.pdf";
export const GOETHE_A1_WORDS = "https://www.goethe.de/pro/relaunch/prf/de/A1_SD1_Wortliste_02.pdf";
export const GOETHE_A2_GOALS = "https://www.goethe.de/pro/relaunch/prf/de/Pruefungsziele_Testbeschreibung_A2_SD2.pdf";
export const GOETHE_A2_WORDS = "https://www.goethe.de/pro/relaunch/prf/sr/Goethe-Zertifikat_A2_Wortliste.pdf";
export const GOETHE_B1_WORDS = "https://www.goethe.de/pro/relaunch/prf/en/Goethe-Zertifikat_B1_Wortliste.pdf";
export const GOETHE_EXAMS = "https://www.goethe.de/de/spr/kup/prf.html";
export const TELC_DOWNLOADS = "https://www.telc.net/en/teaching-materials/free-downloads/";
export const TELC_A2_B1 = "https://www.telc.net/en/language-examinations/certificate-exams/german/telc-german-a2b1/";

/** The three links every level shares. */
export const SHARED_LINKS: readonly SyllabusLink[] = [
  course(NICOS_WEG_PLAYLIST, "Nicos Weg (DW) — die ganze Serie", "Nicos Weg (DW) — the whole series"),
  course(DW_LEARN_GERMAN, "DW Deutsch lernen — Kurse nach Niveau", "DW Learn German — courses by level"),
  course(EASY_GERMAN, "Easy German — echte Gespräche mit Untertiteln", "Easy German — real conversations with subtitles")
];
