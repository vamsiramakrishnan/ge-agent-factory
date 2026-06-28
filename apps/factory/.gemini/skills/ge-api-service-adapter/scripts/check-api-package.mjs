#!/usr/bin/env node
import { access, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

function parseArgs(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      flags[key] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
    }
  }
  return flags;
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  const dir = resolve(flags.dir || ".");
  const files = [
    "mock_data/apis/source-adapters.json",
    "mock_data/apis/openapi.json",
    "mock_data/apis/fixtures/index.json",
    "mock_data/apis/mcp-tools.json",
    "mock_data/apis/mcp-adapter/src/mcp.ts",
  ];
  const status = {};
  for (const rel of files) status[rel] = await exists(join(dir, rel));
  const manifestPath = join(dir, "mock_data/apis/source-adapters.json");
  const manifest = status["mock_data/apis/source-adapters.json"]
    ? JSON.parse(await readFile(manifestPath, "utf8"))
    : null;
  const ok = Boolean(manifest?.sources?.length) && Object.values(status).every(Boolean);
  console.log(JSON.stringify({
    ok,
    dir,
    files: status,
    sources: manifest?.sources?.length || 0,
    pattern: manifest?.pattern || null,
  }, null, 2));
  if (!ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
