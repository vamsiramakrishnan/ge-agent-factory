#!/usr/bin/env node
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  process.stdout.write("usage: validate-ledger-event.mjs [event.json]\n\nReads from stdin when no file is provided.\n");
  process.exit(0);
}

function readInput() {
  const path = args[0];
  if (path) return readFileSync(path, "utf8");
  return readFileSync(0, "utf8");
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

let event;
try {
  event = JSON.parse(readInput());
} catch (error) {
  fail(`invalid JSON: ${error.message}`);
}

const required = [
  ["type", event.type],
  ["ts", event.ts],
  ["subject.kind", event.subject?.kind],
  ["subject.id", event.subject?.id],
  ["mode.name", event.mode?.name],
  ["actor.kind", event.actor?.kind],
  ["actor.id", event.actor?.id],
  ["outcome.status", event.outcome?.status],
];

const missing = required.filter(([, value]) => value === undefined || value === null || value === "").map(([name]) => name);
if (missing.length) fail(`missing required field(s): ${missing.join(", ")}`);

if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/.test(event.type)) {
  fail("type must be dot-delimited lowercase words, e.g. workspace.doctor.completed");
}

if (!["local", "remote"].includes(event.mode.name)) {
  fail("mode.name must be local or remote");
}

if (!["system", "harness", "human"].includes(event.actor.kind)) {
  fail("actor.kind must be system, harness, or human");
}

if (Number.isNaN(Date.parse(event.ts))) {
  fail("ts must be an ISO-compatible timestamp");
}

process.stdout.write(JSON.stringify({ ok: true, type: event.type, subject: event.subject, status: event.outcome.status }, null, 2) + "\n");
