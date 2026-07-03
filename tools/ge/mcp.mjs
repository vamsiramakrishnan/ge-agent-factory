// tools/ge/mcp.mjs — `ge mcp deploy|doctor` (tool plane). Moved verbatim out
// of tools/ge.mjs.
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, ui, blog, core, renderChecks, announceExpectedDuration } from "./shared.mjs";

const mcpDeployCmd = defineCommand({
  meta: { name: "deploy", description: "Deploy the per-department custom MCP services to Cloud Run (fleet-level)" },
  args: { ...common },
  run: guarded(({ args }) => {
    announceExpectedDuration("mcp.deploy");
    const res = core.mcpDeploy(cfgFrom(args), { log: blog });
    emit(args, res, (r) => {
      out(`\n${ui.glyph("passed")} ${pc.green("MCP services deployed:")}`);
      out(ui.kv(Object.entries(r.services).map(([dept, url]) => [dept, pc.green(url)])));
    });
  }),
});

const mcpDoctorCmd = defineCommand({
  meta: { name: "doctor", description: "Check the per-department MCP services + Agent Registry readiness" },
  args: { ...common },
  run: guarded(({ args }) => {
    const res = core.mcpDoctor(cfgFrom(args));
    emit(args, res, (r) => {
      out(ui.title("MCP doctor", `${r.project} (${r.region})`) + "\n");
      renderChecks(r.checks);
      out(r.fails === 0
        ? `\n${ui.glyph("passed")} ${pc.green("All hard checks passed.")}`
        : `\n${ui.glyph("failed")} ${pc.red(`${r.fails} hard failure(s).`)}`);
    });
  }),
});

export const mcp = defineCommand({ meta: { name: "mcp", description: "Tool plane (per-department custom MCP services): deploy · doctor" }, subCommands: { deploy: mcpDeployCmd, doctor: mcpDoctorCmd } });
