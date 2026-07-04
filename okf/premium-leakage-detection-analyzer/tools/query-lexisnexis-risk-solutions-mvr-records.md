---
type: Agent Tool
title: query_lexisnexis_risk_solutions_mvr_records
description: Retrieve mvr records from LexisNexis Risk Solutions for the Premium Leakage Detection Analyzer workflow.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_lexisnexis_risk_solutions_mvr_records

Retrieve mvr records from LexisNexis Risk Solutions for the Premium Leakage Detection Analyzer workflow.

- **Kind:** query
- **Source system:** [LexisNexis Risk Solutions](/systems/lexisnexis-risk-solutions.md)

## Inputs

- mvr_id
- driver_name
- date_range

## Outputs

- mvr_records_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [LexisNexis Risk Solutions](/systems/lexisnexis-risk-solutions.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Policy number 5541892 is queued for audit prioritization. mvr_records MVR-2277 (order date 2026-05-10) flags license_status 'suspended' with worst_violation_36mo 'dui_dwi', but prefill_datasets PF-0894 for the same quote_number 5541892 has match_confidence 0.58 and lists a prior_carrier that doesn't match the application. The linked risk_reports entry RPT-3310 has report_date 2026-05-28, more than 30 days old. Determine whether this qualifies as a premium leakage finding, and whether the evidence is sufficient to recommend an audit.](/tests/premium-leakage-detection-analyzer-mvr-prefill-reconciliation.md)

## Evidence emitted

- sql_result

## Required inputs

- mvr_id
- driver_name
- date_range

## Produces

- mvr_records_records

# Examples

```
query_lexisnexis_risk_solutions_mvr_records(mvr_id=<mvr_id>, driver_name=<driver_name>, date_range=<date_range>)
```

# Citations

- [LexisNexis Risk Solutions](/systems/lexisnexis-risk-solutions.md)
