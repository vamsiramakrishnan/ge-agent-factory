// tools/ge/mcp.mjs — `ge mcp deploy|doctor` (tool plane). Moved verbatim out
// of tools/ge.mjs.
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, blog, core, renderChecks, announceExpectedDuration } from "./shared.mjs";

const mcpDeployCmd = defineCommand({
  meta: { name: "deploy", description: "Deploy the per-department custom MCP services to Cloud Run (fleet-level)" },
  args: { ...common },
  run: guarded(({ args }) => {
    announceExpectedDuration("mcp.deploy");
    const res = core.mcpDeploy(cfgFrom(args), { log: blog });
    emit(args, res, (r) => { out(pc.green("\n✓ MCP services deployed:")); for (const [dept, url] of Object.entries(r.services)) out(`  ${dept.padEnd(12)} ${pc.green(url)}`); });
  }),
});

const mcpDoctorCmd = defineCommand({
  meta: { name: "doctor", description: "Check the per-department MCP services + Agent Registry readiness" },
  args: { ...common },
  run: guarded(({ args }) => {
    const res = core.mcpDoctor(cfgFrom(args));
    emit(args, res, (r) => { out(pc.bold(`\nMCP doctor — ${r.project} (${r.region})\n`)); renderChecks(r.checks); out(r.fails === 0 ? pc.green("\nAll hard checks passed.") : pc.red(`\n${r.fails} hard failure(s).`)); });
  }),
});

export const mcp = defineCommand({ meta: { name: "mcp", description: "Tool plane (per-department custom MCP services): deploy · doctor" }, subCommands: { deploy: mcpDeployCmd, doctor: mcpDoctorCmd } });
