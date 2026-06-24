#!/usr/bin/env node

import { runSourceHygiene } from "./lib/source-hygiene.mjs";

const result = runSourceHygiene();
const writer = result.ok ? process.stdout : process.stderr;
writer.write(result.report + "\n");
process.exit(result.ok ? 0 : 1);
