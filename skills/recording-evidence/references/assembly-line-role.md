# Assembly-Line Role

Anchor: `apps/presentation/public/architecture/agent-factory-assembly-line.html`.

## Position

This skill overlays the full assembly line. It is not a station; it is the evidence layer across all stations.

The key idea is that every run teaches the system something. Logs are useful for replay, but the ledger is useful for learning: it turns scattered stage output into stable facts that can be queried across the fleet.

## First Step

Identify the subject being evidenced:

- mission
- factory run
- factory stage
- autopilot run
- workspace
- artifact
- blocker
- repair action
- harness intervention

## Role In The Line

- At `plan`: record mission and target.
- At generation stations: record produced workspaces/data/tool artifacts.
- At gate stations: record validation, doctor, preview, blockers, and repair attempts.
- At cloud stations: record deploy/load/register/publish/verify outcomes.
- At control-plane layer: correlate job, run, item, stage, and artifact provenance.

## Handoff

- From Factory/Autopilot/Console: ingest normalized events.
- To upstream improvement: repeated blocker signatures, repair success rates, and generator defect candidates.
- To audit/resume: provenance and causality for safe continuation.

## Next Step

If a repeated blocker emerges, emit an upstream fix recommendation and route work to the correct skill: Mission, Workspace Gate, Simulator Pack, Console, or Factory implementation.

## What Good Looks Like

A good ledger event explains:

- what fact was learned
- which subject it applies to
- which artifact proves it
- which run/stage/item produced it
- whether the outcome passed, blocked, failed, repaired, or observed
- what should happen next

If the event only repeats a log line, it belongs in a log stream, not the Evidence Ledger.
