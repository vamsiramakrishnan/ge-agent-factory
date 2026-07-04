// tools/ge/passport.mjs — `ge passport`: the Agent Passport as a first-class
// verb. `emit` mints the consolidated signed passport (subject digests +
// attestations over the proof pack), `verify` checks its integrity against
// the workspace bytes on disk, and `admit` runs the admission gate — the
// decision `ge handoff` enforces, runnable standalone for CI or review.
import { defineCommand } from "citty";
import { guarded, common, emit, out, pc, ui, ICON } from "./shared.mjs";
import { checkAdmission, emitPassport, verifyPassport } from "../lib/admission/admission-ops.mjs";
import { DxError } from "../lib/errors/dx-error.mjs";

const id = { type: "positional", required: true, description: "Local workspace id (or use-case id)" };

const emitCmd = defineCommand({
  meta: { name: "emit", description: "Mint the signed Agent Passport for a proven workspace (digests + attestations over the proof pack)" },
  args: { ...common, id },
  run: guarded(async ({ args }) => {
    const res = emitPassport({ id: args.id });
    emit(args, res, (r) => {
      out(ui.title("Passport — emitted", r.id));
      out(ui.kv([
        { key: "subject", value: pc.dim(`sha256:${r.subject.digest.sha256.slice(0, 16)}… · ${r.subject.fileCount} files`), note: "workspace content digest" },
        { key: "contract", value: pc.dim(`sha256:${r.subject.contractDigest.sha256.slice(0, 16)}…`), note: "usecase-spec.json digest" },
        { key: "attests", value: r.predicateTypes.join(" + "), note: "signed DSSE envelopes (in-toto)" },
        { key: "issuer", value: pc.dim(`ed25519 keyid ${r.keyid.slice(0, 16)}…${r.keyCreated ? " (new key generated under .ge/keys/)" : ""}`) },
      ]));
      out(ui.next(r.next, "evaluate the admission gate over this passport"));
    });
  }),
});

const verifyCmd = defineCommand({
  meta: { name: "verify", description: "Verify a passport's integrity: signatures, and digest binding to the workspace bytes on disk" },
  args: { ...common, id },
  run: guarded(async ({ args }) => {
    const res = verifyPassport({ id: args.id });
    emit(args, res, (r) => {
      out(ui.title("Passport — verify", r.id));
      for (const check of r.checks) out(`  ${check.ok ? ICON.pass : ICON.fail} ${check.id.padEnd(26)} ${pc.dim(check.detail)}`);
      out(ui.next(r.next, r.ok ? "run the admission gate" : "re-prove and re-emit"));
    });
  }),
});

const admitCmd = defineCommand({
  meta: { name: "admit", description: "Evaluate the admission gate (policy: .ge.json promotion.gates.admission) and record the decision" },
  args: {
    ...common,
    id,
    stage: { type: "string", description: "Stage the decision is for (default handoff)" },
    force: { type: "boolean", description: "Break-glass: exit 0 despite a denial (the override is recorded in the decision log)" },
  },
  run: guarded(async ({ args }) => {
    const res = checkAdmission({ id: args.id, stage: args.stage || "handoff", force: !!args.force });
    emit(args, res, (r) => {
      out(ui.title("Admission decision", r.workspaceId));
      out(ui.kv([
        { key: "allowed", value: r.allowed ? pc.green("yes") : pc.red("no"), note: r.required ? "gate is required (enforced)" : "gate not required yet — audit mode, decision recorded" },
        { key: "policy", value: pc.dim(`maxAgeDays ${r.policy.maxAgeDays} · requireLiveProof ${r.policy.requireLiveProof}`) },
        { key: "recorded", value: pc.dim("artifacts/admission-decision.json + .ge/admission/decisions.jsonl") },
      ]));
      for (const blocker of r.blockers) out(`  ${ICON.fail} ${pc.bold(blocker.code || "?")} ${blocker.what}\n     ${pc.dim(`fix: ${blocker.fix}`)}`);
      out(ui.next(r.next));
    });
    // Exit contract: a denial from a *required* gate is a failure (CI-usable),
    // unless break-glass was asked for — mirroring the promotion gate.
    if (!res.allowed && res.required && !args.force) {
      throw new DxError(`admission denied for '${res.workspaceId}' (${res.blockers.length} blocker(s)).`, {
        where: "gate: promotion.gates.admission",
        why: res.blockers.map((b) => `${b.code || "?"} ${b.what}`).join("; "),
        fix: res.next,
      });
    }
  }),
});

export const passport = defineCommand({
  meta: { name: "passport", description: "Agent Passport: mint, verify, and admit — the signed proof-pack identity behind the handoff admission gate" },
  subCommands: { emit: emitCmd, verify: verifyCmd, admit: admitCmd },
});
