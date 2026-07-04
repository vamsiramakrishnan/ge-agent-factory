---
type: Proof Obligation
title: "Golden eval obligation — Run the Marketing Dashboard Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-marketing-dashboard-generator-end-to-end"
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

# Golden eval obligation — Run the Marketing Dashboard Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [marketing-dashboard-generator-end-to-end](/tests/marketing-dashboard-generator-end-to-end.md)


## Mechanisms

- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_marketing_dashboard_generator_playbook](/tools/lookup-marketing-dashboard-generator-playbook.md)
- [action_salesforce_crm_execute](/tools/action-salesforce-crm-execute.md)

## Entities that must be referenced

- session_events
- accounts
- contacts
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute execute without two-system evidence

# Citations

- [marketing-dashboard-generator-playbook](/documents/marketing-dashboard-generator-playbook.md)
