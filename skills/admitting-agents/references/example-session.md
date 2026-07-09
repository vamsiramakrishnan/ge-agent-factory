# Example session - admit a proven workspace

This session shows the release-boundary loop: confirm proof exists, mint a
passport, verify it, run admission, and stop on drift.

## The ask

> Operator: "Prepare `ws-hr-onboarding-agent` for handoff. Do not force it
> through if the evidence is stale."

Constraint extracted: release preparation is allowed, but break-glass is not.
The gate must be evidence-led.

## Step 1 - confirm proof exists

```console
$ test -f .ge/factory/workspaces/ws-hr-onboarding-agent/artifacts/promotion-packet.json
```

If the promotion packet is missing, stop and run `ge prove` for the workspace
before minting anything. A passport without a proof pack is refused by design.

## Step 2 - mint and verify the passport

```console
$ bun tools/ge.mjs passport emit ws-hr-onboarding-agent
$ bun tools/ge.mjs passport verify ws-hr-onboarding-agent
```

The emit step signs the current workspace bytes and contract digest. The
verify step recomputes those digests before release tooling relies on them.

## Step 3 - evaluate admission

```console
$ bun tools/ge.mjs passport admit ws-hr-onboarding-agent --json
```

Read the decision, not just the exit code. In audit mode the command may exit
successfully while still returning blockers; in required mode a blocker makes
the command fail.

## Failure variant - stale workspace bytes

```console
$ bun tools/ge.mjs passport verify ws-hr-onboarding-agent
✗ workspace digest does not match the signed passport
```

Reaction: re-run proof and emit a new passport. Do not edit
`agent-passport.json`, do not delete the decision, and do not use
`ge handoff --force` unless the operator explicitly asks for a recorded
break-glass release.

## Done

The workspace has a fresh passport, verification passes, admission returns
`allowed: true`, and the decision is appended to
`.ge/admission/decisions.jsonl`.
