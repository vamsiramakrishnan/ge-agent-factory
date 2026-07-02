#!/usr/bin/env node
// Gate entry point for design-token drift — kept under this name so the
// AGENTS.md gate line, docs:gate, and CI wiring stay untouched. Delegates to
// the palette generator's check (packages/design/scripts/gen-tokens.mjs),
// which byte-compares the marker-delimited generated regions of tokens.css,
// ge.scss, and setup.scss against packages/design/src/palette.mjs — the
// canonical source — via the generator's explicit name→token table. This
// replaced the old value-set regex check, which could not catch a wrong
// name→value pairing.
//   node tools/check-design-tokens.mjs
import { checkTokens, formatCheckReport } from "../packages/design/scripts/gen-tokens.mjs";

const result = checkTokens();
const writer = result.ok ? process.stdout : process.stderr;
writer.write(formatCheckReport(result) + "\n");
process.exit(result.ok ? 0 : 1);
