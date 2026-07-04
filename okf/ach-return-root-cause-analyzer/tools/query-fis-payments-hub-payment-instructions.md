---
type: Agent Tool
title: query_fis_payments_hub_payment_instructions
description: Retrieve payment instructions from FIS Payments Hub for the ACH Return Root Cause Analyzer workflow.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_fis_payments_hub_payment_instructions

Retrieve payment instructions from FIS Payments Hub for the ACH Return Root Cause Analyzer workflow.

- **Kind:** query
- **Source system:** [FIS Payments Hub](/systems/fis-payments-hub.md)

## Inputs

- instruction_id
- date_range

## Outputs

- payment_instructions_records
- payment_instructions_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [FIS Payments Hub](/systems/fis-payments-hub.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [return_file_ingestion_sec_code_triage](/workflow/return-file-ingestion-sec-code-triage.md)
- [root_cause_attribution_validation_control_diagnosis](/workflow/root-cause-attribution-validation-control-diagnosis.md)
- [relationship_owner_notification_scorecard_publication](/workflow/relationship-owner-notification-scorecard-publication.md)

## Evals

- [Run the ACH Return Root Cause Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ach-return-root-cause-analyzer-end-to-end.md)
- [Originator 'Meridian Payroll Services' (instruction_id 742118803) shows an unauthorized return rate of 0.61% in this morning's BigQuery analytics_events rollup for the week of 2026-06-29, but the Looker dashboards scorecard published yesterday still shows 0.38% for the same originator and period. Reconcile the discrepancy against FIS Payments Hub clearing_batches before notifying the relationship owner, and tell me whether we're past the Nacha 0.5% unauthorized threshold.](/tests/ach-return-root-cause-analyzer-conflicting-return-rate.md)
- [Originator 'Harbor Fitness Clubs LLC' (instruction_id 758204471, SEC code WEB) is sitting at a 0.49% trailing-60-day unauthorized return rate per the analytics_events rollup computed_at 2026-07-02T09:00:00Z, just under the Nacha 0.5% threshold. It is now 2026-07-04T14:00:00Z. Confirm whether we need to notify the relationship owner today.](/tests/ach-return-root-cause-analyzer-stale-evidence-edge-case.md)

## Evidence emitted

- source_system_record

## Required inputs

- instruction_id
- date_range

## Produces

- payment_instructions_records
- payment_instructions_summary

# Examples

```
query_fis_payments_hub_payment_instructions(instruction_id=<instruction_id>, date_range=<date_range>)
```

# Citations

- [FIS Payments Hub](/systems/fis-payments-hub.md)
