// tools/ge/agents.mjs — `ge agents build|resume|status|logs|sync`.
// Moved verbatim out of tools/ge.mjs; `resume` added later (ADR 0001's
// pipeline state machine surfaced as a recovery verb). The release verb is
// `ge handoff` (tools/ge/handoff.mjs).
import { defineCommand } from "citty";
import { groupResumeActions } from "../lib/agents-resume.mjs";
import { guarded, common, cfgFrom, emit, out, pc, elog, core, modeOf, LOCAL_BUILD_BOUNDARY } from "./shared.mjs";

// One render + poll loop shared by `ge agents status --watch` and
// `ge agents build --watch`, so kicking off a remote build and watching it
// land is a single command instead of a remembered two-step.
function renderStatusBoard(r) {
  process.stdout.write("\x1bc");
  out(pc.bold(`Status — ${r.total} runs  ${new Date().toISOString()}`));
  out(`  ${pc.green("done")} ${r.tally.done}   ${pc.cyan("running")} ${r.tally.running}   ${pc.yellow("queued")} ${r.tally.queued}   ${pc.red("failed")} ${r.tally.failed}   unknown ${r.tally.unknown}`);
  out(pc.dim("  by stage: " + Object.entries(r.stages).map(([k, v]) => `${k}:${v}`).join("  ")));
}

async function watchStatusUntilTerminal(cfg, { noProxy } = {}) {
  for (;;) {
    const r = await core.status(cfg, { noProxy });
    renderStatusBoard(r);
    if (r.terminal) {
      out(pc.green("\nAll runs terminal."));
      if (r.tally.failed) out(pc.dim("  next: ge agents resume   (retry failed stages from the ledger)"));
      return r;
    }
    await new Promise((s) => setTimeout(s, 15000));
  }
}

const agentsBuild = defineCommand({
  meta: { name: "build", description: "Build agents. Uses the active mode (ge mode); --local/--remote override" },
  args: { ...common, canary: { type: "boolean", description: "Scope: one canary agent" }, all: { type: "boolean", description: "Scope: the whole fleet" }, dept: { type: "string", description: "Scope: one department" }, ids: { type: "string", description: "Scope: comma-separated agent/workspace ids" }, concurrency: { type: "string", description: "Parallel remote submissions (default 2)" }, force: { type: "boolean", description: "Rebuild/resubmit even if already completed (local: wipes the selected workspaces first)" }, "no-proxy": { type: "boolean", description: "Call the gateway directly over HTTPS instead of the gcloud run proxy tunnel" }, local: { type: "boolean", description: "Override: run on this machine via the harness" }, remote: { type: "boolean", description: "Override: submit to the cloud factory" }, limit: { type: "string", description: "Max workspaces to build (local)" }, target: { type: "string", description: `Harness target (local; default ${LOCAL_BUILD_BOUNDARY})` }, vertex: { type: "boolean", description: "Use Vertex for local harness review/preview stages (default true)" }, "no-vertex": { type: "boolean", description: "Disable Vertex-backed harness stages (negates --vertex; same as --vertex=false)" }, location: { type: "string", description: "Vertex/GenAI location for local harness stages" }, model: { type: "string", description: "Model for harness review/refine + generated agents (local and remote)" }, "max-output-tokens": { type: "string", description: "Override generated-agent max_output_tokens (local and remote); default unset = model default" }, "no-refine": { type: "boolean", description: "Skip the cloud Antigravity refine stage (REFINE=0)" }, warm: { type: "boolean", description: "Pre-warm the shared uv cache before running (local)" }, watch: { type: "boolean", description: "Remote: after submitting, watch run status until all runs are terminal" } },
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
        out(pc.dim("  next: ge handoff agents-cli   (cloud: load_data→deploy→register→publish)   ·   ge agents sync --push   (push code)"));
      });
      return;
    }
    const refine = !args["no-refine"] && process.env.REFINE !== "0";
    const res = await core.provision(cfg, { scope, ids: args.ids, dept: args.dept, concurrency: args.concurrency || "2", force: args.force, noProxy: args["no-proxy"], refine, model: args.model, maxOutputTokens: args["max-output-tokens"], log: elog });
    emit(args, res, (r) => {
      out(`\nSubmitted ${pc.green(r.submitted)}  failed ${r.failed ? pc.red(r.failed) : "0"}${r.note ? pc.dim("  " + r.note) : ""}`);
      if (r.submitted && !args.watch) out(pc.dim("  next: ge agents status --watch   (track the submitted runs to completion)"));
    });
    if (args.watch && !args.json && res.submitted) {
      await watchStatusUntilTerminal(cfg, { noProxy: args["no-proxy"] });
    }
  }),
});

const agentsStatus = defineCommand({
  meta: { name: "status", description: "Poll submitted runs (stage tally)" },
  args: { ...common, watch: { type: "boolean", description: "Re-poll every 15s until all runs are terminal" }, "no-proxy": { type: "boolean", description: "Call the gateway directly over HTTPS instead of the gcloud run proxy tunnel" } },
  run: guarded(async ({ args }) => {
    if (args.watch && !args.json) {
      await watchStatusUntilTerminal(cfgFrom(args), { noProxy: args["no-proxy"] });
      return;
    }
    const res = await core.status(cfgFrom(args), { noProxy: args["no-proxy"] });
    emit(args, res, (r) => {
      renderStatusBoard(r);
      if (r.tally.failed) out(pc.dim("\n  next: ge agents resume   (retry failed stages from the ledger)   ·   ge agents logs <runId> --stage <stage>"));
    });
  }),
});

const agentsLogs = defineCommand({
  meta: { name: "logs", description: "Pretty-print a stage's result + errors" },
  args: { ...common, runId: { type: "positional", required: true, description: "Run id (from ge agents status / the ledger)" }, stage: { type: "string", description: "Stage result to print (default validate)" }, item: { type: "string", description: "Work item id within the run" } },
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
  args: { ...common, ids: { type: "string", description: "Comma-separated agent/workspace ids (default: all syncable workspaces)" }, push: { type: "boolean", description: "git push after committing" }, force: { type: "boolean", description: "Re-download/re-sync even if the run was already synced" }, "no-commit": { type: "boolean", description: "Copy the code but skip the git commit" }, local: { type: "boolean", description: "Override: sync locally-generated workspaces" }, "remote-mode": { type: "boolean", description: "Override: pull from GCS (cloud mode)" }, remote: { type: "string", description: "Push to a specific git remote/URL (the repo the agent code must sit in)" }, create: { type: "boolean", description: "Create the Cloud Source repo if it doesn't exist (local mode)" } },
  run: guarded(async ({ args }) => {
    const cfg = cfgFrom(args);
    const mode = args["remote-mode"] ? "remote" : args.local ? "local" : cfg.mode || "local";
    if (mode === "local") {
      const res = core.syncLocal(cfg, { ids: args.ids, remote: args.remote, commit: !args["no-commit"], push: args.push, create: args.create, log: elog });
      emit(args, res, (r) => out(`\nSynced ${pc.green(r.synced)} local workspace(s)${r.repo ? pc.dim(" → " + r.repo) : ""}${r.pushed ? pc.dim(" (pushed)") : ""}`));
      return;
    }
    const res = await core.sync(cfgFrom(args), { ids: args.ids, force: args.force, commit: !args["no-commit"], push: args.push, log: elog });
    emit(args, res, (r) => out(`\nSynced ${pc.green(r.synced)}  failed ${r.failed}${r.committed ? pc.dim("  (committed)") : ""}${r.pushed ? pc.dim(" (pushed)") : ""}`));
  }),
});

const agentsResume = defineCommand({
  meta: { name: "resume", description: "Resume interrupted/failed builds from the ledger: retry failed stages, finish local work, hand off past the boundary" },
  args: {
    ...common,
    ids: { type: "string", description: "Only resume these comma-separated use-case/workspace ids" },
    target: { type: "string", description: `Target stage (default: ${LOCAL_BUILD_BOUNDARY} in local mode, published in remote mode)` },
    local: { type: "boolean", description: "Override: plan against local mode" },
    remote: { type: "boolean", description: "Override: plan against remote mode" },
    run: { type: "boolean", description: "Execute the resume plan (default: print it)" },
  },
  run: guarded(async ({ args }) => {
    const cfg = cfgFrom(args);
    const mode = modeOf(args, cfg);
    const target = args.target || (mode === "local" ? LOCAL_BUILD_BOUNDARY : "published");
    let rows = await core.ledgerPlan({ targetStage: target, mode });
    if (args.ids) {
      const wanted = new Set(String(args.ids).split(",").map((id) => id.trim()).filter(Boolean));
      rows = rows.filter((row) => wanted.has(row.useCaseId) || wanted.has(row.workspaceId));
    }
    const plan = groupResumeActions(rows);
    const result = { kind: "ge.agents.resume", mode, targetStage: target, done: plan.done, actionable: plan.actionable, executed: !!args.run, groups: plan.groups.map(({ items, ...group }) => ({ ...group, count: items.length })) };

    if (!args.run) {
      emit(args, result, (r) => {
        out(pc.bold("\nResume Plan"));
        out(`  mode      ${pc.cyan(r.mode)}   target ${pc.cyan(r.targetStage)}`);
        out(`  items     ${pc.green(`${r.done} at target`)} · ${r.actionable ? pc.yellow(`${r.actionable} actionable`) : "0 actionable"}`);
        if (!r.groups.length) {
          out(pc.dim("\n  nothing to resume — every ledger item is at its target stage."));
          out(pc.dim("  (empty ledger? run a build first, or `ge ledger backfill`)"));
          return;
        }
        for (const group of r.groups) {
          out(pc.bold(`\n  ${group.label}`) + pc.dim(`  — ${group.detail}`));
          out(`  ${pc.dim("$")} ${group.command}`);
        }
        out(pc.dim("\n  next: ge agents resume --run   (execute this plan in order)"));
      });
      return;
    }

    const executed = [];
    for (const group of plan.groups) {
      elog(`${group.label}: ${group.detail}`);
      if (group.action === "build_local") {
        executed.push({ action: group.action, result: await core.provisionLocal(cfg, { ids: group.useCaseIds.join(","), target, log: elog }) });
      } else if (group.action === "handoff") {
        executed.push({ action: group.action, result: await core.handoff(cfg, { ids: group.workspaceIds.join(","), startStage: "load_data", targetStage: "publish_enterprise", concurrency: "2", log: elog }) });
      } else if (group.action === "advance_remote") {
        executed.push({ action: group.action, result: await core.provision(cfg, { ids: group.useCaseIds.join(","), concurrency: "2", log: elog }) });
      }
    }
    emit(args, { ...result, executed: true, results: executed }, (r) => {
      if (!plan.groups.length) { out(pc.dim("\nnothing to resume — every ledger item is at its target stage.")); return; }
      out(pc.green(`\n✓ resume executed: ${plan.groups.map((group) => `${group.label.toLowerCase()} (${group.items.length})`).join(" · ")}`));
      out(pc.dim(`  next: ge agents status${mode === "remote" ? " --watch" : ""}   ·   ge ledger plan`));
    });
  }),
});

export const agents = defineCommand({ meta: { name: "agents", description: "Agent lifecycle: build · resume · status · logs · sync (release proven agents with `ge handoff`)" }, subCommands: { build: agentsBuild, resume: agentsResume, status: agentsStatus, logs: agentsLogs, sync: agentsSync } });
