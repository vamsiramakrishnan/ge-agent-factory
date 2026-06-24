#!/usr/bin/env node
import { formatValidationResult, validateCorpus } from "../src/index.mjs";

const result = await validateCorpus(process.argv[2] || null);
if (!result.ok) {
  console.error(formatValidationResult(result));
  process.exit(1);
}
console.log(formatValidationResult(result));
