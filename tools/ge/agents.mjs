// tools/ge/agents.mjs — `ge agents build|ship|status|fleet|logs|sync`. Moved
// verbatim out of tools/ge.mjs.
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, elog, core, modeOf, LOCAL_BUILD_BOUNDARY } from "./shared.mjs";

const agentsBuild = defineCommand({
  meta: { name: "build", description: "Build agents. Uses the active mode (ge mode); --local/--remote override" },
  args: { ...common, canary: { type: "boolean" }, all: { type: "boolean" }, dept: { type: "string" }, ids: { type: "string" }, concurrency: { type: "string" }, force: { type: "boolean" }, "no-proxy": { type: "boolean" }, local: { type: "boolean", description: "Override: run on this machine via the harness" }, remote: { type: "boolean", description: "Override: submit to the cloud factory" }, limit: { type: "string" }, target: { type: "string", description: `Harness target (local; default ${LOCAL_BUILD_BOUNDARY})` }, vertex: { type: "boolean", description: "Use Vertex for local harness review/preview stages (default true)" }, "no-vertex": { type: "boolean", description: "Disable Vertex-backed harness stages (negates --vertex; same as --vertex=false)" }, location: { type: "string", description: "Vertex/GenAI location for local harness stages" }, model: { type: "string", description: "Model for harness review/refine + generated agents (local and remote)" }, "max-output-tokens": { type: "string", description: "Override generated-agent max_output_tokens (local and remote); default unset = model default" }, "no-refine": { type: "boolean", description: "Skip the cloud Antigravity refine stage (REFINE=0)" }, warm: { type: "boolean", description: "Pre-warm the shared uv cache before running (local)" } },
  run: guarded(async ({ args }) => {
    const cfg = cfgFrom(args);
    const scope = args.canary ? "canary" : args.all ? "all" : undefined;
    if (modeOf(args, cfg) === "local") {
      const target = args.target || LOCAL_BUILD_BOUNDARY; // stop at the build boundary by default
      const vertex = args.vertex === false || args["no-vertex"] === true ? false : true;
      const res = await core.provisionLocal(cfg, { scope, ids: args.ids, dept: args.dept, limit: args.limit, target, vertex, location: args.location, model: args.model, maxOutputTokens: args["max-output-tokens"], warm: args.warm, force: args.force, log: elog });
      emit(args, res, (r) => {
        out(pc.green(`\n✓ local build → ${r.target} (build boundary). Workspaces in ${r.projectsDir}.`));
        if (r.selected) out(pc.dim(`  selected: ${r.selected}`));
        if (r.plan) out(pc.dim(`  plan: ${r.plan}`));
        if (r.run) out(pc.dim(`  run: ${r.run}`));
        if (r.events) out(pc.dim(`  events: ${r.events}`));
        out(pc.dim("  next: ge agents ship   (cloud: load_data→deploy→register→publish)   ·   ge agents sync --push   (push code)"));
      });
      return;
    }
    const refine = !args["no-refine"] && process.env.REFINE !== "0";
    const res = await core.provision(cfg, { scope, ids: args.ids, dept: args.dept, concurrency: args.concurrency || "2", force: args.force, noProxy: args["no-proxy"], refine, model: args.model, maxOutputTokens: args["max-output-tokens"], log: elog });
    emit(args, res, (r) => {
      out(`\nSubmitted ${pc.green(r.submitted)}  failed ${r.failed ? pc.red(r.failed) : "0"}${r.note ? pc.dim("  " + r.note) : ""}`);
      if (r.submitted) out(pc.dim("  next: ge agents status --watch   (track the submitted runs to completion)"));
    });
  }),
});

const agentsStatus = defineCommand({
  meta: { name: "status", description: "Poll submitted runs (stage tally)" },
  args: { ...common, watch: { type: "boolean" }, "no-proxy": { type: "boolean" } },
  run: guarded(async ({ args }) => {
    const render = (r) => {
      if (args.json) return;
      process.stdout.write("\x1bc");
      out(pc.bold(`Status — ${r.total} runs  ${new Date().toISOString()}`));
      out(`  ${pc.green("done")} ${r.tally.done}   ${pc.cyan("running")} ${r.tally.running}   ${pc.yellow("queued")} ${r.tally.queued}   ${pc.red("failed")} ${r.tally.failed}   unknown ${r.tally.unknown}`);
      out(pc.dim("  by stage: " + Object.entries(r.stages).map(([k, v]) => `${k}:${v}`).join("  ")));
    };
    if (args.watch && !args.json) {
      for (;;) { const r = await core.status(cfgFrom(args), { noProxy: args["no-proxy"] }); render(r); if (r.terminal) { out(pc.green("\nAll runs terminal.")); break; } await new Promise((s) => setTimeout(s, 15000)); }
      return;
    }
    const res = await core.status(cfgFrom(args), { noProxy: args["no-proxy"] });
    emit(args, res, render);
  }),
});

const agentsFleet = defineCommand({
  meta: { name: "fleet", description: "Show fleet pipeline health, bottlenecks, and repair owners" },
  args: { ...common, limit: { type: "string" } },
  run: guarded(async ({ args }) => {
    const res = await core.fleetStatus(cfgFrom(args));
    emit(args, res, (r) => {
      const health = r.health || {};
      out(pc.bold(`\nFleet Health — ${r.total} agents`));
      out(`  ${pc.red("blocked")} ${health.blocked || 0}   ${pc.yellow("repairable")} ${health.repairable || 0}`);
      if (health.byStage) {
        out(pc.dim("\n  by stage"));
        for (const stage of health.stages || Object.keys(health.byStage)) {
          out(`  ${String(stage).padEnd(12)} ${health.byStage[stage] || 0}`);
        }
      }
      if (health.byOwner) {
        out(pc.dim("\n  by owner"));
        for (const [owner, count] of Object.entries(health.byOwner).sort((a, b) => b[1] - a[1])) {
          out(`  ${String(owner).padEnd(12)} ${count}`);
        }
      }
      const bottlenecks = (health.bottlenecks || []).slice(0, Number(args.limit || 8));
      if (bottlenecks.length) {
        out(pc.dim("\n  top bottlenecks"));
        for (const item of bottlenecks) {
          out(`  ${pc.yellow(String(item.count).padStart(3))} ${String(item.stage).padEnd(10)} ${pc.cyan(item.blockerId)} ${pc.dim(item.message)}`);
          if (item.actionPlan?.commands?.[0]) out(pc.dim(`      action: ${item.actionPlan.label} · ${item.actionPlan.commands[0]}`));
          if (item.agentIds?.length) out(pc.dim(`      ${item.agentIds.join(", ")}`));
        }
      }
      out(pc.dim("\n  next: ge runtime start autopilot --ids <comma-ids> --stage preview"));
    });
  }),
});

const agentsLogs = defineCommand({
  meta: { name: "logs", description: "Pretty-print a stage's result + errors" },
  args: { ...common, runId: { type: "positional", required: true }, stage: { type: "string" }, item: { type: "string" } },
  run: guarded(({ args }) => {
    const res = core.logs(cfgFrom(args), { runId: args.runId, stage: args.stage || "validate", item: args.item });
    emit(args, res, (r) => {
      if (!r.found) { out(pc.yellow(`no result at ${r.uri}`)); r.available?.forEach((l) => out(pc.dim("  " + l))); return; }
      const x = r.result; if (!x) { out(r.raw || ""); return; }
      out(`\nstage ${pc.cyan(x.stage)}  status ${x.status === "failed" ? pc.red(x.status) : pc.green(x.status)}`);
      if (x.error) out(`error: ${pc.red(x.error)}`);
      for (const o of x.outputs || []) if (o.code !== 0 || (o.stderr || "").trim()) {
        out(pc.dim(`\n$ ${o.cmd} ${(o.args || []).join(" ")}  (exit ${o.code})`));
        if (o.stderr) out(o.stderr.slice(-3000));
        if (o.stdout && o.code !== 0) out(pc.dim(o.stdout.slice(-1500)));
      }
      if (x.logUrl) out(`\nCloud Build log: ${pc.cyan(x.logUrl)}`);
    });
  }),
});

const agentsSync = defineCommand({
  meta: { name: "sync", description: "Generated agent code → generated-agents/ → git (cloud: GCS; --local: harness workspaces)" },
  args: { ...common, ids: { type: "string", description: "Comma-separated agent/workspace ids (default: all syncable workspaces)" }, push: { type: "boolean" }, force: { type: "boolean" }, "no-commit": { type: "boolean" }, local: { type: "boolean", description: "Override: sync locally-generated workspaces" }, "remote-mode": { type: "boolean", description: "Override: pull from GCS (cloud mode)" }, remote: { type: "string", description: "Push to a specific git remote/URL (the repo the agent code must sit in)" }, create: { type: "boolean", description: "Create the Cloud Source repo if it doesn't exist (local mode)" } },
  run: guarded(async ({ args }) => {
    const cfg = cfgFrom(args);
    const mode = args["remote-mode"] ? "remote" : args.local ? "local" : cfg.mode || "remote";
    if (mode === "local") {
      const res = core.syncLocal(cfg, { ids: args.ids, remote: args.remote, commit: !args["no-commit"], push: args.push, create: args.create, log: elog });
      emit(args, res, (r) => out(`\nSynced ${pc.green(r.synced)} local workspace(s)${r.repo ? pc.dim(" → " + r.repo) : ""}${r.pushed ? pc.dim(" (pushed)") : ""}`));
      return;
    }
    const res = await core.sync(cfgFrom(args), { ids: args.ids, force: args.force, commit: !args["no-commit"], push: args.push, log: elog });
    emit(args, res, (r) => out(`\nSynced ${pc.green(r.synced)}  failed ${r.failed}${r.committed ? pc.dim("  (committed)") : ""}${r.pushed ? pc.dim(" (pushed)") : ""}`));
  }),
});

const agentsShip = defineCommand({
  meta: { name: "ship", description: "Hand off locally-built agents to the cloud: upload + run deploy→register→publish remotely" },
  args: { ...common, ids: { type: "string", description: "Comma-separated local workspace ids (default: all built locally)" }, "start-stage": { type: "string", description: "Stage to start at remotely (default load_data)" }, "target-stage": { type: "string", description: "Stage to stop at (default publish_enterprise)" }, concurrency: { type: "string" }, "no-proxy": { type: "boolean" } },
  run: guarded(async ({ args }) => {
    const res = await core.ship(cfgFrom(args), { ids: args.ids, startStage: args["start-stage"] || "load_data", targetStage: args["target-stage"] || "publish_enterprise", concurrency: args.concurrency || "2", noProxy: args["no-proxy"], log: elog });
    emit(args, res, (r) => out(`\nShipped ${pc.green(r.submitted)}  failed ${r.failed ? pc.red(r.failed) : "0"}  ${pc.dim(`(${r.startStage} → ${r.targetStage}, remote)`)}`));
  }),
});

export const agents = defineCommand({ meta: { name: "agents", description: "Agent lifecycle: build · ship · status · fleet · logs · sync" }, subCommands: { build: agentsBuild, ship: agentsShip, status: agentsStatus, fleet: agentsFleet, logs: agentsLogs, sync: agentsSync } });
