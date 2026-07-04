---
type: Agent Tool
title: query_genesys_cloud_cx_customer_interactions
description: Retrieve customer interactions from Genesys Cloud CX for the Proactive Outage Notification Orchestrator workflow.
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

Retrieve customer interactions from Genesys Cloud CX for the Proactive Outage Notification Orchestrator workflow.

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

- [incident_confirmation_scope_binding](/workflow/incident-confirmation-scope-binding.md)
- [customer_queue_impact_mapping](/workflow/customer-queue-impact-mapping.md)
- [cause_eta_narrative_drafting_policy_citation](/workflow/cause-eta-narrative-drafting-policy-citation.md)
- [publish_channel_sync_restoration_confirmation](/workflow/publish-channel-sync-restoration-confirmation.md)

## Evals

- [Run the Proactive Outage Notification Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/proactive-outage-notification-orchestrator-end-to-end.md)
- [ServiceNow tickets record 48213 (category='network', priority='P1', status='resolved', sla_met=true, created_at=2026-07-01) says the Riverside fiber outage was already fixed. But Genesys Cloud CX customer_interactions volume for intent='network_complaint' is still running 3x above the BigQuery analytics_events baseline as of 2026-07-04, and account 55871204 logged an interaction that same day explicitly reporting the fiber service is still down. Decide whether a restoration notification should go out now, and cite the governing sections before recommending anything.](/tests/proactive-outage-notification-orchestrator-resolved-ticket-vs-live-signal-conflict.md)
- [ServiceNow tickets record 55011 (category='network', priority='P1', status='in_progress', created_at=2026-06-30) has already been the subject of two prior ETA notifications published through action_genesys_cloud_cx_publish. Genesys Cloud CX customer_interactions volume tied to this outage is still running 5x above the BigQuery analytics_events baseline as of 2026-07-04, four days after the ticket opened, and operations wants a third revised ETA published today. Decide whether to publish again or escalate, and show your evidence.](/tests/proactive-outage-notification-orchestrator-third-eta-revision-escalation.md)

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
