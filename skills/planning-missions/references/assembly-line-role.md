# Assembly-Line Role

Anchor: `apps/presentation/public/architecture/agent-factory-assembly-line.html`.

## Position

This skill sits at the control-plane intake for every run. It decides what the line should do before work reaches the 14 stations.

The key idea is that a run should not begin as a loose command like “build these agents.” It should begin as a mission: selected agents, target stage, mode, ownership, and handoff. That mission becomes the durable agreement that Factory, Autopilot, Console, and harnesses all follow.

## First Step

Read or create the mission:

```bash
curl -s http://127.0.0.1:<port>/api/ge/mission
```

## Role In The Line

- Before `plan`: resolve selected agents, mode, target stage, and ownership.
- Before `generate_workspace`: decide which missing workspaces Factory must produce.
- Before `validate`/`preview`: decide what Autopilot can supervise locally or observe remotely.
- Before `load_data`/`deploy_runtime`/`publish_enterprise`: determine local-to-cloud handoff.

## Handoff

- To Factory: `target.effectiveFactoryTarget`.
- To Autopilot: `target.workspaceGate`.
- To Evidence Ledger: mission id, selected roster, mode contract, target, and phase plan.

## Next Step

After the mission is fixed, execute the Factory command or start/resume Autopilot against the persisted mission.

## What Good Looks Like

A good mission makes the next move obvious:

- missing local workspace -> Factory builds locally
- missing remote agent -> Factory submits to cloud
- existing local workspace -> Autopilot doctors and repairs
- existing remote run -> Autopilot observes
- publish from local -> explicit `ge handoff`

If a harness cannot tell who owns the next move, the mission is not clear enough.
