// tools/ge/orientation.mjs — top-level orientation/lifecycle commands:
// doctor, up, cutover, mode, config explain. Moved verbatim out of
// tools/ge.mjs. (The bare zero-args status board stays in tools/ge.mjs
// itself — it's the root command's own `run`, not a noun group.)
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, ui, core, blog, elog, announceExpectedDuration, renderChecks } from "./shared.mjs";

export const cutover = defineCommand({
  meta: { name: "cutover", description: "Adopt a hand-managed project into Terraform (plan by default; --apply to run)" },
  args: { ...common, apply: { type: "boolean", description: "Execute the steps (default: print the plan)" } },
  run: guarded(async ({ args }) => {
    const res = await core.cutover(cfgFrom(args), { apply: args.apply, log: elog });
    emit(args, res, (r) => {
      if (r.mode === "plan") {
        out(ui.title("Cutover (Terraform adopt)", r.project));
        out(pc.dim("  import blocks written:"));
        for (const im of r.imports) out(`  ${pc.dim("•")} ${im.to} ${pc.dim("← " + im.id)}`);
        out(`\n${ui.glyph("warning")} ${pc.yellow(r.note)}`);
      } else {
        out(`\n${ui.glyph("passed")} ${pc.green(`cutover applied (terraform) — ${r.health.fails} doctor failure(s).`)}`);
      }
    });
  }),
});

export const mode = defineCommand({
  meta: { name: "mode", description: "Show or set the operating mode: local (build on this machine) | remote (cloud factory)" },
  args: { ...common, set: { type: "positional", required: false, description: "local | remote" } },
  run: guarded(({ args }) => {
    if (args.set) {
      const res = core.setMode(args.set);
      emit(args, res, (r) => out(`${ui.glyph("passed")} ${pc.green("mode =")} ${ui.cmd(r.mode)}`));
      return;
    }
    const cfg = cfgFrom(args);
    // Fallback mirrors the config contract's fail-safe default (local never
    // touches GCP) — see config-schema.mjs.
    const res = { mode: cfg.mode || "local" };
    emit(args, res, (r) => {
      out(ui.title(`Mode: ${r.mode}`));
      out(r.mode === "local"
        ? pc.dim("  this machine runs generate → validate (build boundary); deploy/register/publish are cloud steps.")
        : pc.dim("  this machine submits + observes; the cloud factory builds, deploys, and publishes."));
      out(`  ${pc.dim("set with:")} ${ui.cmd("ge mode local")} ${pc.dim("|")} ${ui.cmd("ge mode remote")}`);
    });
  }),
});

export const doctor = defineCommand({
  meta: { name: "doctor", description: "Unified health: toolchain · factory · data plane · tool plane (--local/--cloud/--data/--mcp to filter). Narrower scoped checks: `ge data doctor` (data plane only), `ge mcp doctor` (tool plane / MCP services only)." },
  args: { ...common, local: { type: "boolean", description: "Include the uv toolchain section" }, cloud: { type: "boolean", description: "Only the factory section" }, data: { type: "boolean", description: "Only the data plane section" }, mcp: { type: "boolean", description: "Only the tool plane section" }, command: { type: "string", description: "Check readiness for a mutating command (up|data.up|mcp.deploy|agents.build|agents.build.local|handoff|agents.sync|prove)" } },
  run: guarded(({ args }) => {
    const cfg = cfgFrom(args);
    const anyFilter = args.local || args.cloud || args.data || args.mcp;
    // Default sections follow the active mode: local → toolchain-first; remote → factory-first.
    // Data + tool plane are shared infra, shown in both.
    const opts = anyFilter
      ? { local: !!args.local, cloud: !!args.cloud, data: !!args.data, mcp: !!args.mcp, command: args.command }
      : (cfg.mode === "local"
          ? { local: true, cloud: false, data: true, mcp: true, command: args.command }
          : { local: false, cloud: true, data: true, mcp: true, command: args.command });
    const res = core.doctorAll(cfg, opts);
    emit(args, res, (r) => {
      out(ui.title("Doctor", `${r.project || "(no project)"} (${r.region})`));
      for (const s of r.sections) {
        out(ui.section(s.name, s.fails ? pc.red(`(${s.fails} fail)`) : ui.glyph("passed")));
        renderChecks(s.checks);
      }
      out(r.fails === 0
        ? `\n${ui.glyph("passed")} ${pc.green("All hard checks passed.")}`
        : `\n${ui.glyph("failed")} ${pc.red(`${r.fails} hard failure(s).`)}`);
    });
  }),
});

export const up = defineCommand({
  meta: { name: "up", description: "Stand up the platform: infra + data + tool planes → unified doctor (--infra/--data/--mcp for one)" },
  args: { ...common, infra: { type: "boolean", description: "Stand up the infra plane only (combinable with --data/--mcp)" }, data: { type: "boolean", description: "Stand up the data plane only (combinable with --infra/--mcp)" }, mcp: { type: "boolean", description: "Stand up the tool (MCP) plane only (combinable with --infra/--data)" } },
  run: guarded(async ({ args }) => {
    const any = args.infra || args.data || args.mcp;
    const planes = any ? ["infra", "data", "mcp"].filter((p) => args[p]) : ["infra", "data", "mcp"];
    announceExpectedDuration("up");
    const res = await core.up(cfgFrom(args), { planes, log: blog });
    emit(args, res, (r) => {
      out(`\n${ui.glyph("passed")} ${pc.green(`up: ${r.planes.join(" + ")} — ${r.health.fails} doctor failure(s).`)}`);
      out(ui.next("ge agents build --canary"));
    });
  }),
});

const configExplain = defineCommand({
  meta: { name: "explain", description: "Show each config value and where it came from (flag · env · .ge.json · default)" },
  args: { ...common, projectNumber: { type: "string", description: "GCP project number override" }, gatewayUrl: { type: "string", description: "Factory gateway URL override" }, geApp: { type: "string", description: "Gemini Enterprise app id override" }, mode: { type: "string", description: "Operating mode override (local|remote)" }, agentsRepo: { type: "string", description: "Generated-agents git repo override" }, bucket: { type: "string", description: "GCS bucket override" } },
  run: guarded(({ args }) => {
    const res = core.explainLoadedConfig({
      project: args.project, projectNumber: args.projectNumber, agentIdentityOrgId: args.agentIdentityOrgId, region: args.region,
      bucket: args.bucket, gatewayUrl: args.gatewayUrl, geApp: args.geApp, mode: args.mode, agentsRepo: args.agentsRepo,
    });
    emit(args, res, (r) => {
      out(ui.title("Config", "value ← source"));
      out(ui.kv(Object.entries(r)
        .filter(([name]) => name !== "_note")
        .map(([name, { value, source }]) => ({
          key: name,
          value: value === undefined || value === "" ? pc.yellow("<unset>") : ui.cmd(String(value)),
          note: "← " + source,
        }))));
      if (r._note) out(`\n  ${ui.glyph("warning")} ${pc.yellow(r._note)}`);
      out(pc.dim("\n  precedence: flag → env → .ge.json → default"));
    });
  }),
});

export const config = defineCommand({ meta: { name: "config", description: "Operator config: explain (precedence/sources)" }, subCommands: { explain: configExplain } });
