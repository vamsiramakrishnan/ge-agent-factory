---
type: Proof Obligation
title: "Golden eval obligation — Run the Audience Segmentation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-audience-segmentation-engine-end-to-end"
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

# Golden eval obligation — Run the Audience Segmentation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [audience-segmentation-engine-end-to-end](/tests/audience-segmentation-engine-end-to-end.md)


## Mechanisms

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_6sense_6sense_records](/tools/query-6sense-6sense-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_audience_segmentation_engine_playbook](/tools/lookup-audience-segmentation-engine-playbook.md)
- [action_salesforce_crm_create](/tools/action-salesforce-crm-create.md)

## Entities that must be referenced

- accounts
- contacts
- 6sense_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute create without two-system evidence

# Citations

- [audience-segmentation-engine-playbook](/documents/audience-segmentation-engine-playbook.md)
