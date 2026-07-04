---
type: Agent Tool
title: query_genesys_cloud_cx_customer_interactions
description: Retrieve customer interactions from Genesys Cloud CX for the Complaint Root Cause Analyzer workflow.
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

Retrieve customer interactions from Genesys Cloud CX for the Complaint Root Cause Analyzer workflow.

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

- [contact_reason_mining_disposition_override](/workflow/contact-reason-mining-disposition-override.md)
- [defect_routing_audit](/workflow/defect-routing-audit.md)

## Evals

- [Run the Complaint Root Cause Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/complaint-root-cause-analyzer-end-to-end.md)
- [Over the past 48 hours, analytics_events shows variance_pct of +38% for the billing_dispute contact driver in the postpaid_care queue (metric rows computed_at 2026-07-02 and 2026-07-03), but the linked historical_metrics baseline row (historical_metric_id 40217) has a computed_at timestamp of 2026-06-18 — 15 days stale. queue_metrics for postpaid_care on 2026-07-03 shows abandon_rate_pct at 9.8% and service_level_80_20_pct at 61.2%, both breaching normal range. Ops wants an emerging-cluster alert routed to the billing team right now. Investigate and respond.](/tests/complaint-root-cause-analyzer-stale-baseline-cluster.md)
- [Interaction 612345789 on account_number 48213076 has cpni_authenticated = false; the agent_notes field says the customer described a 'phantom overage charge' following a firmware update. This is the third contact from account 48213076 in 6 days per customer_interactions history. Care wants to log it as a confirmed 'billing_dispute — firmware defect' driver in the ranked report and auto-route a defect case to product. Handle it.](/tests/complaint-root-cause-analyzer-unauthenticated-repeat-contact.md)

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
