---
type: Agent Tool
title: query_capa_tracking_capa_tracking_records
description: "Retrieve capa tracking records from CAPA Tracking for the Audit & Corrective Action Tracker workflow."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_capa_tracking_capa_tracking_records

Retrieve capa tracking records from CAPA Tracking for the Audit & Corrective Action Tracker workflow.

- **Kind:** query
- **Source system:** [CAPA Tracking](/systems/capa-tracking.md)

## Inputs

- lookup_key
- date_range

## Outputs

- capa_tracking_records_records
- capa_tracking_records_summary

## Side Effects

- May change CAPA Tracking state because the spec classifies it as query.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — query_capa_tracking_capa_tracking_records](/policies/confirmation-query-capa-tracking-capa-tracking-records.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [CAPA Tracking](/systems/capa-tracking.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [audit_finding_intake](/workflow/audit-finding-intake.md)
- [recurrence_pattern_detection](/workflow/recurrence-pattern-detection.md)
- [capa_generation_response_assessment](/workflow/capa-generation-response-assessment.md)

## Evals

- [Run the Audit & Corrective Action Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/audit-corrective-action-tracker-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- capa_tracking_records_records
- capa_tracking_records_summary

# Examples

```
query_capa_tracking_capa_tracking_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [CAPA Tracking](/systems/capa-tracking.md)
- [Confirmation policy — query_capa_tracking_capa_tracking_records](/policies/confirmation-query-capa-tracking-capa-tracking-records.md)
