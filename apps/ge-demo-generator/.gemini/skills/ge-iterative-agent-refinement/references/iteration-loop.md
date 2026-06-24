# Iteration Loop

Use this for multi-pass refinement.

## Pass 1: Contract

Make sure the workspace has:

- `workspace.json`
- agent or scenario manifest
- README with local commands
- deterministic fixtures or fixture plan

## Pass 2: Credibility

Patch generated mock data and tools so they match the chosen source use case:

- persona
- source systems
- trigger
- KPIs
- evidence artifacts
- human-in-the-loop checkpoint

## Pass 3: Validation

Add the cheapest meaningful checks:

- Python compile
- manifest validation
- one smoke prompt
- one expected data assertion

## Pass 4: Demo Readiness

Add:

- demo script
- expected transcript
- before/after metric
- registration plan, not deployment
