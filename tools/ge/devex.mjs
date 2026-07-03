// tools/ge/devex.mjs — `ge devex check`: the fast read-only DevEx gate.
// (The one-command proof lives at `ge prove` — tools/ge/prove.mjs.)
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, elog, core, ICON } from "./shared.mjs";

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
      out(pc.bold("\nDevEx Check"));
      out(r.ok ? pc.green("  passed") : pc.red("  failed"));

      if (r.doctor) {
        out(pc.bold("\n  Local Doctor"));
        const notable = r.doctor.checks.filter((check) => check.status !== "pass");
        if (!notable.length) out(pc.green("  ✓ all hard local checks passed"));
        for (const check of notable) {
          out(`  ${ICON[check.status]} ${check.name.padEnd(30)} ${pc.dim(check.detail)}`);
          if (check.fix) out(`      ${pc.dim("fix:")} ${check.fix}`);
        }
      }

      if (r.docs) {
        out(pc.bold("\n  Docs"));
        out(`  ${r.docs.ok ? ICON.pass : ICON.fail} ${r.docs.summary}`);
        for (const finding of (r.docs.findings || []).slice(0, 8)) out(`      ${finding.path} ${pc.dim(finding.link)}`);
        if ((r.docs.findings || []).length > 8) out(pc.dim(`      ...${r.docs.findings.length - 8} more`));
      }

      out(pc.bold("\n  Workspace Contracts"));
      out(`  checked ${r.workspaces.checked} · failed ${r.workspaces.failed} · warnings ${r.workspaces.warnings}`);
      for (const workspace of r.workspaces.items.filter((item) => !item.ok || item.warnings).slice(0, 8)) {
        out(`  ${workspace.ok ? ICON.warn : ICON.fail} ${workspace.id} ${pc.dim(workspace.path)}`);
        for (const check of workspace.checks.filter((item) => item.status !== "pass").slice(0, 5)) {
          out(`      ${ICON[check.status]} ${check.name.padEnd(24)} ${pc.dim(check.detail)}`);
          if (check.fix) out(`        ${pc.dim("fix:")} ${check.fix}`);
        }
      }

      if (r.next?.length) {
        out(pc.bold("\n  Next"));
        for (const command of r.next) out(`  ${pc.dim("$")} ${command}`);
      }
    });
    if (!res.ok) process.exitCode = 1;
  }),
});

export const devex = defineCommand({
  meta: { name: "devex", description: "Developer-experience checks (fast read-only gate: doctor + docs + workspace contracts)" },
  subCommands: { check: devexCheck },
});
