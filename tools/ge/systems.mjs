// tools/ge/systems.mjs — `ge systems`: the Bring-Your-Own-System noun. Same
// core as the console's /api/systems routes (apps/console/src/server/
// systems.mjs), both binding @ge/byo-systems (packages/byo-systems) to this
// repo's concrete layout — list the generator's known simulated systems,
// synthesize a brand-new one from an NL description/samples/OpenAPI, bind a
// system to a live twin/mcp/rest target, or check the toolchain the
// synthesis CLI (and the bindings store) needs.
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineCommand } from "citty";
import { cfgFrom, common, emit, guarded, modeOf, out, pc, renderChecks, ui } from "./shared.mjs";
import { DxError } from "../lib/errors/dx-error.mjs";
import * as byoSystems from "@ge/byo-systems";

// tools/ge/systems.mjs -> tools/ge -> tools -> repo root.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

// Where this repo's live-system bindings live — same .ge/systems layout
// byo-systems' defaultBindingsDir() derives from any repoRoot, computed once
// here so bind/bindings/unbind/doctor all agree on it.
const BINDINGS_DIR = byoSystems.defaultBindingsDir(REPO_ROOT);

// `--config` accepts either an inline JSON object or a path to a JSON file —
// try parsing the raw string first (the common case for a short object) and
// only fall back to reading it as a file path if that fails.
async function parseConfigArg(value) {
  if (value === undefined || value === null || value === "") return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return JSON.parse(await readFile(resolve(value), "utf8"));
  }
}

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
    r.overlayScope && ["overlay", r.overlayScope.durable ? pc.green(`durable (${r.overlayScope.backend})`) : pc.yellow("session-only (in-process)")],
  ]));
  if (!r.promoted) out(ui.next("ge systems synth ... --promote", "persist this into the curated corpus (registry.json + per-section files)"));
  if (r.overlayScope && !r.overlayScope.durable) {
    out(ui.next("ge systems synth ... --remote", "run remote so this twin gets a durable overlay backend (survives replica restarts)"));
  }
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
    local: { type: "boolean", description: "Override: synthesize with the in-process (session-only) overlay (default)" },
    remote: { type: "boolean", description: "Override: synthesize as if run remotely — auto-sets a durable overlay backend (firestore) unless one is already configured" },
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
    const cfg = cfgFrom(args);
    const mode = modeOf(args, cfg);
    const result = await byoSystems.runSynthesis(spec, { repoRoot: REPO_ROOT, promote: Boolean(args.promote), mode });
    emit(args, result, renderSynth);
  }),
});

function renderBinding(binding) {
  out(ui.kv([
    ["system", pc.cyan(binding.system)],
    ["kind", binding.kind],
    ["boundTo", binding.boundTo],
    ["mode", binding.mode],
    binding.connector && ["connector", binding.connector],
    binding.config && ["config", pc.dim(JSON.stringify(binding.config))],
    ["updatedAt", pc.dim(binding.updatedAt)],
  ]));
}

const bind = defineCommand({
  meta: { name: "bind", description: "Bind a contract system to a live twin/mcp/rest target" },
  args: {
    ...common,
    system: { type: "positional", required: true, description: "Contract system id to bind (see `ge systems list`)" },
    to: { type: "string", required: true, description: "Bind target: twin pack id | MCP endpoint URL | REST base URL" },
    kind: { type: "string", required: true, description: `Target kind: ${byoSystems.BINDING_KINDS.join(" | ")}` },
    mode: { type: "string", required: true, description: `Twin vs. live precedence: ${byoSystems.BINDING_MODES.join(" | ")}` },
    connector: { type: "string", description: "Connector package/module name (informational until a connector SDK exists)" },
    config: { type: "string", description: "Inline JSON object, or a path to a JSON file, of connector config" },
  },
  run: guarded(async ({ args }) => {
    const config = await parseConfigArg(args.config);
    const binding = {
      system: args.system,
      boundTo: args.to,
      kind: args.kind,
      mode: args.mode,
      ...(args.connector ? { connector: args.connector } : {}),
      ...(config !== undefined ? { config } : {}),
    };
    const problems = byoSystems.validateBinding(binding);
    if (problems.length) {
      throw new DxError(`invalid system binding for "${args.system}"`, {
        where: "ge systems bind",
        why: problems.join("; "),
        fix: `ge systems bind ${args.system} --to <target> --kind ${byoSystems.BINDING_KINDS.join("|")} --mode ${byoSystems.BINDING_MODES.join("|")}`,
      });
    }
    const stored = await byoSystems.writeBinding({ dir: BINDINGS_DIR, binding });
    emit(args, { ok: true, binding: stored }, (r) => {
      out(ui.title("System bound", r.binding.system));
      renderBinding(r.binding);
      out(ui.next("ge systems doctor", "check this binding and the overlay-durability scope"));
    });
  }),
});

const bindingsCmd = defineCommand({
  meta: { name: "bindings", description: "List stored live-system bindings (read-only)" },
  args: { ...common },
  run: guarded(async ({ args }) => {
    const result = await byoSystems.readBindings({ dir: BINDINGS_DIR });
    emit(args, result, (r) => {
      out(ui.title("System bindings", `${r.bindings.length} bound`));
      if (!r.bindings.length) {
        out(pc.dim("  none — every system runs twin-only until bound (ge systems bind)"));
        return;
      }
      for (const binding of r.bindings) {
        renderBinding(binding);
        out("");
      }
    });
  }),
});

const unbind = defineCommand({
  meta: { name: "unbind", description: "Remove a system's live binding" },
  args: {
    ...common,
    system: { type: "positional", required: true, description: "Contract system id to unbind" },
  },
  run: guarded(async ({ args }) => {
    const removed = await byoSystems.removeBinding({ dir: BINDINGS_DIR, system: args.system });
    emit(args, { ok: true, system: args.system, removed }, (r) => {
      out(removed ? `${pc.green("✓")} unbound ${r.system}` : pc.dim(`${r.system} was not bound`));
    });
  }),
});

const doctorCmd = defineCommand({
  meta: { name: "doctor", description: "Check the BYO-systems toolchain: python, synthesize_cli.py, registry.json, live bindings, overlay backend" },
  args: { ...common },
  run: guarded(async ({ args }) => {
    const result = await byoSystems.checkToolchain({ repoRoot: REPO_ROOT, bindingsDir: BINDINGS_DIR });
    emit(args, result, (r) => {
      out(ui.title("Systems doctor"));
      renderChecks(r.checks);
    });
  }),
});

export const systems = defineCommand({
  meta: { name: "systems", description: "Bring-Your-Own-System: list built-in simulators (list) · synthesize a new one (synth) · bind a system to a live target (bind/bindings/unbind) · check the toolchain (doctor)" },
  subCommands: { list, synth, bind, bindings: bindingsCmd, unbind, doctor: doctorCmd },
});
