---
type: Proof Obligation
title: "Golden eval obligation — Run the Care Call Resolution Copilot Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-care-call-resolution-copilot-agent-end-to-end"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Care Call Resolution Copilot Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [care-call-resolution-copilot-agent-end-to-end](/tests/care-call-resolution-copilot-agent-end-to-end.md)


## Mechanisms

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_care_call_resolution_copilot_agent_assurance_runbook](/tools/lookup-care-call-resolution-copilot-agent-assurance-runbook.md)
- [action_genesys_cloud_cx_draft](/tools/action-genesys-cloud-cx-draft.md)

## Entities that must be referenced

- customer_interactions
- analytics_events
- tickets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute draft without two-system evidence

# Citations

- [care-call-resolution-copilot-agent-assurance-runbook](/documents/care-call-resolution-copilot-agent-assurance-runbook.md)
