// tools/ge/devex.mjs — `ge devex check`: the fast read-only DevEx gate.
// (The one-command proof lives at `ge prove` — tools/ge/prove.mjs.)
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, ui, elog, core, renderChecks } from "./shared.mjs";

const devexCheck = defineCommand({
  meta: { name: "check", description: "Fast DevEx gate: local doctor, docs links, and workspace manifest contracts" },
  args: {
    ...common,
    id: { type: "string", description: "Workspace or use-case id to check (default: generated use-case workspaces)" },
    "all-workspaces": { type: "boolean", description: "Also check scratch/test workspaces without a use-case id" },
    "no-docs": { type: "boolean", description: "Skip local docs link checks" },
    "no-local": { type: "boolean", description: "Skip local toolchain doctor checks" },
    "no-strict-workspaces": { type: "boolean", description: "Warn instead of fail on missing generated workspace files" },
  },
  run: guarded(({ args }) => {
    const res = core.devexCheck(cfgFrom(args), {
      ids: args.id || "",
      allWorkspaces: args["all-workspaces"],
      strictWorkspaces: !args["no-strict-workspaces"],
      docs: !args["no-docs"],
      local: !args["no-local"],
    });
    emit(args, res, (r) => {
      out(ui.title("DevEx Check"));
      out(`  ${r.ok ? `${ui.glyph("passed")} ${pc.green("passed")}` : `${ui.glyph("failed")} ${pc.red("failed")}`}`);

      if (r.doctor) {
        out(ui.section("Local Doctor"));
        const notable = r.doctor.checks.filter((check) => check.status !== "pass");
        if (!notable.length) out(`  ${ui.glyph("passed")} ${pc.green("all hard local checks passed")}`);
        renderChecks(notable);
      }

      if (r.docs) {
        out(ui.section("Docs"));
        out(`  ${ui.glyph(r.docs.ok ? "passed" : "failed")} ${r.docs.summary}`);
        for (const finding of (r.docs.findings || []).slice(0, 8)) out(`      ${finding.path} ${pc.dim(finding.link)}`);
        if ((r.docs.findings || []).length > 8) out(pc.dim(`      ...${r.docs.findings.length - 8} more`));
      }

      out(ui.section("Workspace Contracts"));
      out(`  checked ${r.workspaces.checked} · failed ${r.workspaces.failed} · warnings ${r.workspaces.warnings}`);
      for (const workspace of r.workspaces.items.filter((item) => !item.ok || item.warnings).slice(0, 8)) {
        out(`  ${ui.glyph(workspace.ok ? "warning" : "failed")} ${workspace.id} ${pc.dim(workspace.path)}`);
        renderChecks(workspace.checks.filter((item) => item.status !== "pass").slice(0, 5), { indent: 6 });
      }

      if (r.next?.length) {
        out(ui.section("Next"));
        out(ui.nextList(r.next));
      }
    });
    if (!res.ok) process.exitCode = 1;
  }),
});

export const devex = defineCommand({
  meta: { name: "devex", description: "Developer-experience checks (fast read-only gate: doctor + docs + workspace contracts)" },
  subCommands: { check: devexCheck },
});
