// tools/ge/orientation.mjs — top-level orientation/lifecycle commands:
// doctor, up, cutover, mode, config explain. Moved verbatim out of
// tools/ge.mjs. (The bare zero-args status board stays in tools/ge.mjs
// itself — it's the root command's own `run`, not a noun group.)
import { defineCommand } from "citty";
import { common, cfgFrom, emit, out, pc, core, ICON, blog, elog } from "./shared.mjs";

export const cutover = defineCommand({
  meta: { name: "cutover", description: "Adopt a hand-managed project into Terraform (plan by default; --apply to run)" },
  args: { ...common, apply: { type: "boolean", description: "Execute the steps (default: print the plan)" } },
  async run({ args }) {
    const res = await core.cutover(cfgFrom(args), { apply: args.apply, log: elog });
    emit(args, res, (r) => {
      if (r.mode === "plan") {
        out(pc.bold(`\nCutover (Terraform adopt) — ${r.project}`));
        out(pc.dim("  import blocks written:"));
        for (const im of r.imports) out(`  ${pc.dim("•")} ${im.to} ${pc.dim("← " + im.id)}`);
        out(pc.yellow("\n" + r.note));
      } else {
        out(pc.green(`\n✓ cutover applied (terraform) — ${r.health.fails} doctor failure(s).`));
      }
    });
  },
});

export const mode = defineCommand({
  meta: { name: "mode", description: "Show or set the operating mode: local (build on this machine) | remote (cloud factory)" },
  args: { ...common, set: { type: "positional", required: false, description: "local | remote" } },
  run({ args }) {
    if (args.set) {
      const res = core.setMode(args.set);
      emit(args, res, (r) => out(pc.green(`✓ mode = ${pc.bold(r.mode)}`)));
      return;
    }
    const cfg = cfgFrom(args);
    const res = { mode: cfg.mode || "remote" };
    emit(args, res, (r) => {
      out(pc.bold(`\nmode: ${pc.cyan(r.mode)}`));
      out(r.mode === "local"
        ? pc.dim("  this machine runs generate → validate (build boundary); deploy/register/publish are cloud steps.")
        : pc.dim("  this machine submits + observes; the cloud factory builds, deploys, and publishes."));
      out(pc.dim("  set with: ge mode local | ge mode remote"));
    });
  },
});

export const doctor = defineCommand({
  meta: { name: "doctor", description: "Unified health: toolchain · factory · data plane · tool plane (--local/--cloud/--data/--mcp to filter). Narrower scoped checks: `ge data doctor` (data plane only), `ge mcp doctor` (tool plane / MCP services only)." },
  args: { ...common, local: { type: "boolean", description: "Include the uv toolchain section" }, cloud: { type: "boolean", description: "Only the factory section" }, data: { type: "boolean", description: "Only the data plane section" }, mcp: { type: "boolean", description: "Only the tool plane section" }, command: { type: "string", description: "Check readiness for a mutating command (up|data.up|mcp.deploy|agents.build|agents.build.local|agents.ship|agents.sync)" } },
  run({ args }) {
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
      out(pc.bold(`\nDoctor — ${r.project || "(no project)"} (${r.region})`));
      for (const s of r.sections) {
        out(pc.bold(`\n  ${s.name}` + (s.fails ? pc.red(`  (${s.fails} fail)`) : pc.green("  ✓")) ));
        for (const ch of s.checks) {
          out(`  ${ICON[ch.status]} ${ch.name.padEnd(30)} ${pc.dim(ch.detail)}`);
          if (ch.status !== "pass" && ch.fix) out(`      ${pc.dim("fix:")} ${ch.fix}`);
        }
      }
      out(r.fails === 0 ? pc.green("\nAll hard checks passed.") : pc.red(`\n${r.fails} hard failure(s).`));
    });
  },
});

export const up = defineCommand({
  meta: { name: "up", description: "Stand up the platform: infra + data + tool planes → unified doctor (--infra/--data/--mcp for one)" },
  args: { ...common, infra: { type: "boolean" }, data: { type: "boolean" }, mcp: { type: "boolean" } },
  async run({ args }) {
    const any = args.infra || args.data || args.mcp;
    const planes = any ? ["infra", "data", "mcp"].filter((p) => args[p]) : ["infra", "data", "mcp"];
    const res = await core.up(cfgFrom(args), { planes, log: blog });
    emit(args, res, (r) => {
      out(pc.green(`\n✓ up: ${r.planes.join(" + ")} — ${r.health.fails} doctor failure(s).`));
      out(pc.dim("Next: ge agents build --canary"));
    });
  },
});

const configExplain = defineCommand({
  meta: { name: "explain", description: "Show each config value and where it came from (flag · env · .ge.json · default)" },
  args: { ...common, projectNumber: { type: "string" }, gatewayUrl: { type: "string" }, geApp: { type: "string" }, mode: { type: "string" }, agentsRepo: { type: "string" }, bucket: { type: "string" } },
  run({ args }) {
    const res = core.explainLoadedConfig({
      project: args.project, projectNumber: args.projectNumber, agentIdentityOrgId: args.agentIdentityOrgId, region: args.region,
      bucket: args.bucket, gatewayUrl: args.gatewayUrl, geApp: args.geApp, mode: args.mode, agentsRepo: args.agentsRepo,
    });
    emit(args, res, (r) => {
      out(pc.bold("\nConfig (value ← source)"));
      for (const [name, field] of Object.entries(r)) {
        if (name === "_note") continue;
        const { value, source } = field;
        const v = value === undefined || value === "" ? pc.yellow("<unset>") : pc.cyan(String(value));
        out(`  ${name.padEnd(16)} ${v}  ${pc.dim("← " + source)}`);
      }
      if (r._note) out(pc.yellow(`\n  ⚠ ${r._note}`));
      out(pc.dim("\n  precedence: flag → env → .ge.json → default"));
    });
  },
});

export const config = defineCommand({ meta: { name: "config", description: "Operator config: explain (precedence/sources)" }, subCommands: { explain: configExplain } });
