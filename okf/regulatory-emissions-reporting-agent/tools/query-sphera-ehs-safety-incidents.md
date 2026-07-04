---
type: Agent Tool
title: query_sphera_ehs_safety_incidents
description: Retrieve safety incidents from Sphera EHS for the Regulatory Emissions Reporting Agent workflow.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_sphera_ehs_safety_incidents

Retrieve safety incidents from Sphera EHS for the Regulatory Emissions Reporting Agent workflow.

- **Kind:** query
- **Source system:** [Sphera EHS](/systems/sphera-ehs.md)

## Inputs

- incident_number
- date_range

## Outputs

- safety_incidents_records
- safety_incidents_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Sphera EHS](/systems/sphera-ehs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Regulatory Emissions Reporting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/regulatory-emissions-reporting-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- incident_number
- date_range

## Produces

- safety_incidents_records
- safety_incidents_summary

# Examples

```
query_sphera_ehs_safety_incidents(incident_number=<incident_number>, date_range=<date_range>)
```

# Citations

- [Sphera EHS](/systems/sphera-ehs.md)
