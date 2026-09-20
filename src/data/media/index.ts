import type { Level, PodcastEpisode, PodcastShow, SectionMedia, VideoClip } from "../../types";
import { A1_MEDIA, A1_SHOWS } from "./a1";
import { A2_MEDIA, A2_SHOWS } from "./a2";
import { B1_MEDIA, B1_SHOWS } from "./b1";
import { B2_MEDIA, B2_SHOWS } from "./b2";

/**
 * What to watch and listen to, section by section.
 *
 * None of this was written from memory. The per-level files are generated
 * from `docs/research/media.json`, the output of a research pass that
 * searched for community-recommended videos and podcasts for every section,
 * fetched each one to read its length, chapters and feed, and then had an
 * independent, skeptical pass try to refute every link, timestamp and claim.
 * Only what survived is here; the JSON keeps the reasons. See
 * docs/media.md for how it was done and how to rerun it.
 */
const MEDIA: Record<Level, readonly SectionMedia[]> = {
  A1: A1_MEDIA,
  A2: A2_MEDIA,
  B1: B1_MEDIA,
  B2: B2_MEDIA
};

const SHOWS: Record<Level, readonly PodcastShow[]> = {
  A1: A1_SHOWS,
  A2: A2_SHOWS,
  B1: B1_SHOWS,
  B2: B2_SHOWS
};

const EMPTY: SectionMedia = { section: "", level: "A1", videos: [], podcasts: [] };

export function mediaFor(sectionId: string): SectionMedia {
  const level = sectionId.slice(0, 2).toUpperCase() as Level;
  return MEDIA[level]?.find((m) => m.section === sectionId) ?? { ...EMPTY, section: sectionId, level };
}

export function showsFor(level: Level): readonly PodcastShow[] {
  return SHOWS[level];
}

export function episodesFor(level: Level): readonly PodcastEpisode[] {
  return MEDIA[level].flatMap((m) => m.podcasts);
}

export function clipsFor(level: Level): readonly VideoClip[] {
  return MEDIA[level].flatMap((m) => m.videos);
}

export function allMedia(): readonly SectionMedia[] {
  return (["A1", "A2", "B1", "B2"] as const).flatMap((level) => MEDIA[level]);
}
