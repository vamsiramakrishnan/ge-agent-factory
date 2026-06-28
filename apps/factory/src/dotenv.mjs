import { existsSync, readFileSync } from "node:fs";
import dotenv from "dotenv";

// Parse a .env file into a plain object (empty when absent). Backed by `dotenv`
// instead of the three hand-rolled, copy-pasted readDotEnvSync functions this
// replaces (harness-runner.js, adk-preview.js, server.js).
export function readDotEnv(path) {
  if (!existsSync(path)) return {};
  return dotenv.parse(readFileSync(path));
}
