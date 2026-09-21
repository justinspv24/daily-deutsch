import type { PodcastShow, SectionMedia } from "../../types";

/**
 * Generated from docs/research/media.json by the research pass of 2026-09-21 — see docs/media.md.
 * Do not edit by hand; rerun the research and regenerate.
 */
export const B1_SHOWS: readonly PodcastShow[] = [
  {
    level: "B1",
    name: "Easy German: Learn German with native speakers",
    homepage: "https://www.easygerman.org/podcast",
    feedUrl: "https://proxyfeed.svmaudio.com/feeds/easygerman/feed.xml",
    fit: "Two native hosts (Cari, Manuel) in unscripted but deliberately clear conversation — real filler words, real sentence structures, but they stop and gloss idioms and Redewendungen as they go. Roughly 30-60 min, twice weekly, everyday and current-affairs topics; exactly the B1 job of moving from textbook German to spoken German. Transcripts/vocab lists exist but are behind the paid membership, which is the one drawback at this level. Extra value for a learner in Nürnberg: the topics are German daily life (Mieten, Bahn, Behörden).",
    evidence: "Apple Podcasts US page (id1482297423) scraped with curl: \"totalNumberOfRatings\":861, \"ratingAverage\":4.8 — by far the largest rating base of any German-learner podcast checked apart from Coffee Break German. Named in the HearSay Magazine Reddit tally \"9 Best Intermediate German Podcasts Reddit Recommends\" (methodology stated on the page: \"We read 20 Reddit threads across r/languagelearning and r/German, counted which resources the community actually recommends\"), and listed at B1 as entry #5 in Atlas Runa \"13 Best German Podcasts for Intermediate Learners (2026)\" (https://atlasruna.com/blog/german-podcasts-intermediate/). Also the lead pick in Migaku \"Best German Podcasts for Learners in 2026\"."
  },
  {
    level: "B1",
    name: "Auf Deutsch gesagt!",
    homepage: "https://www.aufdeutschgesagt.de/",
    feedUrl: "https://feeds.acast.com/public/shows/63cfc6d668877900110ea42a",
    fit: "Robin Meinert interviews native speakers for ~1 hour, then explains the useful vocabulary that came up in the conversation at the end of the episode. Speech is authentic but Robin speaks slowly and steers his guests; the post-episode vocabulary section is what makes it usable at B1 rather than B2-only. No transcripts, so best used as the 'stretch' listen alongside a transcripted show. Biweekly, so the back catalogue matters more than new releases.",
    evidence: "Ranked #2 (of 9) in the HearSay Magazine Reddit-thread tally \"9 Best Intermediate German Podcasts Reddit Recommends\", built from 20 threads across r/languagelearning and r/German. Listed at B1–B2 as entry #6 in Atlas Runa's \"13 Best German Podcasts for Intermediate Learners (2026)\", noted there as \"authentic interviews with vocabulary explanations\". Apple Podcasts US page (id1455018378) scraped with curl: \"totalNumberOfRatings\":107, \"ratingAverage\":4.8."
  },
  {
    level: "B1",
    name: "Slow German mit Annik Rubens",
    homepage: "https://slowgerman.com/",
    feedUrl: "https://slowgerman.com/feed/podcast/",
    fit: "Annik Rubens, a professional Munich journalist, speaks noticeably slowed-down but natural German about German culture, history and daily life (Biergarten, Mülltrennung, Feiertage) in short episodes. The decisive B1 feature: a full free transcript for every episode on the website and in the ID3 tags, so it can be listened to twice — once blind, once reading. Running since 2007, so 300 episodes of A2–B1 input are available immediately. Bavarian/Munich topical focus suits a learner living in Nürnberg.",
    evidence: "Apple Podcasts US page (id1085828103) scraped with curl: \"totalNumberOfRatings\":423, \"ratingAverage\":4.7. Named as a core A1–B1 pick in Sprachcaffe's \"Top 10 Podcasts to Improve German by Levels\" (https://www.sprachcaffe.com/en/uc/magazine-article/top-ten-podcasts-to-improve-german-by-levels.htm) and in the Reddit-derived round-ups (HearSay Magazine's r/German-based list and Migaku's \"Best German Podcasts for Learners in 2026\"), consistently cited for its free transcripts."
  },
  {
    level: "B1",
    name: "14 Minuten – Deine tägliche Portion Deutsch",
    homepage: "https://14minuten.de/",
    feedUrl: "https://anchor.fm/s/f60c4864/podcast/rss",
    fit: "Fixed 14-minute episodes entirely in German on society, geography and everyday German life, aimed explicitly at 'Fortgeschrittene' (B1–B2). The short fixed length makes it the easiest show here to fit into a one-hour daily study routine as a single warm-up or cool-down block; topics are concrete and vocabulary is repeated across episodes. Transcripts are available via the show's Patreon/website rather than free in the feed.",
    evidence: "Ranked #1 (of 9) in the HearSay Magazine Reddit-thread tally \"9 Best Intermediate German Podcasts Reddit Recommends\" — i.e. the most frequently recommended show across the 20 r/languagelearning and r/German threads that list surveyed, described there as B1–B2 cultural deep-dives with transcripts. Apple Podcasts US page (id1622000957) scraped with curl: \"totalNumberOfRatings\":52, \"ratingAverage\":5.0. Feed carries 266 live episodes (Apple metadata lists 400 produced)."
  },
  {
    level: "B1",
    name: "Top-Thema mit Vokabeln (DW Deutsch lernen)",
    homepage: "https://learngerman.dw.com/de/top-thema/s-8031",
    feedUrl: "https://rss.dw.com/xml/DKpodcast_topthemamitvokabeln_de",
    fit: "DW's own B1-labelled news show: two short episodes a week (2–3 min audio) on one current topic, with a free manuscript, a marked vocabulary glossary and comprehension exercises on the DW site. This is the single most precisely B1-targeted show on the list and the best fit for daily drilling — one episode is a 10-minute study block, and the vocabulary glossary feeds straight into the daily_vocab_mistakes workflow. The feed is a rolling window of the ~30 newest episodes; the full archive lives on learngerman.dw.com.",
    evidence: "Listed at B1 as entry #2 in Atlas Runa \"13 Best German Podcasts for Intermediate Learners (2026)\" (https://atlasruna.com/blog/german-podcasts-intermediate/), noted for \"free transcripts with vocabulary glossaries; two episodes weekly\". Apple Podcasts US page (id282932005) scraped with curl: \"totalNumberOfRatings\":120, \"ratingAverage\":4.5. DW itself files it under Niveau B1 in the learngerman.dw.com level navigation."
  },
  {
    level: "B1",
    name: "Langsam gesprochene Nachrichten (DW Deutsch lernen)",
    homepage: "https://learngerman.dw.com/de/langsam-gesprochene-nachrichten/s-13610",
    feedUrl: "https://rss.dw.com/xml/DKpodcast_lgn_de",
    fit: "DW's daily news bulletin read slowly and clearly, with the full text published free on the DW page. DW labels it B2, so at B1 it is the deliberate stretch item — but because the vocabulary is the same recurring news register every day and the script is free, it is the standard B1→B2 bridge. ~10 min daily makes it a fixed morning slot; for a learner living in Germany it also supplies the actual news vocabulary heard on the street and on the Bahn.",
    evidence: "Apple Podcasts US page (id282930329) scraped with curl: \"totalNumberOfRatings\":399, \"ratingAverage\":4.6 — the highest rating count of the DW learner podcasts checked. Carried as a recommended learner audio resource on UBC's German Corner audio resources page (https://blogs.ubc.ca/germancorner/learning-tools/for-the-learner/audio/) and indexed on Podnews (https://podnews.net/podcast/i6w6), which is where the feed URL was confirmed. Also named in Sprachcaffe's \"Top 10 Podcasts to Improve German by Levels\" as the news option for intermediate learners."
  }
];

export const B1_MEDIA: readonly SectionMedia[] = [
  {
    section: "b1_s01",
    level: "B1",
    videos: [
      {
        videoId: "2ixsYArwxpM",
        title: "Konjunktiv II: Wäre oder würde? Einfach erklärt",
        channel: "Deutsch mit Marija",
        start: 0,
        end: 357,
        lengthSeconds: 357,
        label: { de: "Konjunktiv II: wäre oder würde?", en: "Konjunktiv II: \"wäre\" or \"würde\"?" },
        why: "Covers the section's first grammar point (würde / hätte / wäre / könnte) at exactly the decision point learners get wrong: wäre with nouns and adjectives vs. würde with full verbs, plus how \"gern(e)\" behaves in both patterns — i.e. the machinery behind \"Ich würde gern bei Ihnen arbeiten\" and \"wäre ich flexibler\". The video has no chapterRenderer entries and the shortDescription contains no timestamps; the whole 357 s is this one topic, so start=0, end=lengthSeconds=357.",
        evidence: "viewCount from the watch page: 375,515 views (well above the ~50k bar for a grammar explainer). The channel \"Deutsch mit Marija\" is named as one of the picks in FluentU's list \"28 Best German YouTube Channels for Learners in 2025\" (https://www.fluentu.com/blog/german/learn-german-youtube/), and is also on the brief's own list of long-running teaching channels. Verified via oembed: title \"Konjunktiv II: Wäre oder würde? Einfach erklärt\", author_name \"Deutsch mit Marija\".",
        viewCount: 375515,
        language: "de"
      },
      {
        videoId: "fvALt7eKK14",
        title: "B1 - Lesson 25 | Konjunktiv II | Irreale Wünsche und Träume | Learn German intermediate",
        channel: "Learn German",
        start: 0,
        end: 280,
        lengthSeconds: 280,
        label: { de: "Konjunktiv II: irreale Wünsche und Träume", en: "Konjunktiv II: unreal wishes and dreams" },
        why: "The explicitly B1-labelled lesson on using Konjunktiv II for wishes and dreams (\"Ich würde gern …\", \"Ich hätte gern …\", \"Wenn ich nur …\"), which is the communicative half of this section's first grammar point and the register the Bewerbung phrase \"Über eine Einladung zum Gespräch würde ich mich sehr freuen\" sits in. The shortDescription says it builds on earlier lessons that introduced the Konjunktiv II forms and that this one is about expressing wishes and dreams. No chapters and no timestamps in the description; the whole 280 s is this topic, so start=0, end=lengthSeconds=280.",
        evidence: "viewCount from the watch page: 118,976. The channel (oembed author_name \"Learn German\", handle @LearnGermanOriginal) is \"Learn German Original\" from the brief's list of well-known teaching channels, and is listed as \"Learn German\" among the 28 channels in FluentU's \"28 Best German YouTube Channels for Learners in 2025\" (https://www.fluentu.com/blog/german/learn-german-youtube/). Verified via oembed.",
        viewCount: 118976,
        language: "de+en (German examples, English explanation)"
      },
      {
        videoId: "VZ6TUkndNbk",
        title: "Deutsch lernen Niveau A2, B1 | das Vorstellungsgespräch | Was sind Ihre Stärken und Schwächen?",
        channel: "Hallo Deutschschule",
        start: 191,
        end: 619,
        lengthSeconds: 849,
        label: { de: "Das Vorstellungsgespräch: Stärken und Schwächen", en: "The job interview: strengths and weaknesses" },
        why: "Covers the section's Bewerbung half — the set phrases of a Vorstellungsgespräch and the application adjectives (Stärken und Schwächen: zuverlässig, teamfähig, flexibel …). The shortDescription states Herr Meyer applies, answers the questions and talks about his Stärken und Schwächen, and lists the grammar carried in the dialogue, including \"Verben mit Präpositionen\" and \"Konjunktiv\" — i.e. this section's third, fourth and fifth grammar points in one scene. Start/end taken from the video's chapter markers: the interview proper starts at the chapter \"Willkommen Herr Meier.\" (timeRangeStartMillis 191000 → 191 s) and ends where the next chapter, \"Ich möchte gerne das Büro sehen.\" (619000 → 619 s), turns into the office tour. The excluded opening (0–191 s) is only the arrival at reception.",
        evidence: "viewCount from the watch page: 1,285,370 — by far the highest of any candidate checked. \"Hallo Deutschschule\" is named in FluentU's \"28 Best German YouTube Channels for Learners in 2025\" (https://www.fluentu.com/blog/german/learn-german-youtube/) and is on the brief's own list of well-known teaching channels. Verified via oembed: author_name \"Hallo Deutschschule\".",
        viewCount: 1285370,
        language: "de with subtitles (en, es, fr, ar, ru, zh)"
      }
    ],
    podcasts: [
      {
        section: "b1_s01",
        level: "B1",
        show: "Slow German mit Annik Rubens",
        title: "Dialog: Das Bewerbungsgespräch – SG 298",
        pageUrl: "https://slowgerman.com/2025/05/27/bewerbungsgespraech-dialog/",
        audioUrl: "https://slowgerman.cdn.svmaudio.com/slowgerman/sg298.mp3",
        durationSeconds: 202,
        label: { de: "Dialog: Das Bewerbungsgespräch", en: "Dialogue: the job interview" },
        why: "The single best match in any feed. The <description> is the complete transcript of a job interview and contains, almost line for line, this section's material: \"Vielen Dank für die Einladung zum Vorstellungsgespräch\", \"Ein Glas Wasser wäre nett\" and \"Wann könnten Sie bei uns anfangen? … Ich könnte also zum Ersten des nächsten Monats beginnen\" (Konjunktiv II for politeness — wäre, könnte), \"Was würden Sie als Ihre Schwächen beschreiben?\" (würde), \"Sie haben sich bei uns als Sachbearbeiter beworben\" (sich bewerben um/bei) and \"Ich bin zuverlässig, arbeite gerne im Team und bin sehr organisiert\" (exactly the Adjektive für die Bewerbung). At 3:22 it fits a single study block, and Slow German publishes the transcript free on the episode page, so it can be heard once blind and once reading. Audio URL checked: 301 → HTTP 200, Content-Type: audio/mpeg.",
        evidence: "From the show's verified profile: Apple Podcasts US page (id1085828103) scraped with curl — 423 ratings, 4.7 average; named as a core A1–B1 pick in Sprachcaffe's \"Top 10 Podcasts to Improve German by Levels\" and in the Reddit-derived round-ups (HearSay Magazine's r/German-based list, Migaku's \"Best German Podcasts for Learners in 2026\"), consistently cited for its free transcripts."
      },
      {
        section: "b1_s01",
        level: "B1",
        show: "Auf Deutsch gesagt!",
        title: "Episode 57: Das Vorstellungsgespräch",
        pageUrl: "https://sites.libsyn.com/168401/episode-57-das-vorstellungsgesprch",
        audioUrl: "https://sphinx.acast.com/p/open/s/63cfc6d668877900110ea42a/e/c98db399-8c65-4fa1-960d-bc476aaec202/media.mp3",
        durationSeconds: 4439,
        label: { de: "Das Vorstellungsgespräch – ein Gespräch mit Stefan", en: "The job interview – a conversation with Stefan" },
        why: "A full episode devoted to the section's theme: the <itunes:subtitle> says Robin talks with his brother-in-law Stefan about his experiences with Vorstellungsgespräche and that listeners will learn vocabulary such as \"der Bittsteller\" and \"auf Augenhöhe\". That is authentic interview-register German about applying for jobs, with the show's trademark vocabulary explanations at the end — the right stretch listen once the grammar of the section is in place. It is 1:13:59, so it is a back-catalogue listen to split over several days rather than a single 10-minute block. Audio URL checked: 302 → HTTP 200, Content-Type: audio/mpeg.",
        evidence: "From the show's verified profile: ranked #2 of 9 in the HearSay Magazine Reddit-thread tally \"9 Best Intermediate German Podcasts Reddit Recommends\" (built from 20 threads across r/languagelearning and r/German); listed at B1–B2 as entry #6 in Atlas Runa's \"13 Best German Podcasts for Intermediate Learners (2026)\"; Apple Podcasts US page (id1455018378) — 107 ratings, 4.8 average."
      },
      {
        section: "b1_s01",
        level: "B1",
        show: "Easy German: Learn German with native speakers",
        title: "565: Lebenslauf mit Times New Roman",
        pageUrl: "https://www.easygerman.fm/565",
        audioUrl: "https://easy-german.cdn.svmaudio.com/secure/af6cfb97-64a0-421a-aeab-b7531633e485/egp565.mp3?dest-id=3776181",
        durationSeconds: 1960,
        label: { de: "Tipps für die Job-Bewerbung", en: "Tips for the job application" },
        why: "The <description> says Cari and Manuel discuss their experience of hundreds of Job-Bewerbungen at Easy Languages: what makes a good application, which mistakes recur, and how to stand out — the applied counterpart to this section's \"Bewerbung: feste Wendungen\". Its own vocabulary list in the show notes includes die Job-Bewerbung, die Absage, etwas Korrektur lesen, die Rechtschreibung and — pointedly for this section — die Floskel (\"inhaltsarme oder formelhafte Redewendung\"), i.e. the set phrases themselves. The show notes also link two further job episodes (91 and 92, \"Jobsuche in Deutschland\" Teil 1 und 2) if more input on the theme is wanted. Drawback to state: transcript and Vokabelhilfe are behind the paid membership. Audio URL checked: 301 → HTTP 200, Content-Type: audio/mpeg.",
        evidence: "From the show's verified profile: Apple Podcasts US page (id1482297423) scraped with curl — 861 ratings, 4.8 average, the largest rating base of the German-learner podcasts checked apart from Coffee Break German; named in the HearSay Magazine Reddit tally \"9 Best Intermediate German Podcasts Reddit Recommends\" and listed at B1 as entry #5 in Atlas Runa \"13 Best German Podcasts for Intermediate Learners (2026)\"."
      }
    ]
  },
  {
    section: "b1_s02",
    level: "B1",
    videos: [
      {
        videoId: "Bl1Eg39hnf0",
        title: "Endlich Relativsätze verstehen 💪 | Deutsch lernen",
        channel: "Benjamin - Der Deutschlehrer",
        start: 0,
        end: 885,
        lengthSeconds: 885,
        label: { de: "Relativsätze: Nominativ, Akkusativ, Dativ", en: "Relative clauses: nominative, accusative, dative" },
        why: "The whole video is exactly this section's core grammar point. The video has no chapter markers, and the YouTube description states: \"Relativsätze Deutsch Relativpronomen Nominativ Akkusativ Dativ … Wann genau brauchen wir ein Relativpronomen im Nominativ, Akkusativ oder im Dativ.\" Since the entire 885 s is about which case the relative pronoun takes, start = 0 and end = lengthSeconds (885).",
        evidence: "viewCount scraped from the watch page with curl: \"viewCount\":\"320407\" — 320,407 views, far above the 50,000 bar for a grammar explainer. Surfaced as a top result for the German-language query \"Relativsätze B1 erklärt Deutsch lernen Relativpronomen\".",
        viewCount: 320407,
        language: "de"
      },
      {
        videoId: "3NCR_G-Z5v8",
        title: "Deutsch lernen A2, B1 | Relativsätze und Relativpronomen | Personen und Gegenstände beschreiben",
        channel: "Hallo Deutschschule",
        start: 0,
        end: 823,
        lengthSeconds: 823,
        label: { de: "Relativsätze mit Präposition und in allen Fällen – mit Übungen", en: "Relative clauses with prepositions and in every case – with exercises" },
        why: "This is the section's \"describe things precisely\" video and the only verified candidate that explicitly covers relative clauses WITH prepositions. The description says: \"Wir zeigen dir Beispiele von Relativsätzen im Nominativ, Akkusativ, Dativ und Genitiv. Auch Relativsätze mit Präpositionen lernst du kennen\", with the example \"Das ist ein Video, mit dem ich viel lernen kann.\" The video has 15 chapter markers, but they are all example sentences rather than topic sections (e.g. \"Das sind die Geschenke, die ich gekauft habe.\" at 122 s, \"Quiz: Welches Pronomen fehlt?\" at 483 s), so no single chapter isolates the topic — the whole video is the topic. start = 0, end = lengthSeconds (823). Bonus: the second half from ~483 s is quiz/exercise practice, useful as a self-test.",
        evidence: "Hallo Deutschschule is on the list of well-known, long-running German-teaching channels; the channel sorts its videos into CEFR playlists (A1/A2/B1/B2-C1) aligned to Goethe/telc/DSD. viewCount scraped from the watch page with curl: \"viewCount\":\"87072\" — 87,072 views, above the 50,000 bar.",
        viewCount: 87072,
        language: "de"
      },
      {
        videoId: "wzmul2DzOEU",
        title: "Your guide to German EMBEDDED Relative Clauses | B1 Level",
        channel: "YourGermanTeacher",
        start: 147,
        end: 1036,
        lengthSeconds: 1172,
        label: { de: "Eingeschobener Relativsatz: Verb ans Ende", en: "Embedded relative clause: verb goes to the end" },
        why: "Covers the section's third grammar point — where the relative clause sits and where its verb goes (\"Das ist die Frau, die im dritten Stock wohnt.\") — specifically the harder B1 case where the relative clause is embedded in the middle of the main clause and the main verb has to survive around it. Start/end come from the video's own chapterRenderer markers scraped from the watch page: chapters are \"1 easy example\" (0 s), \"a short review about German relative clauses\" (147 s), \"embedded relative clauses\" (411 s), \"more examples in different cases\" (526 s), \"Bonustipp\" (1036 s). I start at 147 s (the review of the rules) and end at 1036 s (the start of the Bonustipp chapter), which gives the review plus the embedded-clause explanation plus the worked examples in all cases.",
        evidence: "YourGermanTeacher is on the list of well-known, long-running German-teaching channels. viewCount scraped from the watch page with curl: \"viewCount\":\"32187\". Also surfaced as a top result for the English query \"best YouTube video German relative clauses Relativsätze explained B1\".",
        viewCount: 32187,
        language: "en"
      },
      {
        videoId: "u0_pPmRUv1M",
        title: "Schreibe den perfekten Beschwerdebrief! Prüfung Deutsch B1 B2",
        channel: "Lingster Academy",
        start: 39,
        end: 741,
        lengthSeconds: 741,
        label: { de: "Beschwerde: Redemittel und Briefaufbau", en: "Complaint: set phrases and letter structure" },
        why: "Covers the section's fourth point, the Beschwerde-Redemittel (\"Ich möchte mich darüber beschweren, dass …\"). The teacher works through a complaint task step by step and writes out the phrases. Start/end from the video's chapterRenderer markers scraped from the watch page: \"Begrüßung\" (0 s), \"Aufgabenstellung\" (39 s), \"Vorbereitung\" (207 s), \"Unterschrift\" (327 s), \"Zusammenfassung\" (582 s). I start at 39 s — the start of the \"Aufgabenstellung\" chapter — to skip only the channel greeting, and run to the end (741 s), because everything from the task onward is the complaint letter itself. Caveat stated honestly: the worked example is a complaint about a streaming service, not about a neighbour, so the topic vocabulary is different even though the Redemittel are the same ones the section teaches.",
        evidence: "viewCount scraped from the watch page with curl: \"viewCount\":\"177102\" — 177,102 views, well above the 50,000 bar. Surfaced as a top result for the German query \"sich beschweren Redemittel Beschwerde Deutsch B1\".",
        viewCount: 177102,
        language: "de"
      }
    ],
    podcasts: [
      {
        section: "b1_s02",
        level: "B1",
        show: "Easy German: Learn German with native speakers",
        title: "670: Wie Deutsche mit ihren Nachbarn kommunizieren",
        pageUrl: "https://www.easygerman.fm/670",
        audioUrl: "https://easy-german.cdn.svmaudio.com/secure/af6cfb97-64a0-421a-aeab-b7531633e485/egp670.mp3?dest-id=3776181",
        durationSeconds: 2196,
        label: { de: "Nachbarn, Beschwerdezettel und laute Musik", en: "Neighbours, complaint notes and loud music" },
        why: "The single best-matching episode found across all six feeds — it is this section's premise almost literally. From the feed description: Joab Nist of \"Notes of Berlin\" collects the written Beschwerdezettel left in Berlin stairwells, and the hosts go through the funniest and rudest ones — \"Es geht um Partygarnelen, vergessene Pakete, laute Musik, Knoblauchgeruch, Trompetenübungen\". The feed's own \"Thema der Woche\" is given as \"Nachbarschaftskommunikation in Deutschland\". Both halves of the section land here: the loud-neighbour topic and the Beschwerde register. Feed <itunes:duration> 36:36. The description also links a subtitled YouTube version (watch?v=54Oc03D4sI0), which helps at B1.",
        evidence: "Show-level: Apple Podcasts US page (id1482297423) shows 861 ratings at 4.8 average; named in the HearSay Magazine Reddit tally \"9 Best Intermediate German Podcasts Reddit Recommends\" and listed at B1 as entry #5 in Atlas Runa \"13 Best German Podcasts for Intermediate Learners (2026)\". Episode-level: title, link, enclosure and duration taken verbatim from the feed at https://proxyfeed.svmaudio.com/feeds/easygerman/feed.xml; audio URL verified with curl -s -m 20 -I -L -A \"Mozilla/5.0\" → 301 then HTTP/1.1 200 OK, Content-Type: audio/mpeg."
      },
      {
        section: "b1_s02",
        level: "B1",
        show: "Slow German mit Annik Rubens",
        title: "Wohnen in Deutschland – SG 303",
        pageUrl: "https://slowgerman.com/2025/08/05/wohnen-in-deutschland-wohnung-haus/",
        audioUrl: "https://slowgerman.cdn.svmaudio.com/slowgerman/sg303.mp3",
        durationSeconds: 555,
        label: { de: "Wohnen in Deutschland: Miete, Wohnungsnot, Mieter oder Eigentümer", en: "Housing in Germany: rent, housing shortage, renting vs owning" },
        why: "Directly on the section's Wohnen theme and the right length for one study block (9:15). The feed description opens: \"In Deutschland ist das Thema Wohnen sehr wichtig … Viele Menschen sprechen darüber, wie viel Miete sie zahlen oder wie schwer es ist, eine Wohnung zu finden\", and goes on to Immobilienkrise and Wohnungsnot. It supplies exactly the noun vocabulary (Miete, Wohnung, Vermieter, Wohnungsnot) that the section's relative clauses need something to attach to — \"die Wohnung, die ich suche\". Slow German publishes a free full transcript for every episode on the page above, so it can be listened to once blind and once reading.",
        evidence: "Show-level: Apple Podcasts US page (id1085828103) shows 423 ratings at 4.7 average; named as a core A1–B1 pick in Sprachcaffe's \"Top 10 Podcasts to Improve German by Levels\" and in the Reddit-derived round-ups (HearSay Magazine, Migaku), consistently cited for its free transcripts. Episode-level: title, link, enclosure and <itunes:duration>9:15</itunes:duration> taken verbatim from https://slowgerman.com/feed/podcast/; audio URL verified with curl -s -m 20 -I -L → 301 then HTTP/1.1 200 OK, Content-Type: audio/mpeg."
      },
      {
        section: "b1_s02",
        level: "B1",
        show: "14 Minuten – Deine tägliche Portion Deutsch",
        title: "Folge 254 - Wohnen in Deutschland ",
        pageUrl: "https://podcasters.spotify.com/pod/show/14minuten/episodes/Folge-254---Wohnen-in-Deutschland-e3jklem",
        audioUrl: "https://anchor.fm/s/f60c4864/podcast/play/120263574/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2026-4-20%2F424519407-44100-2-245cb40744159.mp3",
        durationSeconds: 836,
        label: { de: "Wie die Deutschen wohnen – und was für sie eine schöne Wohnung ist", en: "How Germans live – and what counts as a nice flat for them" },
        why: "Feed description: \"Niveau: mittel. Wie wohnen die Deutschen und wie sieht für die meisten Deutschen eine schöne Wohnung aus? In diesem Video erzählt euch Jan einiges über das Wohnen und Wohnungen in Deutschland.\" A monologue in German at the show's fixed ~14-minute length, so it fits one block of the hour and is a good cultural counterpart to the Easy German conversation. The show's own level tag \"mittel\" matches B1. Transcript is on 14minuten.de rather than free in the feed.",
        evidence: "Show-level: ranked #1 (of 9) in the HearSay Magazine Reddit-thread tally \"9 Best Intermediate German Podcasts Reddit Recommends\" — the most frequently recommended show across the 20 r/languagelearning and r/German threads surveyed; Apple Podcasts US page (id1622000957) shows 52 ratings at 5.0 average. Episode-level: title (CDATA), link, enclosure and <itunes:duration>00:13:56</itunes:duration> taken verbatim from https://anchor.fm/s/f60c4864/podcast/rss; audio URL verified with curl -s -m 20 -I -L → 302 then HTTP/1.1 200 OK, Content-Type: audio/mpeg."
      }
    ]
  },
  {
    section: "b1_s03",
    level: "B1",
    videos: [
      {
        videoId: "BaGciJkrE7o",
        title: "B1 Grammatik - einfach erklärt | das Passiv",
        channel: "Benjamin - Der Deutschlehrer",
        start: 0,
        end: 1052,
        lengthSeconds: 1052,
        label: { de: "Das Passiv auf B1: werden + Partizip II", en: "The passive at B1: werden + past participle" },
        why: "The whole video is a single B1-level lesson on das Passiv — formation with werden + Partizip II, the Aktiv→Passiv transformation, and practice exercises — so start=0 and end=lengthSeconds (1052). The page carries no chapterRenderer entries and the shortDescription has no timestamps, so the whole video is the honest clip. It is the anchor video for the section's first grammar point (Passiv Präsens) and also walks through the past-tense forms.",
        evidence: "viewCount scraped from the watch page: 234,061 views — well above the 50,000 threshold for a grammar explainer. The video is explicitly titled and described as B1 Grammatik / Passiv B1, matching the section level exactly.",
        viewCount: 234061,
        language: "de"
      },
      {
        videoId: "qKsGE6GX8mc",
        title: "Passiv einfach erklärt | Deutsche Grammatik verstehen",
        channel: "Deutsch mit Marija",
        start: 0,
        end: 363,
        lengthSeconds: 363,
        label: { de: "Passiv in allen Zeiten: wird – wurde – ist … worden", en: "Passive in all tenses: wird – wurde – ist … worden" },
        why: "Six-minute video entirely about the passive; the description lists exactly what it covers — when passive is used instead of active, and how it is formed in Präsens, Präteritum and Perfekt, with the examples \"Die Tür wird geöffnet\", \"Das Brot wurde gebacken\", \"Das Gebäude ist renoviert worden\". No chapterRenderer entries and no timestamps in the description, so start=0, end=lengthSeconds (363). This is the section's Passiv Präteritum point (wurde + Partizip II) in a compact form.",
        evidence: "Deutsch mit Marija is one of the named long-running German teaching channels on the reference list, and is listed among the recommended German-learning YouTube channels in FluentU's \"28 Best German YouTube Channels for Learners\" round-up. viewCount scraped from the watch page: 341,734.",
        viewCount: 341734,
        language: "de"
      },
      {
        videoId: "EAaKSMXIeBI",
        title: "Passiv mit Modalverben  | Deutsch lernen b2, c1",
        channel: "DeutschLera",
        start: 129,
        end: 342,
        lengthSeconds: 719,
        label: { de: "Passiv mit Modalverb: Die Tabletten müssen genommen werden", en: "Passive with a modal verb: the tablets must be taken" },
        why: "The shortDescription contains its own timestamp list: 0:35 Wiederholung: Wofür brauchst du das Passiv? · 2:09 Passiv mit Modalverben im Präsens · 5:42 Passiv mit Modalverben (Nebensätze) · 6:27 Passiv mit Modalverben (Präteritum, Perfekt, Plusquamperfekt, Futur 1). start=129 (2:09) and end=342 (5:42) is exactly the \"Passiv mit Modalverben im Präsens\" block — the B1 form \"muss … genommen werden\". The later blocks are B2/C1 tenses and are deliberately cut off.",
        evidence: "viewCount scraped from the watch page: 229,042 — far above the 50,000 threshold for a grammar explainer. DeutschLera's lessons are also carried as study material on LingQ (course 866665, \"DeutschLera Videos (YT), Passiv mit Modalverben\"), i.e. republished by a learning platform.",
        viewCount: 229042,
        language: "de"
      },
      {
        videoId: "YzlCdseVNKI",
        title: "Passiv: Von vs. durch? | Deutsch lernen (B1, B2)",
        channel: "DeutschLera",
        start: 0,
        end: 402,
        lengthSeconds: 402,
        label: { de: "von oder durch? Vom Arzt oder durch Sport", en: "von or durch? By the doctor or through sport" },
        why: "The entire 402-second video is about one thing only — the difference between VON and DURCH in passive sentences (\"In diesem Video geht es um den Unterschied im Gebrauch zwischen VON und DURCH in den Passivsätzen\"). No chapters and no description timestamps, so start=0, end=lengthSeconds (402). This is the section's fourth grammar point, which none of the other three videos isolates.",
        evidence: "viewCount scraped from the watch page: 72,405 — above the 50,000 threshold for a grammar explainer. It is also the only video found that treats von/durch as a standalone topic rather than a footnote.",
        viewCount: 72405,
        language: "de"
      }
    ],
    podcasts: [
      {
        section: "b1_s03",
        level: "B1",
        show: "Easy German: Learn German with native speakers",
        title: "662: Gesundheitsfreaks",
        pageUrl: "https://www.easygerman.fm/662",
        audioUrl: "https://easy-german.cdn.svmaudio.com/secure/af6cfb97-64a0-421a-aeab-b7531633e485/egp662.mp3?dest-id=3776181",
        durationSeconds: 1911,
        label: { de: "Gesundheitsfreaks: Darm, Sport und Schlaf", en: "Health freaks: gut, sport and sleep" },
        why: "Feed description: \"Wir sprechen weiter über das Thema Gesundheit: Manuel erzählt, was er aus dem Bestseller Darm mit Charme mitgenommen hat — und warum er jetzt Kombucha braut. Außerdem geht es um Fahrradhelme, Aufwärmen beim Sport, Schlaftracking und Tagebuchschreiben.\" That is Gesundheit, Ernährung and Fitness in one episode — gut health and fermented food, warming up before sport, sleep tracking — matching all three halves of the section title.",
        evidence: "Show-level: Apple Podcasts US (id1482297423) 861 ratings at 4.8; named in HearSay Magazine's Reddit tally \"9 Best Intermediate German Podcasts Reddit Recommends\" and at B1 as entry #5 in Atlas Runa's \"13 Best German Podcasts for Intermediate Learners (2026)\". Episode-level: <enclosure url> verified with curl -I -L → HTTP/1.1 200 OK, Content-Type: audio/mpeg (after a 301). <itunes:duration> 31:51."
      },
      {
        section: "b1_s03",
        level: "B1",
        show: "Slow German mit Annik Rubens",
        title: "Die Krankenkasse – SG 291",
        pageUrl: "https://slowgerman.com/2025/02/18/krankenversicherung/",
        audioUrl: "https://slowgerman.cdn.svmaudio.com/slowgerman/sg291.mp3",
        durationSeconds: 471,
        label: { de: "Die Krankenkasse – gesetzlich oder privat?", en: "Health insurance – public or private?" },
        why: "Feed description: \"In Deutschland gibt es zwei Arten von Krankenversicherungen: die gesetzliche und die private. Damit ist Deutschland das einzige Land in Europa mit einem zweigeteilten Gesundheitssystem…\" This is the Gesundheit half of the section and it is exactly the register the grammar point lives in — Rezepte, Untersuchungen and Leistungen are what get described in the passive (\"Das Rezept wird ausgestellt\", \"Die Kosten werden von der Kasse übernommen\"). At 7:51 with a free full transcript on the linked page it is a single study block that can be listened to once blind and once reading.",
        evidence: "Show-level: Apple Podcasts US (id1085828103) 423 ratings at 4.7; named as a core A1–B1 pick in Sprachcaffe's \"Top 10 Podcasts to Improve German by Levels\" and in the Reddit-derived HearSay Magazine and Migaku round-ups, consistently for its free transcripts. Episode-level: <enclosure url> verified with curl -I -L → HTTP/1.1 200 OK, Content-Type: audio/mpeg (after a 301). <itunes:duration> 7:51."
      },
      {
        section: "b1_s03",
        level: "B1",
        show: "14 Minuten – Deine tägliche Portion Deutsch",
        title: "Folge 198 - Vegetarismus in Deutschland",
        pageUrl: "https://podcasters.spotify.com/pod/show/14minuten/episodes/Folge-198---Vegetarismus-in-Deutschland-e2spdjf",
        audioUrl: "https://anchor.fm/s/f60c4864/podcast/play/96302127/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2024-11-27%2F392148099-44100-2-2a441c844aaad.mp3",
        durationSeconds: 872,
        label: { de: "Vegetarismus in Deutschland", en: "Vegetarianism in Germany" },
        why: "Feed description: \"In Deutschland gibt es besonders viele Veganer und Vegetarier… Warum entscheiden sich Menschen dafür, kein Fleisch zu essen?\" This is the Ernährung half of the section — diet, meat consumption and food choices — and it is the sub-theme the other two episodes do not cover. Fixed 14-minute length fits one study block, and a transcript is offered on 14minuten.de.",
        evidence: "Show-level: ranked #1 of 9 in HearSay Magazine's Reddit-thread tally \"9 Best Intermediate German Podcasts Reddit Recommends\" (20 threads across r/languagelearning and r/German); Apple Podcasts US (id1622000957) 52 ratings at 5.0. Episode-level: <enclosure url> verified with curl -I -L → HTTP/1.1 200 OK, Content-Type: audio/mpeg (after a 302). <itunes:duration> 00:14:32."
      }
    ]
  },
  {
    section: "b1_s04",
    level: "B1",
    videos: [
      {
        videoId: "QQCBksqogHg",
        title: "Infinitiv mit zu | A2/B1/B2 | Learn German | Deutsch lernen",
        channel: "Benjamin - Der Deutschlehrer",
        start: 0,
        end: 602,
        lengthSeconds: 602,
        label: { de: "Infinitiv mit zu: Verben, Adjektive und Nomen", en: "Infinitive with zu: verbs, adjectives and nouns" },
        why: "The whole video is about exactly this section's first grammar point, so start=0 and end=lengthSeconds (602). The page's chapterRenderer data confirms the structure end to end: Einleitung (0:00), 1. bestimmte Verben (1:48) with versprechen (2:25) and vergessen (3:11), bestimmte Adjektive (4:33) with wichtig sein (5:00) and interessant sein (6:09), bestimmte Substantive (6:49) with Angst haben (7:11) and keine Lust haben (8:04). That maps directly onto the section examples \"Ich habe vor, einen Kurs zu machen\" and \"Es ist wichtig, regelmäßig zu üben\" — verb-triggered and adjective-triggered zu-infinitives.",
        evidence: "viewCount scraped from the watch page: 221,862 views — well above the ~50,000 bar for a grammar explainer. Verified via oembed (title \"Infinitiv mit zu | A2/B1/B2 | Learn German | Deutsch lernen\", author_name \"Benjamin - Der Deutschlehrer\").",
        viewCount: 221862,
        language: "de"
      },
      {
        videoId: "QeNzj72acE4",
        title: "B1 - Lesson 14 | damit, um...zu | Finalsätze | Learn German Intermediate",
        channel: "Learn German",
        start: 0,
        end: 656,
        lengthSeconds: 656,
        label: { de: "Finalsätze: um … zu oder damit?", en: "Purpose clauses: um … zu vs. damit" },
        why: "Covers the section's second grammar point (um … zu / damit) and nothing else — it is lesson 14 of this channel's structured B1 course, titled \"Finalsätze (damit, um...zu)\" in its own description. The watch page returned no chapterRenderer entries, so per the rules start=0 and end=lengthSeconds (656): the whole video is the clip. It teaches exactly the same-subject/different-subject rule behind the section examples \"Ich lerne, um die Prüfung zu bestehen\" vs. \"Ich lerne, damit meine Kinder stolz sind\".",
        evidence: "Channel is Learn German Original (@LearnGermanOriginal), one of the named long-running teaching channels. viewCount scraped from the watch page: 240,728. Verified via oembed (author_name \"Learn German\", author_url https://www.youtube.com/@LearnGermanOriginal).",
        viewCount: 240728,
        language: "en+de (English explanation, German examples)"
      },
      {
        videoId: "dCccMZKLT3M",
        title: "German Lesson (94) - Verbs + Infinitives without \"zu\" - lassen - stehen - bleiben - gehen - B1/B2",
        channel: "lingoni GERMAN",
        start: 0,
        end: 451,
        lengthSeconds: 451,
        label: { de: "Verben ohne zu: lassen, sehen, hören, gehen, bleiben", en: "Verbs without zu: lassen, sehen, hören, gehen, bleiben" },
        why: "Whole video, start=0 to end=lengthSeconds (451), because every chapter belongs to this section's third grammar point. Chapters from the watch page: Intro (0:00), Review: Verbs/Expressions + zu + Infinitive (0:19), Verbs of Perception sehen/hören/fühlen (1:30), Verbs of Movement gehen/fahren/kommen (2:58), finden + haben + Infinitive (4:16), lassen + Infinitive (5:19), bleiben + Infinitive (6:09). The opening review chapter also contrasts it with Infinitiv mit zu, which is exactly the confusion this section has to resolve (\"Ich gehe schwimmen\" — no zu).",
        evidence: "Channel is lingoni GERMAN, one of the named long-running teaching channels (Jenny's A1–B2 course, ~450 lessons). viewCount scraped from the watch page: 155,518. Verified via oembed (author_name \"lingoni GERMAN\").",
        viewCount: 155518,
        language: "en+de (English explanation, German examples)"
      },
      {
        videoId: "Bcxq7VDswKI",
        title: "B1 - Lesson 17 | nicht/kein/nur brauchen + zu | Learn German Intermediate",
        channel: "Learn German",
        start: 0,
        end: 609,
        lengthSeconds: 609,
        label: { de: "brauchen + zu: nicht / kein / nur", en: "brauchen + zu: nicht / kein / nur" },
        why: "The whole video is this section's fourth grammar point. No chapterRenderer entries on the page, so start=0 and end=lengthSeconds (609). Its own description lists the content as \"How to frame sentences with 'nicht/kein/nur' and brauchen + zu / When to use these sentences / Difference between them\" plus exceptions — i.e. both section examples, \"Du brauchst nicht zu kommen\" and \"Du brauchst nur anzurufen\", and the fact that brauchen + zu only works with a negation or nur.",
        evidence: "Channel is Learn German Original (@LearnGermanOriginal), a named long-running teaching channel, and this is lesson 17 of its structured B1 course. viewCount scraped from the watch page: 149,451. Verified via oembed.",
        viewCount: 149451,
        language: "en+de (English explanation, German examples)"
      }
    ],
    podcasts: [
      {
        section: "b1_s04",
        level: "B1",
        show: "Slow German mit Annik Rubens",
        title: "SG #194: Das deutsche Schulsystem (aktualisiert)",
        pageUrl: "https://slowgerman.com/2019/11/12/sg-194-das-deutsche-schulsystem-aktualisiert/",
        audioUrl: "https://slowgerman.cdn.svmaudio.com/slowgerman/sg194.mp3",
        durationSeconds: 620,
        label: { de: "Das deutsche Schulsystem", en: "The German school system" },
        why: "Feed title and description are squarely the section theme (Bildung/Schule): \"In Deutschland gibt es eine Schulpflicht. Jedes Kind muss also eine Schule besuchen\", then Einschulung, Grundschule and the different Schulformen. At 10:20 it is a single study block, slowly spoken, and the full text is free on the linked page, so it can be listened to once blind and once while reading — which also lets Justins hunt the zu-infinitives in the transcript. Grammar bonus: school topics naturally produce \"Jedes Kind muss eine Schule besuchen\" (Modalverb, no zu) next to \"Es ist wichtig, ... zu ...\" patterns.",
        evidence: "Taken from the feed https://slowgerman.com/feed/podcast/ (saved locally and grepped); itunes:duration 10:20, pubDate Tue, 12 Nov 2019. Audio URL checked with curl -s -m 20 -I -L: 301 then HTTP/1.1 200 OK, Content-Type: audio/mpeg."
      },
      {
        section: "b1_s04",
        level: "B1",
        show: "Top-Thema mit Vokabeln (DW Deutsch lernen)",
        title: "Eine Schule, die Chancen bietet",
        pageUrl: "https://learngerman.dw.com/de/eine-schule-die-chancen-bietet/l-79172058?maca=de-DKpodcast_topthemamitvokabeln_de-2296-xml-mrss",
        audioUrl: "https://radiodownloaddw-a.akamaihd.net/Events/podcasts/de/2296_DKpodcast_topthemamitvokabeln_de/91090795_2-podcast-2296-79172058.mp3",
        durationSeconds: 177,
        label: { de: "Eine Schule, die Chancen bietet", en: "A school that offers opportunities" },
        why: "The feed description is entirely about school and education: \"Wie gut ein Kind in der Schule ist und welchen Abschluss es macht, hängt in Deutschland immer noch stark von der sozialen Herkunft ab. Eine Grundschule in Bonn zeigt, dass man daran etwas ändern kann.\" DW files Top-Thema at Niveau B1, it is only 2:57, and the DW page carries a free manuscript plus a marked vocabulary glossary — the glossary feeds straight into daily_vocab_mistakes.md. The \"damit sich etwas ändert / um Chancen zu verbessern\" framing is the section's purpose grammar in a real text.",
        evidence: "Taken from the feed https://rss.dw.com/xml/DKpodcast_topthemamitvokabeln_de (saved locally and grepped); itunes:duration 02:57, pubDate Tue, 8 Sep 2026. Audio URL checked with curl -s -m 20 -I -L: HTTP/1.1 200 OK, Content-Type: audio/mpeg."
      },
      {
        section: "b1_s04",
        level: "B1",
        show: "Easy German: Learn German with native speakers",
        title: "47: Schule in Deutschland",
        pageUrl: "https://www.easygerman.org/podcast/episodes/47",
        audioUrl: "https://easy-german.cdn.svmaudio.com/secure/af6cfb97-64a0-421a-aeab-b7531633e485/egp47.mp3?dest-id=3776181",
        durationSeconds: 1622,
        label: { de: "Schule in Deutschland – Gespräch mit einem Lehrer", en: "School in Germany – conversation with a teacher" },
        why: "Feed description: Cari and Manuel talk to their guest Klaus, \"Lehrer für Geschichte und Sozialwissenschaften\", about \"das Schulsystem in Deutschland\", the Schulalltag and \"die unterschiedlichen Schulformen\" — the section theme in unscripted native speech rather than a scripted text. It is the right level of stretch after the two shorter scripted episodes above, and gives the everyday vocabulary (Schulformen, Unterricht, Abschluss) the section needs. Drawback stated honestly: the transcript and Vokabelhilfe are members-only.",
        evidence: "Taken from the feed https://proxyfeed.svmaudio.com/feeds/easygerman/feed.xml (saved locally and grepped); itunes:duration 27:02, pubDate Wed, 17 Jun 2020. Audio URL checked with curl -s -m 20 -I -L: 301 then HTTP/1.1 200 OK, Content-Type: audio/mpeg."
      }
    ]
  },
  {
    section: "b1_s05",
    level: "B1",
    videos: [
      {
        videoId: "uK2H0i6tObI",
        title: "ALLE Konnektoren A1-B1 | Deutsch lernen",
        channel: "Benjamin - Der Deutschlehrer",
        start: 0,
        end: 862,
        lengthSeconds: 862,
        label: { de: "Alle Konnektoren A1–B1: Wo steht das Verb?", en: "All connectors A1–B1: where does the verb go?" },
        why: "The whole video is about exactly this section's first grammar point: which connector puts the verb in position 1, position 2 or at the end. The description states it explicitly: \"Am wichtigsten ist es, dass ihr die Position des Verbs lernt. Das Verb kann bei den verschiedenen Konnektoren nämlich in Position 1, Position 2 oder am Ende stehen\", and it ends with a gap-fill test. The watch page (fetched, 1.25 MB) contains no chapterRenderer entries and the description has no timestamps, so start=0 and end=lengthSeconds=862 — the whole video is on topic, which covers the deshalb / deswegen / trotzdem / dann / sonst group plus the contrast with weil/obwohl.",
        evidence: "viewCount 1,257,906 read from the fetched watch page (grep '\"viewCount\":\"[0-9]*\"'); it is the single most-viewed German connector explainer that came up in the YouTube search for \"trotzdem deshalb deswegen außerdem Konnektoren deutsch B1\" (next best: Dein Sprachcoach 711k, Learn German Today 218k). Long-running DaF channel (@BenjaminDerDeutschlehrer), confirmed by oembed.",
        viewCount: 1257906,
        language: "de"
      },
      {
        videoId: "dT2ANPzxhHg",
        title: "Deutsch lernen B1 | Die eigene Meinung äußern | Wortschatz und Redemittel",
        channel: "Hallo Deutschschule",
        start: 0,
        end: 631,
        lengthSeconds: 631,
        label: { de: "Meiner Meinung nach … – Redemittel zum Meinung äußern", en: "\"In my opinion …\" – phrases for giving an opinion" },
        why: "Covers the section's \"Meinung äußern\" point at exactly B1 (the title says B1). The description contains the full transcript, and it is wall-to-wall Redemittel: \"Meiner Meinung nach …\", \"Ich bin davon überzeugt, dass …\", \"Ich vertrete die Meinung, dass …\", \"Ich persönlich finde, dass …\", plus the disagreeing side (\"Ich bin ganz anderer Meinung\"). No chapterRenderer entries on the fetched watch page and no timestamps in the description, and the entire 631 s is this one topic, so start=0, end=lengthSeconds=631.",
        evidence: "viewCount 453,565 read from the fetched watch page. Hallo Deutschschule is one of the long-running teaching channels named in the brief's list of well-known channels; channel confirmed via oembed (author_name \"Hallo Deutschschule\", @hallodeutschschule).",
        viewCount: 453565,
        language: "de"
      },
      {
        videoId: "cDAAbnThw0o",
        title: "ZUSTIMMEN UND ABLEHNEN (mündliche Prüfung Teil 3) A2/B1/B2/C1",
        channel: "Dein Sprachcoach",
        start: 0,
        end: 774,
        lengthSeconds: 774,
        label: { de: "Zustimmen & widersprechen in der Diskussion", en: "Agreeing and disagreeing in a discussion" },
        why: "Matches the section's \"Zustimmen & widersprechen\" point (\"Da stimme ich dir zu. · Das sehe ich anders.\"). The description frames it as the phrases you need for the Diskussion part of the oral exam at A2/B1/B2/C1: \"In fast jeder Deutschprüfung … muss man eine Diskussion führen und diese Redemittel helfen dir dabei.\" The fetched watch page has no chapters and the description has no timestamps; the whole 774 s is agreeing/disagreeing phrases with spontaneous examples, so start=0, end=lengthSeconds=774.",
        evidence: "viewCount 170,103 read from the fetched watch page — well above the 50,000 bar for a grammar/Redemittel explainer. Dein Sprachcoach (Maria) is a long-running DaF exam-prep channel with its own A2/B1/B2 courses; channel confirmed via oembed (@DeinSprachcoach).",
        viewCount: 170103,
        language: "de"
      },
      {
        videoId: "4xdlx1oZkI8",
        title: "[87] Konjunktiv 1 (indirekte Rede) -  Verwendung und Bildung einfach erklärt!",
        channel: "EasyDeutsch - Deutsche Grammatik verstehen",
        start: 40,
        end: 121,
        lengthSeconds: 514,
        label: { de: "Indirekte Rede: direkt vs. indirekt (erster Schritt)", en: "Reported speech: direct vs. indirect (first step)" },
        why: "For the section's \"Indirekte Rede: erster Schritt\" I deliberately cut the conceptual opening and leave out the B2-level formation tables. The timestamps come from the video description (no chapterRenderer on the fetched page, but the description lists chapters): 0:40 \"Was ist der Konjunktiv 1?\", 1:22 \"Was ist 'indirekte Rede'?\", 2:01 \"Der Konjunktiv 1 in festen Wendungen\", 2:36 \"Bildung des Konjunktiv 1\", 5:24 \"Zeitformen\", 6:07 \"Gute Nachrichten\". start=40 (first chapter) and end=156 (start of the \"Bildung\" chapter at 2:36), so the clip is exactly the difference between direct and indirect speech — the level this section needs — and stops before the conjugation drill.",
        evidence: "viewCount 55,996 read from the fetched watch page, above the ~50,000 bar for a grammar explainer. EasyDeutsch (easy-deutsch.de, 87+ numbered grammar lessons, its own grammar ebooks) is a long-running DaF grammar channel; identity confirmed via oembed (author_name \"EasyDeutsch - Deutsche Grammatik verstehen\", @EasyDeutsch). I could not find a Reddit thread naming it, so this rests on the view count plus the channel's track record.",
        viewCount: 55996,
        language: "de"
      }
    ],
    podcasts: [
      {
        section: "b1_s05",
        level: "B1",
        show: "Easy German: Learn German with native speakers",
        title: "133: Social Media und Meinungsfreiheit",
        pageUrl: "https://www.easygerman.org/podcast/episodes/133",
        audioUrl: "https://easy-german.cdn.svmaudio.com/secure/af6cfb97-64a0-421a-aeab-b7531633e485/egp133.mp3?dest-id=3776181",
        durationSeconds: 1664,
        label: { de: "Social Media und Meinungsfreiheit", en: "Social media and freedom of speech" },
        why: "Media plus opinion in one episode — the exact combination this section teaches. The feed description asks: \"Sollten private Unternehmen entscheiden dürfen, welche Äußerungen in sozialen Medien erlaubt sind und welche nicht? Wer ist zuständig für die Durchsetzung von Gesetzen? Muss der Staat sich einmischen?\" Cari and Manuel argue it out, so the listener hears Meinungs-Redemittel and agreeing/disagreeing used naturally. <itunes:duration> 27:44.",
        evidence: "Show-level: Apple Podcasts US page id1482297423 scraped with curl — \"totalNumberOfRatings\":861, \"ratingAverage\":4.8; named in the HearSay Magazine Reddit tally \"9 Best Intermediate German Podcasts Reddit Recommends\" and listed at B1 as entry #5 in Atlas Runa \"13 Best German Podcasts for Intermediate Learners (2026)\". Episode-level: title, link, enclosure and duration taken from the cached feed (proxyfeed.svmaudio.com/feeds/easygerman/feed.xml); audio URL checked with curl -I -L → HTTP 200, Content-Type: audio/mpeg; page URL checked → HTTP 200."
      },
      {
        section: "b1_s05",
        level: "B1",
        show: "Slow German mit Annik Rubens",
        title: "Social Media für Jugendliche verbieten? – SG 321",
        pageUrl: "https://slowgerman.com/2026/07/07/social-media-verbot-fuer-jugendliche/",
        audioUrl: "https://slowgerman.cdn.svmaudio.com/slowgerman/sg321.mp3",
        durationSeconds: 543,
        label: { de: "Social-Media-Verbot für Jugendliche?", en: "Should teenagers be banned from social media?" },
        why: "A short, slowly spoken pro-and-contra piece on a media topic — ideal for this section's \"Meinung äußern / zustimmen & widersprechen\". Feed description: \"Ein Social-Media-Verbot für Jugendliche? … Sollten Kinder und Jugendliche überhaupt Social Media nutzen dürfen? Diese Diskussion ist nicht neu … Besonders weil Australien als erstes Land der Welt gehandelt …\". 9:03 fits one study block, and Slow German publishes the full transcript free on the episode page, so the connectors (deshalb, trotzdem, außerdem) can be read as well as heard.",
        evidence: "Show-level: Apple Podcasts US page id1085828103 scraped with curl — \"totalNumberOfRatings\":423, \"ratingAverage\":4.7; named as a core A1–B1 pick in Sprachcaffe's \"Top 10 Podcasts to Improve German by Levels\" and in the Reddit-derived round-ups (HearSay Magazine, Migaku). Episode-level: title, link, enclosure and <itunes:duration>9:03 taken from the cached feed (slowgerman.com/feed/podcast/); audio URL checked with curl -I -L → HTTP 200, Content-Type: audio/mpeg; page URL checked → HTTP 200."
      },
      {
        section: "b1_s05",
        level: "B1",
        show: "Auf Deutsch gesagt!",
        title: "Episode 103: (A)soziale Medien mit Daniel",
        pageUrl: "https://shows.acast.com/63cfc6d668877900110ea42a/episodes/656f92357535be0012be8013",
        audioUrl: "https://sphinx.acast.com/p/open/s/63cfc6d668877900110ea42a/e/656f92357535be0012be8013/media.mp3",
        durationSeconds: 2950,
        label: { de: "(A)soziale Medien – Vor- und Nachteile", en: "(Anti)social media – pros and cons" },
        why: "A full conversation about the pros and cons of social media, i.e. two people giving, justifying and contradicting opinions — the stretch listen for this section. Feed description: \"in dieser Episode spreche ich mit Daniel … über die Vor- und Nachteile von sozialen Medien. In der Sprachanalyse (25:36) warten wieder viele interessante Wörter, wie 'die Vereinsamung', 'das Selbstwertgefühl' …\", so the vocabulary section starts at 25:36 and a free handout PDF is linked in the feed. <itunes:duration> 49:10.",
        evidence: "Show-level: ranked #2 of 9 in the HearSay Magazine Reddit-thread tally \"9 Best Intermediate German Podcasts Reddit Recommends\"; entry #6 (B1–B2) in Atlas Runa \"13 Best German Podcasts for Intermediate Learners (2026)\"; Apple Podcasts US id1455018378 scraped with curl — \"totalNumberOfRatings\":107, \"ratingAverage\":4.8. Episode-level: title, enclosure and duration from the cached feed (feeds.acast.com/public/shows/63cfc6d668877900110ea42a); audio URL checked with curl -I -L → HTTP 200, Content-Type: audio/mpeg."
      }
    ]
  },
  {
    section: "b1_s06",
    level: "B1",
    videos: [
      {
        videoId: "qT3rFwKSPxQ",
        title: "WENN oder ALS - einfach erklärt 🤓 + TEST | Deutsch lernen",
        channel: "Benjamin - Der Deutschlehrer",
        start: 0,
        end: 793,
        lengthSeconds: 793,
        label: { de: "als oder wenn? — der Unterschied mit Test", en: "als or wenn? — the difference, with a test" },
        why: "Covers the section's core distinction 'als oder wenn?' (als = einmal in der Vergangenheit, wenn = immer/Gegenwart/Zukunft) and ends with a self-test. The video page has no chapterRenderer entries and the title and description are entirely about wenn vs. als, so the whole video is the clip: start = 0, end = lengthSeconds = 793.",
        evidence: "viewCount scraped from the watch page: \"viewCount\":\"122575\" — well above the 50,000 threshold for a grammar explainer. Channel 'Benjamin - Der Deutschlehrer' confirmed via oembed author_name.",
        viewCount: 122575,
        language: "de"
      },
      {
        videoId: "GasFzTb0WcI",
        title: "Temporale Konjunktionen | als, wenn, bevor, nachdem, seitdem, während, bis - Übungen | Kuchenbacken",
        channel: "GermanSkills.com",
        start: 0,
        end: 412,
        lengthSeconds: 412,
        label: { de: "Temporale Konjunktionen im Einsatz: als, wenn, bevor, nachdem, seitdem, während, bis", en: "Temporal conjunctions in action: als, wenn, bevor, nachdem, seitdem, während, bis" },
        why: "This is the one video that drills the full conjunction list the section teaches. The scraped shortDescription names them explicitly: \"Notiere sie dir: als, wenn, bevor, nachdem, seitdem, während, bis\", and the whole 412 s is a gap-fill exercise set in a cake-baking story (sequence of actions = exactly what bevor/nachdem/während express). No chapters on the page, and the entire video is on topic, so start = 0, end = lengthSeconds = 412.",
        evidence: "viewCount scraped from the watch page: \"viewCount\":\"59205\" — above the 50,000 threshold for a grammar explainer. Channel 'GermanSkills.com' confirmed via oembed author_name; the description links to the matching exercise page at germanskills.com.",
        viewCount: 59205,
        language: "de"
      },
      {
        videoId: "ejhhn1yvrx0",
        title: "Deutsch lernen: das Plusquamperfekt einfach erklärt B1/B2/C1",
        channel: "Lingster Academy",
        start: 84,
        end: 667,
        lengthSeconds: 667,
        label: { de: "Plusquamperfekt: Bildung und Gebrauch", en: "Pluperfect: how it is formed and when it is used" },
        why: "Chapter markers were read from the page (chapterRenderer): 0 = title card, 84000 ms = \"Was ist das Plusquamperfekt?\", 130000 = \"Beispielsätze\", 315000 = \"Schaubild\", 385000 = \"Beispiele\", 578000 = \"Warum benutzt man das Plusquamperfekt?\". The clip starts at the first content chapter (84 s) and runs to the end of the video (667 s), i.e. the whole explanation minus the intro card. The description states the key point of this section — that the Plusquamperfekt is used together with a Perfekt or Präteritum and does not stand alone — which is the section's 'zwei Zeiten, eine Reihenfolge' point.",
        evidence: "viewCount scraped from the watch page: \"viewCount\":\"128759\" — well above the 50,000 threshold. Channel 'Lingster Academy' confirmed via oembed author_name.",
        viewCount: 128759,
        language: "de"
      },
      {
        videoId: "xsTGaMqX7uY",
        title: "Deutsch lernen mit Dialogen B1, B2 | Temporale Nebensätze | Plusquamperfekt | Satzstellung",
        channel: "Hallo Deutschschule",
        start: 367,
        end: 688,
        lengthSeconds: 753,
        label: { de: "Zeitliche Reihenfolge angeben: nachdem + Plusquamperfekt im Nebensatz", en: "Putting events in order: nachdem + pluperfect in the subordinate clause" },
        why: "Chapters read from the page: … 298000 ms \"Nebensatz dass\", 367000 ms \"Zeitliche Reihenfolge angeben\", 688000 ms \"Deutsche Aussprache\". The clip is exactly that chapter — start 367 s, end 688 s (next chapter start) — and it is the section's fourth grammar point (two tenses, one order) taught inside a story rather than as a table, with the Nebensatz word order shown at the same time.",
        evidence: "'Hallo Deutschschule' is on the list of well-known, long-running German teaching channels. viewCount scraped from the watch page: \"viewCount\":\"617097\" — the highest of any candidate checked for this section.",
        viewCount: 617097,
        language: "de"
      }
    ],
    podcasts: [
      {
        section: "b1_s06",
        level: "B1",
        show: "Slow German mit Annik Rubens",
        title: "Mit der Bahn fahren in Deutschland – SG 278",
        pageUrl: "https://slowgerman.com/2024/08/06/mit-der-bahn-fahren-in-deutschland/",
        audioUrl: "https://slowgerman.cdn.svmaudio.com/slowgerman/sg278.mp3",
        durationSeconds: 697,
        label: { de: "Mit der Bahn fahren in Deutschland", en: "Travelling by train in Germany" },
        why: "Straight match for 'Reisen & Mobilität': the episode is about using the Deutsche Bahn in Germany — tickets, delays, long-distance vs. regional travel. Slow German publishes a free transcript for every episode, so Justins can listen once blind and once reading, and the Bahn vocabulary is exactly what he needs living in Nürnberg. Found by grepping the feed's <title> lines for Bahn/Zug/Reise/Verkehr keywords.",
        evidence: "Apple Podcasts US id1085828103: 423 ratings, 4.7 average (per the show dossier). Named as a core A1–B1 pick in Sprachcaffe's \"Top 10 Podcasts to Improve German by Levels\" and in the Reddit-derived round-ups (HearSay Magazine's r/German-based list, Migaku's 2026 list), consistently cited for its free transcripts. Audio url verified: curl -I -L returned 301 → HTTP/1.1 200 OK, Content-Type: audio/mpeg."
      },
      {
        section: "b1_s06",
        level: "B1",
        show: "14 Minuten – Deine tägliche Portion Deutsch",
        title: "Folge 118 - Die Deutschen und das Reisen",
        pageUrl: "https://podcasters.spotify.com/pod/show/14minuten/episodes/Folge-118---Die-Deutschen-und-das-Reisen-e2jg5qg",
        audioUrl: "https://anchor.fm/s/f60c4864/podcast/play/86562064/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2024-4-10%2F377168541-44100-2-9bc056abcbd8f7e3.mp3",
        durationSeconds: 850,
        label: { de: "Die Deutschen und das Reisen", en: "Germans and travel" },
        why: "The feed description reads: \"Die Deutschen reise gerne. Aber wohin? Und wie? Welche Länder mögen die Deutschen am Liebsten? In dieser Folge stelle ich euch einige interessante Fakten zum Reiseverhalten der Deutschen vor.\" — travel destinations and modes of travel, i.e. Reisen und Mobilität, in one fixed 14-minute block that fits the daily hour. Titles in this feed are in CDATA, so I grepped the CDATA title lines for Reise/Urlaub/Bahn/Auto/Zug/Mobilität.",
        evidence: "Ranked #1 (of 9) in the HearSay Magazine Reddit-thread tally \"9 Best Intermediate German Podcasts Reddit Recommends\", compiled from 20 r/languagelearning and r/German threads. Apple Podcasts US id1622000957: 52 ratings, 5.0 average (per the show dossier). Audio url verified: curl -I -L returned 302 → HTTP/1.1 200 OK, Content-Type: binary/octet-stream (accepted as application/octet-stream)."
      },
      {
        section: "b1_s06",
        level: "B1",
        show: "Auf Deutsch gesagt!",
        title: "Episode 33: Urlaub an der Ostsee",
        pageUrl: "https://aufdeutschgesagt.de/podcast/episode-33-urlaub-an-der-ostsee/",
        audioUrl: "https://sphinx.acast.com/p/open/s/63cfc6d668877900110ea42a/e/aa899649-5460-4313-8f8a-f329263bc387/media.mp3",
        durationSeconds: 2741,
        label: { de: "Urlaub an der Ostsee — Reisebericht mit Sprachanalyse", en: "A Baltic Sea holiday — travel account with a vocabulary breakdown" },
        why: "Feed description: \"heute berichte ich Euch von meinem Urlaub an der Ostsee! In der Sprachanalyse (18:18) könnt Ihr maritimen Wortschatz wie „der Leuchtturm“, „der Strandkorb“ und „der Tidenhub“ kennenlernen.\" This is a first-person past-tense travel report — precisely the 'Als ich in Berlin war …' register the section teaches, so the temporal clauses and past tenses appear in natural use, and the vocabulary section from 18:18 feeds the daily_vocab workflow. A free handout PDF is linked in the show notes.",
        evidence: "Ranked #2 (of 9) in the HearSay Magazine Reddit-thread tally \"9 Best Intermediate German Podcasts Reddit Recommends\" (20 threads across r/languagelearning and r/German). Listed at B1–B2 as entry #6 in Atlas Runa's \"13 Best German Podcasts for Intermediate Learners (2026)\". Apple Podcasts US id1455018378: 107 ratings, 4.8 average (per the show dossier). Audio url verified: a ranged GET followed the 302 to stitcher2.acast.com and returned HTTP/1.1 206 Partial Content, Content-Type: audio/mpeg, with ID3 tags naming \"Robin Meinert\" / \"Auf Deutsch gesagt!\"."
      }
    ]
  },
  {
    section: "b1_s07",
    level: "B1",
    videos: [
      {
        videoId: "aDH-_ghOQo8",
        title: "Der Genitiv | Einfach erklärt + viele Beispiele und Übungen",
        channel: "Benjamin - Der Deutschlehrer",
        start: 0,
        end: 600,
        lengthSeconds: 850,
        label: { de: "Der Genitiv: Formen und Gebrauch", en: "The genitive: forms and use" },
        why: "Covers the section's core point (Genitiv) — how the genitive is formed and when it is used, i.e. exactly the \"die Folgen des Klimawandels / die Zukunft der Kinder\" pattern. Start/end taken from the video's own chapter markers (chapterRenderer): Einführung 0s, Artikel 18s, \"Wann brauchen wir den Genitiv?\" 53s, \"Kurze Übung\" 173s, \"Genitivpräpositionen ergänzen\" 600s. I end the clip at 600s, where the chapter list moves on to the preposition exercise (that point is covered better by the YourGermanTeacher clip below) — so 0–600 is the genitive-formation block including its practice exercise.",
        evidence: "viewCount from the watch page: 192,926 views for a single grammar explainer — well above the 50,000 threshold for a teaching video. Description positions it explicitly as \"Deutsch lernen B1 - Deutsch lernen B2 - Genitiv - Genitivpräpositionen\".",
        viewCount: 192926,
        language: "de"
      },
      {
        videoId: "xzpnjZb7I0s",
        title: "Präpositionen mit Genitiv - NO ENGLISH | trotz & wegen | Alternativen 😉",
        channel: "YourGermanTeacher",
        start: 0,
        end: 457,
        lengthSeconds: 457,
        label: { de: "Präpositionen mit Genitiv: wegen, trotz", en: "Genitive prepositions: wegen, trotz" },
        why: "Dedicated to the section's second grammar point, Präpositionen mit Genitiv, and to the two the section names first (wegen, trotz) — the \"Wegen des Klimawandels …\" sentence pattern. The whole video is on this one topic, so start = 0 and end = lengthSeconds (457). Its chapters confirm the scope end to end: Intro 0s, wegen 25s, trotz 61s, Beispiele 104s, Bonus Tipp 273s. Entirely in German (\"NO ENGLISH\"), which suits B1.",
        evidence: "YourGermanTeacher is on the list of well-known, long-running German-teaching channels. Independently, viewCount from the watch page: 116,097 views.",
        viewCount: 116097,
        language: "de"
      },
      {
        videoId: "CpO9Wn4wTy4",
        title: "Deutsch lernen: Adjektivendungen logisch erklärt! Grammatik A2-B2",
        channel: "Lingster Academy",
        start: 0,
        end: 492,
        lengthSeconds: 492,
        label: { de: "Adjektivendungen: System in allen Fällen", en: "Adjective endings: the system across the cases" },
        why: "Covers the section's third point, Adjektivdeklination. The video has no chapter markers, but its own description states the full scope — \"Welche Adjektivendungen kommen nach bestimmten Artikeln und unbestimmten Artikeln, im Singular und Plural und nach Nullartikel? Was ist eine Adjektivdeklination?\" — i.e. the whole 8:12 is this one topic, so start = 0 and end = lengthSeconds (492). Honest caveat: the description advertises the declension system by article type (definite / indefinite / zero, singular / plural) rather than naming the four cases one by one, so it is the \"how the ending system works\" explainer rather than a case-by-case table drill.",
        evidence: "viewCount from the watch page: 269,640 views — the highest of the adjective-ending explainers checked, far above the 50,000 threshold. Title itself is levelled A2–B2, matching B1.",
        viewCount: 269640,
        language: "de"
      },
      {
        videoId: "MgAypaNh5Dg",
        title: "Adjektivdeklination einfach lernen | OHNE Artikel | Deutsch lernen",
        channel: "Benjamin - Der Deutschlehrer",
        start: 0,
        end: 518,
        lengthSeconds: 518,
        label: { de: "Adjektive ohne Artikel: frisches Wasser, saubere Luft", en: "Adjectives without an article: frisches Wasser, saubere Luft" },
        why: "Matches the section's fourth point exactly — Adjektive ohne Artikel (\"frisches Wasser · saubere Luft · mit großem Interesse\"). No chapter markers, but the description says the video is about one thing only: \"In diesem Video schauen wir uns an, wie die Adjektivdeklination ohne Artikel funktioniert\", plus a test and a closing test contrasting with-article and without-article endings. So start = 0, end = lengthSeconds (518).",
        evidence: "viewCount from the watch page: 108,384 views, above the 50,000 threshold for a grammar explainer. Same channel as the genitive video above, whose most-viewed grammar explainers run into the hundreds of thousands.",
        viewCount: 108384,
        language: "de"
      }
    ],
    podcasts: [
      {
        section: "b1_s07",
        level: "B1",
        show: "Slow German mit Annik Rubens",
        title: "Der Klimawandel in Deutschland – SG 299",
        pageUrl: "https://slowgerman.com/2025/06/10/klimawandel-klimakrise/",
        audioUrl: "https://slowgerman.cdn.svmaudio.com/slowgerman/sg299.mp3",
        durationSeconds: 581,
        label: { de: "Der Klimawandel in Deutschland", en: "Climate change in Germany" },
        why: "The single closest match in any of the feeds to the section's own example sentence \"Wegen des Klimawandels …\". Feed description: \"Der Klimawandel ist ein großes Thema auf der ganzen Welt. Auch in Deutschland. Aber was bedeutet Klimawandel genau? Es bedeutet, dass sich das Klima auf der Erde verändert. Es wird wärmer. Das Wetter ändert sich. Es gibt mehr extreme Wetterereignisse.\" Slowly spoken, ~9:41, and Slow German publishes a free full transcript for every episode, so it can be listened to once blind and once while reading — useful for spotting genitive phrases (die Folgen des Klimawandels) in real text.",
        evidence: "Fields taken verbatim from the feed https://slowgerman.com/feed/podcast/ (title, link, enclosure url, itunes:duration 9:41). Audio url verified: curl -I -L returned a 301 then HTTP/1.1 200 OK with Content-Type: audio/mpeg. Show evidence as supplied: Apple Podcasts US id1085828103, 423 ratings, 4.7 average; named as a core A1–B1 pick in Sprachcaffe's \"Top 10 Podcasts to Improve German by Levels\"."
      },
      {
        section: "b1_s07",
        level: "B1",
        show: "Top-Thema mit Vokabeln (DW Deutsch lernen)",
        title: "Nach der Hitze: Diskussion über Klimaschutz",
        pageUrl: "https://learngerman.dw.com/de/nach-der-hitze-diskussion-%C3%BCber-klimaschutz/l-77801741",
        audioUrl: "https://radiodownloaddw-a.akamaihd.net/Events/podcasts/de/2296_DKpodcast_topthemamitvokabeln_de/DB62D9F3_2-podcast-2296-77801741.mp3",
        durationSeconds: 169,
        label: { de: "Nach der Hitze: Diskussion über Klimaschutz", en: "After the heatwave: the climate-protection debate" },
        why: "Environment/climate at exactly B1, in the news register where genitive constructions and genitive prepositions actually appear (wegen der starken Hitze, die Aufgabe der Städte). Feed description: \"Nach extremen Temperaturen von über 40 Grad zeigt sich, wie schlecht Deutschland auf Hitze vorbereitet ist. Für die Regierung ist das vor allem Aufgabe der Städte und Kommunen. Das sorgt für Kritik.\" At 2:49 it fits a single study block, and the DW page carries a free manuscript plus a marked vocabulary glossary that feeds straight into the daily vocab workflow.",
        evidence: "Fields taken verbatim from the feed https://rss.dw.com/xml/DKpodcast_topthemamitvokabeln_de (title, link, enclosure url, itunes:duration 02:49, pubDate Fri, 3 Jul 2026). Audio url verified: curl -I -L returned HTTP/1.1 200 OK with Content-Type: audio/mpeg; the episode page also returns 200. Show evidence as supplied: listed at B1 as entry #2 in Atlas Runa \"13 Best German Podcasts for Intermediate Learners (2026)\"; Apple Podcasts US id282932005, 120 ratings, 4.5 average; DW files it under Niveau B1."
      },
      {
        section: "b1_s07",
        level: "B1",
        show: "14 Minuten – Deine tägliche Portion Deutsch",
        title: "Folge 253 - Erneuerbare Energien",
        pageUrl: "https://podcasters.spotify.com/pod/show/14minuten/episodes/Folge-253---Erneuerbare-Energien-e3j8umk",
        audioUrl: "https://anchor.fm/s/f60c4864/podcast/play/119879828/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2026-4-12%2F424004814-44100-2-8ddfb03996d43.mp3",
        durationSeconds: 869,
        label: { de: "Erneuerbare Energien", en: "Renewable energy" },
        why: "Umwelt & Natur vocabulary in a fixed 14-minute block. Feed description: \"Niveau: mittel — Kohle, Öl und Gas gibt es nicht ewig und gut für das Klima sind sie auch nicht. In Deutschland gibt es deswegen immer mehr erneuerbare Energien. Patrick erzählt euch mehr über Windkraft, Solarstrom und vieles mehr.\" The feed marks it \"Niveau: mittel\", i.e. the show's B1 tier rather than its easy tier, and the description promises the transcript on 14minuten.de.",
        evidence: "Fields taken verbatim from the feed https://anchor.fm/s/f60c4864/podcast/rss (title, link, enclosure url, itunes:duration 00:14:29, pubDate Fri, 08 May 2026). Audio url verified: curl -I -L returned a 302 then HTTP/1.1 200 OK with Content-Type: audio/mpeg. Show evidence as supplied: ranked #1 of 9 in the HearSay Magazine Reddit-thread tally \"9 Best Intermediate German Podcasts Reddit Recommends\"; Apple Podcasts US id1622000957, 52 ratings, 5.0 average."
      }
    ]
  },
  {
    section: "b1_s08",
    level: "B1",
    videos: [
      {
        videoId: "Pskb8dIVTpA",
        title: "ᐅ Deutsch Satzbau und Konnektoren: Weil, obwohl, wegen, trotz, deshalb, trotzdem (Deutsch B1-B2)",
        channel: "Learn German Today",
        start: 58,
        end: 146,
        lengthSeconds: 373,
        label: { de: "weil und obwohl: Grund und Gegengrund im Nebensatz", en: "weil and obwohl: reason and counter-reason in the subordinate clause" },
        why: "The video has YouTube chapter markers; the chapter \"weil und obwohl\" runs from 58s (timeRangeStartMillis 58000) to the next chapter \"wegen und trotz\" at 146s, so start=58, end=146. That chapter is exactly this section's first grammar point: cause with weil and contrast with obwohl, both as Nebensätze with the verb at the end. The description states the practical goal as naming \"Gründe und Gegengründe\" with the example pair \"Käthe liebt Karl, weil er schöne Augen hat. / Käthe liebt Karl, obwohl er eine Glatze hat.\" The later chapters (wegen/trotz prepositions, deshalb/trotzdem main-clause adverbs) are deliberately excluded because they are not this section's grammar.",
        evidence: "viewCount scraped from the watch page: 164,925 views — well above the 50,000 bar for a grammar explainer. The video is explicitly badged \"Deutsch B1-B2\" in its title and description, matching this section's level. Verified via oembed (title + author_name \"Learn German Today\" returned as JSON).",
        viewCount: 164925,
        language: "de"
      },
      {
        videoId: "DOsTLqnbivo",
        title: "Deutsch lernen / Learn German B1-B2  - Die Konnektoren \"obwohl\" und \"trotzdem\"",
        channel: "Benjamin - Der Deutschlehrer",
        start: 0,
        end: 194,
        lengthSeconds: 194,
        label: { de: "obwohl vs. trotzdem: Gegensatz im Nebensatz üben", en: "obwohl vs. trotzdem: drilling contrast in the subordinate clause" },
        why: "Whole video, start=0, end=194 (lengthSeconds=194): it is about nothing but obwohl and trotzdem. The chapter list confirms it — after a 47-second Einleitung every chapter is a sentence pair that transforms an obwohl-Nebensatz into a trotzdem main clause (\"Er kauft ein Auto, obwohl er kein Geld hat.\" → \"Er hat kein Geld, trotzdem kauft er ein Auto.\", and four more pairs through 170s). That drill is this section's concessive point, and because several pairs put the Nebensatz first it also shows the word order the section teaches (Nebensatz = Position 1, then the main-clause verb).",
        evidence: "viewCount scraped from the watch page: 148,675 views for a 3-minute grammar explainer — far above the 50,000 bar. Title and channel confirmed by the oembed check (author_name \"Benjamin - Der Deutschlehrer\"). The same channel's \"ALLE Konnektoren (von A1-B1)\" has 180,105 views, indicating a consistently used teaching channel for this exact topic.",
        viewCount: 148675,
        language: "de"
      },
      {
        videoId: "y_cxgBBE6iA",
        title: "Zweiteilige Konnektoren | Alle Doppelkonjunktionen B1/B2",
        channel: "YourGermanTeacher",
        start: 0,
        end: 966,
        lengthSeconds: 1339,
        label: { de: "Zweiteilige Konnektoren: nicht nur … sondern auch, sowohl … als auch, weder … noch, entweder … oder, zwar … aber", en: "Two-part connectors: not only … but also, both … and, neither … nor, either … or, admittedly … but" },
        why: "Chapters come from both the chapterRenderer data and the timestamp list in the description. start=0 keeps the opening chapter \"Zweiteilige Konnektoren\" (0–87s), which defines the category and the word-order rule. end=966 is the start of the chapter \"je desto\" (16:06), which is not one of this section's connectors. The window 0–966 therefore contains exactly the five connectors this section teaches — nicht nur … sondern auch (87s), sowohl … als auch (282s), weder … noch (390s), entweder … oder (536s), zwar … aber (840s) — plus einerseits … andererseits (672s) as a bonus. The description promises \"When and how to use them / Positioning / Word order\", which is the section's concern.",
        evidence: "YourGermanTeacher is on the list of well-known, long-running German teaching channels. viewCount scraped from the watch page: 355,980 views — the highest of any candidate checked for this topic and seven times the 50,000 bar. Verified via oembed (author_name \"YourGermanTeacher\").",
        viewCount: 355980,
        language: "de"
      },
      {
        videoId: "O_Q9MpxjsrI",
        title: "Goethe Prüfung B1: Kommentar / Forumsbeitrag schreiben",
        channel: "Lingster Academy",
        start: 0,
        end: 558,
        lengthSeconds: 558,
        label: { de: "Stellungnahme im Forum: Einleitung, Argumente, eigene Meinung, Schluss", en: "Forum-post statement: introduction, arguments, own opinion, conclusion" },
        why: "Whole video, start=0, end=558 (lengthSeconds=558). The watch page contains no chapterRenderer entries and no timestamps in the description, so no sub-clip could be cut honestly; the whole video is about one thing — how to build a B1 Forumsbeitrag/Kommentar — which is this section's \"Stellungnahme: Aufbau\" point (Einleitung → Argumente → eigene Meinung → Schluss). The description confirms the scope: a Deutschprüfung video series starting \"mit dem Niveau B1 und der Fertigkeit Schreiben\". This is the one clip in the set aimed at the writing task rather than at a single connector, which is where the section's obwohl/weil/da and two-part connectors are actually used.",
        evidence: "viewCount scraped from the watch page: 61,169 views — above the 50,000 bar for a teaching video. Verified via oembed (title + author_name \"Lingster Academy\"). Surfaced as a top result in a web search for B1 Forumsbeitrag/Stellungnahme videos alongside the Goethe/ÖSD exam-prep videos.",
        viewCount: 61169,
        language: "de"
      }
    ],
    podcasts: [
      {
        section: "b1_s08",
        level: "B1",
        show: "Slow German mit Annik Rubens",
        title: "Das Ehrenamt und der Freiwilligendienst – SG 304",
        pageUrl: "https://slowgerman.com/2025/08/19/ehrenamt-freiwilligendienst-fsj-thw/",
        audioUrl: "https://slowgerman.cdn.svmaudio.com/slowgerman/sg304.mp3",
        durationSeconds: 647,
        label: { de: "Ehrenamt und Freiwilligendienst in Deutschland", en: "Volunteering and voluntary service in Germany" },
        why: "Found by grepping the feed's <title> lines for Gesellschaft/Zusammenleben keywords (Ehrenamt, Engagement, Verein, Freiwillig). The episode is about unpaid civic engagement in Germany — Ehrenamt, Freiwilligendienst, FSJ, THW — which is precisely this section's theme and its model sentence \"Obwohl er wenig Zeit hat, engagiert er sich.\" At 10:47 it is one study block, and Slow German publishes a free full transcript on the episode page, so it can be heard once blind and once while reading.",
        evidence: "Feed https://slowgerman.com/feed/podcast/ fetched with curl and saved; item fields taken verbatim from it: <title>Das Ehrenamt und der Freiwilligendienst &#8211; SG 304</title>, <link>, <enclosure url=\"…sg304.mp3\" type=\"audio/mpeg\"/>, <itunes:duration>10:47</itunes:duration>, <pubDate>Tue, 19 Aug 2025</pubDate>. Audio URL checked with curl -s -m 20 -I -L: 301 → HTTP/1.1 200 OK, Content-Type: audio/mpeg."
      },
      {
        section: "b1_s08",
        level: "B1",
        show: "Easy German: Learn German with native speakers",
        title: "274: Engagement, Vereine und Ehrenamt",
        pageUrl: "https://www.easygerman.org/podcast/episodes/274",
        audioUrl: "https://easy-german.cdn.svmaudio.com/secure/af6cfb97-64a0-421a-aeab-b7531633e485/egp274.mp3?dest-id=3776181",
        durationSeconds: 2089,
        label: { de: "Engagement, Vereine und Ehrenamt – wie sich Deutsche organisieren", en: "Civic engagement, clubs and volunteering – how Germans organise themselves" },
        why: "The feed description states that almost one in three people in Germany does ehrenamtliche Tätigkeit in a Verein, church body or aid organisation, and that Cari, co-founder of a gemeinnütziger Verein, explains which kinds of Vereine exist and why Ehrenamt matters here. That is the section's \"Gesellschaft & Zusammenleben\" theme in its most German-specific form, and the episode's Hausaufgabe (\"Wie engagiert ihr euch?\") is exactly the arguing-a-position task the section builds towards. Two unscripted native speakers make it the spoken-German stretch alongside the scripted Slow German episode.",
        evidence: "Feed https://proxyfeed.svmaudio.com/feeds/easygerman/feed.xml fetched with curl and saved; item fields taken verbatim: <title>274: Engagement, Vereine und Ehrenamt</title>, <link><![CDATA[https://www.easygerman.org/podcast/episodes/274]]></link>, <enclosure url=\"…egp274.mp3?dest-id=3776181\" type=\"audio/mpeg\" />, <itunes:duration>34:49</itunes:duration>, <pubDate>Sat, 19 Mar 2022</pubDate>. Audio URL checked with curl -s -m 20 -I -L: 301 → HTTP/1.1 200 OK, Content-Type: audio/mpeg."
      },
      {
        section: "b1_s08",
        level: "B1",
        show: "Top-Thema mit Vokabeln (DW Deutsch lernen)",
        title: "Ehrenamtliche Bürgermeister am Limit",
        pageUrl: "https://learngerman.dw.com/de/ehrenamtliche-b%C3%BCrgermeister-am-limit/l-78415446",
        audioUrl: "https://radiodownloaddw-a.akamaihd.net/Events/podcasts/de/2296_DKpodcast_topthemamitvokabeln_de/8820700F_2-podcast-2296-78415446.mp3",
        durationSeconds: 155,
        label: { de: "Ehrenamtliche Bürgermeister am Limit", en: "Volunteer mayors at their limit" },
        why: "The feed description reads: \"Bürgermeister im Ehrenamt haben es schwer: Sie arbeiten viel und erfahren immer wieder Anfeindungen. Obwohl ihr Amt für die Demokratie eine wichtige Rolle spielt, mangelt es in vielen Kommunen an Unterstützung und Geld.\" It is a civic-engagement/Gesellschaft topic, and the description itself is a textbook obwohl-Nebensatz standing before the main clause — the exact structure this section teaches (\"Nebensatz zählt als Position 1, dann kommt das Verb\"). At 2:35 with a free DW manuscript and marked vocabulary glossary, it is the tightest B1-labelled item in the set and feeds straight into the daily vocab workflow.",
        evidence: "Feed https://rss.dw.com/xml/DKpodcast_topthemamitvokabeln_de fetched with curl and saved; item fields taken verbatim: <title>Ehrenamtliche Bürgermeister am Limit</title>, <link> (DW learngerman page l-78415446, tracking parameter ?maca=… removed), <enclosure url=\"…78415446.mp3\" type=\"audio/mpeg\"/>, <itunes:duration>02:35</itunes:duration>, <pubDate>Tue, 18 Aug 2026</pubDate>. Audio URL checked with curl -s -m 20 -I -L: HTTP/1.1 200 OK, Content-Type: audio/mpeg."
      }
    ]
  },
  {
    section: "b1_s09",
    level: "B1",
    videos: [
      {
        videoId: "0nLh5YGZbII",
        title: "Dafür, davon, darüber? | Pronominaladverbien",
        channel: "fröhlich Deutsch",
        start: 0,
        end: 375,
        lengthSeconds: 375,
        label: { de: "Pronominaladverbien: dafür, davon, darüber, darauf", en: "Prepositional adverbs: dafür, davon, darüber, darauf" },
        why: "Covers the section's first grammar point (Präpositionaladverbien / Pronominaladverbien — darauf, damit, davon, darüber) directly. The video has no chapter markers and its description states the whole 6:15 is about exactly this one topic ('Viele von euch haben Probleme mit den sogenannten Pronominaladverbien (auch: Präpositionaladverbien...). In diesem Video erkläre ich euch die wichtigsten Informationen DAZU'), so start=0 and end=lengthSeconds (375). Explanation is in clear, slow German; the description explicitly tells learners to switch on the German subtitles or slow playback, which suits a B1 learner.",
        evidence: "viewCount pulled from the watch page: 959,652 views — by far the highest of any Pronominaladverbien explainer found, and roughly 20x the 50,000 bar for a grammar explainer. Channel fröhlich Deutsch has 216 thousand subscribers (subscriberCountText on the same page). Surfaced as a top result for the German-language query 'Präpositionaladverbien darauf worauf erklärt B1'.",
        viewCount: 959652,
        language: "de"
      },
      {
        videoId: "9W4OSheAvgA",
        title: "Nomen mit -n am Ende: die n-Deklination │ Deutsch lernen A1/2, B1, B2",
        channel: "Lingster Academy",
        start: 0,
        end: 505,
        lengthSeconds: 505,
        label: { de: "n-Deklination: der Kunde → den Kunden", en: "The n-declension: der Kunde → den Kunden" },
        why: "Covers the section's second grammar point (n-Deklination) — which masculine nouns take -n/-en in Akkusativ, Dativ and Genitiv, exactly the der Kunde → den Kunden / dem Kunden pattern the section teaches. No chapter markers on the video; the description says the whole video is on this one topic ('Lerne, warum manche maskuline Nomen (=Substantive) im Singular im Deutschen ein -n am Wortende brauchen. Welche sind das und wie verwendet man sie korrekt?'), so start=0 and end=lengthSeconds (505). Explicitly labelled A1/2, B1, B2, German-language explanation — right register for B1.",
        evidence: "viewCount from the watch page: 143,196 views — well above the 50,000 bar for a grammar explainer. Channel Lingster Academy has 436 thousand subscribers (subscriberCountText on the same page), i.e. an established German-teaching channel.",
        viewCount: 143196,
        language: "de"
      },
      {
        videoId: "Yh96nluPR5M",
        title: "✅VERBEN MIT PRÄPOSITIONEN endlich verstehen! (Deutsch lernen | Grammatik A2 | B1 | B2 | C1| C2)",
        channel: "Dein Sprachcoach",
        start: 0,
        end: 1041,
        lengthSeconds: 1041,
        label: { de: "Verben mit Präposition: sich ärgern über, achten auf, sparen für", en: "Verbs with prepositions: sich ärgern über, achten auf, sparen für" },
        why: "Covers the section's third grammar point (Verben mit Präposition) — which preposition belongs to which verb and which case it governs, the machinery behind sich ärgern über, sich beschweren bei, achten auf, sparen für. It also feeds directly into the darauf/worauf point, since prepositional adverbs are built from exactly these verb+preposition pairs. No chapter markers were present on the page; the description says the entire video is on this one topic ('Nach diesem Video wirst du endlich die Verben mit Präpositionen verstehen!'), so start=0 and end=lengthSeconds (1041). German-language explanation, labelled A2–C2 by the channel, which is appropriate at B1.",
        evidence: "viewCount from the watch page: 62,278 views — above the 50,000 bar for a grammar explainer. Channel Dein Sprachcoach has 752 thousand subscribers (subscriberCountText on the same page), one of the largest German-teaching channels on YouTube.",
        viewCount: 62278,
        language: "de"
      },
      {
        videoId: "O8GdoTbz-dA",
        title: "VERTRÄGE KÜNDIGEN auf Deutsch🇩🇪 (Deutsch für Fortgeschrittene | Deutsch lernen | besser schreiben)",
        channel: "Dein Sprachcoach",
        start: 0,
        end: 948,
        lengthSeconds: 948,
        label: { de: "Verträge kündigen: Textbausteine für das Kündigungsschreiben", en: "Cancelling a contract: building blocks for the cancellation letter" },
        why: "Covers the section's fourth point (Kündigung: Textbausteine) — the fixed formulations for cancelling a contract in writing, i.e. exactly the 'Hiermit kündige ich meinen Vertrag fristgerecht zum … / Bitte bestätigen Sie mir die Kündigung schriftlich' register. No chapter markers on the page; the description says the whole video is about this single task ('In diesem Video lernst du, wie du einen Vertrag auf Deutsch kündigen kannst ... Alle Beispiele aus dem Video findest du in meinem kostenlosen PDF'), so start=0 and end=lengthSeconds (948). The 'Kunde/Vertragspartner' vocabulary in it also rehearses the n-declension nouns from this section.",
        evidence: "Channel Dein Sprachcoach has 752 thousand subscribers (subscriberCountText from the watch page) — a large, long-running German-teaching channel. viewCount from the same page: 47,692, which is just below the 50,000 guideline; I am stating the exact number rather than rounding. The competing Kündigung explainers I checked were far smaller (DeutschCollege D0jhLavEJbU: 11,350 views; Deutsch mit Luisa 6Un9PV1YUR4: 9,456 views), so this is the best-supported video for this specific sub-topic.",
        viewCount: 47692,
        language: "de"
      }
    ],
    podcasts: [
      {
        section: "b1_s09",
        level: "B1",
        show: "Slow German mit Annik Rubens",
        title: "Konsum in Deutschland – SG #217",
        pageUrl: "https://slowgerman.com/2020/10/13/konsum-in-deutschland-sg-217/",
        audioUrl: "https://slowgerman.cdn.svmaudio.com/slowgerman/sg217.mp3",
        durationSeconds: 379,
        label: { de: "Konsum in Deutschland: Wofür geben die Deutschen ihr Geld aus?", en: "Consumption in Germany: what Germans spend their money on" },
        why: "The episode title is literally the section theme (Konsum). The feed description walks through the Konsumausgaben privater Haushalte: 'Es ist also die Frage, wofür die Menschen in Deutschland ihr Geld ausgeben' — average monthly household spending of 2704 Euro broken down into Wohnen/Energie, Verkehr, Nahrungsmittel, Freizeit. That supplies the exact Konsum/Geld noun and verb vocabulary of the section (ausgeben, Ausgaben, Haushalt, Miete, Kredit, Kosten), and 'Geld ausgeben für' rehearses the verb+preposition pattern. At 6:19 it is a single study block, and Slow German publishes a free full transcript for every episode.",
        evidence: "Taken from the show's own feed (https://slowgerman.com/feed/podcast/), item <title>Konsum in Deutschland &#8211; SG #217</title>, <link>, <enclosure url> and <itunes:duration>6:19</itunes:duration>. Audio URL verified: curl -s -m 20 -I -L returned HTTP/1.1 200 OK with Content-Type: audio/mpeg (after a 301 redirect)."
      },
      {
        section: "b1_s09",
        level: "B1",
        show: "Easy German: Learn German with native speakers",
        title: "647: Weltmeister im Sparen (mit Saidi Sulilatu von Finanztip)",
        pageUrl: "https://www.easygerman.fm/647",
        audioUrl: "https://easy-german.cdn.svmaudio.com/secure/af6cfb97-64a0-421a-aeab-b7531633e485/egp647.mp3?dest-id=3776181",
        durationSeconds: 2078,
        label: { de: "Weltmeister im Sparen: Geld, Sparen und Investieren in Deutschland", en: "World champions at saving: money, saving and investing in Germany" },
        why: "Matches the Geld half of the section head-on. The feed description: Finanztip editor-in-chief Saidi Sulilatu explains 'warum die Deutschen zwar viel sparen, aber oft viel zu wenig aus ihrem Geld machen. Wir sprechen über Aktien, ETFs, Immobilien, Kryptowährungen und darüber, welche Fehler man beim Sparen und Investieren unbedingt vermeiden sollte' — i.e. an hour of natural sparen/investieren/Geld register. 'sparen für' and 'sich ärgern über' style verb+preposition constructions come up constantly in this kind of talk, and the guest's name/role also gives live n-declension nouns (der Experte, der Kunde, der Journalist). Note: it is a 34-minute interview, so it is the stretch listen of the three; transcript and Vokabelhilfe are behind the paid membership.",
        evidence: "Taken from the show's feed (https://proxyfeed.svmaudio.com/feeds/easygerman/feed.xml), item <title>647: Weltmeister im Sparen (mit Saidi Sulilatu von Finanztip)</title>, pubDate Sat, 14 Mar 2026, <link>https://www.easygerman.fm/647</link>, <enclosure url> and <itunes:duration>34:38</itunes:duration>. Audio URL verified: curl -s -m 20 -I -L returned HTTP/1.1 200 OK with Content-Type: audio/mpeg (after a 301 redirect)."
      },
      {
        section: "b1_s09",
        level: "B1",
        show: "Top-Thema mit Vokabeln (DW Deutsch lernen)",
        title: "„Vergessene Konten“: Wem gehört das Geld?",
        pageUrl: "https://learngerman.dw.com/de/vergessene-konten-wem-geh%C3%B6rt-das-geld/l-77471403?maca=de-DKpodcast_topthemamitvokabeln_de-2296-xml-mrss",
        audioUrl: "https://radiodownloaddw-a.akamaihd.net/Events/podcasts/de/2296_DKpodcast_topthemamitvokabeln_de/5B9F1BFD_2-podcast-2296-77471403.mp3",
        durationSeconds: 157,
        label: { de: "Vergessene Konten: Wem gehört das Geld auf der Bank?", en: "Forgotten accounts: who owns the money in the bank?" },
        why: "Money, banks and the legal side of a contract — the section's Konsum/Geld/Verträge triangle. Feed description: 'In Deutschland liegen Milliarden Euro auf Konten, die keinem mehr zugeordnet werden können. Auch die Erben wissen oft nichts Genaues und kommen nur schwer an Informationen. Experten fordern andere Regeln.' The feed's own itunes:keywords list it as 'Bank, Geld, Vermögen, Konto, Erbe, Erbschaft, Finanzen, Nachlass, Staat, Datenschutz, Datenbank, Top-Thema, B1'. Also useful for the n-declension point: der Erbe → die Erben, der Experte → Experten appear right in the summary. At 2:37 with a free DW manuscript and vocabulary glossary, it is a ready 10-minute study block.",
        evidence: "Taken from the DW feed (https://rss.dw.com/xml/DKpodcast_topthemamitvokabeln_de), item <title>„Vergessene Konten“: Wem gehört das Geld?</title>, <link>, <enclosure url> and <itunes:duration>02:37</itunes:duration>; the item's <category> is 'Fortgeschrittene' and its itunes:keywords end with 'Top-Thema, B1'. Audio URL verified: curl -s -m 20 -I -L returned HTTP/1.1 200 OK with Content-Type: audio/mpeg."
      }
    ]
  },
  {
    section: "b1_s10",
    level: "B1",
    videos: [
      {
        videoId: "WQKtUHgfqOw",
        title: "How to talk about the future in German? - German Future Tense A2",
        channel: "YourGermanTeacher",
        start: 30,
        end: 674,
        lengthSeconds: 744,
        label: { de: "Futur I und Präsens für die Zukunft", en: "Futur I and present tense for the future" },
        why: "Covers two of this section's grammar points back to back. Chapter markers read from the page: 0:30 \"Present tense used for the future\", 1:24 \"German Future tense - Das Futur I\", 3:47 \"The difference between Futur I & Präsens\", 5:52 \"Sentence structure\", 8:26 \"Examples\", 11:14 \"Bonus Tip\". start=30 is the start of the \"Present tense used for the future\" chapter, end=674 is the start of the \"Bonus Tip\" chapter, so the clip runs from Präsens-für-die-Zukunft through the worked Futur I examples and stops before the off-topic bonus section. Titled A2 but the werden+Infinitiv vs. Präsens contrast is exactly the B1 job here.",
        evidence: "viewCount from the watch page: 95,694. YourGermanTeacher is one of the named long-running German teaching channels on the reference list of established teaching channels.",
        viewCount: 95694,
        language: "en (explanation) with German example sentences"
      },
      {
        videoId: "a1Of4z6t_J4",
        title: "Deutsche Grammatik: das Futur (werden) | A2, B1, B2",
        channel: "Lingster Academy",
        start: 368,
        end: 450,
        lengthSeconds: 601,
        label: { de: "Vermutungen mit wohl, wahrscheinlich, vermutlich", en: "Assumptions with wohl, wahrscheinlich, vermutlich" },
        why: "Chapter markers from the page: 0:00 Einleitung, 1:55 \"Zukunft mit dem Präsens\", 2:41 \"Gegenwart mit dem Präsens\", 4:28 \"2. Erwartungen/Visionen/Prophezeiungen\", 6:08 \"3. Vermutungen mit Adverbialen\", 7:30 \"abgeschlossene Zukunft (Futur II)\", 8:26 \"Vermutung über Vergangenheit\". start=368 is the start of \"Vermutungen mit Adverbialen\" — the section's wohl/wahrscheinlich/vermutlich point — and end=450 is the start of the Futur II chapter, which is above B1 and deliberately excluded. Explanation is entirely in German, appropriate for B1.",
        evidence: "viewCount from the watch page: 93,545 — well above the 50,000 threshold for a grammar explainer.",
        viewCount: 93545,
        language: "de"
      },
      {
        videoId: "IGC-ciq2yso",
        title: "B1 - Lesson 39 | Futur I | Future Tense in German | Learn German",
        channel: "Learn German",
        start: 0,
        end: 487,
        lengthSeconds: 487,
        label: { de: "Futur I: werden + Infinitiv (B1-Lektion)", en: "Futur I: werden + infinitive (B1 lesson)" },
        why: "The video has no chapter markers (checked for chapterRenderer on the page — none present) and the whole 8:07 is a single lesson on Futur I, so start=0 and end=487 (full length). It is the channel's explicitly B1-numbered lesson on werden + Infinitiv, so it is the level-matched drill of the section's core form; it overlaps in substance with the YourGermanTeacher clip, offered as a second, German-labelled B1 pass rather than new material.",
        evidence: "viewCount from the watch page: 107,320. The channel is Learn German Original (youtube.com/@LearnGermanOriginal), one of the named established German teaching channels on the reference list.",
        viewCount: 107320,
        language: "de+en"
      },
      {
        videoId: "K0b9eVbKXjU",
        title: "Why Germans Celebrate Carnival at 11:11 am | Easy German 477",
        channel: "Easy German",
        start: 67,
        end: 393,
        lengthSeconds: 809,
        label: { de: "Karneval: Brauchtum und Festvokabular", en: "Carnival: customs and festival vocabulary" },
        why: "This is the topic/vocabulary video rather than a grammar video: it supplies the Feste-und-Traditionen vocabulary the section's speaking task needs. Chapters from the page: 0:00 Begrüßung, 1:07 \"Was ist Karneval?\", 3:15 \"Woher kommt Karneval?\", 5:18 \"Warum feiern wir Karneval?\", 6:33 Sponsoring, 7:29 Skidamarink, 8:25 Kostüme, 12:12 Ende. start=67 is the start of \"Was ist Karneval?\" and end=393 is the start of the sponsor break, so the clip is the three explanatory chapters only. Native-speed German with German and English subtitles, the intended B1 stretch.",
        evidence: "viewCount from the watch page: 97,132. Easy German is one of the named long-running teaching channels on the reference list.",
        viewCount: 97132,
        language: "de+en subtitles"
      }
    ],
    podcasts: [
      {
        section: "b1_s10",
        level: "B1",
        show: "Easy German: Learn German with native speakers",
        title: "148: Feste & Feiertage in Deutschland",
        pageUrl: "https://www.easygerman.org/podcast/episodes/148",
        audioUrl: "https://easy-german.cdn.svmaudio.com/secure/af6cfb97-64a0-421a-aeab-b7531633e485/egp148.mp3?dest-id=3776181",
        durationSeconds: 2020,
        label: { de: "Feste & Feiertage in Deutschland", en: "Festivals and public holidays in Germany" },
        why: "Exact theme match. The feed description says Janusz and Manuel explain when and how people celebrate in Germany, compare Janusz's Namenstag childhood with Manuel's Kindergeburtstage, cover the gesetzliche Feiertage, and note that the differences run not only between countries but within Germany itself — which is precisely the section's comparing move (im Gegensatz zu / während). Episode show notes link Namenstag, Geburtstag, Weihnachten, Ostern and the list of German public holidays.",
        evidence: "Apple Podcasts US page (id1482297423): 861 ratings, 4.8 average. Named in the HearSay Magazine Reddit tally \"9 Best Intermediate German Podcasts Reddit Recommends\" and listed at B1 as entry #5 in Atlas Runa \"13 Best German Podcasts for Intermediate Learners (2026)\"."
      },
      {
        section: "b1_s10",
        level: "B1",
        show: "Slow German mit Annik Rubens",
        title: "SG #078: Fasching oder Karneval",
        pageUrl: "https://slowgerman.com/2014/03/04/sg-078-fasching-oder-karneval/",
        audioUrl: "https://slowgerman.cdn.svmaudio.com/slowgerman/sg78.mp3",
        durationSeconds: 345,
        label: { de: "Fasching, Karneval, Fastnacht", en: "Carnival: Fasching, Karneval, Fastnacht" },
        why: "A short, slow, free-transcript episode entirely about a German Brauch. The feed description explains the regional names (Fasching in Bavaria, Fastnacht in Baden-Württemberg, Karneval elsewhere), the link to the Fastenzeit and Aschermittwoch, and the costumes — the regional contrast is a ready-made model for the section's \"im Gegensatz zu … / während hier …\" comparisons. At 5:45 it fits a single study block.",
        evidence: "Apple Podcasts US page (id1085828103): 423 ratings, 4.7 average. Named as a core A1–B1 pick in Sprachcaffe's \"Top 10 Podcasts to Improve German by Levels\" and in the Reddit-derived round-ups (HearSay Magazine, Migaku), consistently cited for its free transcripts."
      },
      {
        section: "b1_s10",
        level: "B1",
        show: "Auf Deutsch gesagt!",
        title: "Episode 8: Frohe Ostern!",
        pageUrl: "http://www.aufdeutschgesagt.de/",
        audioUrl: "https://sphinx.acast.com/p/open/s/63cfc6d668877900110ea42a/e/cc3562370a0d4d45b43110e2c0f4b4da/media.mp3",
        durationSeconds: 2365,
        label: { de: "Ostern: Warum und wie man feiert", en: "Easter: why and how Germans celebrate" },
        why: "The feed description asks \"Wie und warum wird Ostern in Deutschland gefeiert?\" and points to a Sprachanalyse at 17:49 where Robin goes through the new vocabulary from the episode — the feast-day vocabulary this section needs, with the show's characteristic end-of-episode gloss. A free PDF handout is linked in the show notes.",
        evidence: "Ranked #2 (of 9) in the HearSay Magazine Reddit-thread tally \"9 Best Intermediate German Podcasts Reddit Recommends\", built from 20 threads across r/languagelearning and r/German. Apple Podcasts US page (id1455018378): 107 ratings, 4.8 average."
      }
    ]
  },
  {
    section: "b1_s11",
    level: "B1",
    videos: [
      {
        videoId: "6WxShqoXFtQ",
        title: "The German verb \"lassen\" with ALL its meanings | A2 & B1 Level",
        channel: "YourGermanTeacher",
        start: 43,
        end: 783,
        lengthSeconds: 1017,
        label: { de: "lassen – alle Bedeutungen (reparieren lassen, in Ruhe lassen, Lass uns …)", en: "The verb lassen: all its meanings" },
        why: "Covers the section's 'lassen' grammar point directly. The video has chapter markers; I took start = the chapter 'The 6 meanings of LASSEN' (43000 ms) and end = the chapter 'Bonus Tipp' (783000 ms), so the clip runs through conjugation (86s), 'etwas veranlassen' = Ich lasse mein Auto reparieren (120s), 'etwas erlauben / zulassen' = Er lässt die Tür offen (246s), 'zurücklassen' (338s), 'einen Vorschlag machen' = Lass uns … (397s) and 'aufhören' = Lass das! (526s). That is exactly the set of senses the section lists, and it stops before the bonus/homework sections.",
        evidence: "viewCount from the watch page: 229,800 views for a single grammar explainer. YourGermanTeacher is one of the long-running teaching channels named in the task's list of well-known German-teaching channels (https://www.youtube.com/@yourgermanteacher).",
        viewCount: 229800,
        language: "en (English explanation, German example sentences on screen)"
      },
      {
        videoId: "2SJh9NzCN8o",
        title: "THE DATIVE part 6: The 10 MOST IMPORTANT Dative Verbs in GERMAN: helfen, glauben, passen, etc",
        channel: "Learn German with Anja",
        start: 0,
        end: 397,
        lengthSeconds: 397,
        label: { de: "Verben mit Dativ: helfen, danken, gefallen, gehören", en: "Dative verbs: helfen, danken, gefallen, gehören" },
        why: "The whole video is about the verbs that force the Dativ (helfen, glauben, passen, gefallen, gehören …), which is the section's 'Verben mit Dativ' point. The watch page shows no chapterRenderer entries and the video is only 6:37 long and entirely on this one topic, so start = 0 and end = lengthSeconds (397).",
        evidence: "viewCount from the watch page: 356,080 views. 'Learn German with Anja' (https://www.youtube.com/@LearnGermanwithAnja) is on the task's list of well-known, long-running teaching channels.",
        viewCount: 356080,
        language: "en (English explanation, German examples)"
      },
      {
        videoId: "-zObYGX7VKA",
        title: "75 Adjectives with prepositions | Learn German Grammar | Adjektive mit Präpositionen | B1 | B2",
        channel: "Learn German",
        start: 69,
        end: 1292,
        lengthSeconds: 1292,
        label: { de: "Adjektive mit Präposition: stolz auf, zufrieden mit, verliebt in", en: "Adjectives with prepositions: proud of, satisfied with, in love with" },
        why: "Matches the section's 'Adjektive mit Präposition' point, and it also drills the case each preposition takes — the part learners actually get wrong. Chapters from the watch page: 'Intro' 0, 'Adjektive mit Präpositionen' 69000 ms, '… accusative' 280000 ms, 'Adjektive mit Dative' 822000 ms, 'Präpositionen mit Dative' 965000 ms, then two closing chapters at 1117000 and 1168000 ms. I set start = 69 (first content chapter, skipping the intro) and end = 1292 = lengthSeconds, because every remaining chapter is still on this topic. Self-labelled B1/B2, so the level fits.",
        evidence: "viewCount from the watch page: 187,660 views. The channel is 'Learn German' / Learn German Original (https://www.youtube.com/@LearnGermanOriginal), named in the task's list of well-known long-running teaching channels.",
        viewCount: 187660,
        language: "en (English framing, German adjective+preposition examples)"
      }
    ],
    podcasts: [
      {
        section: "b1_s11",
        level: "B1",
        show: "Easy German: Learn German with native speakers",
        title: "198: Freunde, Kumpel und Komparsen",
        pageUrl: "https://www.easygerman.org/podcast/episodes/198",
        audioUrl: "https://easy-german.cdn.svmaudio.com/secure/af6cfb97-64a0-421a-aeab-b7531633e485/egp198.mp3?dest-id=3776181",
        durationSeconds: 1831,
        label: { de: "Freundschaft: Freund oder nur Kumpel?", en: "Friendship: a Freund, or just a Kumpel?" },
        why: "The feed description is entirely about Freundschaft — building friendships as a newcomer in Germany, Manuel's friend Eva's tips for meeting people, and explicitly 'den Unterschied zwischen \"Freunden\" und \"Kumpel\"' plus how to keep friendships alive over distance. That is the section's Freundschaft/Beziehungen theme, and the Freund/Kumpel distinction is precisely the relationship vocabulary this section builds.",
        evidence: "Show-level evidence as supplied: Apple Podcasts US page (id1482297423) scraped with curl shows 861 ratings at 4.8 average; named in the HearSay Magazine Reddit tally '9 Best Intermediate German Podcasts Reddit Recommends' and listed at B1 as entry #5 in Atlas Runa '13 Best German Podcasts for Intermediate Learners (2026)'. Episode-level: <enclosure> verified with curl -I -L → final HTTP/1.1 200 OK, Content-Type: audio/mpeg."
      },
      {
        section: "b1_s11",
        level: "B1",
        show: "Easy German: Learn German with native speakers",
        title: "104: So ehrlich waren wir noch nie",
        pageUrl: "https://www.easygerman.org/podcast/episodes/104",
        audioUrl: "https://easy-german.cdn.svmaudio.com/secure/af6cfb97-64a0-421a-aeab-b7531633e485/egp104.mp3?dest-id=3776181",
        durationSeconds: 1803,
        label: { de: "Charakter & Schwächen: Besserwisser, emotional, unorganisiert", en: "Character and weaknesses: know-it-all, emotional, disorganised" },
        why: "The feed description has the three hosts describing their own personal weaknesses — 'Manuel war zum Beispiel immer schon ein Besserwisser, Cari wird oft sehr emotional und Janusz ist einfach unorganisiert' — i.e. an unscripted hour of character adjectives applied to real people. That is the section's 'Charakter & Gefühle: Adjektive' point in natural speech, and the title itself ('So ehrlich …') is the Ehrlichkeit word family.",
        evidence: "Show-level evidence as supplied: Apple Podcasts US page (id1482297423), 861 ratings / 4.8 average; HearSay Magazine Reddit-thread tally and Atlas Runa B1 list entry #5. Episode-level: <enclosure> verified with curl -I -L → final HTTP/1.1 200 OK, Content-Type: audio/mpeg."
      },
      {
        section: "b1_s11",
        level: "B1",
        show: "Slow German mit Annik Rubens",
        title: "SG #146: Die Beziehung",
        pageUrl: "https://slowgerman.com/2017/10/11/sg-146-die-beziehung/",
        audioUrl: "https://slowgerman.cdn.svmaudio.com/slowgerman/sg146.mp3",
        durationSeconds: 226,
        label: { de: "Die Beziehung: verliebt sein, Schmetterlinge im Bauch", en: "Relationships: being in love, butterflies in your stomach" },
        why: "The feed description defines Beziehung ('das Verhältnis, das wir zu einem anderen Menschen haben'), then works through sich verlieben, 'Verliebt sein ist ein schönes Gefühl' and 'Schmetterlinge im Bauch'. It is a 3:46 slow-spoken block on exactly the Gefühle/Beziehungen theme, and it models 'verliebt in' — one of the section's adjective+preposition items — in context.",
        evidence: "Show-level evidence as supplied: Apple Podcasts US page (id1085828103) scraped with curl shows 423 ratings at 4.7 average; named as a core A1–B1 pick in Sprachcaffe's 'Top 10 Podcasts to Improve German by Levels' and in the Reddit-derived round-ups, consistently cited for its free transcripts (the full text for this episode is on the linked page). Episode-level: <enclosure> verified with curl -I -L → final HTTP/1.1 200 OK, Content-Type: audio/mpeg."
      }
    ]
  },
  {
    section: "b1_s12",
    level: "B1",
    videos: [
      {
        videoId: "EtPj-9UlAhE",
        title: "Schreiben Teil 1 Goethe Zertifikat B1 | Prüfungsvorbereitung Deutsch B1| Deutsch mit Marija",
        channel: "Deutsch mit Marija ",
        start: 0,
        end: 511,
        lengthSeconds: 511,
        label: { de: "Schreiben Teil 1: informelle Nachricht (80 Wörter)", en: "Writing part 1: the informal message (80 words)" },
        why: "Covers the section's first grammar point (Schreiben Teil 1 — informal message, ~80 words). Marija walks through a sample Goethe B1 writing task and shows exactly how to hit every Leitpunkt to get full marks. The video has no chapter markers and the whole 8:31 runtime is one Schreiben-Teil-1 task walk-through, so start=0 and end=lengthSeconds (511).",
        evidence: "Deutsch mit Marija is one of the named long-running teaching channels in the brief's list; the video page reports \"viewCount\":\"102386\" (102,386 views), verified by curl on the watch page.",
        viewCount: 102386,
        language: "de"
      },
      {
        videoId: "HKi1aWDPC80",
        title: "Goethe Zertifikat B1 Schreiben Teil 3 | Halb-Formelle E-Mail",
        channel: "Grenzenlosci",
        start: 0,
        end: 630,
        lengthSeconds: 630,
        label: { de: "Schreiben Teil 3: die formelle E-Mail (40 Wörter)", en: "Writing part 3: the formal e-mail (40 words)" },
        why: "Covers the third writing part of the section — the short formal/half-formal e-mail (Sehr geehrte …, Siezen, Mit freundlichen Grüßen). The shortDescription is just a multilingual restatement of \"Goethe Zertifikat B1 | Modul Schreiben Teil III\" with no timestamps, and the page has no chapterRenderer entries; the entire 10:30 video is that one exam part, so start=0 and end=lengthSeconds (630).",
        evidence: "Watch page reports \"viewCount\":\"58907\" (58,907 views) — above the 50,000 bar for a grammar/exam explainer; verified by curl on https://www.youtube.com/watch?v=HKi1aWDPC80.",
        viewCount: 58907,
        language: "de"
      },
      {
        videoId: "3f65jBV0tYE",
        title: "Goethe Zertifikat B1 neu | Sprechen Teil 2 | Alle Präsentationen",
        channel: "Deutsch Mit Mir 🇩🇪",
        start: 0,
        end: 264,
        lengthSeconds: 7476,
        label: { de: "Präsentation: Aufbau und Redemittel am Modellbeispiel", en: "Presentation: structure and set phrases in a worked model" },
        why: "The section's Aufbau (Thema vorstellen → persönliche Erfahrung → Situation im Heimatland → Vor- und Nachteile → Meinung → Abschluss) and its Redemittel are shown end-to-end in a single spoken model presentation. The video is a 2h05 compilation with real chapter markers; I took the first chapter, \"Goethe B1 Fitnessstudio – Brauchen wir Fitnessstudios?\", whose chapterRenderer timeRangeStartMillis is 0 and whose next chapter starts at 264000 ms — so start=0, end=264. This is a worked model rather than a lecture on the structure; the structure is visible in how the speaker moves through the five folien.",
        evidence: "Watch page reports \"viewCount\":\"276255\" (276,255 views), far above the 50,000 bar for a teaching video; verified by curl on the watch page, where the 25+ chapterRenderer entries were also read.",
        viewCount: 276255,
        language: "de"
      },
      {
        videoId: "dp3JEYMTubQ",
        title: "ZB1 Goethe/ÖSD: Gemeinsam etwas planen",
        channel: "Deutsch global",
        start: 0,
        end: 251,
        lengthSeconds: 251,
        label: { de: "Redemittel Gespräch: gemeinsam etwas planen", en: "Discussion phrases: planning something together" },
        why: "Covers the section's \"Redemittel Gespräch\" point — the Sprechen part where the two candidates plan something together (Was hältst du davon? · Ich schlage vor, … · Wie wäre es, wenn …? · Einverstanden. / Das sehe ich anders.). The page has no chapterRenderer entries and the whole 4:11 runtime is this one exam task (the description notes \"Alle Redemittel nochmal bei 3:56\", i.e. a recap near the end), so start=0 and end=lengthSeconds (251). Caveat stated honestly: the first line of the description reads \"Zertifikat B1 - Email schreiben\", which looks like copy-paste from another upload — the oembed title and the page keywords (\"gemeinsam etwas planen\", \"hochzeit planen\", \"mündliche Prüfung Teil 1 ZB1 Goethe/ÖSD\") confirm the content is the speaking task.",
        evidence: "Watch page reports \"viewCount\":\"377511\" (377,511 views) — the highest of any candidate checked for this section; verified by curl on https://www.youtube.com/watch?v=dp3JEYMTubQ.",
        viewCount: 377511,
        language: "de"
      }
    ],
    podcasts: [
      {
        section: "b1_s12",
        level: "B1",
        show: "Slow German mit Annik Rubens",
        title: "Brief schreiben – So schreibe ich einen Brief! SG #206",
        pageUrl: "https://slowgerman.com/2020/03/24/brief-schreiben-so-schreibe-ich-einen-brief-sg-206/",
        audioUrl: "https://slowgerman.cdn.svmaudio.com/slowgerman/sg206.mp3",
        durationSeconds: 365,
        label: { de: "Einen formellen Brief schreiben — Betreff, Anrede, Grußformel", en: "Writing a formal letter — subject line, salutation, sign-off" },
        why: "The feed description is a complete how-to for a formal letter: Briefkopf, Absender/Empfänger, Betreffzeile, the salutation \"Sehr geehrte Damen und Herren,\" / \"Sehr geehrte Frau Müller,\", Siezen instead of duzen, formulas like \"ich bitte Sie\" and \"ich möchte Ihnen mitteilen, dass …\", and the closing \"Mit freundlichen Grüßen\". That is exactly the register the section's Schreiben Teil 3 (formelle E-Mail, 40 W.) is graded on. 6:05 long, and the description doubles as a free full transcript (plus a PDF at slowgerman.com/folgen/sg206kurz.pdf), so it fits a 10-minute study block.",
        evidence: "Show-level: Apple Podcasts US page (id1085828103) scraped with curl shows \"totalNumberOfRatings\":423, \"ratingAverage\":4.7; named as a core A1–B1 pick in Sprachcaffe's \"Top 10 Podcasts to Improve German by Levels\" and in the Reddit-derived round-ups (HearSay Magazine's r/German-based list, Migaku's \"Best German Podcasts for Learners in 2026\"), consistently cited for its free transcripts. Episode-level: audio url verified with curl -I -L → final \"HTTP/1.1 200 OK\", \"Content-Type: audio/mpeg\"."
      },
      {
        section: "b1_s12",
        level: "B1",
        show: "Auf Deutsch gesagt!",
        title: "Episode 165: Authentisch auftreten mit Achim Griesel",
        pageUrl: "https://www.aufdeutschgesagt.de/",
        audioUrl: "https://sphinx.acast.com/p/open/s/63cfc6d668877900110ea42a/e/69eb4aae13963c024344fc98/media.mp3",
        durationSeconds: 2985,
        label: { de: "Vor Publikum sprechen — was einen guten Redner ausmacht", en: "Speaking in front of an audience — what makes a good speaker" },
        why: "itunes:subtitle is literally \"Wie redet man vor Publikum?\" and the description opens with \"vor anderen sprechen. Präsentationen, Meetings …\" — Robin talks with Achim Griesel (founder of \"Nacht der Redner\") about what makes a good speaker, how to be authentic and how to bring your topic onto the stage. That maps directly onto the section's Präsentation (Aufbau + delivery) and its nerves. The Sprachanalyse at 30:09 glosses vocabulary including \"das Lampenfieber\" (stage fright) and \"etwas herunterrattern\" (to reel something off) — both exactly the words a B1 candidate needs for this exam part.",
        evidence: "Show-level: ranked #2 of 9 in the HearSay Magazine Reddit-thread tally \"9 Best Intermediate German Podcasts Reddit Recommends\" (20 threads across r/languagelearning and r/German); entry #6 at B1–B2 in Atlas Runa's \"13 Best German Podcasts for Intermediate Learners (2026)\"; Apple Podcasts US (id1455018378) \"totalNumberOfRatings\":107, \"ratingAverage\":4.8. Episode-level: audio url verified with curl -L range GET → 302 to stitcher2.acast.com then \"HTTP/1.1 206 Partial Content\", \"Content-Type: audio/mpeg\"."
      },
      {
        section: "b1_s12",
        level: "B1",
        show: "Auf Deutsch gesagt!",
        title: "Episode 157: Gesprächsfähig werden mit Bertram Thiel",
        pageUrl: "https://www.aufdeutschgesagt.de/",
        audioUrl: "https://sphinx.acast.com/p/open/s/63cfc6d668877900110ea42a/e/69593a6118c941d6d607eb00/media.mp3",
        durationSeconds: 2613,
        label: { de: "Gesprächsfähig werden — zuhören und Argumente klar formulieren", en: "Becoming conversation-ready — listening and stating arguments clearly" },
        why: "The description says the episode is about \"wie Gespräche gelingen können\" with communication teacher Bertram Thiel, and specifically about \"aktives Zuhören sowie eine klare Formulierung von Argumenten\" — the two skills the section's Redemittel Gespräch exist to support (Was hältst du davon? · Ich schlage vor, … · Einverstanden. / Das sehe ich anders.). itunes:subtitle: \"Wie kann Dialog im Alltag und in der Schule gelingen?\" Sprachanalyse at 25:19 glosses \"das Geschwätz\", \"der Streithahn\" and \"sich in die Haare bekommen\".",
        evidence: "Show-level: same as above — #2 of 9 in the HearSay Magazine Reddit-thread tally \"9 Best Intermediate German Podcasts Reddit Recommends\", #6 at B1–B2 in Atlas Runa's \"13 Best German Podcasts for Intermediate Learners (2026)\", Apple Podcasts US id1455018378 with 107 ratings at 4.8. Episode-level: audio url verified with curl -L range GET → 302 to stitcher2.acast.com then \"HTTP/1.1 206 Partial Content\", \"Content-Type: audio/mpeg\"."
      }
    ]
  }
];
