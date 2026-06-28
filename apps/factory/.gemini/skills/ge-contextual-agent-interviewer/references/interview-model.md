# Interview Model

Use a funnel. Each question should reduce generation ambiguity.

## Stage 1: Anchor

Ask: "Which department and use case should this demo prove?"

If the user is unsure, offer 3 choices from the catalog:

- one executive-facing use case
- one operator-facing workflow use case
- one analytics/data use case

## Stage 2: Audience

Ask who needs to believe the demo:

- executive sponsor
- business operator
- platform / IT owner
- risk, audit, or compliance reviewer

This controls the generated agent's tone, evidence, and UI artifact.

## Stage 3: Workflow Moment

Ask for the exact moment:

- morning briefing
- exception triage
- live meeting co-pilot
- scheduled batch monitor
- event-driven orchestration
- executive readout

This controls trigger type, mock data, and tests.

## Stage 4: Systems And Evidence

Ask which systems must look real. Use source systems from the chosen use case
first. Ask what evidence the agent should cite:

- SQL result
- source-system record
- document/policy
- scorecard
- ticket or audit trail
- generated recommendation

## Stage 5: Success Metric

Ask for the before/after proof. Prefer a KPI already defined in the source
use-case slide.

## When To Stop

Stop when you can write:

- what agent to build
- what systems to mock
- what data to generate
- what output artifact proves value
- what smoke test should pass
