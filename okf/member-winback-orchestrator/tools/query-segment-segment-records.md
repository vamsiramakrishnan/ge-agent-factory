---
type: Agent Tool
title: query_segment_segment_records
description: "Retrieve segment records from Segment for the Lapsed Member Win-Back Orchestrator workflow."
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_segment_segment_records

Retrieve segment records from Segment for the Lapsed Member Win-Back Orchestrator workflow.

- **Kind:** query
- **Source system:** [Segment](/systems/segment.md)

## Inputs

- lookup_key
- date_range

## Outputs

- segment_records_records
- segment_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Segment](/systems/segment.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [lapse_detection_reason_inference](/workflow/lapse-detection-reason-inference.md)
- [marketing_cloud_journey_dispatch](/workflow/marketing-cloud-journey-dispatch.md)
- [reactivation_confirmation_nurture_audit](/workflow/reactivation-confirmation-nurture-audit.md)

## Evals

- [Run the Lapsed Member Win-Back Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/member-winback-orchestrator-end-to-end.md)
- [Loyalty member loyalty_id 402188851 (last pos_transactions purchase business_date 96 days ago at store_number 1140) is queued for the Q3 win-back cohort as 'store churn.' Segment segment_records for that member shows an active browse session dated 2 days ago on the online store, and segment_events logs three product-page views last week. Marketing wants to send the 15%-off win-back email today. Decide whether to include this member and what lapse reason to assign.](/tests/member-winback-orchestrator-conflicting-lapse-signal.md)

## Evidence emitted

- sql_result

## Required inputs

- lookup_key
- date_range

## Produces

- segment_records_records
- segment_records_summary

# Examples

```
query_segment_segment_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Segment](/systems/segment.md)
