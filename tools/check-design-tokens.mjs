#!/usr/bin/env node
// Fail loudly if the three hand-maintained copies of the brand palette
// (packages/design/src/tokens.css, docs/_sass/color_schemes/ge.scss, and
// packages/design/src/palette.mjs) ever disagree. tokens.css is the
// canonical source; palette.mjs is meant to trace every value in it (and in
// ge.scss) exactly. See packages/design/src/palette.mjs for the full
// rationale.
//   node tools/check-design-tokens.mjs
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { checkDesignTokens, formatDesignTokensReport, readFileUtf8 } from "./lib/design-tokens.mjs";
import { PALETTE } from "../packages/design/src/palette.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

const tokensCssText = readFileUtf8(join(ROOT, "packages/design/src/tokens.css"));
const sassText = readFileUtf8(join(ROOT, "docs/_sass/color_schemes/ge.scss"));

const result = checkDesignTokens({ tokensCssText, sassText, palette: PALETTE });
const writer = result.ok ? process.stdout : process.stderr;
writer.write(formatDesignTokensReport(result) + "\n");
process.exit(result.ok ? 0 : 1);
