// tools/ge/systems.mjs — `ge systems`: the Bring-Your-Own-System noun. Same
// core as the console's /api/systems routes (apps/console/src/server/
// systems.mjs), both binding @ge/byo-systems (packages/byo-systems) to this
// repo's concrete layout — list the generator's known simulated systems,
// synthesize a brand-new one from an NL description/samples/OpenAPI, or check
// the toolchain the synthesis CLI needs.
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineCommand } from "citty";
import { common, emit, guarded, out, pc, renderChecks, ui } from "./shared.mjs";
import { DxError } from "../lib/errors/dx-error.mjs";
import * as byoSystems from "@ge/byo-systems";

// tools/ge/systems.mjs -> tools/ge -> tools -> repo root.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

function renderList(r) {
  out(ui.title("Systems", `${r.systems.length} known`));
  const idW = Math.max(...r.systems.map((s) => s.id.length), 0);
  for (const s of r.systems) {
    out(`  ${pc.cyan(s.id.padEnd(idW))}  ${s.displayName}  ${pc.dim(s.maturity)}`);
  }
}

const list = defineCommand({
  meta: { name: "list", description: "List the built-in simulated systems known to the generator registry" },
  args: { ...common },
  run: guarded(async ({ args }) => {
    const result = await byoSystems.listKnownSystems({ repoRoot: REPO_ROOT });
    emit(args, result, renderList);
  }),
});

function renderSynth(r) {
  out(ui.title("Synthesized system", r.displayName || r.id));
  out(ui.kv([
    ["id", r.id],
    ["tools", String((r.tools || []).length)],
    ["collections", String(Object.keys(r.collections || {}).length)],
    r.promoted && ["promoted", pc.green("yes")],
  ]));
  if (!r.promoted) out(ui.next("ge systems synth ... --promote", "persist this into the curated corpus (registry.json + per-section files)"));
}

const synth = defineCommand({
  meta: { name: "synth", description: "Synthesize a brand-new live simulator system from an NL description, samples, or an OpenAPI spec" },
  args: {
    ...common,
    name: { type: "string", description: "Display name for the synthesized system" },
    description: { type: "string", description: "Natural-language description (mode: nl, the default)" },
    "from-openapi": { type: "string", description: "Path to an OpenAPI/Swagger JSON spec (mode: openapi)" },
    "from-samples": { type: "string", description: "Path to a JSON file of {collection: [rows]} (mode: samples)" },
    promote: { type: "boolean", description: "Also persist the result into the curated corpus (registry.json + per-section files)" },
  },
  run: guarded(async ({ args }) => {
    const python = byoSystems.resolveSynthesisPython({ repoRoot: REPO_ROOT });
    const probe = byoSystems.probeInterpreter(python);
    if (!probe.ok) {
      throw new DxError(`python interpreter not usable for synthesis: ${python}`, {
        where: "ge systems synth",
        why: probe.detail,
        fix: "mise run setup",
      });
    }
    const body = {};
    if (args.name) body.displayName = args.name;
    if (args["from-openapi"]) {
      body.mode = "openapi";
      body.openapi = JSON.parse(await readFile(resolve(args["from-openapi"]), "utf8"));
    } else if (args["from-samples"]) {
      body.mode = "samples";
      body.samples = JSON.parse(await readFile(resolve(args["from-samples"]), "utf8"));
    } else {
      body.mode = "nl";
      body.description = args.description || "";
    }
    const spec = byoSystems.buildSynthesisSpec(body);
    const result = await byoSystems.runSynthesis(spec, { repoRoot: REPO_ROOT, promote: Boolean(args.promote) });
    emit(args, result, renderSynth);
  }),
});

const doctorCmd = defineCommand({
  meta: { name: "doctor", description: "Check the BYO-systems toolchain: python, synthesize_cli.py, registry.json, overlay backend" },
  args: { ...common },
  run: guarded(async ({ args }) => {
    const result = await byoSystems.checkToolchain({ repoRoot: REPO_ROOT });
    emit(args, result, (r) => {
      out(ui.title("Systems doctor"));
      renderChecks(r.checks);
    });
  }),
});

export const systems = defineCommand({
  meta: { name: "systems", description: "Bring-Your-Own-System: list built-in simulators (list) · synthesize a new one (synth) · check the toolchain (doctor)" },
  subCommands: { list, synth, doctor: doctorCmd },
});
