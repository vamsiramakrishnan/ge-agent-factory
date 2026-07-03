---
name: guarding-the-factory
description: The factory's safety rail for an autonomous operator — what is reversible, what is outward-facing, and what needs explicit human sign-off. Use when about to deploy, load data, publish, change IAM or cross-project, or take any destructive action, and whenever deciding whether to act or escalate.
---

# Guarding The Factory

A shared, single-purpose skill the operator and deploy/access skills consult **before** an action that is hard to undo or reaches outside the current project. It encodes the same gates the console enforces in code, so an agent acting without a human still respects them.

In plain language: classify the action first. Reversible + in-project + non-public → proceed. Otherwise → require explicit sign-off and escalate. "Probably fine" is not sign-off.

## Assembly-Line Slot

- **First step:** classify the proposed action on two axes — reversibility and blast radius.
- **Plays a role in:** every station that mutates cloud state, data, access, or anything outside this project.
- **Input:** the proposed action + target project/service.
- **Output:** a verdict — `proceed`, `proceed-with-rollback-noted`, or `escalate` (with reason).
- **Next step:** the calling skill proceeds or escalates per the verdict.

## Hard gates (refuse / escalate unless explicitly authorized)

- **No cross-project deploys.** A provisioning/deploy target project MUST equal the control-plane project unless it is explicitly allow-listed (`GE_ALLOWED_PROJECTS`). Empty/placeholder project → refuse, do not fall back to the shared project.
- **Per-agent in-deck provisioning is disabled by default** (`*_ENABLE_AGENT_PROVISION`). Do not re-enable to "just deploy one"; route to the self-service installer.
- **Readonly honored.** If `GE_CONSOLE_READONLY` is set, no mutations — full stop.
- **Outward-facing = confirm.** Publishing (Gemini Enterprise, a public repo), granting IAM, or exposing a service is irreversible-ish (indexing/caching). Require sign-off.
- **Prefer reversible mechanics.** An env flip / new Cloud Run revision (rollback = redeploy) beats a destructive change. Choose the reversible path when one exists.

## Decision rule

```
reversible AND same-project AND not-public        -> proceed
reversible BUT outward-facing (publish/grant)     -> proceed only with explicit sign-off
irreversible OR cross-project OR destructive       -> escalate, do not act
```

## Common mistakes

- Treating a placeholder project id as a real target (silently hits the shared project).
- Re-enabling disabled provisioning to bypass the self-service path.
- Calling a publish/grant "reversible" because a delete exists — assume it was indexed/cached.

## Done when

A verdict is returned. On `escalate`, surface the reason and the safe alternative (usually: the self-service installer, or a reversible env/revision change) rather than proceeding.

## References

- Read `references/example-session.md` when an ask trips a gate (live spend, guard caps, `GE_CONFIRM`, readonly) — a worked refusal-and-escalation with the real error texts and the exact wording of a good escalation.
- Walk `assets/escalation-checklist.md` before any risky action and copy it into the run record — one "yes → escalate" box ends the debate.
