---
type: Proof Obligation
title: "Golden eval obligation — Run the List Management & Segmentation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-list-management-segmentation-agent-end-to-end"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the List Management & Segmentation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [list-management-segmentation-agent-end-to-end](/tests/list-management-segmentation-agent-end-to-end.md)


## Mechanisms

- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_marketo_campaigns](/tools/query-marketo-campaigns.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_list_management_segmentation_agent_playbook](/tools/lookup-list-management-segmentation-agent-playbook.md)

## Entities that must be referenced

- contacts
- campaigns
- accounts
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [list-management-segmentation-agent-playbook](/documents/list-management-segmentation-agent-playbook.md)
