---
type: Agent Tool
title: query_nice_actimize_fraud_alerts
description: Retrieve fraud alerts from NICE Actimize for the Sanctions Screening Hit Analyzer workflow.
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

# query_nice_actimize_fraud_alerts

Retrieve fraud alerts from NICE Actimize for the Sanctions Screening Hit Analyzer workflow.

- **Kind:** query
- **Source system:** [NICE Actimize](/systems/nice-actimize.md)

## Inputs

- alert_id
- account_number
- date_range

## Outputs

- fraud_alerts_records
- fraud_alerts_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [NICE Actimize](/systems/nice-actimize.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [cross_system_risk_correlation](/workflow/cross-system-risk-correlation.md)

## Evals

- [Run the Sanctions Screening Hit Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sanctions-screening-hit-analyzer-end-to-end.md)
- [Screening ID 50147732 flagged case 9184622 (customer 'Aldric Petrov Holdings') against the OFAC SDN list with a fuzzy_match_score of 91 and hit_type pending_analyst_review. NICE Actimize investigation case 2048117 on the same customer shows an open structuring typology with sar_decision pending_review and a filing_deadline_date 9 days out. Reconcile the two records and tell me whether we can auto-clear the sanctions hit.](/tests/sanctions-screening-hit-analyzer-cross-system-reconciliation.md)

## Evidence emitted

- source_system_record

## Required inputs

- alert_id
- account_number
- date_range

## Produces

- fraud_alerts_records
- fraud_alerts_summary

# Examples

```
query_nice_actimize_fraud_alerts(alert_id=<alert_id>, account_number=<account_number>, date_range=<date_range>)
```

# Citations

- [NICE Actimize](/systems/nice-actimize.md)
