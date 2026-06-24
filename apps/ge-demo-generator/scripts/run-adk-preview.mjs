#!/usr/bin/env node
import { resolve } from "node:path";
import { runAdkPreviewForWorkspace } from "../src/adk-preview.js";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      out[key] = true;
    } else {
      out[key] = next;
      i += 1;
    }
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const workspaceDir = resolve(args["workspace-dir"] || ".");
  const projectId = args["project-id"] || args.workspace || "workspace";
  const result = await runAdkPreviewForWorkspace({
    workspaceDir,
    projectId,
    prompt: args.prompt || "hello",
    repoRoot: resolve(args["repo-root"] || "."),
    dataRoot: args["data-root"] ? resolve(args["data-root"]) : undefined,
    timeoutMs: Number(args.timeout || 60_000),
    createPacket: args["promotion-packet"] !== "false",
    source: args.source || "factory-preview",
  });
  console.log(JSON.stringify({ ok: result.ok === true, ...result }, null, 2));
  if (!result.ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
});
