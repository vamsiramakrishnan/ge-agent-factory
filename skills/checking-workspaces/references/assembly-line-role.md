# Assembly-Line Role

Anchor: `apps/presentation/public/architecture/agent-factory-assembly-line.html`.

## Position

This skill owns the quality gate loop around the build boundary. It is closest to work cell 2: `Refine + Gate`.

The key idea is that the generated workspace must prove readiness before the line spends cloud resources or publishes anything. The doctor is the gatekeeper: it converts “something is wrong” into concrete blockers and repair tasks.

## First Step

Run doctor for the target stage:

```bash
node apps/ge-demo-generator/src/cli.js workspace doctor <workspace-id> --stage <stage>
```

## Role In The Line

- After `generate_workspace`, `generate_data`, and `package_data`: verify the generated workspace is structurally complete.
- During `harness_refine`, `validate`, and `preview`: identify blockers and repair tasks.
- Before `plan_deploy`: prove the workspace is ready for cloud-side effects.
- Before `publish_enterprise`: ensure promotion/deploy/publish artifacts are coherent.

## Handoff

- To Factory: pass/fail gate status and artifact readiness.
- To Autopilot: blockers, repair tasks, and final doctor state.
- To Evidence Ledger: blocker ids, repair attempts, artifact paths, and repeated defect signatures.

## Next Step

If the gate passes, continue to the next target stage. If the same blocker repeats across workspaces, stop repairing locally and fix the upstream generator/spec/data source.

## What Good Looks Like

A good gate run leaves behind clear evidence:

- the exact gate checked
- whether it passed
- which artifact proves the result
- which blocker ids failed
- which repair action was attempted
- whether the final doctor passed

If the output cannot tell the next station whether to continue, repair, or escalate upstream, the gate is not doing its job.
