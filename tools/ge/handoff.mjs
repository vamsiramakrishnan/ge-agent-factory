// tools/ge/handoff.mjs — `ge handoff [target]`: the golden path's last verb.
// Hands proven agents to a deploy target. `agents-cli` is the supported
// target today (ship → agents-cli deploy → Agent Engine → Gemini Enterprise);
// an unsupported target renders the four-field error contract, not a stack
// trace. The core handoff op uploads proven workspaces and runs the
// post-boundary stages (load_data → deploy → register → publish) remotely.
//
// `plan`/`package`/`verify-package` are the local-only, zero-cloud-call
// siblings (tools/lib/handoff-package.mjs): they answer "what would a real
// handoff submit" and "build/verify a portable copy of it" without ever
// touching GCS, the gateway, or the run ledger.
//
// citty note: this command has no `run` of its own — `agents-cli` (the
// historical default target, and the only one HANDOFF_TARGETS supports
// today) is itself a subcommand, wired as `default` so a bare `ge handoff`
// (or `ge handoff --ids ...` with no positional) dispatches to it exactly as
// `ge handoff agents-cli ...` would. citty resolves a subcommand only when
// the first non-flag token matches a registered name/alias (see
// node_modules/citty's runCommand) — a `target` positional living
// *alongside* subCommands would collide with that (any non-"agents-cli"
// string would misdispatch as "unknown command" instead of reaching the
// unsupported-target DxError), so target lives only as the "agents-cli"
// subcommand's identity, not as a shared positional. The parent still
// declares the string-typed flags (ids/start-stage/target-stage/concurrency/
// out/archive) in its own `args` purely so citty's flag-vs-positional scan
// knows `--ids foo` is one token, not a stray positional — see passport.mjs/
// okf.mjs for the same nested-subcommand shape without this wrinkle (their
// commands don't mix a default target with sibling verbs).
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, ui, elog, core, argFlag, argValue } from "./shared.mjs";
import { packageHandoff, planHandoff, verifyHandoffPackage } from "../lib/handoff-package.mjs";
import { DEFAULT_REMOTE_SUBMIT_CONCURRENCY } from "../lib/provision.mjs";

// Superset of every string-typed flag any handoff subcommand accepts, kept
// on the PARENT purely for citty's findSubCommandIndex()/_isValueFlag() scan
// (it decides whether the token after `--ids` etc. is that flag's value or a
// candidate subcommand name) — never read directly, since this command has
// no `run`. See the module comment above.
const dispatchArgs = {
  ...common,
  ids: { type: "string", description: "(agents-cli/plan/package) comma-separated local workspace ids" },
  "start-stage": { type: "string", description: "(agents-cli/plan) stage to start at remotely" },
  "target-stage": { type: "string", description: "(agents-cli/plan) stage to stop at" },
  concurrency: { type: "string", description: "(agents-cli) parallel remote submissions" },
  out: { type: "string", description: "(package) output path" },
  archive: { type: "string", description: "(verify-package) path to the packaged archive/directory" },
  "no-proxy": { type: "boolean", description: "(agents-cli) call the gateway directly, no proxy tunnel" },
  force: { type: "boolean", description: "(agents-cli/plan) break-glass override" },
};

const agentsCli = defineCommand({
  meta: { name: "agents-cli", description: "Hand off proven agents through agents-cli deploy → Agent Engine → Gemini Enterprise (the default target)" },
  args: {
    ...common,
    ids: { type: "string", description: "Comma-separated local workspace ids (default: all built locally)" },
    "start-stage": { type: "string", description: "Stage to start at remotely (default load_data)" },
    "target-stage": { type: "string", description: "Stage to stop at (default publish_enterprise)" },
    concurrency: { type: "string", description: `Parallel remote submissions (default ${DEFAULT_REMOTE_SUBMIT_CONCURRENCY}; env GE_REMOTE_SUBMIT_CONCURRENCY)` },
    "no-proxy": { type: "boolean", description: "Call the gateway directly over HTTPS instead of the gcloud run proxy tunnel" },
    force: { type: "boolean", description: "Break-glass: release despite a denied admission decision (the override is recorded in the decision log)" },
  },
  run: guarded(async ({ args }) => {
    const res = await core.handoff(cfgFrom(args), { target: "agents-cli", ids: args.ids, startStage: argValue(args, "start-stage"), targetStage: argValue(args, "target-stage"), concurrency: args.concurrency, noProxy: argFlag(args, "no-proxy"), force: args.force, log: elog });
    emit(args, res, (r) => {
      out(ui.title("Handoff"));
      out(ui.kv([
        { key: "target", value: ui.cmd(r.target), note: "agents-cli deploy → Agent Engine → Gemini Enterprise" },
        { key: "shipped", value: `${pc.green(r.submitted)}  failed ${r.failed ? pc.red(r.failed) : "0"}`, note: `${r.startStage || "load_data"} → ${r.targetStage || "publish_enterprise"}, remote` },
      ]));
      out(ui.next("ge agents status --watch", "follow the handoff to done"));
    });
  }),
});

const planCmd = defineCommand({
  meta: { name: "plan", description: "Dry run: report content digests and the admission verdict for a handoff, without uploading, submitting, or recording anything" },
  args: {
    ...common,
    ids: { type: "string", description: "Comma-separated local workspace ids (default: all built locally)" },
    target: { type: "string", description: "Deploy target the plan is for (default agents-cli)" },
    "start-stage": { type: "string", description: "Stage the real handoff would start at remotely (default load_data)" },
    "target-stage": { type: "string", description: "Stage the real handoff would stop at (default publish_enterprise)" },
    force: { type: "boolean", description: "Preview the plan as if --force (break-glass) were used on the real handoff" },
  },
  run: guarded(async ({ args }) => {
    const res = planHandoff({ ids: args.ids, target: args.target || "agents-cli", startStage: args["start-stage"], targetStage: args["target-stage"], force: args.force });
    emit(args, res, (r) => {
      out(ui.title("Handoff — plan", `${r.target} · ${r.startStage} → ${r.targetStage}`));
      out(ui.columns(r.workspaces, [
        { header: "id", value: (w) => ui.cmd(w.id) },
        { header: "digest", value: (w) => pc.dim(`sha256:${w.digest.hex.slice(0, 12)}…`) },
        { header: "admission", value: (w) => (w.admission.allowed ? pc.green("allowed") : pc.red("denied")) + (w.admission.blockers.length ? pc.dim(` (${w.admission.blockers.length} blocker(s))`) : "") },
      ]));
      for (const note of r.notes) out(pc.dim(`  ${note}`));
      out(ui.next("ge handoff package --ids <ids>", "build the portable archive this plan describes"));
    });
  }),
});

const packageCmd = defineCommand({
  meta: { name: "package", description: "Build the same archive `ge handoff` uploads, to a local path, with a manifest of content digests — no upload, no cloud call" },
  args: {
    ...common,
    ids: { type: "string", description: "Comma-separated local workspace ids (default: all built locally)" },
    out: { type: "string", description: "Output path (default ./handoff-package.tar.gz for one workspace, a directory of <id>.tar.gz for several)" },
    target: { type: "string", description: "Deploy target recorded in the manifest (default agents-cli)" },
  },
  run: guarded(async ({ args }) => {
    const res = packageHandoff({ ids: args.ids, out: args.out, target: args.target || "agents-cli" });
    emit(args, res, (r) => {
      out(ui.title("Handoff — package", r.out));
      out(ui.columns(r.workspaces, [
        { header: "id", value: (w) => ui.cmd(w.id) },
        { header: "archive", value: (w) => pc.dim(w.archive) },
        { header: "digest", value: (w) => pc.dim(`sha256:${w.digest.hex.slice(0, 12)}… · ${w.files} file(s)`) },
      ]));
      out(ui.next(`ge handoff verify-package ${r.out}`, "verify the package's integrity before handing it off"));
    });
  }),
});

const verifyPackageCmd = defineCommand({
  meta: { name: "verify-package", description: "Re-extract a handoff package and compare its content digests against the manifest written at package time" },
  args: {
    ...common,
    archive: { type: "positional", required: true, description: "Path to the packaged archive (single workspace) or directory (several workspaces)" },
  },
  run: guarded(async ({ args }) => {
    const res = verifyHandoffPackage({ archive: args.archive });
    emit(args, res, (r) => {
      out(ui.title("Handoff — verify package", r.ok ? pc.green("ok") : pc.red("mismatch")));
      out(ui.columns(r.workspaces, [
        { header: "id", value: (w) => ui.cmd(w.id) },
        { header: "ok", value: (w) => (w.ok ? ui.glyph("passed") : ui.glyph("failed")) },
      ]));
    });
  }),
});

export const handoff = defineCommand({
  meta: { name: "handoff", description: "Hand off proven agents to a deploy target (supported today: agents-cli → Agent Engine → Gemini Enterprise); plan/package/verify-package inspect a handoff with zero cloud calls" },
  args: dispatchArgs,
  subCommands: { "agents-cli": agentsCli, plan: planCmd, package: packageCmd, "verify-package": verifyPackageCmd },
  default: "agents-cli",
});
