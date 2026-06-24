# Assembly-Line Role

Anchor: `apps/presentation/public/architecture/agent-factory-assembly-line.html`.

## Position

This skill owns the web-console surface of the control plane. It maps operator actions onto the same `factory-core` used by CLI and MCP.

The key idea is that the console is an operator cockpit, not a separate implementation of the factory. It should make the current line state visible, start safe actions, and preserve resumability.

## First Step

Classify the operator action:

- status/read-only observation
- command/job mutation
- mission planning
- Autopilot run control
- workspace gate action
- artifact/log inspection

## Role In The Line

- Surface entry point: Web console -> `/api/ge/*`.
- Gateway role: route sentinels and preflight checks.
- Durable state role: persisted jobs, Autopilot runs, and event streams.
- Operator role: display mission, mode contract, blockers, artifacts, and resume controls.

## Handoff

- To Factory core: command metadata and request body.
- To Transport: job/autopilot execution and persistence.
- To UI: status, blockers, artifacts, mode capability, logs, and mission.
- To Evidence Ledger: events and durable state that should become normalized evidence.

## Next Step

After adding or changing a console action, add a route-sentinel test, run the console audit script, and verify TypeScript.

## What Good Looks Like

A good console flow shows:

- what mode the system is in
- what the mode allows
- which mission or job is active
- what is running, blocked, done, or resumable
- which artifacts and blockers explain the state
- which next action is safe

If the operator has to infer whether a button repairs locally, observes remotely, or starts cloud work, the UI is not clear enough.
