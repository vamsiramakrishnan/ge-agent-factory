// tools/ge/devex.mjs — `ge devex check|smoke`. Moved verbatim out of
// tools/ge.mjs.
import { defineCommand } from "citty";
import { common, cfgFrom, emit, out, pc, elog, core, ICON } from "./shared.mjs";

const devexSmoke = defineCommand({
  meta: { name: "smoke", description: "One-command local DevEx proof: doctor → local mode → canary workspace manifest" },
  args: {
    ...common,
    id: { type: "string", description: "Use-case id to build (default: catalog canary)" },
    target: { type: "string", description: "Local harness target (default validated; use previewed for full build boundary)" },
    preview: { type: "boolean", description: "Shortcut for --target previewed (may require project/Vertex auth)" },
    vertex: { type: "boolean", description: "Use Vertex-backed harness stages when target reaches them" },
    "no-vertex": { type: "boolean", description: "Disable Vertex-backed harness stages" },
    warm: { type: "boolean", description: "Pre-warm the shared uv cache before running" },
    force: { type: "boolean", description: "Regenerate matching local workspace(s) from scratch" },
  },
  async run({ args }) {
    const vertex = args["no-vertex"] ? false : args.preview ? true : !!args.vertex;
    const res = await core.devexSmoke(cfgFrom(args), {
      id: args.id,
      target: args.target || "validated",
      preview: args.preview,
      vertex,
      warm: args.warm,
      force: args.force,
      log: elog,
    });
    emit(args, res, (r) => {
      out(pc.bold("\nDevEx Smoke"));
      if (!r.ok) {
        out(pc.red(`  blocked at ${r.stage || "unknown"}`));
        for (const check of r.doctor?.checks || []) {
          if (check.status === "pass") continue;
          out(`  ${ICON[check.status]} ${check.name.padEnd(30)} ${pc.dim(check.detail)}`);
          if (check.fix) out(`      ${pc.dim("fix:")} ${check.fix}`);
        }
        out(pc.dim(`\n  next: ${r.next || "mise run setup"}`));
        return;
      }
      out(pc.green(`  passed → ${r.target}`));
      if (r.workspace) {
        out(`  workspace ${pc.cyan(r.workspace.id)} ${pc.dim(r.workspace.path)}`);
        if (r.workspace.manifest) out(`  manifest  ${pc.dim(r.workspace.manifest)}`);
        if (r.workspace.evalConfig) out(`  eval      ${pc.dim(r.workspace.evalConfig)}`);
      }
      if (r.build?.run) out(`  run       ${pc.dim(r.build.run)}`);
      if (r.next?.length) {
        out(pc.bold("\n  Next"));
        for (const command of r.next.slice(0, 4)) out(`  ${pc.dim("$")} ${command}`);
      }
    });
    if (!res.ok) process.exitCode = 1;
  },
});

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
  run({ args }) {
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
  },
});

export const devex = defineCommand({
  meta: { name: "devex", description: "Developer-experience checks and one-command local smoke paths" },
  subCommands: { check: devexCheck, smoke: devexSmoke },
});
