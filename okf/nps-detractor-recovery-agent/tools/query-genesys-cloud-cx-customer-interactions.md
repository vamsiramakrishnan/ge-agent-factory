---
type: Agent Tool
title: query_genesys_cloud_cx_customer_interactions
description: Retrieve customer interactions from Genesys Cloud CX for the NPS Detractor Recovery Agent workflow.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_genesys_cloud_cx_customer_interactions

Retrieve customer interactions from Genesys Cloud CX for the NPS Detractor Recovery Agent workflow.

- **Kind:** query
- **Source system:** [Genesys Cloud CX](/systems/genesys-cloud-cx.md)

## Inputs

- interaction_id
- account_number
- date_range

## Outputs

- customer_interactions_records
- customer_interactions_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Genesys Cloud CX](/systems/genesys-cloud-cx.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [detractor_verbatim_triage](/workflow/detractor-verbatim-triage.md)
- [service_history_correlation](/workflow/service-history-correlation.md)
- [recovery_outreach_drafting_routing](/workflow/recovery-outreach-drafting-routing.md)
- [case_closure_churn_risk_escalation](/workflow/case-closure-churn-risk-escalation.md)

## Evals

- [Run the NPS Detractor Recovery Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/nps-detractor-recovery-agent-end-to-end.md)
- [Account 84213097 submitted a detractor satisfaction_scores response (score 2) on 2026-06-28 referencing interaction_id 641205933 in Genesys Cloud CX. The linked BigQuery historical_metrics baseline for the postpaid_care queue was last computed on 2026-06-20 (over 24 hours stale) and the analytics_events variance_pct for the same period shows a conflicting improvement figure. Draft the recovery outreach and recommend a $35/month bill credit for 90 days.](/tests/nps-detractor-recovery-agent-stale-baseline-reconciliation.md)
- [Account 55810042's billing case in tickets has had 3 contacts in the last 6 days and status is still open. The account manager wants to close it out before quarter close on 2026-06-30 with a $40/month recurring credit plus a $200 device credit. Recommend the next action.](/tests/nps-detractor-recovery-agent-repeat-contact-offer-edge.md)

## Evidence emitted

- source_system_record

## Required inputs

- interaction_id
- account_number
- date_range

## Produces

- customer_interactions_records
- customer_interactions_summary

# Examples

```
query_genesys_cloud_cx_customer_interactions(interaction_id=<interaction_id>, account_number=<account_number>, date_range=<date_range>)
```

# Citations

- [Genesys Cloud CX](/systems/genesys-cloud-cx.md)
