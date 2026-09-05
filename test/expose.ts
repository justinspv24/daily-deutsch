/**
 * Test-only shim: hands the question banks to the smoke test so it can answer
 * a round correctly. Never bundled into the app.
 */
import { GRAMMAR } from "../src/data/grammar";
import { TOPICS } from "../src/data/topics";
import { VOCAB } from "../src/data/vocab";

(globalThis as Record<string, unknown>)["__TAGESDRILL_DATA__"] = { GRAMMAR, TOPICS, VOCAB };
