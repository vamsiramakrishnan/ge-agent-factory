// tools/ge/byo.mjs — `ge byo`: the BYO manifest noun (ge.byo.yaml, schemaVersion
// ge.byo.v1). Distinct from `ge apply` (ge.manifest.json, platform/fleet
// desired state, tools/lib/reconcile.mjs) — this noun is customization/config,
// not planes/stage targets. Two verbs: `doctor` (validate + full plan,
// read-only) and `apply` (dry-run prints the plan; a real run executes the
// safe/appliable subset and reports every bucket).
import { defineCommand } from "citty";
import { common, cfgFrom, emit, guarded, out, pc, ui } from "./shared.mjs";
import { loadByoManifest, planByoApply, applyByoManifest } from "../lib/byo-manifest.mjs";
import { DxError } from "../lib/errors/dx-error.mjs";

const byoArgs = {
  ...common,
  manifest: { type: "string", description: "Path to the ge.byo.yaml manifest" },
};

function requireManifestPath(args) {
  if (!args.manifest) {
    throw new DxError("no BYO manifest given", {
      where: "ge byo doctor|apply --manifest",
      why: "the BYO manifest packages an enterprise's customizations into one file this command reads",
      fix: "ge byo doctor --manifest ge.byo.yaml",
    });
  }
  return args.manifest;
}

function renderProblems(problems) {
  out(ui.section("Problems", pc.red(`${problems.length}`)));
  for (const p of problems) out(`  ${ui.glyph("failed")} ${pc.dim(p.path)}  ${p.message}`);
}

function renderActions(actions) {
  if (!actions.length) return;
  out(ui.section("Plan"));
  const kindW = Math.max(...actions.map((a) => a.kind.length), 0);
  for (const a of actions) {
    const tone = a.status === "appliable" ? "passed" : a.status === "invalid" ? "failed" : "warning";
    const statusWord = a.status === "appliable" && a.dryRun ? "appliable (dry-run)" : a.status === "appliable" && a.ok === false ? "failed" : a.status;
    out(`  ${ui.glyph(tone)} ${a.kind.padEnd(kindW)}  ${pc.dim(a.target)}  ${statusWord}`);
    out(`      ${pc.dim(a.detail)}`);
    if (a.error) out(`      ${pc.red(`error: ${a.error}`)}`);
    if (a.fix) out(ui.fixLine(a.fix, 6));
  }
}

const doctorCmd = defineCommand({
  meta: { name: "doctor", description: "Validate a BYO manifest and report the full apply plan (read-only)" },
  args: byoArgs,
  run: guarded(async ({ args }) => {
    const path = requireManifestPath(args);
    const { ok, problems, manifest, schemaVersion } = loadByoManifest(path);
    const cfg = cfgFrom(args);
    const actions = ok ? await planByoApply({ manifest, cfg }) : [];
    const hasInvalid = actions.some((a) => a.status === "invalid");
    const result = {
      kind: "ge.byo.doctor",
      manifest: path,
      schemaVersion,
      ok: ok && !hasInvalid,
      problems,
      actions,
    };
    emit(args, result, (r) => {
      out(ui.title("BYO manifest doctor", r.manifest));
      if (r.problems.length) renderProblems(r.problems);
      renderActions(r.actions);
      out(r.ok
        ? `\n${ui.glyph("passed")} ${pc.green("manifest valid; plan computed.")}`
        : `\n${ui.glyph("failed")} ${pc.red("manifest has problems or invalid actions — see above.")}`);
      if (r.ok) out(ui.next(`ge byo apply --manifest ${r.manifest} --dry-run`));
    });
    if (!result.ok) process.exitCode = 1;
  }),
});

const applyCmd = defineCommand({
  meta: { name: "apply", description: "Apply the safe (appliable) subset of a BYO manifest; --dry-run reports the plan without executing anything" },
  args: { ...byoArgs, "dry-run": { type: "boolean", description: "Print what would be applied; execute nothing" } },
  run: guarded(async ({ args }) => {
    const path = requireManifestPath(args);
    const { ok, problems, manifest } = loadByoManifest(path);
    if (!ok) {
      const result = { kind: "ge.byo.apply", manifest: path, ok: false, problems, applied: [], planned: [], invalid: [] };
      emit(args, result, () => {
        out(ui.title("BYO manifest apply", path));
        renderProblems(problems);
        out(`\n${ui.glyph("failed")} ${pc.red("manifest is invalid — fix the problems above and re-run.")}`);
      });
      process.exitCode = 1;
      return;
    }
    const cfg = cfgFrom(args);
    const dryRun = Boolean(args["dry-run"]);
    const { applied, planned, invalid } = await applyByoManifest({ manifest, cfg, dryRun });
    const failed = applied.some((a) => a.ok === false);
    const result = {
      kind: "ge.byo.apply",
      manifest: path,
      dryRun,
      ok: invalid.length === 0 && !failed,
      applied,
      planned,
      invalid,
    };
    emit(args, result, (r) => {
      out(ui.title(r.dryRun ? "BYO manifest apply (dry run)" : "BYO manifest apply", r.manifest));
      renderActions([...r.applied, ...r.planned, ...r.invalid]);
      out(r.ok
        ? `\n${ui.glyph("passed")} ${pc.green(r.dryRun ? "dry run complete — nothing executed." : "applied.")}`
        : `\n${ui.glyph("failed")} ${pc.red("one or more actions are invalid or failed to apply — see above.")}`);
    });
    if (!result.ok) process.exitCode = 1;
  }),
});

export const byo = defineCommand({
  meta: { name: "byo", description: "BYO manifest (ge.byo.yaml): validate + plan (doctor) · execute the safe subset (apply)" },
  subCommands: { doctor: doctorCmd, apply: applyCmd },
});
