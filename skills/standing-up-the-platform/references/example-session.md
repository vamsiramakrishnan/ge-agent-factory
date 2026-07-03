# Example session — get the tool plane up before tonight's remote build

A worked interaction: doctor → classify what's down → guard check → stand up
only the missing plane → re-doctor → report. The `doctor --local` output is
real (run in this repo); the cloud outputs are authored to match the
renderers in `tools/lib/planes/*.mjs` and `tools/lib/doctor/engine.mjs`.
Read this when doctor is red and it's unclear which plane to bring up, or
what a healthy stand-up looks like.

## The ask

> Operator: "Remote canary builds start tonight on `acme-factory-prod`.
> Doctor was complaining earlier — make sure the platform is actually ready.
> You have sign-off for same-project remediation."

Constraints extracted: target project named, sign-off given for same-project
cloud mutations (satisfies `guarding-the-factory` for reversible in-project
work — cross-project or destructive would still escalate).

## Step 1 — read the structured checks, scoped to the command that will run

The build tonight is `ge agents build`, so ask readiness for exactly that:

```console
$ bun tools/ge.mjs doctor --command agents.build
Doctor — acme-factory-prod (us-central1)

  readiness: agents.build  (5 fail)
  ✓ command             ge agents build
  ✓ gcloud available    Google Cloud SDK 528.0.0
  ✓ config project      acme-factory-prod
  ✓ config geAppId      acme-assistant_1749_app
  ✓ config gatewayUrl   https://ge-agent-factory-gateway-8741xyz-uc.a.run.app
  ✓ gcloud auth         operator@acme.com
  ✓ project access      acme-factory-prod
  ✗ tool plane finance  ge-agent-factory-mcp-finance not deployed
      fix: ge mcp deploy  (run from local)
  ✗ tool plane hr       ge-agent-factory-mcp-hr not deployed
      fix: ge mcp deploy  (run from local)
  ✗ tool plane it       ge-agent-factory-mcp-it not deployed
      fix: ge mcp deploy  (run from local)
  ✗ tool plane marketing  ge-agent-factory-mcp-marketing not deployed
      fix: ge mcp deploy  (run from local)
  ✗ tool plane procurement  ge-agent-factory-mcp-procurement not deployed
      fix: ge mcp deploy  (run from local)

✗ 5 hard failure(s).
```

Decisions made here:

- Grouped by plane: factory config/auth is green, **only the tool plane is
  down**. Bring up only what doctor flags — do not run a full `ge up` when
  one plane is missing (wasteful, churns terraform on healthy planes).
- These are hard failures for `agents.build` specifically: a remote build
  registers each agent's tools against its department MCP service, so
  building now would ship agents with no tools.

## Step 2 — guard, then stand up only the tool plane

Classify per `guarding-the-factory`: same-project, reversible (a redeploy
replaces it), not outward-facing, and the operator gave sign-off → proceed.

```console
$ bun tools/ge.mjs mcp deploy
usually takes 5-20m
building ge-agent-factory-mcp-finance → us-central1-docker.pkg.dev/acme-factory-prod/ge-agent-factory/ge-agent-factory-mcp-finance:latest
deploying ge-agent-factory-mcp-finance
  invoker ✓ principalSet://iam.googleapis.com/locations/global/workloadIdentityPools/acme-factory-prod.svc.id.goog/*
  invoker ✓ serviceAccount:ge-agent-factory-runner@acme-factory-prod.iam.gserviceaccount.com
building ge-agent-factory-mcp-hr → …
…  (× 5 departments: finance, hr, it, marketing, procurement)
wrote mcpServices to .ge.json

✓ MCP services deployed:
  finance      https://ge-agent-factory-mcp-finance-8741xyz-uc.a.run.app
  hr           https://ge-agent-factory-mcp-hr-8741xyz-uc.a.run.app
  it           https://ge-agent-factory-mcp-it-8741xyz-uc.a.run.app
  marketing    https://ge-agent-factory-mcp-marketing-8741xyz-uc.a.run.app
  procurement  https://ge-agent-factory-mcp-procurement-8741xyz-uc.a.run.app
  done in 11m 3s
```

## Step 3 — re-doctor; never declare ready from a started op

```console
$ bun tools/ge.mjs mcp doctor
MCP doctor — acme-factory-prod (us-central1)

  ✓ mcp finance                        ge-agent-factory-mcp-finance: True
  ✓ mcp finance invoker                agent identity can invoke
  …  (all 5 departments pass)
  ✓ agent registry API                 agentregistry.googleapis.com
  ✓ agent-registry CLI                 available
  ✓ agent identity agentregistry.viewer  granted to principalSet://…
  ✓ agent identity mcp.toolUser        granted to principalSet://…

✓ All hard checks passed.
$ bun tools/ge.mjs doctor --command agents.build
…
✓ All hard checks passed.
```

## Step 4 — report back

> Agent: "Platform is ready for tonight's build. Only the tool plane was
> down: deployed the 5 department MCP services (`ge mcp deploy`, ~11m),
> invoker grants confirmed for the agent-identity principalSet and the
> runner SA, URLs merged into `.ge.json`. `ge doctor --command agents.build`
> is green. Factory and data planes were already healthy — nothing else was
> touched."

The report names what was down, exactly what was mutated (and that it's
reversible by redeploy), and that readiness was re-verified — never "ran the
command" as if that were the same as "green".

## Failure variant — data plane down, but mode/confirmation refuse the fix

```console
$ bun tools/ge.mjs data up
✗ ge data up mutates real GCP resources and requires remote mode (current mode: local). Re-run with --mode remote and GE_CONFIRM=1, or GE_DRY_RUN=1 to preview.
```

This is the remote guard (`tools/lib/remote-guard.mjs`), not a bug: every
GCP-mutating op requires `mode=remote` plus explicit confirmation. React in
order:

1. `GE_DRY_RUN=1` first if you want the preview (`[dry-run] skipping
   terraform apply — set GE_CONFIRM=1 to provision`).
2. With operator sign-off: `bun tools/ge.mjs mode remote`, then
   `GE_CONFIRM=1 bun tools/ge.mjs data up`.
3. Without sign-off: stop and escalate — do NOT set `GE_CONFIRM=1` on your
   own authority (see `guarding-the-factory`).

If a check stays red after its fix command ran clean, stop remediating and
hand the doctor detail line to `triaging-runs` — repeating a stand-up
command on a persistent failure is the "re-running a deterministic failure"
mistake.
