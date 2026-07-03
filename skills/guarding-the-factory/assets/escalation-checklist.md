# Escalation decision checklist — walk top to bottom before a risky action

Any single "yes → escalate" ends the walk: the verdict is `escalate`, no
matter how urgent the ask. Copy into the run record with boxes marked.

1. [ ] **Reversible?** Is there a one-command rollback (new revision, env
   flip, remove-binding)? No rollback → **escalate**.
2. [ ] **Same project?** Target project == control-plane project, or
   explicitly in `GE_ALLOWED_PROJECTS`? No/placeholder/empty → **escalate**
   (never fall back to the shared project, never widen the allowlist).
3. [ ] **Outward-facing?** Publish, IAM grant, public exposure, paid live
   traffic? Yes → requires **explicit sign-off** naming the action ("it's
   fine" in passing is not sign-off).
4. [ ] **A guard already said no?** (`--yes` refusal, `GE_CONFIRM`,
   guard caps GELIVE008, `GE_CONSOLE_READONLY`, provisioning disabled.)
   The guard's unlock instruction is not permission — only the operator's
   explicit word is. Overriding, or restructuring the action to slip under
   a cap, is a bypass → **escalate**.
5. [ ] **Reversible path exists?** Cassette replay instead of live, dry-run
   (`GE_DRY_RUN=1`) instead of apply, revision instead of destroy → do the
   reversible one first and say so.
6. [ ] **Sign-off specific?** Names the action, scope/number, and target
   ("approved: live bench, 20 sessions") — not a vibe. Vague → ask for the
   exact confirmation, offering the sentence to say.
7. [ ] **Recorded?** Who approved, exact command, rollback plan, and (for
   temporary changes like a raised cap) the restore step — before running.

Escalation message shape: what was refused · which gate/axis fired · the
exact confirmation that unblocks · the safe alternative already done.
