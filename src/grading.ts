import type { Verdict } from "./types";

/** Trim, collapse whitespace, drop trailing punctuation and wrapping quotes. */
export function flatten(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,!?;:]+$/u, "")
    .replace(/^["'„“]+|["'”“]+$/gu, "")
    .trim();
}

/** ä→a, ö→o, ü→u, ß→ss — used to detect a near miss rather than a wrong answer. */
export function foldUmlauts(input: string): string {
  return input
    .toLowerCase()
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ß/g, "ss");
}

/**
 * Grade a German answer.
 *   ok   — matches an accepted answer
 *   near — matches once umlauts and ß are folded away (spelling slip)
 *   no   — wrong
 */
export function judgeGerman(
  input: string,
  accepted: readonly string[],
  caseSensitive = false
): Verdict {
  const given = flatten(input);
  if (!given) return "no";

  for (const candidate of accepted) {
    const target = flatten(candidate);
    const hit = caseSensitive ? given === target : given.toLowerCase() === target.toLowerCase();
    if (hit) return "ok";
  }
  for (const candidate of accepted) {
    if (foldUmlauts(given) === foldUmlauts(flatten(candidate))) return "near";
  }
  return "no";
}

/** English meanings are graded generously: articles, "to" and gender tags are ignored. */
export function judgeEnglish(input: string, accepted: readonly string[]): Verdict {
  const normalise = (s: string): string =>
    flatten(s)
      .toLowerCase()
      .replace(/\((?:m|f|n)\)/g, "")
      .replace(/^(?:to|a|an|the)\s+/, "")
      .replace(/\s+/g, " ")
      .trim();

  const given = normalise(input);
  if (!given) return "no";

  for (const candidate of accepted) {
    const target = normalise(candidate);
    if (given === target) return "ok";
    if (target.length > 3 && (given.includes(target) || target.includes(given))) return "ok";
  }
  return "no";
}
