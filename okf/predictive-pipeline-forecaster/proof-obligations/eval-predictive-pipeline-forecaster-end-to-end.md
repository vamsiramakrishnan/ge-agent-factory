---
type: Proof Obligation
title: "Golden eval obligation — Run the Predictive Pipeline Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-predictive-pipeline-forecaster-end-to-end"
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

# Golden eval obligation — Run the Predictive Pipeline Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [predictive-pipeline-forecaster-end-to-end](/tests/predictive-pipeline-forecaster-end-to-end.md)


## Mechanisms

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_6sense_6sense_records](/tools/query-6sense-6sense-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_predictive_pipeline_forecaster_playbook](/tools/lookup-predictive-pipeline-forecaster-playbook.md)
- [action_salesforce_crm_enrich](/tools/action-salesforce-crm-enrich.md)

## Entities that must be referenced

- accounts
- contacts
- 6sense_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute enrich without two-system evidence

# Citations

- [predictive-pipeline-forecaster-playbook](/documents/predictive-pipeline-forecaster-playbook.md)
