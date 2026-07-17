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
import { writePrivateArtifacts } from "../lib/private-artifacts.mjs";
import * as byoSystems from "@ge/byo-systems";

// tools/ge/systems.mjs -> tools/ge -> tools -> repo root.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SIMULATOR_CORPUS_DIR = resolve(REPO_ROOT, "apps", "factory", "simulator-systems");

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
    "from-traces": { type: "string", description: "Path to a ge.replay-corpus.v1 (from ge systems record) — projects observed fields into the twin schema (mode: samples)" },
    "from-profile": { type: "string", description: "Path to a ge.system-profile.v1 — pairs with --from-traces for the display name and system id" },
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
    if (args["from-traces"]) {
      // Project the redacted replay corpus into samples (JS side); the Python
      // pipeline compiles it exactly like a --from-samples run. Redacted
      // values are fine — synthesis reads field PRESENCE, which is the
      // field-coverage gap `ge systems compare` reports.
      const { parseCorpus, projectCorpusToSamples } = await import("../lib/system-record.mjs");
      const profile = args["from-profile"] ? JSON.parse(await readFile(resolve(args["from-profile"]), "utf8")) : null;
      const corpus = parseCorpus(await readFile(resolve(args["from-traces"]), "utf8"), {
        profile,
        system: profile?.system || null,
      });
      const { samples } = projectCorpusToSamples(corpus);
      if (!Object.keys(samples).length) {
        throw new DxError("the replay corpus yielded no sample rows to synthesize from", {
          where: "ge systems synth --from-traces",
          why: "no response body in the corpus contained object rows keyed by a collection path",
          fix: "record more read traffic (ge systems record ... --max-calls N) or pass --from-openapi",
        });
      }
      body.mode = "samples";
      body.samples = samples;
      if (!body.displayName && profile) {
        body.displayName = profile.displayName || profile.system;
      }
      if (!body.displayName && corpus.header?.system) body.displayName = corpus.header.system;
    } else if (args["from-openapi"]) {
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

// Where mutation proposals land by default — beside the bindings store.
const MUTATIONS_DIR = resolve(BINDINGS_DIR, "mutations");

const mutationInfer = defineCommand({
  meta: {
    name: "infer",
    description:
      "Infer ge.mutation-model.v1 write semantics from an OpenAPI spec or samples (deterministic heuristic tier) and emit a reviewable proposal — never edits a pack",
  },
  args: {
    ...common,
    system: { type: "positional", required: true, description: "Target system id the proposal is for" },
    "from-openapi": { type: "string", description: "Path to an OpenAPI/Swagger JSON spec" },
    "from-samples": { type: "string", description: "Path to a JSON file of {collection: [rows]}" },
    out: { type: "string", description: "Proposal output path (default .ge/systems/mutations/<system>.proposal.json)" },
  },
  run: guarded(async ({ args }) => {
    const system = byoSystems.assertMutationSystemId(args.system);
    const body = { displayName: system, useLlm: false }; // heuristic tier: deterministic by construction
    if (args["from-openapi"]) {
      body.mode = "openapi";
      body.openapi = JSON.parse(await readFile(resolve(args["from-openapi"]), "utf8"));
    } else if (args["from-samples"]) {
      body.mode = "samples";
      body.samples = JSON.parse(await readFile(resolve(args["from-samples"]), "utf8"));
    } else {
      throw new DxError("mutation infer needs a source", {
        where: "ge systems mutation infer",
        why: "write semantics are inferred from an OpenAPI spec or samples, never invented",
        fix: `ge systems mutation infer ${args.system} --from-openapi <spec.json>`,
      });
    }
    const spec = byoSystems.buildSynthesisSpec(body);
    const synthesized = await byoSystems.runSynthesis(spec, { repoRoot: REPO_ROOT });
    const contract = synthesized.contract || synthesized;
    const packDir = resolve(SIMULATOR_CORPUS_DIR, system);
    const baseWorkflowsText = await readFile(resolve(packDir, "workflows.json"), "utf8").catch(() => null); // best-effort: missing pack = no base-hash guard; apply re-reads authoritatively and fails loudly there

    const proposal = byoSystems.buildMutationProposal({
      contract,
      system,
      source: { mode: body.mode, path: args["from-openapi"] || args["from-samples"] },
      baseWorkflowsText,
    });
    const outPath = resolve(args.out || resolve(MUTATIONS_DIR, `${system}.proposal.json`));
    const { mkdir, writeFile } = await import("node:fs/promises");
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, `${JSON.stringify(proposal, null, 2)}\n`, "utf8");
    const handlerCount = Object.keys(proposal.workflows.toolHandlers || {}).length;
    emit(args, { ok: true, proposal: outPath, handlers: handlerCount, writeBindings: proposal.writeBindings }, (r) => {
      out(ui.title("Mutation proposal", system));
      out(ui.kv([["proposal", r.proposal], ["handlers", String(r.handlers)], ["write tools", String(r.writeBindings.length)]]));
      out(ui.next(`ge systems mutation apply --proposal ${r.proposal}`, "review, then apply (dry-run by default; --write persists)"));
    });
  }),
});

const mutationValidate = defineCommand({
  meta: {
    name: "validate",
    description:
      "Statically validate write semantics across the simulator corpus (or one system) against ge.mutation-model.v1 — read-only, fast",
  },
  args: {
    ...common,
    system: { type: "string", description: "Validate one system instead of the whole corpus" },
  },
  run: guarded(async ({ args }) => {
    const result = await byoSystems.validateCorpusMutations({ repoRoot: REPO_ROOT, system: args.system || undefined });
    emit(args, result, (r) => {
      out(ui.title("Mutation model", `${r.summary.total} system(s), ${r.summary.failing} failing, ${r.summary.warnings} warning(s)`));
      for (const entry of r.systems.filter((s) => !s.ok)) {
        out(`  ${pc.red("✗")} ${entry.system}`);
        for (const problem of entry.problems) out(`      ${pc.dim(problem)}`);
      }
      for (const entry of r.systems.filter((s) => s.ok && s.warnings.length)) {
        out(`  ${pc.yellow("▲")} ${entry.system}: ${entry.warnings.join("; ")}`);
      }
      if (r.ok) out(`  ${pc.green("✓")} every write handler declares its mutation semantics`);
    });
  }),
});

const mutationApply = defineCommand({
  meta: {
    name: "apply",
    description:
      "Apply a mutation proposal to its pack's workflows.json — dry-run by default; hand-authored handler values are never overwritten",
  },
  args: {
    ...common,
    proposal: { type: "string", required: true, description: "Path to a ge.mutation-proposal.v1 file (from mutation infer)" },
    write: { type: "boolean", description: "Persist the merge (default: dry-run report only)" },
    force: { type: "boolean", description: "Skip the base-hash guard (the pack changed since infer)" },
    "pack-dir": { type: "string", description: "Target pack directory (default: the corpus dir for the proposal's system)" },
  },
  run: guarded(async ({ args }) => {
    const proposal = JSON.parse(await readFile(resolve(args.proposal), "utf8"));
    const packDir = args["pack-dir"] ? resolve(args["pack-dir"]) : undefined;
    const result = await byoSystems.applyMutationProposal({
      proposal,
      repoRoot: REPO_ROOT,
      packDir,
      write: Boolean(args.write),
      force: Boolean(args.force),
    });
    emit(args, result, (r) => {
      out(ui.title(r.dryRun ? "Mutation apply (dry-run)" : "Mutation applied", proposal.system));
      for (const change of r.changes) {
        out(`  ${change.kind === "added" ? pc.green("+") : pc.cyan("~")} ${change.handler}${change.keys ? pc.dim(` (${change.keys.join(", ")})`) : ""}`);
      }
      if (!r.changes.length) out(pc.dim("  nothing to change — pack already conformant"));
      if (r.dryRun && r.changes.length) out(ui.next(`ge systems mutation apply --proposal ${args.proposal} --write`, "persist the merge"));
      if (!r.dryRun) out(ui.next("ge systems mutation validate", "re-check the corpus contract"));
    });
  }),
});

const mutation = defineCommand({
  meta: {
    name: "mutation",
    description:
      "Write-semantics contract (ge.mutation-model.v1): infer a proposal from OpenAPI/samples (infer) · validate the corpus (validate) · apply a proposal (apply, dry-run default)",
  },
  subCommands: { infer: mutationInfer, validate: mutationValidate, apply: mutationApply },
});

// Where profiles, replay corpora, and realism reports land — beside the
// bindings store, so the whole real-system surface lives under .ge/systems.
const PROFILES_DIR = resolve(BINDINGS_DIR, "profiles");
const REPLAY_DIR = resolve(REPO_ROOT, ".ge", "replay");

const profileCmd = defineCommand({
  meta: {
    name: "profile",
    description:
      "Capture a redacted ge.system-profile.v1 from a real system's OpenAPI spec (read allowlist / write denylist / auth by reference); with --probe, one read-only reachability dial (risk: calls-live-readonly)",
  },
  args: {
    ...common,
    system: { type: "positional", required: true, description: "System id the profile is for" },
    kind: { type: "string", description: "Target kind (rest only in this phase)", default: "rest" },
    "base-url": { type: "string", description: "Live base URL (required for --probe; recorded for record/compare)" },
    openapi: { type: "string", required: true, description: "Path to the system's OpenAPI/Swagger JSON spec" },
    auth: { type: "string", description: "Auth reference: env:VARIABLE_NAME or none (never a token value)" },
    redact: { type: "string", description: "Path to a ge.redaction-policy.v1 (required when the spec carries PII-shaped fields)" },
    probe: { type: "boolean", description: "Dial the base URL once, read-only, to record reachability (risk: calls-live-readonly)" },
    out: { type: "string", description: "Profile output path (default .ge/systems/profiles/<system>.profile.json)" },
  },
  run: guarded(async ({ args }) => {
    const { buildSystemProfile } = await import("../lib/system-profile.mjs");
    const openapiText = await readFile(resolve(args.openapi), "utf8");
    const redactionPolicyText = args.redact ? await readFile(resolve(args.redact), "utf8") : null;
    const profile = await buildSystemProfile({
      system: args.system,
      kind: args.kind,
      baseUrl: args["base-url"],
      openapiText,
      authRef: args.auth,
      redactionPolicyText,
      probe: Boolean(args.probe),
    });
    const outPath = resolve(args.out || resolve(PROFILES_DIR, `${args.system}.profile.json`));
    await writePrivateArtifacts([{ path: outPath, text: `${JSON.stringify(profile, null, 2)}\n` }]);
    emit(args, { ok: true, profile: outPath, allowedProbes: profile.allowedProbes.length, forbiddenOperations: profile.forbiddenOperations.length, probe: profile.probe }, (r) => {
      out(ui.title("System profile", args.system));
      out(ui.kv([
        ["profile", r.profile],
        ["read allowlist", String(r.allowedProbes)],
        ["write denylist", String(r.forbiddenOperations)],
        ["auth", profile.auth.type === "env" ? `env:${profile.auth.var}` : "none"],
        ["redaction", profile.redactionPolicyHash ? pc.green("policy attached") : pc.dim("none (spec carries no PII-shaped fields)")],
        profile.probe && ["probe", profile.probe.reachable ? pc.green(`reachable (HTTP ${profile.probe.status})`) : pc.red("unreachable")],
      ]));
      out(ui.next(`ge systems record ${args.system} --profile ${r.profile} --script <probes.yaml> --max-calls 25`, "capture read-only traffic into a replay corpus"));
    });
  }),
});

const recordCmd = defineCommand({
  meta: {
    name: "record",
    description:
      "Record bounded, allowlisted, READ-ONLY traffic from a profiled system into a redacted ge.replay-corpus.v1 (risk: calls-live-readonly), or import an existing NDJSON/HAR capture through the same redaction path",
  },
  args: {
    ...common,
    system: { type: "positional", required: true, description: "System id (must match the profile)" },
    profile: { type: "string", description: "Path to the ge.system-profile.v1 (from ge systems profile)" },
    script: { type: "string", description: "Path to a read-only probe script (JSON: {calls: [{name, path, query?}]})" },
    "max-calls": { type: "string", description: "Hard cap on live calls (required for live recording; 1..500)" },
    "import-har": { type: "string", description: "Import a HAR file instead of dialing (write traffic dropped, all redacted)" },
    "import-ndjson": { type: "string", description: "Import an NDJSON capture instead of dialing (re-redacted)" },
    redact: { type: "string", description: "Path to a ge.redaction-policy.v1 applied to every exchange" },
    out: { type: "string", description: "Corpus output path (default .ge/replay/system-<system>.ndjson)" },
  },
  run: guarded(async ({ args }) => {
    const record = await import("../lib/system-record.mjs");
    const policy = args.redact ? JSON.parse(await readFile(resolve(args.redact), "utf8")) : null;
    let result;
    if (args["import-har"]) {
      result = record.importTraces({ format: "har", text: await readFile(resolve(args["import-har"]), "utf8"), system: args.system, policy });
    } else if (args["import-ndjson"]) {
      result = record.importTraces({ format: "ndjson", text: await readFile(resolve(args["import-ndjson"]), "utf8"), system: args.system, policy });
    } else {
      if (!args.profile || !args.script) {
        throw new DxError("live recording needs a profile and a probe script", {
          where: "ge systems record",
          why: "read-only capture dials only the profile's allowlisted paths named in the script",
          fix: `ge systems record ${args.system} --profile <profile> --script <probes.json> --max-calls 25`,
        });
      }
      const profile = JSON.parse(await readFile(resolve(args.profile), "utf8"));
      const script = JSON.parse(await readFile(resolve(args.script), "utf8"));
      result = await record.recordSystemTraces({
        profile,
        system: args.system,
        script,
        policy,
        maxCalls: Number(args["max-calls"]),
      });
    }
    const outPath = resolve(args.out || resolve(REPLAY_DIR, `system-${args.system}.ndjson`));
    const reportPath = `${outPath.replace(/\.ndjson$/, "")}.redaction-report.json`;
    await writePrivateArtifacts([
      { path: reportPath, text: `${JSON.stringify(result.redactionReport, null, 2)}\n` },
      { path: outPath, text: record.corpusToNdjson(result.lines) },
    ]);
    emit(args, { ok: true, corpus: outPath, redactionReport: reportPath, calls: result.calls, redactions: result.redactionReport.totalRedactions }, (r) => {
      out(ui.title("Replay corpus", args.system));
      out(ui.kv([
        ["corpus", r.corpus],
        ["calls", String(r.calls)],
        ["redactions", String(r.redactions)],
        ["report", r.redactionReport],
      ]));
      out(ui.next(`ge systems compare ${args.system} --profile ${args.profile || "<profile>"} --max-calls 25`, "measure the twin against read-only live probes"));
    });
  }),
});

const compareCmd = defineCommand({
  meta: {
    name: "compare",
    description:
      "Measure a twin against its real system using only allowlisted read probes (risk: calls-live-readonly): endpoint/field coverage (mechanical), latency/error realism (advisory) — never dials a write endpoint",
  },
  args: {
    ...common,
    system: { type: "positional", required: true, description: "System id (twin pack + profile must match)" },
    profile: { type: "string", required: true, description: "Path to the ge.system-profile.v1 (must carry base-url)" },
    "max-calls": { type: "string", description: "Cap on live sample calls (default 25)", default: "25" },
    out: { type: "string", description: "Realism report output path (default .ge/systems/profiles/<system>.realism-report.json)" },
  },
  run: guarded(async ({ args }) => {
    const { compareSystemTwin } = await import("../lib/system-compare.mjs");
    const profile = JSON.parse(await readFile(resolve(args.profile), "utf8"));
    const report = await compareSystemTwin({ profile, system: args.system, repoRoot: REPO_ROOT, maxCalls: Number(args["max-calls"]) });
    const outPath = resolve(args.out || resolve(PROFILES_DIR, `${args.system}.realism-report.json`));
    await writePrivateArtifacts([{ path: outPath, text: `${JSON.stringify(report, null, 2)}\n` }]);
    emit(args, { ok: true, report: outPath, dimensions: report.dimensions, next: report.next }, (r) => {
      out(ui.title("Twin realism", `${args.system} vs live`));
      const glyph = { pass: pc.green("✓"), gap: pc.red("✗"), advisory: pc.yellow("▲"), not_sampled: pc.dim("·") };
      for (const [name, dim] of Object.entries(r.dimensions)) {
        out(`  ${glyph[dim.status] || "?"} ${name.padEnd(18)} ${pc.dim(`[${dim.kind}]`)} ${dim.detail}`);
      }
      for (const line of r.next) out(ui.next(line.split("  #")[0].trim(), line.split("  #")[1]?.trim() || ""));
    });
  }),
});

const dispatchCmd = defineCommand({
  meta: {
    name: "dispatch",
    description:
      "Compile stored bindings into the dispatch directive the tool plane consumes (GE_SIMULATOR_DISPATCH) — resolved decisions only, twin by default, live entries for dialable live_first bindings",
  },
  args: { ...common },
  run: guarded(async ({ args }) => {
    const directive = await byoSystems.buildDispatchDirective({ dir: BINDINGS_DIR });
    const result = { env: byoSystems.DISPATCH_ENV, fileEnv: byoSystems.DISPATCH_FILE_ENV, directive };
    emit(args, result, (r) => {
      const systems = Object.keys(r.directive.systems);
      out(ui.title("Dispatch directive", systems.length ? `${systems.length} live` : "all twin"));
      for (const [system, entry] of Object.entries(r.directive.systems)) {
        out(`  ${pc.cyan(system)}  reads → live (${entry.baseUrl})${entry.authEnv ? pc.dim(`  auth: env:${entry.authEnv}`) : ""}`);
      }
      if (!systems.length) {
        out(pc.dim("  no live_first rest bindings — every system routes to its twin (ge systems bind ... --mode live_first)"));
        return;
      }
      out(ui.next(`export ${r.env}='${JSON.stringify(r.directive)}'`, "inject into a local tool-plane run so read ops route live (writes always stay on the twin)"));
    });
  }),
});

const doctorCmd = defineCommand({
  meta: { name: "doctor", description: "Check the BYO-systems toolchain: python, synthesize_cli.py, registry.json, live bindings, overlay backend" },
  args: {
    ...common,
    dial: {
      type: "boolean",
      description:
        "Also dial each stored rest binding read-only (one reachability probe) and report its dispatch decision — the only doctor path that opens a network connection (risk: calls-live-readonly)",
    },
  },
  run: guarded(async ({ args }) => {
    const result = args.dial
      ? await (await import("../lib/systems-dial.mjs")).doctorWithDial({ repoRoot: REPO_ROOT, bindingsDir: BINDINGS_DIR })
      : await byoSystems.checkToolchain({ repoRoot: REPO_ROOT, bindingsDir: BINDINGS_DIR });
    emit(args, result, (r) => {
      out(ui.title("Systems doctor"));
      renderChecks(r.checks);
    });
  }),
});

export const systems = defineCommand({
  meta: { name: "systems", description: "Bring-Your-Own-System: list built-in simulators (list) · synthesize a new one (synth) · profile a real system read-only (profile) · record a replay corpus (record) · compare a twin to live (compare) · bind a system to a live target (bind/bindings/unbind) · compile the tool-plane dispatch directive (dispatch) · write-semantics contract (mutation infer/validate/apply) · check the toolchain (doctor, --dial to probe live bindings read-only)" },
  subCommands: { list, synth, profile: profileCmd, record: recordCmd, compare: compareCmd, bind, bindings: bindingsCmd, unbind, dispatch: dispatchCmd, mutation, doctor: doctorCmd },
});
