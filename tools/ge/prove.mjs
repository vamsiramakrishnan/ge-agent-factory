// tools/ge/prove.mjs — `ge prove`: the golden path's middle verb.
// One dispatch rule, no flags needed on the golden path:
//   nothing built yet   → the first proof (health check → one validated
//                         workspace from the catalog)
//   agents built        → rebuild their proof (agents build: local engine,
//                         or the cloud factory in remote mode)
// `--watch` re-proves whenever a contract source changes (captured contracts
// under the interviews root, catalog specs) — the Vite loop. Watch runs stay
// on this machine (pure computation to the build boundary), so looping is
// safe by construction.
// `--live` adds the release-verification lane: run evalset cases through the
// deployed assist surface (or `--cassette` replay — zero cloud) and report
// per-case metrics, baseline conformance, and the live gate verdict. Live
// proof is explicit and cost-guarded — it never runs by default.
import { watch } from "node:fs";
import { defineCommand } from "citty";
import { contractWatchRoots } from "../lib/golden-path.mjs";
import { proveLive } from "../lib/live/prove-live.mjs";
import { evaluateLiveGate, liveGatePolicy } from "../lib/gates/live-gate.mjs";
import { DxError } from "../lib/errors/dx-error.mjs";
import { guarded, common, cfgFrom, emit, out, pc, ui, elog, core, renderChecks } from "./shared.mjs";

function renderProve(r) {
  out(ui.title("Prove"));
  if (r.path === "fresh") {
    out(pc.dim("  fresh machine — proving from scratch (health check → first agent build)"));
    if (!r.ok) {
      out(`  ${ui.glyph("blocked")} ${pc.red(`blocked at ${r.stage || "unknown"}`)}`);
      renderChecks((r.doctor?.checks || []).filter((check) => check.status !== "pass"));
      out(ui.next(typeof r.next === "string" ? r.next : "mise run setup"));
      return;
    }
    out(`  ${ui.glyph("passed")} ${pc.green(`proof passed → ${r.target}`)}`);
    if (r.workspace) {
      out(ui.kv([
        { key: "workspace", value: ui.cmd(r.workspace.id), note: r.workspace.path },
        r.workspace.manifest && ["manifest", pc.dim(r.workspace.manifest)],
        r.workspace.evalConfig && ["eval", pc.dim(r.workspace.evalConfig)],
      ]));
    }
    out(ui.next("ge handoff agents-cli", "hand the proven agent to the cloud"));
    return;
  }
  if (r.mode === "remote") {
    out(`  submitted ${pc.green(r.submitted)}  failed ${r.failed ? pc.red(r.failed) : "0"}  ${pc.dim("(cloud factory)")}`);
    out(ui.next("ge agents status --watch"));
    return;
  }
  out(`  ${ui.glyph("passed")} ${pc.green(`proof rebuilt → ${r.target} (build boundary)`)}`);
  out(ui.kv([
    ["workspaces", pc.dim(r.projectsDir)],
    r.selected && ["selected", pc.dim(String(r.selected))],
    r.run && ["run", pc.dim(r.run)],
  ]));
  out(ui.next("ge handoff agents-cli", "hand the proven agents to the cloud"));
}

// ── the live lane ───────────────────────────────────────────────────────────

function renderLiveProof(r) {
  out(ui.title("Live Proof", r.evalset.id));
  out(ui.kv([
    ["verdict", r.status === "passed" ? pc.green("PASS") : pc.red(r.status.toUpperCase())],
    ["cases", `${r.cases.filter((kase) => kase.ok).length}/${r.cases.length} pass${r.evalset.cases > r.evalset.selected ? pc.dim(` (of ${r.evalset.cases} in the evalset)`) : ""}`],
    ["target", pc.dim(r.target.engine)],
    ["source", pc.dim(r.source.replay ? "cassette replay" : "live assist surface")],
    ["baseline", r.conformance.baseline === "drifted" ? pc.red("drifted") : pc.dim(r.conformance.baseline)],
  ]));
  out(ui.section("Cases"));
  for (const kase of r.cases) {
    out(`  ${ui.glyph(kase.ok ? "passed" : "failed")} ${kase.id}  ${pc.dim(`${kase.turns} turn(s) · conformance ${kase.conformance}`)}`);
    for (const metric of kase.metrics.filter((m) => m.status === "fail" || m.status === "warning")) {
      out(`      ${metric.status === "fail" ? pc.red(metric.metric) : pc.yellow(metric.metric)}  ${pc.dim(metric.detail)}`);
    }
    for (const blocker of kase.blockers) out(`      ${pc.red(blocker.code || "blocked")}  ${pc.dim(blocker.what)}`);
  }
  for (const drifted of r.conformance.drift) {
    out(`  ${ui.glyph("warning")} drift in ${drifted.caseId}: ${pc.dim(drifted.drift.map((d) => d.field).join(", "))}`);
  }
  out(ui.kv([
    ["gate", r.gate.passed ? pc.green("live gate passed") : pc.red("live gate blocked")],
    ["artifacts", pc.dim([r.artifacts.proofResult, r.artifacts.matrix].join(" · "))],
  ]));
  out(ui.next(r.next));
}

async function runLiveProve(args) {
  if (!args.evalset) {
    throw new DxError("live proof needs an evalset", {
      where: "--evalset",
      why: "the live lane replays recorded eval cases against the deployed agent; there is no default suite yet",
      fix: "ge drive --record evals/recorded.evalset.json   (then: ge prove --live --evalset evals/recorded.evalset.json)",
    });
  }
  const result = await proveLive(cfgFrom(args), {
    evalset: args.evalset,
    cassette: args.cassette,
    maxCases: args.maxCases ? Number(args.maxCases) : undefined,
    maxTurns: args.maxTurns ? Number(args.maxTurns) : undefined,
    strictResponder: args.strictResponder,
    updateBaseline: args.updateBaseline,
    targetAgent: args.targetAgent,
    assistant: args.assistant,
    log: elog,
  });
  const gate = evaluateLiveGate(result, { ...liveGatePolicy(), strictResponder: !!args.strictResponder });
  emit(args, { ...result, gate }, renderLiveProof);
  if (!result.verdict.passed || !gate.passed) process.exitCode = 1;
}

export const prove = defineCommand({
  meta: { name: "prove", description: "Prove the current contracts end to end: fresh machine → health check + first agent build; agents built already → rebuild their proof. --live verifies the shipped agent through its assist surface; --watch re-proves on contract change" },
  args: {
    ...common,
    id: { type: "string", description: "Prove one use-case/workspace id (default: everything built, or the catalog canary when fresh)" },
    target: { type: "string", description: "Stop at this stage (default: validated when fresh, the build boundary otherwise)" },
    force: { type: "boolean", description: "Re-prove from scratch (wipes matching local workspaces first)" },
    preview: { type: "boolean", description: "Shortcut for --target previewed (may require project/Vertex auth)" },
    vertex: { type: "boolean", description: "Use Vertex-backed stages when the target reaches them" },
    warm: { type: "boolean", description: "Pre-warm the shared uv cache before running" },
    watch: { type: "boolean", description: "Watch contract sources and re-prove on change (local, pure computation — safe to loop)" },
    live: { type: "boolean", description: "Release verification: run evalset cases through the deployed agent's live assist surface (explicit, cost-guarded — never the default)" },
    evalset: { type: "string", description: "Evalset to prove live (ADK-compatible; record one with ge drive --record)" },
    cassette: { type: "string", description: "Replay a recorded cassette instead of live traffic (deterministic, no cloud)" },
    maxCases: { type: "string", description: "Cap the number of eval cases run live (cost guard)" },
    maxTurns: { type: "string", description: "Cap turns per case (cost guard)" },
    strictResponder: { type: "boolean", description: "Fail cases whose responder identity cannot be verified" },
    updateBaseline: { type: "boolean", description: "Accept the current live behavior as the new conformance baseline" },
    targetAgent: { type: "string", description: "Expected responding agent id (asserted against the stream)" },
    assistant: { type: "string", description: "Assistant id on the engine (default default_assistant) — prove any deployed agent, factory-built or not" },
  },
  run: guarded(async ({ args }) => {
    if (args.live) return runLiveProve(args);
    const opts = { id: args.id, target: args.target, force: args.force, vertex: args.vertex, warm: args.warm, preview: args.preview, log: elog };
    if (!args.watch) {
      const res = await core.prove(cfgFrom(args), opts);
      emit(args, res, renderProve);
      if (res.ok === false) process.exitCode = 1;
      return;
    }

    // Watch loop: force local mode (the build boundary makes looping safe;
    // remote submissions must stay deliberate), debounce bursts, never let one
    // failed proof kill the loop — the next save gets a fresh verdict.
    const cfg = { ...cfgFrom(args), mode: "local" };
    const roots = contractWatchRoots(core.REPO_ROOT);
    const runOnce = async () => {
      try {
        const res = await core.prove(cfg, opts);
        emit(args, res, renderProve);
      } catch (e) {
        process.stderr.write(pc.red(`✗ ${e?.message || e}`) + "\n");
        if (e?.fix || e?.hint) process.stderr.write(ui.fixLine(e.fix || e.hint, 2) + "\n");
      }
    };
    await runOnce();
    if (!roots.length) {
      out(`\n  ${ui.glyph("warning")} ${pc.yellow("nothing to watch: no contract sources found (capture one first: ge capture)")}`);
      return;
    }
    out(pc.dim(`\n  watching ${roots.length} contract root(s) — save a contract to re-prove (ctrl-c to stop)`));
    let timer = null;
    let running = false;
    let dirty = false;
    const trigger = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(async () => {
        if (running) { dirty = true; return; }
        running = true;
        do {
          dirty = false;
          out(pc.dim("\n  contract changed — re-proving…"));
          await runOnce();
        } while (dirty);
        running = false;
        out(pc.dim("  watching (ctrl-c to stop)"));
      }, 400);
    };
    for (const root of roots) watch(root, { recursive: true }, trigger);
    await new Promise(() => {}); // hold the loop open until ctrl-c
  }),
});
